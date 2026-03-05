
import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const CashSummary = ({ balance, totalIncome, totalExpense }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* الرصيد الحالي */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">الرصيد الحالي</h3>
          <FaWallet className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">{balance} ر.س</p>
      </div>

      {/* إجمالي القبض */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">إجمالي القبض</h3>
          <FaArrowUp className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">+{totalIncome} ر.س</p>
      </div>

      {/* إجمالي الصرف */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">إجمالي الصرف</h3>
          <FaArrowDown className="text-2xl opacity-80" />
        </div>
        <p className="text-3xl font-bold">-{totalExpense} ر.س</p>
      </div>
    </div>
  );
};

export default CashSummary;
