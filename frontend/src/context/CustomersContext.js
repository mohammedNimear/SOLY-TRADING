// src/contexts/CustomersContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';

const CustomersContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};

const initialState = {
  customers: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  REMOVE_CUSTOMER: 'REMOVE_CUSTOMER'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, customers: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_CUSTOMER:
      return { ...state, customers: [action.payload, ...state.customers] };
    case ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer._id === action.payload._id ? action.payload : customer
        )
      };
    case ACTIONS.REMOVE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload)
      };
    default:
      return state;
  }
};

export const CustomersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCustomers = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await customerService.getAllCustomers();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data.customers });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createCustomer = useCallback(async (customerData) => {
    try {
      const data = await customerService.createCustomer(customerData);
      dispatch({ type: ACTIONS.ADD_CUSTOMER, payload: data.customer });
      toast.success('تم إنشاء العميل بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateCustomer = useCallback(async (id, customerData) => {
    try {
      const data = await customerService.updateCustomer(id, customerData);
      dispatch({ type: ACTIONS.UPDATE_CUSTOMER, payload: data.customer });
      toast.success('تم تحديث العميل بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    try {
      const data = await customerService.deleteCustomer(id);
      dispatch({ type: ACTIONS.REMOVE_CUSTOMER, payload: id });
      toast.success('تم تعطيل العميل بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getCustomerBalance = useCallback(async (id) => {
    try {
      const data = await customerService.getCustomerBalance(id);
      return data.balance;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getCustomerInvoices = useCallback(async (id) => {
    try {
      const data = await customerService.getCustomerInvoices(id);
      return data.invoices;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerBalance,
    getCustomerInvoices
  };

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
};
