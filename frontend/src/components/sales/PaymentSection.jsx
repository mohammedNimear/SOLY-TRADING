
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const PaymentSection = ({ total, paymentMethod, setPaymentMethod, customerId, setCustomerId, notes, setNotes }) => {
  const [customers, setCustomers] = useState([]);
  const [amountPaid, setAmountPaid] = useState(total);
  const [exchangeRate, setExchangeRate] = useState(1); // سعر الصرف للدولار مثلاً
  const [exchangeCurrency, setExchangeCurrency] = useState('LYD'); // العملة المستخدمة في الصرف

  useEffect(() => {
    // جلب قائمة العملاء (للدفع الآجل أو الصرف)
    const fetchCustomers = async () => {
      try {
        const { data } = await apiClient.get('/customers');
        setCustomers(data);
      } catch (error) {
        console.error('فشل جلب العملاء', error);
      }
    };
    fetchCustomers();
  }, []);

  // إذا تغير المبلغ الإجمالي، حدّث المبلغ المدفوع ليطابقه (إلا إذا كان الآجل)
  useEffect(() => {
    if (paymentMethod !== 'credit') {
      setAmountPaid(total);
    }
  }, [total, paymentMethod]);

  // حساب الباقي
  const remaining = amountPaid - total;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">طريقة الدفع</h3>
      <div className="flex flex-wrap gap-2">
        {['cash', 'card', 'credit', 'exchange'].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`px-4 py-2 rounded-lg border ${
              paymentMethod === method
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
            }`}
          >
            {method === 'cash' && 'نقدي'}
            {method === 'card' && 'بطاقة'}
            {method === 'credit' && 'آجل'}
            {method === 'exchange' && 'صرف'}
          </button>
        ))}
      </div>

      {/* حقل اختيار العميل (للآجل أو الصرف) */}
      {(paymentMethod === 'credit' || paymentMethod === 'exchange') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اختر العميل</label>
          <select
            value={customerId || ''}
            onChange={(e) => setCustomerId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- اختر عميل --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* مبلغ مدفوع (لغير الآجل) */}
      {paymentMethod !== 'credit' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المبلغ المدفوع</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}

      {/* خيارات الصرف (عملة، سعر الصرف) */}
      {paymentMethod === 'exchange' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العملة</label>
            <select
              value={exchangeCurrency}
              onChange={(e) => setExchangeCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="LYD">دينار ليبي</option>
              <option value="USD">دولار</option>
              <option value="EUR">يورو</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سعر الصرف</label>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* ملاحظات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="أي ملاحظات إضافية..."
        />
      </div>

      {/* عرض الباقي إذا كان موجوداً */}
      {paymentMethod !== 'credit' && remaining !== 0 && (
        <div className={`p-3 rounded-lg ${remaining >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {remaining >= 0 ? `الباقي للعميل: ${remaining.toFixed(2)}` : `المتبقي على العميل: ${Math.abs(remaining).toFixed(2)}`}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
