// src/pages/transfers/Transfers.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Truck } from 'lucide-react';
import TransferForm from '../../components/transfers/TransferForm';

const Transfers = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // بيانات تجريبية
  const transfers = [
    {
      id: 'TRF-20240115-0001',
      from: { type: 'store', name: 'المخزن الرئيسي' },
      to: { type: 'sellingWindow', name: 'نافذة البيع 1' },
      items: [
        { product: 'زيت ذرة 1 لتر', quantity: 50 },
        { product: 'سكر 1 كيلو', quantity: 30 }
      ],
      status: 'completed',
      createdAt: '2024-01-15 10:30',
      approvedBy: 'محمد أحمد'
    },
    {
      id: 'TRF-20240115-0002',
      from: { type: 'store', name: 'المخزن الفرعي' },
      to: { type: 'store', name: 'المخزن المركزي' },
      items: [
        { product: 'شاي أخضر 100 غرام', quantity: 25 }
      ],
      status: 'pending',
      createdAt: '2024-01-15 14:15'
    }
  ];

  const handleCreateTransfer = (transferData) => {
    console.log('Creating transfer:', transferData);
    alert('تم إنشاء التحويل بنجاح!');
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      approved: { text: 'موافق عليه', color: 'bg-blue-100 text-blue-800' },
      completed: { text: 'مكتمل', color: 'bg-green-100 text-green-800' },
      rejected: { text: 'مرفوض', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header مع الأزرار */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حركة البضاعة</h1>
          <p className="text-gray-600">إدارة تحويلات المنتجات بين المخازن ونوافذ البيع</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>تحويل جديد</span>
        </button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">إجمالي التحويلات</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <Truck className="text-green-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">مكتملة اليوم</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Filter className="text-yellow-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث برقم التحويل أو المنتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتمل</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة التحويلات - نسخة مبسطة بدون الاستيراد */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم التحويل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  من
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إلى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transfer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.from.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.to.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.items.length} منتج
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transfer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نموذج إنشاء تحويل جديد */}
      {showCreateModal && (
        <TransferForm
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTransfer}
        />
      )}
    </div>
  );
};

export default Transfers;
