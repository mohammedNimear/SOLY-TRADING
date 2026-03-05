// src/pages/stores/StoreInventory.jsx
import React, { useState } from 'react';
import { Search, AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';

const StoreInventory = () => {
  const [selectedStore, setSelectedStore] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات تجريبية
  const stores = [
    { id: '1', name: 'المخزن الرئيسي', desc: 'مخزن' },
    { id: '2', name: 'نافذة البيع 1', desc: 'نافذة' }
  ];

  const inventoryData = [
    {
      id: '1',
      product: { name: 'زيت ذرة 1 لتر', sku: 'OIL001', category: 'الزيوت' },
      currentQuantity: 25,
      minQuantity: 10,
      lastMovement: 'وارد - 2024-01-15',
      status: 'normal'
    },
    {
      id: '2',
      product: { name: 'سكر 1 كيلو', sku: 'SUG001', category: 'السكر' },
      currentQuantity: 3,
      minQuantity: 15,
      lastMovement: 'صادر - 2024-01-14',
      status: 'critical'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">جرد المخازن</h1>
          <p className="text-gray-600">متابعة مستويات المخزون وتحديد المنتجات الحرجة</p>
        </div>
        
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">اختر المخزن/النافذة</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name} ({store.desc})
            </option>
          ))}
        </select>
      </div>

      {selectedStore ? (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث بالمنتج أو SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-500">{item.product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.currentQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'critical' ? (
                        <span className="flex items-center text-red-600">
                          <AlertTriangle size={16} className="ml-1" />
                          حرجة
                        </span>
                      ) : (
                        <span className="text-green-600">طبيعية</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border p-12 text-center">
          <Package className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">اختر مخزن أو نافذة</h3>
          <p className="mt-2 text-gray-600">يرجى اختيار مخزن أو نافذة بيع لعرض الجرد</p>
        </div>
      )}
    </div>
  );
};

export default StoreInventory;
