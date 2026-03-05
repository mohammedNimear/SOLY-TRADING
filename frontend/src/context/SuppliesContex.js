// src/contexts/SuppliesContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import supplyService from '../services/supplyService';
import toast from 'react-hot-toast';

const SuppliesContext = createContext();

export const useSupplies = () => {
  const context = useContext(SuppliesContext);
  if (!context) {
    throw new Error('useSupplies must be used within a SuppliesProvider');
  }
  return context;
};

const initialState = {
  supplies: [],
  pendingSupplies: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_PENDING_SUCCESS: 'FETCH_PENDING_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_SUPPLY: 'ADD_SUPPLY',
  UPDATE_SUPPLY: 'UPDATE_SUPPLY',
  REMOVE_SUPPLY: 'REMOVE_SUPPLY'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, supplies: action.payload };
    case ACTIONS.FETCH_PENDING_SUCCESS:
      return { ...state, loading: false, pendingSupplies: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_SUPPLY:
      return { ...state, supplies: [action.payload, ...state.supplies] };
    case ACTIONS.UPDATE_SUPPLY:
      return {
        ...state,
        supplies: state.supplies.map(supply =>
          supply._id === action.payload._id ? action.payload : supply
        ),
        pendingSupplies: state.pendingSupplies.filter(
          supply => supply._id !== action.payload._id
        )
      };
    case ACTIONS.REMOVE_SUPPLY:
      return {
        ...state,
        supplies: state.supplies.filter(supply => supply._id !== action.payload),
        pendingSupplies: state.pendingSupplies.filter(
          supply => supply._id !== action.payload
        )
      };
    default:
      return state;
  }
};

export const SuppliesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSupplies = useCallback(async (params = {}) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await supplyService.getAllSupplies(params);
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data.supplies });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
    
  }, []);

  const fetchPendingSupplies = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await supplyService.getPendingSupplies();
      dispatch({ type: ACTIONS.FETCH_PENDING_SUCCESS, payload: data.supplies });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createSupply = useCallback(async (supplyData) => {
    try {
      const data = await supplyService.createSupply(supplyData);
      dispatch({ type: ACTIONS.ADD_SUPPLY, payload: data.supply });
      toast.success('تم إنشاء التوريد بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateSupply = useCallback(async (id, supplyData) => {
    try {
      const data = await supplyService.updateSupply(id, supplyData);
      dispatch({ type: ACTIONS.UPDATE_SUPPLY, payload: data.supply });
      toast.success('تم تحديث التوريد بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteSupply = useCallback(async (id) => {
    try {
      await supplyService.deleteSupply(id);
      dispatch({ type: ACTIONS.REMOVE_SUPPLY, payload: id });
      toast.success('تم حذف التوريد بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const approveSupply = useCallback(async (id, status, notes) => {
    try {
      const data = await supplyService.approveSupply(id, { status, notes });
      dispatch({ type: ACTIONS.UPDATE_SUPPLY, payload: data.supply });
      toast.success(`تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} التوريد بنجاح`);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getSupplyById = useCallback(async (id) => {
    try {
      const data = await supplyService.getSupplyById(id);
      return data.supply;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchSupplies,
    fetchPendingSupplies,
    createSupply,
    updateSupply,
    deleteSupply,
    approveSupply,
    getSupplyById
  };

  return (
    <SuppliesContext.Provider value={value}>
      {children}
    </SuppliesContext.Provider>
  );
};
