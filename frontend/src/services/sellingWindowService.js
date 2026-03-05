// src/services/sellingWindowService.js
import apiClient from './api';

const sellingWindowService = {
  getAllSellingWindows: async (params = {}) => {
    try {
      const response = await apiClient.get('/selling-windows', { params });
      return response.data.windows || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب نوافذ البيع');
    }
  },

  getSellingWindowById: async (id) => {
    try {
      const response = await apiClient.get(`/selling-windows/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب نافذة البيع');
    }
  },

  createSellingWindow: async (windowData) => {
    try {
      const response = await apiClient.post('/selling-windows', windowData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء نافذة البيع');
    }
  },

  updateSellingWindow: async (id, windowData) => {
    try {
      const response = await apiClient.put(`/selling-windows/${id}`, windowData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث نافذة البيع');
    }
  },

  deleteSellingWindow: async (id) => {
    try {
      const response = await apiClient.delete(`/selling-windows/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف نافذة البيع');
    }
  },

  addProductToWindow: async (windowId, productData) => {
    try {
      const response = await apiClient.post(`/selling-windows/${windowId}/products`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إضافة المنتج إلى النافذة');
    }
  },

  removeProductFromWindow: async (windowId, productId) => {
    try {
      const response = await apiClient.delete(`/selling-windows/${windowId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إزالة المنتج من النافذة');
    }
  },

  transferToWindow: async (transferData) => {
    try {
      const response = await apiClient.post('/selling-windows/transfer', transferData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في التحويل إلى النافذة');
    }
  }
};

export default sellingWindowService;
