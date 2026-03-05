// src/pages/stores/StoreDetails.jsx - النسخة المحدثة
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, AlertTriangle, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const StoreDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات تجريبية - في المستقبل ستؤخذ من الـ API
  const storesData = {
    '1': {
      id: '1',
      name: 'المخزن الرئيسي',
      desc: 'مخزن',
      location: 'السوق العربي - شارع التجارة',
      manager: 'أحمد محمد',
      employers: 8,
      isActive: true
    },
    '2': {
      id: '2',
      name: 'نافذة البيع 1',
      desc: 'نافذة',
      location: 'السوق المركزي - الدخول الرئيسي',
      manager: 'سارة أحمد',
      employers: 3,
      isActive: true
    }
  };

  const inventoryData = {
    '1': [
      { id: '1', name: 'زيت ذرة 1 لتر', sku: 'OIL001', quantity: 25, minQuantity: 10, category: 'الزيوت', status: 'normal' },
      { id: '2', name: 'سكر 1 كيلو', sku: 'SUG001', quantity: 3, minQuantity: 15, category: 'السكر', status: 'critical' },
      { id: '3', name: 'شاي أخضر 100 غرام', sku: 'TEA001', quantity: 45, minQuantity: 5, category: 'الشاي والقهوة', status: 'normal' }
    ],
    '2': [
      { id: '1', name: 'زيت ذرة 1 لتر', sku: 'OIL001', quantity: 12, minQuantity: 5, category: 'الزيوت', status: 'normal' },
      { id: '2', name: 'سكر 1 كيلو', sku: 'SUG001', quantity: 8, minQuantity: 10, category: 'السكر', status: 'normal' },
      { id: '4', name: 'قهوة مطحونة 250 غرام', sku: 'COF001', quantity: 2, minQuantity: 5, category: 'الشاي والقهوة', status: 'critical' }
    ]
  };

  // الحصول على بيانات المخزن الحالي
  const store = storesData[id] || storesData['1'];
  const inventory = inventoryData[id] || inventoryData['1'];

  // تصفية الجرد حسب البحث
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إحصائيات محسوبة
  const criticalItems = filteredInventory.filter(item => item.status === 'critical');
  const totalItems = filteredInventory.length;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="ml-2" />
          العودة
        </button>
        <button className="btn-primary">
          تعديل {store.desc === 'مخزن' ? 'المخزن' : 'النافذة'}
        </button>
      </div>

      {/* Store Info Card */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-1">{store.desc === 'مخزن' ? 'مخزن' : 'نافذة بيع'}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>الموقع: {store.location}</span>
              <span>المدير: {store.manager}</span>
              <span>الموظفون: {store.employers}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {store.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الجرد ({totalItems})
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'movements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الحركات
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              الإحصائيات
            </button>
          </nav>
        </div>

        {/* Inventory Tab Content */}
        {activeTab === 'inventory' && (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">جرد المنتجات</h3>
              <p className="text-gray-600">
                جميع المنتجات في هذا {store.desc === 'مخزن' ? 'المخزن' : 'النافذة'} 
                {criticalItems.length > 0 && (
                  <span className="text-red-600"> • {criticalItems.length} منتج حرجة</span>
                )}
              </p>
            </div>

            {/* Search Bar for Inventory */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="البحث بالمنتج أو SKU أو الفئة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {filteredInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنتج
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الفئة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكمية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحد الأدنى
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.quantity <= item.minQuantity 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.minQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity <= item.minQuantity ? (
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
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="mx-auto mb-4" size={48} />
                <p>لا توجد منتجات مطابقة للبحث</p>
              </div>
            )}
          </div>
        )}

        {/* Movements Tab */}
        {activeTab === 'movements' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">حركات المنتجات</h3>
                <p className="text-gray-600">جميع عمليات الدخل والصرف لهذا {store.desc === 'مخزن' ? 'المخزن' : 'النافذة'}</p>
              </div>
              <button className="btn-primary text-sm">
                تصدير التقرير
              </button>
            </div>
            
            <div className="text-center py-12 text-gray-500">
              <Package className="mx-auto mb-4" size={48} />
              <p>لا توجد حركات بعد</p>
              <p className="text-sm mt-2">ستظهر هنا جميع عمليات التوريد والاستهلاك</p>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">الإحصائيات</h3>
                <p className="text-gray-600">تحليل أداء {store.desc === 'مخزن' ? 'المخزن' : 'النافذة'}</p>
              </div>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>هذا الشهر</option>
                <option>هذا الأسبوع</option>
                <option>هذه السنة</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="text-blue-600" size={24} />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">إجمالي الوارد</p>
                    <p className="text-xl font-bold text-gray-900">1,250</p>
                    <p className="text-xs text-gray-500">وحدة</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="text-orange-600" size={24} />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">إجمالي الصادر</p>
                    <p className="text-xl font-bold text-gray-900">890</p>
                    <p className="text-xs text-gray-500">وحدة</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Package className="text-green-600" size={24} />
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">الرصيد الحالي</p>
                    <p className="text-xl font-bold text-gray-900">360</p>
                    <p className="text-xs text-gray-500">وحدة</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">المنتجات الحرجة</h4>
              {criticalItems.length > 0 ? (
                <ul className="space-y-1">
                  {criticalItems.map(item => (
                    <li key={item.id} className="text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="ml-2" />
                      {item.name} - الكمية: {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-600">لا توجد منتجات حرجة</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;
