import apiClient from './api';

const productService = {
  // الحصول على جميع المنتجات
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      // التأكد من أن النتيجة مصفوفة
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.products && Array.isArray(response.data.products)) {
        return response.data.products;
      } else {
        console.warn('Products data is not an array:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنتجات');
    }
  },

  // الحصول على منتج بحسب ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنتج');
    }
  },

  // إنشاء منتج جديد
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء المنتج');
    }
  },

  // تحديث منتج
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث المنتج');
    }
  },

  // حذف منتج
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف المنتج');
    }
  },

  // البحث في المنتجات
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في البحث');
    }
  },

  // ==================== إدارة الفئات ====================
  getCategories: async () => {
    try {
      const response = await apiClient.get('/products/categories');
      if (response.data?.categories) {
        return response.data.categories;
      }
      return ['الزيوت', 'السكر', 'الشاي والقهوة', 'منظفات', 'مواد تنظيف', 'مشروبات', 'أخرى'];
    } catch (error) {
      console.log('Using default categories');
      return ['الزيوت', 'السعر', 'الشاي والقهوة', 'منظفات', 'مواد تنظيف', 'مشروبات', 'أخرى'];
    }
  },

  createCategory: async (categoryName) => {
    try {
      const response = await apiClient.post('/products/categories', { name: categoryName });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء الفئة');
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/products/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف الفئة');
    }
  }
  // ==================== نهاية إدارة الفئات ====================
};

export default productService;
