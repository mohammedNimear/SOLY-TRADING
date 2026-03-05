import axios from 'axios';
import toast from 'react-hot-toast';

// إنشاء نسخة مخصصة من axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8800/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// إضافة token إلى كل طلب إذا كان موجوداً
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة الأخطاء العامة مع toast
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // توكن غير صالح - تسجيل خروج
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('جلسة تسجيل الدخول منتهية. يرجى تسجيل الدخول مرة أخرى.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('ليس لديك صلاحية للوصول إلى هذا المحتوى');
    } else if (error.response?.status >= 500) {
      toast.error('حدث خطأ في الخادم. يرجى المحاولة لاحقاً');
    }
    return Promise.reject(error);
  }
);

// دوال مساعدة للطلبات مع toast
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const get = async (url, config = {}, showLoading = true) => {
  const loadingToast = showLoading ? toast.loading('جاري التحميل...') : null;
  try {
    const response = await apiClient.get(url, config);
    if (loadingToast) toast.dismiss(loadingToast);
    return response;
  } catch (error) {
    if (loadingToast) toast.dismiss(loadingToast);
    toast.error(error.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
    throw error;
  }
};

export const post = async (url, data, config = {}, showLoading = true) => {
  const loadingToast = showLoading ? toast.loading('جاري المعالجة...') : null;
  try {
    const response = await apiClient.post(url, data, config);
    if (loadingToast) toast.dismiss(loadingToast);
    toast.success('تمت العملية بنجاح');
    return response;
  } catch (error) {
    if (loadingToast) toast.dismiss(loadingToast);
    throw error;
  }
};

export const put = async (url, data, config = {}, showLoading = true) => {
  const loadingToast = showLoading ? toast.loading('جاري التحديث...') : null;
  try {
    const response = await apiClient.put(url, data, config);
    if (loadingToast) toast.dismiss(loadingToast);
    toast.success('تم التحديث بنجاح');
    return response;
  } catch (error) {
    if (loadingToast) toast.dismiss(loadingToast);
    toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
    throw error;
  }
};

export const del = async (url, config = {}, showLoading = true) => {
  const loadingToast = showLoading ? toast.loading('جاري الحذف...') : null;
  try {
    const response = await apiClient.delete(url, config);
    if (loadingToast) toast.dismiss(loadingToast);
    toast.success('تم الحذف بنجاح');
    return response;
  } catch (error) {
    if (loadingToast) toast.dismiss(loadingToast);
    toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحذف');
    throw error;
  }
};

export default apiClient;
