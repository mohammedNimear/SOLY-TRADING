// src/services/expenseService.js
import apiClient from './api';

const expenseService = {
  getAllExpenses: async (params = {}) => {
    try {
      const response = await apiClient.get('/expenses', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنصرفات');
    }
  },

  getPersonalExpenses: async () => {
    try {
      const response = await apiClient.get('/expenses/personal');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنصرفات الشخصية');
    }
  },

  getBusinessExpenses: async () => {
    try {
      const response = await apiClient.get('/expenses/business');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنصرفات التجارية');
    }
  },

  getExpenseById: async (id) => {
    try {
      const response = await apiClient.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب المنصرف');
    }
  },

  createExpense: async (expenseData) => {
    try {
      const response = await apiClient.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء المنصرف');
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const response = await apiClient.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث المنصرف');
    }
  },

  deleteExpense: async (id) => {
    try {
      const response = await apiClient.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف المنصرف');
    }
  }
};

export default expenseService;
