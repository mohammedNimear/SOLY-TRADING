// components/cashbox/PaymentTotalsCard.jsx
const PaymentTotalsCard = ({ title, amount, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="mr-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold" style={{ color: 'inherit' }}>
            {amount.toLocaleString()} ₪
          </p>
        </div>
      </div>
    </div>
  );
};
