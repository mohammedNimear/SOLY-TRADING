import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import productService from '../services/productService';
import toast from 'react-hot-toast';

// Initial State
const initialState = {
  products: [],
  categories: ['الزيوت', 'السكر', 'الشاي والقهوة', 'منظفات', 'مواد تنظيف', 'مشروبات', 'أخرى'],
  loading: false,
  error: null,
  stats: {
    totalProducts: 0,
    criticalProducts: 0,
    totalStock: 0,
    inventoryValue: 0
  }
};

// Actions
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  UPDATE_CATEGORIES: 'UPDATE_CATEGORIES',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    
    case ACTIONS.FETCH_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        products: action.payload.products,
        stats: action.payload.stats
      };
    
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    
    case ACTIONS.ADD_PRODUCT:
      return { 
        ...state, 
        products: [action.payload, ...state.products],
        stats: {
          ...state.stats,
          totalProducts: state.stats.totalProducts + 1,
          totalStock: state.stats.totalStock + (action.payload.stock || 0)
        }
      };
    
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        )
      };
    
    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        stats: {
          ...state.stats,
          totalProducts: state.stats.totalProducts - 1
        }
      };
    
    case ACTIONS.UPDATE_CATEGORIES:
      return { ...state, categories: action.payload };
    
    case ACTIONS.UPDATE_STATS:
      return { ...state, stats: action.payload };
    
    default:
      return state;
  }
};

// Create Context
const ProductContext = createContext();

// Custom Hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Calculate statistics
  const calculateStats = useCallback((products) => {
    const totalProducts = products.length;
    const criticalProducts = products.filter(p => (p.stock || 0) <= (p.minStock || 0)).length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
    
    return {
      totalProducts,
      criticalProducts,
      totalStock,
      inventoryValue: inventoryValue.toLocaleString()
    };
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const products = await productService.getAllProducts();
      const stats = calculateStats(products);
      
      dispatch({ 
        type: ACTIONS.FETCH_SUCCESS, 
        payload: { products, stats } 
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      dispatch({ 
        type: ACTIONS.FETCH_ERROR, 
        payload: error.message || 'فشل في جلب المنتجات' 
      });
      toast.error(error.message || 'فشل في جلب المنتجات');
    }
  }, [calculateStats]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categories = await productService.getCategories();
      dispatch({ type: ACTIONS.UPDATE_CATEGORIES, payload: categories });
    } catch (error) {
      console.warn('Using default categories');
    }
  }, []);

  // Add new product
  const addProduct = useCallback(async (productData) => {
    try {
      const response = await productService.createProduct(productData);
      const newProduct = response.product || response.data || response;
      
      dispatch({ type: ACTIONS.ADD_PRODUCT, payload: newProduct });
      toast.success('تم إضافة المنتج بنجاح');
      
      return { success: true, data: newProduct };
    } catch (error) {
      toast.error(error.message || 'فشل في إضافة المنتج');
      return { success: false, message: error.message };
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      const updatedProduct = response.product || response.data || response;
      
      dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
      toast.success('تم تحديث المنتج بنجاح');
      
      return { success: true, data: updatedProduct };
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث المنتج');
      return { success: false, message: error.message };
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      await productService.deleteProduct(id);
      dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: id });
      toast.success('تم حذف المنتج بنجاح');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'فشل في حذف المنتج');
      return { success: false, message: error.message };
    }
  }, []);

  // Update product price only
  const updateProductPrice = useCallback(async (id, priceData) => {
    try {
      const response = await productService.updateProduct(id, priceData);
      const updatedProduct = response.product || response.data || response;
      
      dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
      toast.success('تم تحديث السعر بنجاح');
      
      return { success: true, data: updatedProduct };
    } catch (error) {
      toast.error(error.message || 'فشل في تحديث السعر');
      return { success: false, message: error.message };
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const value = {
    ...state,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductPrice
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
