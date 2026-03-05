import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول عند تحميل Layout
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // إذا لم يكن هناك توكن، نعيد التوجيه لتسجيل الدخول
      navigate('/login');
    }
  }, [navigate]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header ثابت في الأعلى */}
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar للشاشات الكبيرة */}
        <div className="hidden md:block w-64 bg-white shadow-lg z-20 flex-shrink-0 border-l border-gray-200">
          <Sidebar />
        </div>
        
        {/* المحتوى مع Footer */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Sidebar للشاشات الصغيرة (overlay) */}
      {mobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl md:hidden">
            <div className="h-full flex flex-col">
              <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
