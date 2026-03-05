// src/pages/dashboard/Dashboard.jsx - النسخة المحدثة
import React, { useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  DollarSign,
  Truck,
  CreditCard
} from 'lucide-react';
import { useCustomers, useProducts, useSales, useStores } from '../../context';

const Dashboard = () => {
  const { stats: salesStats, fetchSalesStats } = useSales();
  const { stats: productStats } = useProducts();
  const { stores } = useStores();
  const { customers } = useCustomers();

  useEffect(() => {
    fetchSalesStats();
  }, [fetchSalesStats]);

  // إحصائيات سريعة
  const quickStats = [
    {
      title: 'إجمالي المبيعات',
      value: salesStats.totalSales?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      unit: 'ر.س'
    },
    {
      title: 'عدد الفواتير',
      value: salesStats.totalInvoices || '0',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      unit: ''
    },
    {
      title: 'إجمالي المنتجات',
      value: productStats.totalProducts || '0',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      unit: ''
    },
    {
      title: 'عدد العملاء',
      value: customers.length || '0',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      unit: ''
    }
  ];

  // المنتجات الحرجة
  const criticalProducts = [
    { name: 'زيت ذرة 1 لتر', sku: 'OIL001', stock: 3, minStock: 10 },
    { name: 'سكر 1 كيلو', sku: 'SUG001', stock: 2, minStock: 15 },
    { name: 'شاي أخضر', sku: 'TEA001', stock: 1, minStock: 5 }
  ];

  // أحدث المبيعات
  const recentSales = [
    { id: '1', customer: 'أحمد محمد', amount: '1,250', time: 'قبل 5 دقائق' },
    { id: '2', customer: 'سارة أحمد', amount: '890', time: 'قبل 15 دقيقة' },
    { id: '3', customer: 'علي عبدالله', amount: '2,400', time: 'قبل 30 دقيقة' }
  ];

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-1">مرحباً بك في نظام إدارة المخزون والمبيعات</p>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {stat.value} {stat.unit}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* الشبكة الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المنتجات الحرجة */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">المنتجات الحرجة</h3>
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المخزون الحالي
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحد الأدنى
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criticalProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {product.minStock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* أحدث المبيعات */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">أحدث المبيعات</h3>
              <ShoppingCart className="text-blue-500" size={20} />
            </div>
            <div className="mt-4 space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sale.customer}</p>
                    <p className="text-xs text-gray-500">{sale.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{sale.amount} ر.س</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* الإحصائيات الإضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* توزيع المبيعات */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع المبيعات</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نقدي</span>
                <span className="text-sm font-medium text-gray-900">
                  {salesStats.cashTotal?.toLocaleString() || '0'} ر.س
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">آجل</span>
                <span className="text-sm font-medium text-gray-900">
                  {salesStats.creditTotal?.toLocaleString() || '0'} ر.س
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '35%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* نظرة عامة على المخازن */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نظرة عامة على المخازن</h3>
            <div className="space-y-3">
              {stores.slice(0, 3).map((store, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {store.products?.length || 0} منتج
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات سريعة */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">تنبيهات سريعة</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc space-y-1 pl-5">
                <li>3 منتجات بحاجة لإعادة الطلب</li>
                <li>فاتورة آجلة متأخرة الدفع</li>
                <li>مخزن يحتاج إلى صيانة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
