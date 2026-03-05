// src/common/ProtectedRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected Route - لحماية الصفحات التي تحتاج تسجيل دخول
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // إذا لم يكن هناك توكن، نعيد التوجيه لتسجيل الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // إذا كان هناك توكن، نعرض المحتوى
  return children;
};

// Public Route - لحماية صفحة تسجيل الدخول
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // إذا كان هناك توكن، نعيد التوجيه للوحة التحكم
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  // إذا لم يكن هناك توكن، نعرض المحتوى
  return children;
};

// Admin Route - لحماية الصفحات التي تحتاج صلاحيات إدارية
export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // إذا لم يكن هناك توكن، نعيد التوجيه لتسجيل الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // التحقق من صلاحيات الإدارة
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role === 'admin') {
      return children;
    }
  }
  
  // إذا لم تكن صلاحيات إدارية، نعيد التوجيه للوحة التحكم
  return <Navigate to="/" replace />;
};

// Manager Route - لحماية الصفحات التي تحتاج صلاحيات مشرف
export const ManagerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // إذا لم يكن هناك توكن، نعيد التوجيه لتسجيل الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // التحقق من صلاحيات المشرف أو الإدارة
  if (user) {
    const userData = JSON.parse(user);
    if (userData.role === 'admin' || userData.role === 'manager') {
      return children;
    }
  }
  
  // إذا لم تكن صلاحيات مناسبة، نعيد التوجيه للوحة التحكم
  return <Navigate to="/" replace />;
};

// Guest Route - للسماح بالوصول فقط للزوار
export const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // إذا كان هناك توكن، نسمح بالوصول (مفيد لصفحات مثل نسيت كلمة المرور)
  return children;
};

// Custom Route - للتحقق من شروط مخصصة
export const CustomRoute = ({ children, condition, redirectTo = "/login" }) => {
  const token = localStorage.getItem('token');
  
  // إذا لم يكن هناك توكن، نعيد التوجيه
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // التحقق من الشرط المخصص
  if (condition) {
    return children;
  }
  
  // إذا لم يتحقق الشرط، نعيد التوجيه
  return <Navigate to={redirectTo} replace />;
};

// Export افتراضي لل backwards compatibility
export default ProtectedRoute;
