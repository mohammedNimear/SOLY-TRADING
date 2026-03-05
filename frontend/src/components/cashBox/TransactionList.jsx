
// components/cashbox/TransactionForm.jsx
import React, { useState } from 'react';

const TransactionForm = ({ onSave, onCancel }) => {
  const [type, setType] = useState('deposit'); // deposit أو withdraw
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    onSave({
      type,
      amount: parseFloat(amount),
      description,
    });
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        إضافة حركة جديدة
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="deposit"
              checked={type === 'deposit'}
              onChange={(e) => setType(e.target.value)}
              className="ml-2"
            />
            <span className="text-gray-700 dark:text-gray-300">إيداع</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="withdraw"
              checked={type === 'withdraw'}
              onChange={(e) => setType(e.target.value)}
              className="ml-2"
            />
            <span className="text-gray-700 dark:text-gray-300">سحب</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            المبلغ
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="أدخل المبلغ"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            الوصف
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            placeholder="شرح الحركة (اختياري)"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            حفظ
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
