// src/contexts/SuppliersContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import supplierService from './../services/supplierService';

const SuppliersContext = createContext();

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SuppliersProvider');
  }
  return context;
};

const initialState = {
  suppliers: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_SUPPLIER: 'ADD_SUPPLIER',
  UPDATE_SUPPLIER: 'UPDATE_SUPPLIER',
  REMOVE_SUPPLIER: 'REMOVE_SUPPLIER'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, suppliers: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_SUPPLIER:
      return { ...state, suppliers: [action.payload, ...state.suppliers] };
    case ACTIONS.UPDATE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.map(supplier =>
          supplier._id === action.payload._id ? action.payload : supplier
        )
      };
    case ACTIONS.REMOVE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.filter(supplier => supplier._id !== action.payload)
      };
    default:
      return state;
  }
};

export const SuppliersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSuppliers = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await supplierService.getAllSuppliers();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data.suppliers });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createSupplier = useCallback(async (supplierData) => {
    try {
      const data = await supplierService.createSupplier(supplierData);
      dispatch({ type: ACTIONS.ADD_SUPPLIER, payload: data.supplier });
      toast.success('تم إنشاء المورد بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateSupplier = useCallback(async (id, supplierData) => {
    try {
      const data = await supplierService.updateSupplier(id, supplierData);
      dispatch({ type: ACTIONS.UPDATE_SUPPLIER, payload: data.supplier });
      toast.success('تم تحديث المورد بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteSupplier = useCallback(async (id) => {
    try {
      await supplierService.deleteSupplier(id);
      dispatch({ type: ACTIONS.REMOVE_SUPPLIER, payload: id });
      toast.success('تم حذف المورد بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
};
