// src/pages/employees/ExpenseManagement.jsx
import React, { useState } from 'react';
import { Plus, Search, Filter, DollarSign, Check, X } from 'lucide-react';

const ExpenseManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // بيانات تجريبية للمنصرفات
  const personalExpenses = [
    {
      id: '1',
      employee: 'أحمد محمد',
      description: 'شراء أدوات مكتبية',
      amount: 500,
      date: '2024-01-15',
      status: 'مقبول',
      approvedBy: 'مدير النظام'
    },
    {
      id: '2',
      employee: 'سارة أحمد',
      description: 'مصاريف نقل',
      amount: 300,
      date: '2024-01-14',
      status: 'معلق',
      approvedBy: null
    }
  ];

  const commercialExpenses = [
    {
      id: '3',
      employee: 'مصطفى حسن',
      description: 'شراء معدات للصيانة',
      amount: 1200,
      date: '2024-01-10',
      status: 'مقبول',
      approvedBy: 'مدير النظام'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'مقبول': return 'bg-green-100 text-green-800';
      case 'مرفوض': return 'bg-red-100 text-red-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنصرفات</h1>
          <p className="text-gray-600">إدارة المنصرفات الشخصية والتجارية للموظفين</p>
        </div>
        
        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>منصرف جديد</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">إجمالي المنصرفات</p>
              <p className="text-2xl font-bold text-gray-900">15,250</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">الشخصية</p>
              <p className="text-2xl font-bold text-gray-900">8,500</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">التجارية</p>
              <p className="text-2xl font-bold text-gray-900">6,750</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Filter className="text-yellow-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">معلقة</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              المنصرفات الشخصية
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'commercial'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              المنصرفات التجارية
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="البحث بالموظف أو الوصف..."
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
                <option value="مقبول">مقبولة</option>
                <option value="مرفوض">مرفوضة</option>
                <option value="معلق">معلقة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموظف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
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
              {(activeTab === 'personal' ? personalExpenses : commercialExpenses).map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.amount.toFixed(2)} SDG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {expense.status === 'معلق' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 ml-4 flex items-center">
                          <Check size={16} className="ml-1" />
                          قبول
                        </button>
                        <button className="text-red-600 hover:text-red-900 ml-4 flex items-center">
                          <X size={16} className="ml-1" />
                          رفض
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <AddExpenseModal 
          onClose={() => setShowAddExpenseModal(false)} 
          expenseType={activeTab}
        />
      )}
    </div>
  );
};

// نموذج إضافة منصرف جديد
const AddExpenseModal = ({ onClose, expenseType }) => {
  const [formData, setFormData] = useState({
    employee: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating new expense:', formData);
    alert(`تم إضافة المنصرف ${expenseType === 'personal' ? 'الشخصي' : 'التجاري'} بنجاح!`);
    onClose();
  };

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد' },
    { id: '2', name: 'سارة أحمد' },
    { id: '3', name: 'مصطفى حسن' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            منصرف {expenseType === 'personal' ? 'شخصي' : 'تجاري'} جديد
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الموظف *
              </label>
              <select
                value={formData.employee}
                onChange={(e) => setFormData({...formData, employee: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر الموظف</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="وصف المنصرف"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المبلغ (SDG) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
                            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التاريخ *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              حفظ المنصرف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseManagement;
