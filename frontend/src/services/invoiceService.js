import apiClient from "./api";



const invoiceService = {
  // إنشاء فاتورة جديدة
  createInvoice: async (invoiceData) => {
    try {
      // التحقق من صحة بيانات الإدخال
      if (!invoiceData) {
        throw new Error('بيانات الفاتورة مطلوبة');
      }
      
      // التحقق من العناصر
      if (!invoiceData.items || !Array.isArray(invoiceData.items)) {
        throw new Error('العناصر مطلوبة ومصفوفة');
      }
      
      // التحقق من المخزن
      if (!invoiceData.store) {
        throw new Error('المخزن مطلوب');
      }
      
      // التحقق من العميل
      if (!invoiceData.customer || !invoiceData.customerName) {
        throw new Error('العميل مطلوب');
      }
      
      const response = await apiClient.post('/invoices', invoiceData);
      
      return response.data;
      
    } catch (error) {
      console.error('Error in createInvoice:', error);
      // دع Axios interceptors يتعامل مع الأخطاء
      throw error;
    }
  },

  // جلب جميع الفواتير
  getAllInvoices: async (params = {}) => {
    try {
      const response = await apiClient.get('/invoices', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // جلب فاتورة محددة
  getInvoiceById: async (id) => {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // تحديث فاتورة
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await apiClient.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // حذف فاتورة
  deleteInvoice: async (id) => {
    try {
      const response = await apiClient.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // البحث في الفواتير
  searchInvoices: async (query, filters = {}) => {
    try {
      const params = {
        search: query,
        ...filters
      };
      const response = await apiClient.get('/invoices/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching invoices:', error);
      throw error;
    }
  },

  // جلب إحصائيات الفواتير
  getInvoiceStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/invoices/stats?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      throw error;
    }
  },

  // جلب الفواتير حسب الحالة
  getInvoicesByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/invoices/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices by status:', error);
      throw error;
    }
  },

  // جلب الفواتير حسب العميل
  getInvoicesByCustomer: async (customerId) => {
    try {
      const response = await apiClient.get(`/invoices/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      throw error;
    }
  }
};

export default invoiceService;
