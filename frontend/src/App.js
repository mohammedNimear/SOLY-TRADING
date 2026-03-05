// src/App.js - النسخة المحدثة والكاملة
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';

import Layout from './components/layout/Layout';
import Login from './pages/login/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Sales from './pages/sales/Sales';
import Products from './pages/products/Products';
import StoresPage from './pages/stores/Stores';
import StoreDetails from './pages/stores/StoreDetails';
import StoreInventory from './pages/stores/StoreInventory';
import Transfers from './pages/transfers/Transfers';
import Customers from './pages/customers/Customers';
import Invoices from './pages/invoices/Invoices';
import CreateInvoice from './pages/invoices/CreateInvoice';
import InvoiceDetails from './pages/invoices/InvoiceDetails';
import ExpenseManagement from './pages/employees/ExpenseManagement';
import Supplies from './pages/supplies/Supplies';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';
import SuppliersPage from './pages/supplies/Suppliers';
import CriticalInventory from './pages/inventory/CriticalInventory';
import Permissions from './pages/settings/Permissions';
import SalesReport from './pages/reports/SalesReport';
import ProfitLossReport from './pages/reports/ProfitLossReport';
import SystemSettings from './pages/settings/SystemSettings';
import Employees from './pages/employees/Emloyees';
import { AuthProvider, CustomersProvider, 
  EmployeesProvider, ExpensesProvider, 
  InventoryProvider, ProductProvider, SalesProvider, 
  SellingWindowsProvider, StoresProvider, 
  SuppliersProvider, SuppliesProvider, 
  TransfersProvider } from './context';

/**
 * App is the main component of the application.
 * It wraps all the other components and providers with the necessary context.
 * It also defines the routes of the application.
 */
function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <SalesProvider>
          <StoresProvider>
            <SellingWindowsProvider>
              <EmployeesProvider>
                <TransfersProvider>
                  <SuppliersProvider>
                    <SuppliesProvider>
                      <InventoryProvider>
                        <CustomersProvider>
                          <ExpensesProvider>
                              <div className="App">
                            <Routes>
                                <Route>
                                  <Route 
                                    path="/login" 
                                    element={
                                      <PublicRoute>
                                        <Login />
                                      </PublicRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/forgot-password" 
                                    element={
                                      <PublicRoute>
                                        <ForgotPassword />
                                      </PublicRoute>
                                    } 
                                  />
                                  <Route 
                                    path="/" 
                                    element={
                                      <ProtectedRoute>
                                        <Layout />
                                      </ProtectedRoute>
                                    }
                                  >
                                    <Route index element={<Dashboard />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="sales" element={<Sales />} />
                                    <Route path="products" element={<Products />} />
                                    <Route path="stores" element={<StoresPage />} />
                                    <Route path="stores/:id" element={<StoreDetails />} />
                                    <Route path="inventory" element={<StoreInventory />} />
                                    <Route path="inventory/critical" element={<CriticalInventory />} />
                                    <Route path="transfers" element={<Transfers />} />
                                    <Route path="customers" element={<Customers />} />
                                    <Route path="invoices" element={<Invoices />} />
                                    <Route path="invoices/create" element={<CreateInvoice />} />
                                    <Route path="invoices/:id" element={<InvoiceDetails />} />
                                    <Route path="employees" element={<Employees />} />
                                    <Route path="expenses" element={<ExpenseManagement />} />
                                    <Route path="suppliers" element={<SuppliersPage />} />
                                    <Route path="supplies" element={<Supplies />} />
                                    <Route path="reports/sales" element={<SalesReport />} />
                                    <Route path="reports/profit-loss" element={<ProfitLossReport />} />
                                    <Route path="settings/permissions" element={<Permissions />} />
                                    <Route path="settings/system" element={<SystemSettings />} />                                    
                                    {/* Catch all undefined routes */}
                                    <Route path="*" element={
                                      <div className="flex items-center justify-center h-screen">
                                        <div className="text-center">
                                          <h1 className="text-4xl font-bold text-gray-900">404</h1>
                                          <p className="text-gray-600 mt-2">الصفحة غير موجودة</p>
                                        </div>
                                      </div>
                                    } />
                                  </Route>
                                </Route>
                            </Routes>
                              </div>
                          </ExpensesProvider>
                        </CustomersProvider>
                      </InventoryProvider>
                    </SuppliesProvider>
                  </SuppliersProvider>
                </TransfersProvider>
              </EmployeesProvider>
            </SellingWindowsProvider>
          </StoresProvider>
        </SalesProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
