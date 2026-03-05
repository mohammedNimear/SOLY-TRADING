// src/contexts/SellingWindowsContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import sellingWindowService from '../services/sellingWindowService';
import toast from 'react-hot-toast';

const SellingWindowsContext = createContext();

export const useSellingWindows = () => {
  const context = useContext(SellingWindowsContext);
  if (!context) {
    throw new Error('useSellingWindows must be used within a SellingWindowsProvider');
  }
  return context;
};

const initialState = {
  windows: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_WINDOW: 'ADD_WINDOW',
  UPDATE_WINDOW: 'UPDATE_WINDOW',
  REMOVE_WINDOW: 'REMOVE_WINDOW'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, windows: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_WINDOW:
      return { ...state, windows: [action.payload, ...state.windows] };
    case ACTIONS.UPDATE_WINDOW:
      return {
        ...state,
        windows: state.windows.map(window =>
          window._id === action.payload._id ? action.payload : window
        )
      };
    case ACTIONS.REMOVE_WINDOW:
      return {
        ...state,
        windows: state.windows.filter(window => window._id !== action.payload)
      };
    default:
      return state;
  }
};

export const SellingWindowsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchWindows = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await sellingWindowService.getAllSellingWindows();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createWindow = useCallback(async (windowData) => {
    try {
      const data = await sellingWindowService.createSellingWindow(windowData);
      dispatch({ type: ACTIONS.ADD_WINDOW, payload: data.window });
      toast.success('تم إنشاء نافذة البيع بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateWindow = useCallback(async (id, windowData) => {
    try {
      const data = await sellingWindowService.updateSellingWindow(id, windowData);
      dispatch({ type: ACTIONS.UPDATE_WINDOW, payload: data.window });
      toast.success('تم تحديث نافذة البيع بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteWindow = useCallback(async (id) => {
    try {
      await sellingWindowService.deleteSellingWindow(id);
      dispatch({ type: ACTIONS.REMOVE_WINDOW, payload: id });
      toast.success('تم تعطيل نافذة البيع بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const addProductToWindow = useCallback(async (windowId, productData) => {
    try {
      const data = await sellingWindowService.addProductToWindow(windowId, productData);
      dispatch({ type: ACTIONS.UPDATE_WINDOW, payload: data.window });
      toast.success('تم إضافة المنتج إلى النافذة بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const removeProductFromWindow = useCallback(async (windowId, productId) => {
    try {
      const data = await sellingWindowService.removeProductFromWindow(windowId, productId);
      dispatch({ type: ACTIONS.UPDATE_WINDOW, payload: data.window });
      toast.success('تم إزالة المنتج من النافذة بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const transferToWindow = useCallback(async (transferData) => {
    try {
      const data = await sellingWindowService.transferToWindow(transferData);
      // تحديث كلا المخزن والنافذة
      fetchWindows(); // إعادة تحميل للحصول على البيانات المحدثة
      toast.success('تم التحويل إلى النافذة بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, [fetchWindows]);

  const value = {
    ...state,
    fetchWindows,
    createWindow,
    updateWindow,
    deleteWindow,
    addProductToWindow,
    removeProductFromWindow,
    transferToWindow
  };

  return (
    <SellingWindowsContext.Provider value={value}>
      {children}
    </SellingWindowsContext.Provider>
  );
};
