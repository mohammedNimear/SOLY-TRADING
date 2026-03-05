// src/pages/supplies/SupplierDetails.jsx
import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, CreditCard, FileText, Truck, Calendar, User } from 'lucide-react';
import { useSuppliers } from '../../context';
const SupplierDetails = ({ supplier, onClose }) => {
  const [supplyRecords, setSupplyRecords] = useState([
    { date: '2024-01-15', invoice: 'SUP-001', amount: 5000, status: 'مدفوع' },
    { date: '2024-01-10', invoice: 'SUP-002', amount: 3500, status: 'مدفوع جزئياً' },
    { date: '2024-01-05', invoice: 'SUP-003', amount: 7200, status: 'غير مدفوع' }
  ]);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  // الحصول على حالة الدفع
  const getPaymentStatus = (status) => {
    const statusConfig = {
      'مدفوع': { text: 'مدفوع', color: 'bg-green-100 text-green-800' },
      'مدفوع جزئياً': { text: 'مدفوع جزئياً', color: 'bg-yellow-100 text-yellow-800' },
      'غير مدفوع': { text: 'غير مدفوع', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{supplier.name}</h2>
              <p className="text-gray-600">مورد</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-6">
          {/* معلومات المورد */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات المورد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الشخص المسؤول:</span>
                <span className="ml-2 font-medium">{supplier.contactPerson || 'غير محدد'}</span>
              </div>
              
              <div className="flex items-center">
                <Phone size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الهاتف:</span>
                <span className="ml-2 font-medium">{supplier.phone || 'غير محدد'}</span>
              </div>
              
              {supplier.email && (
                <div className="flex items-center">
                  <Mail size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">البريد:</span>
                  <span className="ml-2 font-medium">{supplier.email}</span>
                </div>
              )}
              
              {supplier.address && (
                <div className="flex items-center">
                  <MapPin size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">العنوان:</span>
                  <span className="ml-2 font-medium">{supplier.address}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <CreditCard size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الحد الائتماني:</span>
                <span className="ml-2 font-medium">
                  {formatAmount(supplier.creditLimit)} ر.س
                </span>
              </div>
              
              {supplier.taxNumber && (
                <div className="flex items-center">
                  <FileText size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">الرقم الضريبي:</span>
                  <span className="ml-2 font-medium">{supplier.taxNumber}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الحالة:</span>
                <span className={`ml-2 font-medium ${supplier.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {supplier.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          </div>

          {/* الإحصائيات المالية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(Math.abs(supplier.balance))} ر.س
              </div>
              <div className="text-sm text-gray-600">
                {supplier.balance < 0 ? 'مدين' : 'دائن'}
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(8500)} ر.س
              </div>
              <div className="text-sm text-gray-600">إجمالي المشتريات</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatAmount(6800)} ر.س
              </div>
              <div className="text-sm text-gray-600">المدفوع</div>
            </div>
          </div>

          {/* سجل التوريدات */}
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">سجل التوريدات (آخر 30 يوم)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الفاتورة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplyRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.invoice}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount(record.amount)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getPaymentStatus(record.status)}
                      </td>
                    </tr>
                  ))}
                  
                  {supplyRecords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        <FileText className="mx-auto mb-2" size={24} />
                        <p>لا توجد توريدات لهذا المورد</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* الملاحظات */}
          {supplier.notes && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الملاحظات</h3>
              <p className="text-gray-700">{supplier.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
