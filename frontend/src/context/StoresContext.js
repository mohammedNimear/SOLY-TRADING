
// src/contexts/StoresContext.js
import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../services/api';

const StoresContext = createContext();

export const useStores = () => {
  const context = useContext(StoresContext);
  if (!context) {
    throw new Error('useStores must be used within a StoresProvider');
  }
  return context;
};

 export const StoresProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('فشل في تحميل المخازن');
    } finally {
      setLoading(false);
    }
  };

  const addStore = async (storeData) => {
    try {
      const response = await apiClient.post('/stores', storeData);
      setStores(prev => [...prev, response.data]);
      toast.success('تم إضافة المخزن بنجاح');
      return response.data;
    } catch (error) {
      console.error('Error adding store:', error);
      toast.error('فشل في إضافة المخزن');
      throw error;
    }
  };

  const updateStore = async (id, storeData) => {
    try {
      const response = await apiClient.put(`/stores/${id}`, storeData);
      setStores(prev => prev.map(s => s._id === id ? response.data : s));
      toast.success('تم تحديث المخزن بنجاح');
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('فشل في تحديث المخزن');
      throw error;
    }
  };

  const deleteStore = async (id) => {
    try {
      await apiClient.delete(`/stores/${id}`);
      setStores(prev => prev.filter(s => s._id !== id));
      toast.success('تم حذف المخزن بنجاح');
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('فشل في حذف المخزن');
      throw error;
    }
  };

  // تحديث منتجات المخزن (قد يكون لها apiClient منفصل)
  const updateStoreProducts = async (storeId, products) => {
    try {
      const response = await apiClient.put(`/stores/${storeId}/products`, 
        { products });
      // تحديث المخزن في القائمة
      setStores(prev => prev.map(s => s._id === storeId ? response.data : s));
      toast.success('تم تحديث منتجات المخزن');
      return response.data;
    } catch (error) {
      console.error('Error updating store products:', error);
      toast.error('فشل في تحديث منتجات المخزن');
      throw error;
    }
  };

  const theValue = {
        stores,
        loading,
        fetchStores,
        addStore,
        updateStore,
        deleteStore,
        updateStoreProducts,
      }

  return (
    <StoresContext.Provider value={theValue}>
      {children}
    </StoresContext.Provider>
  );
};

