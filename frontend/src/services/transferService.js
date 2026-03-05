// src/services/transferService.js
import apiClient from './api';

const transferService = {
  getAllTransfers: async (params = {}) => {
    try {
      const response = await apiClient.get('/transfers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التحويلات');
    }
  },

  getPendingTransfers: async () => {
    try {
      const response = await apiClient.get('/transfers/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التحويلات المعلقة');
    }
  },

  getTransferById: async (id) => {
    try {
      const response = await apiClient.get(`/transfers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التحويل');
    }
  },

  createTransfer: async (transferData) => {
    try {
      const response = await apiClient.post('/transfers', transferData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء التحويل');
    }
  },

  approveTransfer: async (id, approvalData) => {
    try {
      const response = await apiClient.put(`/transfers/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في الموافقة على التحويل');
    }
  }
};

export default transferService;
