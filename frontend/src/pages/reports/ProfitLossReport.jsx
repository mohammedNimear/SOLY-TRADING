// src/pages/reports/ProfitLossReport.jsx
import React, { useState } from 'react';
import { Calendar, Download, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const ProfitLossReport = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('monthly');

  // بيانات تجريبية
  const profitLossData = {
    revenue: 86000,
    costOfGoods: 51600,
    grossProfit: 34400,
    operatingExpenses: 12000,
    netProfit: 22400,
    profitMargin: 26.05,
    expenses: [
      { category: 'رواتب الموظفين', amount: 8000 },
      { category: 'إيجار', amount: 3000 },
      { category: 'كهرباء ومياه', amount: 1000 },
      { category: 'تسويق', amount: 2000 }
    ]
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقرير الأرباح والخسائر</h1>
          <p className="text-gray-600 mt-1">تحليل شامل للأداء المالي</p>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="yearly">سنوي</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download size={16} className="ml-2" />
            تصدير
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              من تاريخ
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Filter size={16} className="ml-2" />
              تطبيق
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatAmount(profitLossData.revenue)} ر.س
          </div>
          <div className="text-sm text-gray-600">الإيرادات</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {formatAmount(profitLossData.costOfGoods)} ر.س
          </div>
          <div className="text-sm text-gray-600">تكلفة البضاعة</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatAmount(profitLossData.grossProfit)} ر.س
          </div>
          <div className="text-sm text-gray-600">الأرباح الإجمالية</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatAmount(profitLossData.netProfit)} ر.س
          </div>
          <div className="text-sm text-gray-600">الأرباح الصافية</div>
        </div>
      </div>

      {/* Profit Margin Analysis */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">تحليل هامش الربح</h3>
          <TrendingUp className="text-green-500" size={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {profitLossData.profitMargin.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">هامش الربح الصافي</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {((profitLossData.grossProfit / profitLossData.revenue) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">هامش الربح الإجمالي</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {((profitLossData.operatingExpenses / profitLossData.revenue) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">نسبة المصروفات</div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">تحليل المصروفات</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {profitLossData.expenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{expense.category}</span>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="font-medium text-gray-900">
                    {formatAmount(expense.amount)} ر.س
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(expense.amount / profitLossData.operatingExpenses) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {((expense.amount / profitLossData.operatingExpenses) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نسب مالية مهمة</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">نسبة هامش الربح الصافي</span>
              <span className="font-medium">{profitLossData.profitMargin.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">نسبة العائد على الاستثمار</span>
              <span className="font-medium">18.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">نسبة الدين إلى حقوق الملكية</span>
              <span className="font-medium">0.3:1</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">تحليل الاتجاه</h3>
          <div className="h-40 flex items-end justify-between space-x-2 space-x-reverse">
            {[85, 92, 78, 95, 88].map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${value}%` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">شهر {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;
