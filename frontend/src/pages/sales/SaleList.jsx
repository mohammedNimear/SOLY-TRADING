import React from 'react';
import { Calendar, Clock, User, Receipt } from 'lucide-react';

const SaleList = ({ activeTab, searchTerm }) => {
  // بيانات تجريبية
  const sales = [
    {
      id: 'INV-001',
      customer: 'أحمد محمد',
      date: '2024-01-15',
      time: '14:30',
      amount: '2,500',
      paymentMethod: 'نقدي',
      status: 'مكتمل',
      items: 3
    },
    {
      id: 'INV-002',
      customer: 'علي عبدالله',
      date: '2024-01-15',
      time: '13:45',
      amount: '1,800',
      paymentMethod: 'تصريف',
      status: 'مكتمل',
      items: 2
    },
    {
      id: 'INV-003',
      customer: 'محمد علي',
      date: '2024-01-15',
      time: '12:15',
      amount: '3,200',
      paymentMethod: 'أجل',
      status: 'معلق',
      items: 5,
      dueDate: '2024-02-15'
    },
    {
      id: 'INV-004',
      customer: 'عمر أحمد',
      date: '2024-01-14',
      time: '16:20',
      amount: '1,200',
      paymentMethod: 'نقدي',
      status: 'مكتمل',
      items: 1
    }
  ];

  const getPaymentMethodColor = (method) => {
    switch(method) {
      case 'نقدي': return 'bg-green-100 text-green-800';
      case 'أجل': return 'bg-orange-100 text-orange-800';
      case 'تصريف': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'ملغى': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الفاتورة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العميل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التاريخ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المبلغ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              طريقة الدفع
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
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Receipt className="text-gray-400 ml-2" size={16} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{sale.id}</div>
                    <div className="text-sm text-gray-500">{sale.items} منتج</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="text-gray-400 ml-2" size={16} />
                  <div className="text-sm font-medium text-gray-900">{sale.customer}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="text-gray-400 ml-2" size={16} />
                  <div>
                    <div className="text-sm text-gray-900">{sale.date}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={12} className="ml-1" />
                      {sale.time}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {sale.amount} SDG
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(sale.paymentMethod)}`}>
                  {sale.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                  {sale.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  عرض
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  طباعة
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SaleList;
