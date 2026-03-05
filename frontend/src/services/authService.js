// src/services/authService.js
import apiClient from './api';

const authService = {
  // تسجيل الدخول
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تسجيل الدخول');
    }
  },

  // تسجيل الخروج
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    apiClient.defaults.headers.common['Authorization'] = '';
  },

  // التحقق من التوكن
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // تحديث التوكن
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }
};

export default authService;
