// src/pages/inventory/CriticalInventory.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Package, Bell } from 'lucide-react';
import { useProducts, useStores } from '../../context';

const CriticalInventory = () => {
  const { products, loading: productsLoading } = useProducts();
  const { stores } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [sortBy, setSortBy] = useState('stock');

  // الحصول على المنتجات الحرجة
  const criticalProducts = products.filter(product => {
    const isCritical = (product.stock || 0) <= (product.minStock || 0);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    return isCritical && matchesSearch;
  });

  // ترتيب المنتجات
  const sortedProducts = [...criticalProducts].sort((a, b) => {
    if (sortBy === 'stock') {
      return (a.stock || 0) - (b.stock || 0);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المخزون الحرج</h1>
          <p className="text-gray-600 mt-1">إدارة المنتجات التي تحتاج لإعادة الطلب</p>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
                   <Bell className="text-red-500" size={20} />
          <span className="text-sm font-medium text-red-600">
            {criticalProducts.length} منتج حرجة
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث باسم المنتج أو SKU..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع المخازن</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="stock">ترتيب حسب الكمية</option>
            <option value="name">ترتيب حسب الاسم</option>
          </select>
          
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center">
            <AlertTriangle size={16} className="ml-2" />
            منتجات حرجة فقط
          </button>
        </div>
      </div>

      {/* Critical Products Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  المخزن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  الكمية الحالية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  الحد الأدنى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  النسبة المئوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-red-800 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => {
                  const percentage = ((product.stock || 0) / (product.minStock || 1)) * 100;
                  return (
                    <tr key={product._id} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                            <Package className="text-gray-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.storeName || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {product.stock || 0} قطعة
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.minStock || 0} قطعة
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-red-600">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Bell size={16} className="ml-1" />
                          تنبيه
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
                    <p>لا توجد منتجات حرجة حالياً</p>
                    <p className="text-sm mt-2">جميع المنتجات ضمن الحدود الآمنة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">إجمالي المنتجات الحرجة</p>
              <p className="text-2xl font-bold text-red-900">{criticalProducts.length}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">قيمة المخزون الحرجة</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatAmount(criticalProducts.reduce((sum, p) => sum + (p.stock * p.price), 0))} ر.س
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">متوسط النسبة المئوية</p>
              <p className="text-2xl font-bold text-yellow-900">
                {criticalProducts.length > 0 
                  ? Math.round(criticalProducts.reduce((sum, p) => 
                      sum + (((p.stock || 0) / (p.minStock || 1)) * 100), 0) / criticalProducts.length)
                  : 0}%
              </p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bell className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalInventory;
