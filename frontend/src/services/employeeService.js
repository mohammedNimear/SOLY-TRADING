// src/services/employeeService.js
import apiClient from './api';

const employeeService = {
  getAllEmployees: async (params = {}) => {
    try {
      const response = await apiClient.get('/employees', { params });
      return response.data.employees || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب الموظفين');
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في جلب الموظف');
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إنشاء الموظف');
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تحديث الموظف');
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في حذف الموظف');
    }
  },

  assignToStore: async (employeeId, storeId, role) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/assign-store`, {
        storeId,
        role
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في تعيين الموظف للمخزن');
    }
  },

  removeFromStore: async (employeeId, storeId) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/remove-store`, {
        storeId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطأ في إزالة الموظف من المخزن');
    }
  }
};

export default employeeService;
