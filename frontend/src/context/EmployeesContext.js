// src/contexts/EmployeesContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import employeeService from '../services/employeeService';
import toast from 'react-hot-toast';

const EmployeesContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeesProvider');
  }
  return context;
};

const initialState = {
  employees: [],
  loading: false,
  error: null
};

const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  REMOVE_EMPLOYEE: 'REMOVE_EMPLOYEE'
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, employees: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.ADD_EMPLOYEE:
      return { ...state, employees: [action.payload, ...state.employees] };
    case ACTIONS.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp._id === action.payload._id ? action.payload : emp
        )
      };
    case ACTIONS.REMOVE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(emp => emp._id !== action.payload)
      };
    default:
      return state;
  }
};

export const EmployeesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchEmployees = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await employeeService.getAllEmployees();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
      toast.error(error.message);
    }
  }, []);

  const createEmployee = useCallback(async (employeeData) => {
    try {
      const data = await employeeService.createEmployee(employeeData);
      dispatch({ type: ACTIONS.ADD_EMPLOYEE, payload: data.employee });
      toast.success('تم إنشاء الموظف بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateEmployee = useCallback(async (id, employeeData) => {
    try {
      const data = await employeeService.updateEmployee(id, employeeData);
      dispatch({ type: ACTIONS.UPDATE_EMPLOYEE, payload: data.employee });
      toast.success('تم تحديث الموظف بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const deleteEmployee = useCallback(async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      dispatch({ type: ACTIONS.REMOVE_EMPLOYEE, payload: id });
      toast.success('تم حذف الموظف بنجاح');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const assignToStore = useCallback(async (employeeId, storeId, role) => {
    try {
      const data = await employeeService.assignToStore(employeeId, storeId, role);
      dispatch({ type: ACTIONS.UPDATE_EMPLOYEE, payload: data.employee });
      toast.success('تم تعيين الموظف للمخزن بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const removeFromStore = useCallback(async (employeeId, storeId) => {
    try {
      const data = await employeeService.removeFromStore(employeeId, storeId);
      dispatch({ type: ACTIONS.UPDATE_EMPLOYEE, payload: data.employee });
      toast.success('تم إزالة الموظف من المخزن بنجاح');
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignToStore,
    removeFromStore
  };

  return (
    <EmployeesContext.Provider value={value}>
      {children}
    </EmployeesContext.Provider>
  );
};
