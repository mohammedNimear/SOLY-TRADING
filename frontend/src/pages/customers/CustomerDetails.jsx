// src/pages/customers/CustomerDetails.jsx
import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, CreditCard, FileText, TrendingUp, User } from 'lucide-react';
import { useCustomers } from '../../context/CustomersContext';

const CustomerDetails = ({ customer, onClose }) => {
  const { getCustomerBalance, getCustomerInvoices } = useCustomers();
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await getCustomerBalance(customer._id);
        const customerInvoices = await getCustomerInvoices(customer._id);
        setBalanceInfo(balance);
        setInvoices(customerInvoices);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customer) {
      fetchData();
    }
  }, [customer, getCustomerBalance, getCustomerInvoices]);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  // الحصول على حالة الفاتورة
  const getInvoiceStatus = (status) => {
    const statusConfig = {
      'paid': { text: 'مدفوعة', color: 'bg-green-100 text-green-800' },
      'unpaid': { text: 'غير مدفوعة', color: 'bg-red-100 text-red-800' },
      'partial': { text: 'دفعة جزئية', color: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { text: 'ملغاة', color: 'bg-gray-100 text-gray-800'}
    };
    
    const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 font-bold text-lg">
                {customer.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600">{customer.type === 'شركة' ? customer.company : 'عميل فرد'}</p>
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
          {/* معلومات العميل */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الهاتف:</span>
                <span className="ml-2 font-medium">{customer.phone}</span>
              </div>
              
              {customer.email && (
                <div className="flex items-center">
                  <Mail size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">البريد:</span>
                  <span className="ml-2 font-medium">{customer.email}</span>
                </div>
              )}
              
              {customer.address && (
                <div className="flex items-center">
                  <MapPin size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">العنوان:</span>
                  <span className="ml-2 font-medium">{customer.address}</span>
                </div>
              )}
              
              {customer.type === 'شركة' && customer.taxNumber && (
                <div className="flex items-center">
                  <CreditCard size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">الرقم الضريبي:</span>
                  <span className="ml-2 font-medium">{customer.taxNumber}</span>
                </div>
              )}
              
              {customer.type === 'شركة' && customer.contactPerson && (
                <div className="flex items-center">
                  <User size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">الشخص المسؤول:</span>
                  <span className="ml-2 font-medium">{customer.contactPerson}</span>
                </div>
              )}
            </div>
          </div>

          {/* الرصيد والمعلومات المالية */}
          {balanceInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatAmount(balanceInfo.creditLimit)} ر.س
                </div>
                <div className="text-sm text-gray-600">الحد الائتماني</div>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${balanceInfo.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatAmount(Math.abs(balanceInfo.outstandingBalance))} ر.س
                </div>
                <div className="text-sm text-gray-600">
                  {balanceInfo.outstandingBalance > 0 ? 'مدين' : 'دائن'}
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatAmount(balanceInfo.totalInvoices)} ر.س
                </div>
                <div className="text-sm text-gray-600">إجمالي الفواتير</div>
              </div>
            </div>
          )}

          {/* أحدث الفواتير */}
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">أحدث الفواتير</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الفاتورة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المدفوع
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المتبقي
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.slice(0, 5).map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber || `INV-${invoice._id.slice(-6)}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount(invoice.total)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount(invoice.paidAmount || 0)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount((invoice.total - (invoice.paidAmount || 0)))} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getInvoiceStatus(invoice.status)}
                      </td>
                    </tr>
                  ))}
                  
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        <FileText className="mx-auto mb-2" size={24} />
                        <p>لا توجد فواتير لهذا العميل</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="text-green-500 ml-2" size={20} />
                <h4 className="font-medium text-gray-900">إحصائيات الشراء</h4>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>عدد الفواتير:</span>
                  <span className="font-medium">{invoices.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>متوسط الفاتورة:</span>
                  <span className="font-medium">
                    {invoices.length > 0 
                      ? formatAmount(invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length) 
                      : '0'} ر.س
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center">
                <CreditCard className="text-blue-500 ml-2" size={20} />
                <h4 className="font-medium text-gray-900">معلومات إضافية</h4>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>الحالة:</span>
                  <span className={`font-medium ${customer.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                {customer.notes && (
                  <div className="text-sm">
                    <span className="text-gray-600">ملاحظات:</span>
                    <p className="mt-1 text-gray-900">{customer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
