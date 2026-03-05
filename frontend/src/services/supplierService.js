// src/services/supplierService.js
import apiClient from './api';

const supplierService = {
  getAllSuppliers: async (params = {}) => {
    try {
      const response = await apiClient.get('/suppliers', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب الموردين');
    }
  },

  getSupplierById: async (id) => {
    try {
      const response = await apiClient.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المورد');
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await apiClient.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء المورد');
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await apiClient.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث المورد');
    }
  },

  deleteSupplier: async (id) => {
    try {
      const response = await apiClient.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف المورد');
    }
  }
};

export default supplierService;
