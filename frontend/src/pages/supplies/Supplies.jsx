// src/pages/supplies/Supplies.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Truck, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import NewSupply from './NewSupply';
import SupplyDetails from './SupplyDetails';
import { useSupplies } from '../../context';

const Supplies = () => {
  const { supplies, pendingSupplies, loading, fetchSupplies, fetchPendingSupplies } = useSupplies();
  const [showNewSupply, setShowNewSupply] = useState(false);
  const [showSupplyDetails, setShowSupplyDetails] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchSupplies();
    fetchPendingSupplies();
  }, [fetchSupplies, fetchPendingSupplies]);

  // تحديد القائمة الحالية بناءً على التبويب
  const currentSupplies = activeTab === 'pending' ? pendingSupplies : supplies;

  // تصفية التوريدات
  const filteredSupplies = currentSupplies.filter(supply => {
    const matchesSearch = supply.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supply.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supply.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // الحصول على حالة التوريد
  const getSupplyStatus = (status) => {
    const statusConfig = {
      'معلق': { text: 'معلق', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'مقبول': { text: 'مقبول', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'مرفوض': { text: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center`}>
        <Icon size={12} className="ml-1" />
        {config.text}
      </span>
    );
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  const handleViewDetails = (supply) => {
    setSelectedSupply(supply);
    setShowSupplyDetails(true);
  };

  if (loading && supplies.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">التوريدات</h1>
          <p className="text-gray-600 mt-1">إدارة توريدات المنتجات من الموردين</p>
        </div>
        
        <button
          onClick={() => setShowNewSupply(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="ml-2" />
          توريد جديد
        </button>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي التوريدات</p>
              <p className="text-lg font-bold text-gray-900">{supplies.length}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-lg font-bold text-yellow-600">{pendingSupplies.length}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مقبولة</p>
              <p className="text-lg font-bold text-green-600">
                {supplies.filter(s => s.status === 'مقبول').length}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مرفوضة</p>
              <p className="text-lg font-bold text-red-600">
                {supplies.filter(s => s.status === 'مرفوض').length}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="text-red-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              جميع التوريدات
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              قيد الانتظار ({pendingSupplies.length})
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث برقم الفاتورة أو اسم المورد..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="معلق">معلق</option>
              <option value="مقبول">مقبول</option>
              <option value="مرفوض">مرفوض</option>
            </select>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              <Filter size={16} className="ml-2" />
              تصفية
            </button>
          </div>
        </div>

        {/* Supplies Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الفاتورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupplies.length > 0 ? (
                filteredSupplies.map((supply) => (
                  <tr key={supply._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supply.invoiceNumber || `SUP-${supply._id.slice(-6)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supply.supplierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supply.storeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supply.items?.length || 0} منتج
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(supply.totalAmount)} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(supply.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSupplyStatus(supply.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(supply)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye size={16} className="ml-1" />
                        تفاصيل
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Truck className="mx-auto mb-4" size={48} />
                    <p>لا توجد توريدات</p>
                    <p className="text-sm mt-2">
                      {activeTab === 'pending' 
                        ? 'لا توجد توريدات قيد الانتظار' 
                        : 'ابدأ بإضافة توريد جديد'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showNewSupply && (
        <NewSupply
          onClose={() => setShowNewSupply(false)}
          onSuccess={() => {
            setShowNewSupply(false);
            fetchSupplies();
            fetchPendingSupplies();
          }}
        />
      )}
      
      {showSupplyDetails && selectedSupply && (
        <SupplyDetails
          supply={selectedSupply}
          onClose={() => {
            setShowSupplyDetails(false);
            setSelectedSupply(null);
          }}
          onAction={() => {
            setShowSupplyDetails(false);
            setSelectedSupply(null);
            fetchSupplies();
            fetchPendingSupplies();
          }}
        />
      )}
    </div>
  );
};

export default Supplies;

