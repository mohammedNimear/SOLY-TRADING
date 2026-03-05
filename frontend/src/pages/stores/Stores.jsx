// src/pages/stores/Stores.jsx
import React, { useState } from 'react';
import { Plus, Search, MapPin, Users, Package, Store as StoreIcon, ShoppingBag, Edit3, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Stores = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stores');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات تجريبية للمخازن
  const stores = [
    {
      id: '1',
      name: 'المخزن الرئيسي',
      desc: 'مخزن رئيسي كبير يحتوي على كامل مخزون الشركة',
      location: 'السوق العربي - شارع التجارة',
      manager: 'أحمد محمد',
      employers: 8,
      productsCount: 150,
      isActive: true
    },
    {
      id: '2',
      name: 'المخزن الفرعي',
      desc: 'مخزن فرعي لتوزيع البضاعة على النوافذ',
      location: 'الحي الغربي - مقابل البنك',
      manager: 'علي عبدالله',
      employers: 5,
      productsCount: 85,
      isActive: true
    },
    {
      id: '3',
      name: 'المخزن المركزي',
      desc: 'مخزن مركزي للتخزين طويل المدى',
      location: 'المدينة - المنطقة الصناعية',
      manager: 'محمد علي',
      employers: 6,
      productsCount: 200,
      isActive: true
    },
    {
      id: '4',
      name: 'المخزن الشمالي',
      desc: 'مخزن خاص بالمنطقة الشمالية',
      location: 'المنطقة الشمالية - السوق الشمالي',
      manager: 'يوسف إبراهيم',
      employers: 4,
      productsCount: 95,
      isActive: true
    },
    {
      id: '5',
      name: 'المخزن الجنوبي',
      desc: 'مخزن خاص بالمنطقة الجنوبية',
      location: 'المنطقة الجنوبية - السوق الجنوبي',
      manager: 'خالد محمود',
      employers: 5,
      productsCount: 120,
      isActive: true
    }
  ];

  // بيانات تجريبية لنوافذ البيع
  const sellingWindows = [
    {
      id: '1',
      name: 'نافذة البيع 1',
      desc: 'نافذة بيع رئيسية في السوق المركزي',
      location: 'السوق المركزي - الدخول الرئيسي',
      manager: 'سارة أحمد',
      employers: 3,
      productsCount: 45,
      isActive: true
    },
    {
      id: '2',
      name: 'نافذة البيع 2',
      desc: 'نافذة بيع في الحي التجاري',
      location: 'الحي التجاري - شارع الحرية',
      manager: 'فاطمة علي',
      employers: 2,
      productsCount: 38,
      isActive: true
    },
    {
      id: '3',
      name: 'نافذة البيع 3',
      desc: 'نافذة بيع في المجمع التجاري',
      location: 'المجمع التجاري - الطابق الأول',
      manager: 'نور عبد الله',
      employers: 4,
      productsCount: 52,
      isActive: true
    },
    {
      id: '4',
      name: 'نافذة البيع 4',
      desc: 'نافذة بيع في المنطقة الصناعية',
      location: 'المنطقة الصناعية - بوابة رقم 3',
      manager: 'مصطفى حسن',
      employers: 2,
      productsCount: 30,
      isActive: true
    },
    {
      id: '5',
      name: 'نافذة البيع 5',
      desc: 'نافذة بيع في المدينة الجديدة',
      location: 'المدينة الجديدة - مقابل المدرسة',
      manager: 'إيمان محمد',
      employers: 3,
      productsCount: 41,
      isActive: true
    },
    {
      id: '6',
      name: 'نافذة البيع 6',
      desc: 'نافذة بيع في السوق الشمالي',
      location: 'السوق الشمالي - قسم الأغذية',
      manager: 'رانيا خالد',
      employers: 2,
      productsCount: 28,
      isActive: true
    },
    {
      id: '7',
      name: 'نافذة البيع 7',
      desc: 'نافذة بيع في السوق الجنوبي',
      location: 'السوق الجنوبي - منطقة الخضار',
      manager: 'هدى يوسف',
      employers: 3,
      productsCount: 35,
      isActive: true
    }
  ];

  // تصفية البيانات حسب البحث
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWindows = sellingWindows.filter(window =>
    window.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    window.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    window.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // دوال المعالجة
const handleViewDetails = (storeId) => {
  navigate(`/stores/${storeId}`);
};

const handleEdit = (storeId) => {
  // للتعديل سنفتح نموذج بسيط أولاً
  alert(`تعديل المخزن/النافذة: ${storeId}`);
  // سيتم تطويرها لاحقاً لإضافة نموذج التعديل
};

const handleTransfer = (storeId) => {
  // للتحويل سننتقل لصفحة التحويلات مع تحديد المصدر
  alert(`تحويل من: ${storeId}`);
  // سيتم تطويرها لاحقاً
};


  const StoreCard = ({ store, isWindow = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${isWindow ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isWindow ? (
                <ShoppingBag className={`${isWindow ? 'text-green-600' : 'text-blue-600'}`} size={24} />
              ) : (
                <StoreIcon className={`${isWindow ? 'text-green-600' : 'text-blue-600'}`} size={24} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{store.desc}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {store.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="ml-2" />
            <span className="text-sm">{store.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users size={16} className="ml-2" />
            <span className="text-sm">المدير: {store.manager} • الموظفون: {store.employers}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Package size={16} className="ml-2" />
            <span className="text-sm">عدد المنتجات: {store.productsCount}</span>
          </div>
        </div>

        {/* أزرار الإجراءات المحسّنة */}
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => handleViewDetails(store.id, isWindow ? 'window' : 'store')}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center"
          >
            <Search size={16} className="ml-1" />
            تفاصيل
          </button>
          <button 
            onClick={() => handleEdit(store.id)}
            className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center"
          >
            <Edit3 size={16} className="ml-1" />
            تعديل
          </button>
          <button 
            onClick={() => handleTransfer(store.id, isWindow ? 'window' : 'store')}
            className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center justify-center"
          >
            <ArrowRightLeft size={16} className="ml-1" />
            تحويل
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header مع الأزرار */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المخازن ونوافذ البيع</h1>
          <p className="text-gray-600">إدارة جميع المخازن ونوافذ البيع في النظام</p>
        </div>
        
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>{activeTab === 'stores' ? 'مخزن جديد' : 'نافذة بيع جديدة'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('stores')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'stores'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              المخازن ({stores.length})
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'windows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              نوافذ البيع ({sellingWindows.length})
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالاسم أو الوصف أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'stores' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map(store => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWindows.map(window => (
                <StoreCard key={window.id} store={window} isWindow={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stores;
