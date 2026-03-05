// src/contexts/SalesContext.js - النسخة المحدثة
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import salesService from '../services/expenseService';
import toast from 'react-hot-toast';

const SalesContext = createContext();

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};

const initialState = {
  sales: [],
  invoices: [],
  loading: false,
  error: null,
  stats: {
    totalSales: 0,
    totalInvoices: 0,
    cashTotal: 0,
    creditTotal: 0
  }
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SALES_SUCCESS: 'FETCH_SALES_SUCCESS',
  FETCH_INVOICES_SUCCESS: 'FETCH_INVOICES_SUCCESS',
  FETCH_STATS_SUCCESS: 'FETCH_STATS_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_SALE: 'ADD_SALE',
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  REMOVE_INVOICE: 'REMOVE_INVOICE'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SALES_SUCCESS:
      return { ...state, loading: false, sales: action.payload };
    case ACTIONS.FETCH_INVOICES_SUCCESS:
      return { ...state, loading: false, invoices: action.payload };
    case ACTIONS.FETCH_STATS_SUCCESS:
      return { ...state, loading: false, stats: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_SALE:
      return { ...state, sales: [action.payload, ...state.sales] };
    case ACTIONS.ADD_INVOICE:
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case ACTIONS.UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice._id === action.payload._id ? action.payload : invoice
        )
      };
    case ACTIONS.REMOVE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice._id !== action.payload)
      };
    default:
      return state;
  }
};

export const SalesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSales = useCallback(async (params = {}) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await salesService.getAllSales(params);
      dispatch({ type: ACTIONS.FETCH_SALES_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchInvoices = useCallback(async (params = {}) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await salesService.getAllInvoices(params);
      dispatch({ type: ACTIONS.FETCH_INVOICES_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchSalesStats = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await salesService.getSalesStats();
      dispatch({ type: ACTIONS.FETCH_STATS_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createSale = useCallback(async (saleData) => {
    try {
      const data = await salesService.createSale(saleData);
      dispatch({ type: ACTIONS.ADD_SALE, payload: data.data });
      toast.success('تم إنشاء عملية البيع بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const data = await salesService.createInvoice(invoiceData);
      dispatch({ type: ACTIONS.ADD_INVOICE, payload: data.data });
      toast.success('تم إنشاء الفاتورة بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateInvoice = useCallback(async (id, invoiceData) => {
    try {
      const data = await salesService.updateInvoice(id, invoiceData);
      dispatch({ type: ACTIONS.UPDATE_INVOICE, payload: data.data });
      toast.success('تم تحديث الفاتورة بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteInvoice = useCallback(async (id) => {
    try {
      await salesService.deleteInvoice(id);
      dispatch({ type: ACTIONS.REMOVE_INVOICE, payload: id });
      toast.success('تم حذف الفاتورة بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getInvoiceById = useCallback(async (id) => {
    try {
      const data = await salesService.getInvoiceById(id);
      return data.data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchSales,
    fetchInvoices,
    fetchSalesStats,
    createSale,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};
