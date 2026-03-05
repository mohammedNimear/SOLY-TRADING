
import React from 'react';
import { Save, X } from 'lucide-react';

const SaleSummary = ({ totals, onSave, onCancel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">الإجمالي الفرعي:</span>
        <span className="text-lg font-medium text-gray-900 dark:text-white">{totals.subtotal.toFixed(2)} د.ل</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">الخصم:</span>
        <span className="text-lg font-medium text-red-500">- {totals.discount.toFixed(2)} د.ل</span>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">الإجمالي:</span>
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totals.total.toFixed(2)} د.ل</span>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Save className="w-5 h-5 ml-2" />
          حفظ الفاتورة
        </button>
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5 ml-2" />
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default SaleSummary;
