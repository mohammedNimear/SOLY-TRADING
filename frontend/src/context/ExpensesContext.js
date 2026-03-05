// src/contexts/ExpensesContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import expenseService from '../services/expenseService';
import toast from 'react-hot-toast';

const ExpensesContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};

const initialState = {
  expenses: [],
  personalExpenses: [],
  businessExpenses: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_ALL_SUCCESS: 'FETCH_ALL_SUCCESS',
  FETCH_PERSONAL_SUCCESS: 'FETCH_PERSONAL_SUCCESS',
  FETCH_BUSINESS_SUCCESS: 'FETCH_BUSINESS_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  REMOVE_EXPENSE: 'REMOVE_EXPENSE'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_ALL_SUCCESS:
      return { ...state, loading: false, expenses: action.payload };
    case ACTIONS.FETCH_PERSONAL_SUCCESS:
      return { ...state, loading: false, personalExpenses: action.payload };
    case ACTIONS.FETCH_BUSINESS_SUCCESS:
      return { ...state, loading: false, businessExpenses: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        )
      };
    case ACTIONS.REMOVE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload)
      };
    default:
      return state;
  }
};

export const ExpensesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchExpenses = useCallback(async (params = {}) => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await expenseService.getAllExpenses(params);
      dispatch({ type: ACTIONS.FETCH_ALL_SUCCESS, payload: data.expenses });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchPersonalExpenses = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await expenseService.getPersonalExpenses();
      dispatch({ type: ACTIONS.FETCH_PERSONAL_SUCCESS, payload: data.expenses });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const fetchBusinessExpenses = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await expenseService.getBusinessExpenses();
      dispatch({ type: ACTIONS.FETCH_BUSINESS_SUCCESS, payload: data.expenses });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createExpense = useCallback(async (expenseData) => {
    try {
      const data = await expenseService.createExpense(expenseData);
      dispatch({ type: ACTIONS.ADD_EXPENSE, payload: data.expense });
      toast.success('تم إنشاء المنصرف بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const data = await expenseService.updateExpense(id, expenseData);
      dispatch({ type: ACTIONS.UPDATE_EXPENSE, payload: data.expense });
      toast.success('تم تحديث المنصرف بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseService.deleteExpense(id);
      dispatch({ type: ACTIONS.REMOVE_EXPENSE, payload: id });
      toast.success('تم حذف المنصرف بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchExpenses,
    fetchPersonalExpenses,
    fetchBusinessExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
