// src/contexts/TransfersContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import transferService from '../services/transferService';
import toast from 'react-hot-toast';

const TransfersContext = createContext();

export const useTransfers = () => {
  const context = useContext(TransfersContext);
  if (!context) {
    throw new Error('useTransfers must be used within a TransfersProvider');
  }
  return context;
};

const initialState = {
  transfers: [],
  pendingTransfers: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_PENDING_SUCCESS: 'FETCH_PENDING_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_TRANSFER: 'ADD_TRANSFER',
  UPDATE_TRANSFER: 'UPDATE_TRANSFER'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, transfers: action.payload };
    case ACTIONS.FETCH_PENDING_SUCCESS:
      return { ...state, loading: false, pendingTransfers: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_TRANSFER:
      return { ...state, transfers: [action.payload, ...state.transfers] };
    case ACTIONS.UPDATE_TRANSFER:
      return {
        ...state,
        transfers: state.transfers.map(transfer =>
          transfer._id === action.payload._id ? action.payload : transfer
        ),
        pendingTransfers: state.pendingTransfers.filter(
          transfer => transfer._id !== action.payload._id
        )
      };
    default:
      return state;
  }
};

export const TransfersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTransfers = useCallback(async (params = {}) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await transferService.getAllTransfers(params);
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data.transfers });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchPendingTransfers = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await transferService.getPendingTransfers();
      dispatch({ type: ACTIONS.FETCH_PENDING_SUCCESS, payload: data.transfers });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createTransfer = useCallback(async (transferData) => {
    try {
      const data = await transferService.createTransfer(transferData);
      dispatch({ type: ACTIONS.ADD_TRANSFER, payload: data.transfer });
      toast.success('تم إنشاء التحويل بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const approveTransfer = useCallback(async (id, status, notes) => {
    try {
      const data = await transferService.approveTransfer(id, { status, notes });
      dispatch({ type: ACTIONS.UPDATE_TRANSFER, payload: data.transfer });
      toast.success(`تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} التحويل بنجاح`);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const getTransferById = useCallback(async (id) => {
    try {
      const data = await transferService.getTransferById(id);
      return data.transfer;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchTransfers,
    fetchPendingTransfers,
    createTransfer,
    approveTransfer,
    getTransferById
  };

  return (
    <TransfersContext.Provider value={value}>
      {children}
    </TransfersContext.Provider>
  );
};
