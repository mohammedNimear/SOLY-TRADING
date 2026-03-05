// src/contexts/InventoryContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import storeService from '../services/storeService';
import toast from 'react-hot-toast';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

const initialState = {
  inventory: [],
  criticalProducts: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_INVENTORY_SUCCESS: 'FETCH_INVENTORY_SUCCESS',
  FETCH_CRITICAL_SUCCESS: 'FETCH_CRITICAL_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_INVENTORY_SUCCESS:
      return { ...state, loading: false, inventory: action.payload };
    case ACTIONS.FETCH_CRITICAL_SUCCESS:
      return { ...state, loading: false, criticalProducts: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.newQuantity }
            : item
        )
      };
    default:
      return state;
  }
};

export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchStoreInventory = useCallback(async (storeId) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await storeService.getStoreInventory(storeId);
      dispatch({ type: ACTIONS.FETCH_INVENTORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchCriticalProducts = useCallback(async (storeId, threshold = 10) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await storeService.getCriticalProducts(storeId, threshold);
      dispatch({ type: ACTIONS.FETCH_CRITICAL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const updateProductQuantity = useCallback(async (storeId, productId, quantity) => {
    try {
      const data = await storeService.updateProductQuantity(storeId, productId, quantity);
      dispatch({ 
        type: ACTIONS.UPDATE_QUANTITY, 
        payload: { productId, newQuantity: quantity } 
      });
      toast.success('تم تحديث الكمية بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const transferProducts = useCallback(async (transferData) => {
    try {
      const data = await storeService.transferProducts(transferData);
      toast.success('تم نقل المنتجات بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchStoreInventory,
    fetchCriticalProducts,
    updateProductQuantity,
    transferProducts
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
