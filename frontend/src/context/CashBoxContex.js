
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from './../api/axios';

export const CashBoxContext = createContext();


export const useCashBox = () => {
  const context = useContext(CashBoxContext);
  if (!context) {
    throw new Error('useCashBox must be used within a CashBoxProvider');
  }
  return context;
};

export const CashBoxProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/cash/balance'),
        api.get('/cash/transactions'),
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('فشل جلب بيانات الخزنة', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTransaction = async (type, amount, reason, relatedId = null) => {
    try {
      const { data } = await api.post('/cash/transactions', {
        type,
        amount,
        reason,
        relatedId,
      });
      setBalance(data.newBalance);
      setTransactions(prev => [data.transaction, ...prev]);
      return data;
    } catch (error) {
      console.error('فشل إضافة حركة', error);
      throw error;
    }
  };

  const refreshBalance = useCallback(async () => {
    try {
      const { data } = await api.get('/cash/balance');
      setBalance(data.balance);
    } catch (error) {
      console.error('فشل تحديث الرصيد', error);
    }
  }, []);

  return (
    <CashBoxContext.Provider value={{ balance, transactions, loading, addTransaction, refreshBalance }}>
      {children}
    </CashBoxContext.Provider>
  );
};
