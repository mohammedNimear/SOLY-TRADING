// src/components/layout/Sidebar.jsx
import React from 'react';
import { X, Home, ShoppingCart, Package, Store, Users, ArrowRightLeft, PackageCheck, FileText, User, DollarSign, Building, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = ({ mobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: ' الرئيسية', path: '/', icon: Home },
    { name: 'المبيعات', path: '/sales', icon: ShoppingCart },
    { name: 'المنتجات', path: '/products', icon: Package },
    { name: 'المخازن والنوافذ', path: '/stores', icon: Store },
    { name: 'جرد المخازن', path: '/inventory', icon: PackageCheck },
    { name: 'حركة البضاعة', path: '/transfers', icon: ArrowRightLeft },
    { name: 'العملاء', path: '/customers', icon: Users },
    { name: 'الفواتير', path: '/invoices', icon: FileText },
    { name: 'الموظفون', path: '/employees', icon: User },
    { name: 'المنصرفات', path: '/expenses', icon: DollarSign },
    { name: 'الموردون', path: '/suppliers', icon: Building },
    { name: 'التوريدات', path: '/supplies', icon: Truck }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header الـ Sidebar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Soly ERP" className="h-8 w-auto" />
            <span className="logo-text mr-2 text-lg font-bold text-blue-600">SOLY</span>
          </div>
          {mobile && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* قائمة الـ Sidebar */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-right ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
