
// pages/CashBox/CashBox.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, FiTrendingUp, FiTrendingDown, 
  FiClock, FiCreditCard, FiRepeat, FiPieChart 
} from 'react-icons/fi';
import BalanceCard from '../../components/cashBox/BalanceCard';
import TransactionsTable from '../../components/cashBox/TransactionsTable';
import TransactionForm from './../../components/cashBox/TransactionList';
import apiClient from '../../services/api';
import { useNotifications } from './../../context/NotificationContext';

const CashBox = () => {
  const { addNotification } = useNotifications();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // إحصائيات طرق الدفع
  const [paymentTotals, setPaymentTotals] = useState({
    total: 0,
    cash: 0,
    credit: 0,
    distribution: 0,
  });

  // إحصائيات اليوم (يمكن جلبها من الخلفية أيضاً)
  const [todayStats, setTodayStats] = useState({
    todayIncome: 0,
    todayExpense: 0,
    transactionsCount: 0,
  });

  // جلب البيانات من الخلفية
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب إجمالي طرق الدفع
        const totalsRes = await apiClient.get('/sales/cash/totals');
        setPaymentTotals(totalsRes.data);

        // جلب رصيد الصندوق (قد يكون من مسار آخر)
        // نفترض أن هناك مساراً منفصلاً أو أن totals تحتوي على الرصيد
        setBalance(totalsRes.data.total); // مثال

        // جلب حركات الصندوق (يمكن من '/cash/details')
        const detailsRes = await apiClient.get('/sales/cash/details');
        setTransactions(detailsRes.data);

        // جلب إحصائيات اليوم (قد تكون من مسار آخر)
        // نفترض أنها تأتي من مكان آخر
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = detailsRes.data.filter(t => 
          t.date?.startsWith(today)
        );
        setTodayStats({
          todayIncome: todayTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          todayExpense: todayTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
          transactionsCount: detailsRes.data.length,
        });

      } catch (error) {
        addNotification({
          type: 'error',
          message: 'فشل تحميل بيانات الصندوق',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  const handleAddTransaction = async (transactionData) => {
    try {
      // إرسال الحركة إلى الخلفية
      const response = await apiClient.post('/cash/transactions', transactionData);
      const newTransaction = response.data;
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      if (transactionData.type === 'income') {
        setBalance(prev => prev + transactionData.amount);
      } else {
        setBalance(prev => prev - transactionData.amount);
      }
      
      addNotification({
        type: 'success',
        message: 'تم إضافة الحركة بنجاح',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'حدث خطأ أثناء إضافة الحركة',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          صندوق النقد
        </h1>

        {/* بطاقة الرصيد */}
        <BalanceCard balance={balance} />

        {/* بطاقات إحصائيات طرق الدفع */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* الإجمالي الكلي */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FiPieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">الإجمالي الكلي</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {paymentTotals.total.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>

          {/* النقدي */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">نقدي</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {paymentTotals.cash.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>

          {/* آجل */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiCreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">آجل</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {paymentTotals.credit.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>

          {/* تصريف */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                <FiRepeat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">تصريف</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {paymentTotals.distribution.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقات إحصائيات اليوم (وارد/منصرف) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">وارد اليوم</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {todayStats.todayIncome.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <FiTrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">منصرف اليوم</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {todayStats.todayExpense.toLocaleString()} ₪
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الحركات</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {todayStats.transactionsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج إضافة حركة */}
        <div className="mb-8">
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>

        {/* جدول الحركات */}
        <TransactionsTable transactions={transactions} />
      </motion.div>
    </div>
  );
};

export default CashBox;
