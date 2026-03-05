// src/services/storeService.js
import apiClient from './api';

const storeService = {
  // الحصول على جميع المخازن والنوافذ
  getAllStores: async (params = {}) => {
    try {
      const response = await apiClient.get('/stores', { params });
      return response.data.stores || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المخازن');
    }
  },

  // الحصول على تفاصيل مخزن بحسب ID
  getStoreById: async (id) => {
    try {
      const response = await apiClient.get(`/stores/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المخزن');
    }
  },

  // جرد المخزن
  getStoreInventory: async (storeId) => {
    try {
      const response = await apiClient.get(`/stores/${storeId}/inventory`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جرد المخزن');
    }
  },

  // تحديث كمية منتج في المخزن
  updateProductQuantity: async (storeId, productId, quantity) => {
    try {
      const response = await apiClient.patch(`/stores/${storeId}/products/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث الكمية');
    }
  },

  // إنشاء مخزن جديد
  createStore: async (storeData) => {
    try {
      const response = await apiClient.post('/stores', storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء المخزن');
    }
  },

  // تحديث مخزن
  updateStore: async (id, storeData) => {
    try {
      const response = await apiClient.put(`/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث المخزن');
    }
  },

  // حذف مخزن
  deleteStore: async (id) => {
    try {
      const response = await apiClient.delete(`/stores/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف المخزن');
    }
  },

  // البحث في المخازن
  searchStores: async (query) => {
    try {
      const response = await apiClient.get(`/stores/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في البحث');
    }
  },

  // الحصول على المنتجات الحرجة في المخزن
  getCriticalProducts: async (storeId, threshold = 10) => {
    try {
      const response = await apiClient.get(`/stores/${storeId}/critical?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنتجات الحرجة');
    }
  },

  // نقل المنتجات بين المخازن
  transferProducts: async (transferData) => {
    try {
      const response = await apiClient.post('/stores/transfer', transferData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في نقل المنتجات');
    }
  }
};

export default storeService;
