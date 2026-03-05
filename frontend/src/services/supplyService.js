// src/services/supplyService.js
import apiClient from './api';

const supplyService = {
  getAllSupplies: async (params = {}) => {
    try {
      const response = await apiClient.get('/supplies', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التوريدات');
    }
  },

  getPendingSupplies: async () => {
    try {
      const response = await apiClient.get('/supplies/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التوريدات المعلقة');
    }
  },

  getSupplyById: async (id) => {
    try {
      const response = await apiClient.get(`/supplies/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب التوريد');
    }
  },

  createSupply: async (supplyData) => {
    try {
      const response = await apiClient.post('/supplies', supplyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء التوريد');
    }
  },

  updateSupply: async (id, supplyData) => {
    try {
      const response = await apiClient.put(`/supplies/${id}`, supplyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث التوريد');
    }
  },

  deleteSupply: async (id) => {
    try {
      const response = await apiClient.delete(`/supplies/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف التوريد');
    }
  },

  approveSupply: async (id, approvalData) => {
    try {
      const response = await apiClient.put(`/supplies/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في الموافقة على التوريد');
    }
  }
};

export default supplyService;
