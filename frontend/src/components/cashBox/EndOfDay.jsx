import React, { useState, useContext, useEffect } from 'react';
import { SalesContext } from '../contexts/SalesContext';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiPrinter } from 'react-icons/fi';
import api from '../api';
import toast from 'react-hot-toast';

const EndOfDay = () => {
  const { sales, fetchSales } = useContext(SalesContext);
  const { darkMode } = useContext(DarkModeContext);

  // حالات التصفية والتاريخ
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySales, setDailySales] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(1); // سعر الصرف (مثلاً الدولار مقابل العملة المحلية)
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    cashTotal: 0,
    creditTotal: 0,
    totalAmount: 0,
    cashInvoices: 0,
    creditInvoices: 0,
  });

  // تحميل المبيعات عند تغيير التاريخ
  useEffect(() => {
    fetchSales();
  }, []);

  // فلترة مبيعات اليوم المحدد
  useEffect(() => {
    if (!sales || sales.length === 0) return;
    const filtered = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
      return saleDate === selectedDate;
    });
    setDailySales(filtered);
  }, [sales, selectedDate]);

  // حساب الإحصائيات
  useEffect(() => {
    let cashTotal = 0, creditTotal = 0, cashCount = 0, creditCount = 0;
    dailySales.forEach(sale => {
      if (sale.paymentMethod === 'نقدي') {
        cashTotal += sale.totalAmount;
        cashCount++;
      } else if (sale.paymentMethod === 'أجل') {
        creditTotal += sale.totalAmount;
        creditCount++;
      }
    });
    setSummary({
      totalInvoices: dailySales.length,
      cashTotal,
      creditTotal,
      totalAmount: cashTotal + creditTotal,
      cashInvoices: cashCount,
      creditInvoices: creditCount,
    });
  }, [dailySales]);

  // تغيير التاريخ
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // إنهاء اليوم (إرسال تقرير للخادم)
  const handleEndDay = async () => {
    try {
      await api.post('/reports/end-of-day', {
        date: selectedDate,
        summary,
        exchangeRate,
      });
      toast.success('تم إنهاء اليوم بنجاح');
    } catch (err) {
      toast.error('فشل في إنهاء اليوم');
    }
  };

  // طباعة التقرير
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`p-4 ${darkMode ? 'dark' : ''} print:bg-white`}>
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">نهاية اليوم</h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handlePrint}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPrinter /> طباعة
          </button>
          <button
            onClick={handleEndDay}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            إنهاء اليوم
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
              <FiClock size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الفواتير</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{summary.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200">
              <FiCheckCircle size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">نقدي</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{summary.cashInvoices}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{summary.cashTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200">
              <FiXCircle size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">آجل</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{summary.creditInvoices}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{summary.creditTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-200">
              <FiDollarSign size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">الإجمالي</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{summary.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* قسم سعر الصرف */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 print:hidden">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-gray-700 dark:text-gray-300 font-medium">سعر الصرف (دولار):</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
            className="border rounded-lg px-3 py-2 w-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <span className="text-gray-600 dark:text-gray-400">
            الإجمالي بالدولار: {(summary.totalAmount / exchangeRate).toFixed(2)}
          </span>
        </div>
      </div>

      {/* جدول فواتير اليوم */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b dark:border-gray-700 dark:text-white">فواتير اليوم</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">رقم الفاتورة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">طريقة الدفع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجمالي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dailySales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    لا توجد فواتير لهذا اليوم
                  </td>
                </tr>
              ) : (
                dailySales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{sale._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{sale.customer?.name || 'نقدي'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.paymentMethod === 'نقدي' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{sale.totalAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {new Date(sale.createdAt).toLocaleTimeString('ar-EG')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* تذييل للطباعة */}
      <div className="hidden print:block mt-8 text-center text-gray-600">
        <p>تقرير نهاية اليوم - {new Date(selectedDate).toLocaleDateString('ar-EG')}</p>
        <p>إجمالي الفواتير: {summary.totalInvoices} | نقدي: {summary.cashTotal.toFixed(2)} | آجل: {summary.creditTotal.toFixed(2)} | الإجمالي: {summary.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default EndOfDay;
