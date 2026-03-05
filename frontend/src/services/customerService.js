// src/services/customerService.js
import apiClient from './api';

const customerService = {
  // الحصول على جميع العملاء
  getAllCustomers: async (params = {}) => {
    try {
      const response = await apiClient.get('/customers', { params });
      return response.data.customers || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب العملاء');
    }
  },

  // الحصول على عميل بحسب ID
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب العميل');
    }
  },

  // إنشاء عميل جديد
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء العميل');
    }
  },

  // تحديث عميل
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث العميل');
    }
  },

  // حذف عميل
  deleteCustomer: async (id) => {
    try {
      const response = await apiClient.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف العميل');
    }
  },

  // البحث في العملاء
  searchCustomers: async (query) => {
    try {
      const response = await apiClient.get(`/customers/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في البحث');
    }
  }
};

export default customerService;
