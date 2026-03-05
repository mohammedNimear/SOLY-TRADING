
// components/cashbox/BalanceCard.jsx
import React from 'react';
import { Wallet } from 'lucide-react';

const BalanceCard = ({ balance, loading }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Wallet className="w-8 h-8 ml-3" />
          <div>
            <p className="text-sm opacity-90">الرصيد الحالي</p>
            {loading ? (
              <div className="h-8 w-24 bg-white/20 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-bold">{balance.toLocaleString()} د.ل</p>
            )}
          </div>
        </div>
        <div className="text-left">
          <p className="text-sm opacity-75">آخر تحديث</p>
          <p className="text-sm">{new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
