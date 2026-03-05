// src/pages/reports/SalesReport.jsx
import React, { useState } from 'react';
import { Calendar, Download, Filter, BarChart3, PieChart, TrendingUp } from 'lucide-react';

const SalesReport = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('daily');
  const [exportFormat, setExportFormat] = useState('pdf');

  // بيانات تجريبية
  const salesData = [
    { date: '2024-01-01', sales: 15000, profit: 3000, orders: 45 },
    { date: '2024-01-02', sales: 18000, profit: 3600, orders: 52 },
    { date: '2024-01-03', sales: 12000, profit: 2400, orders: 38 },
    { date: '2024-01-04', sales: 22000, profit: 4400, orders: 65 },
    { date: '2024-01-05', sales: 19000, profit: 3800, orders: 58 }
  ];

  const profitLossData = {
    revenue: 86000,
    costOfGoods: 51600,
    grossProfit: 34400,
    operatingExpenses: 12000,
    netProfit: 22400,
    profitMargin: 26.05
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  const exportReport = () => {
    alert(`تصدير التقرير بصيغة ${exportFormat.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تقارير المبيعات</h1>
          <p className="text-gray-600 mt-1">تحليل أداء المبيعات والأرباح</p>
        </div>
        
        <div className="flex space-x-2 space-x-reverse">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} className="ml-2" />
            تصدير
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              من تاريخ
            </label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إلى تاريخ
            </label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع التقرير
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">يومي</option>
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
              <option value="yearly">سنوي</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Filter size={16} className="ml-2" />
              تطبيق
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatAmount(salesData.reduce((sum, day) => sum + day.sales, 0))} ر.س
          </div>
          <div className="text-sm text-gray-600">إجمالي المبيعات</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatAmount(salesData.reduce((sum, day) => sum + day.profit, 0))} ر.س
          </div>
          <div className="text-sm text-gray-600">إجمالي الأرباح</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {salesData.reduce((sum, day) => sum + day.orders, 0)}
          </div>
          <div className="text-sm text-gray-600">عدد الطلبات</div>
        </div>
        
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {((salesData.reduce((sum, day) => sum + day.profit, 0) / 
               salesData.reduce((sum, day) => sum + day.sales, 0)) * 100).toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">هامش الربح</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">مبيعات يومية</h3>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
            {salesData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{ height: `${(day.sales / 25000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">
                  {new Date(day.date).toLocaleDateString('ar-SA', { day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profit/Loss Chart */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">تحليل الأرباح والخسائر</h3>
            <PieChart className="text-green-500" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">الإيرادات</span>
              <span className="text-sm font-medium">{formatAmount(profitLossData.revenue)} ر.س</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">تكلفة البضاعة</span>
              <span className="text-sm font-medium text-red-600">
                -{formatAmount(profitLossData.costOfGoods)} ر.س
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(profitLossData.costOfGoods / profitLossData.revenue) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-medium text-gray-900">الأرباح الإجمالية</span>
              <span className="text-sm font-bold text-green-600">
                {formatAmount(profitLossData.grossProfit)} ر.س
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sales Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">تفاصيل المبيعات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبيعات (ر.س)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأرباح (ر.س)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الطلبات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معدل الطلب
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(day.sales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatAmount(day.profit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(day.sales / day.orders).toFixed(2)} ر.س
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  الإجمالي
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatAmount(salesData.reduce((sum, day) => sum + day.sales, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  {formatAmount(salesData.reduce((sum, day) => sum + day.profit, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salesData.reduce((sum, day) => sum + day.orders, 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(
                    salesData.reduce((sum, day) => sum + day.sales, 0) / 
                    salesData.reduce((sum, day) => sum + day.orders, 0)
                  ).toFixed(2)} ر.س
                </td>
              </tr>
            </tbody>
          </table>
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
            <div className="text-sm text-gray-600 mt-2">هامش الربح الإجمالي</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              60%
            </div>
            <div className="text-sm text-gray-600 mt-2">نسبة تكلفة البضاعة</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              14.29%
            </div>
            <div className="text-sm text-gray-600 mt-2">نسبة المصروفات التشغيلية</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
