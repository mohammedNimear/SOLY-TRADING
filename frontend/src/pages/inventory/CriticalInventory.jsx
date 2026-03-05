
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaEdit, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import apiClient from '../../services/api';

const CriticalStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  // جلب المنتجات الحرجة
  useEffect(() => {
    fetchCriticalProducts();
  }, []);

  const fetchCriticalProducts = async () => {
    setLoading(true);
    try {
      // استبدل هذا بطلب حقيقي
      const response = await apiClient.get('/products/critical');
      setProducts(response.data);

      // بيانات تجريبية
      // const mockProducts = [
      //   { id: 1, name: 'منتج أ', sku: 'PRD001', quantity: 5, minStock: 10, price: 100, supplier: 'المورد الأول' },
      //   { id: 2, name: 'منتج ب', sku: 'PRD002', quantity: 2, minStock: 8, price: 250, supplier: 'المورد الثاني' },
      //   { id: 3, name: 'منتج ج', sku: 'PRD003', quantity: 0, minStock: 15, price: 75, supplier: 'المورد الثالث' },
      //   { id: 4, name: 'منتج د', sku: 'PRD004', quantity: 12, minStock: 20, price: 300, supplier: 'المورد الأول' },
      //   { id: 5, name: 'منتج هـ', sku: 'PRD005', quantity: 3, minStock: 5, price: 180, supplier: 'المورد الثاني' },
      // ];
      // setProducts(mockProducts);
    } catch (error) {
      console.error('خطأ في جلب المنتجات الحرجة', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // تحديث كمية المنتج
  const handleUpdateQuantity = async (id) => {
    if (!newQuantity || newQuantity < 0) {
      toast.error('الرجاء إدخال كمية صالحة');
      return;
    }

    try {
      // استبدل هذا بطلب حقيقي
      // await apiClient.patch(`/products/${id}`, { quantity: newQuantity });

      // تحديث الحالة محلياً
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, quantity: parseInt(newQuantity) } : p))
      );
      toast.success('تم تحديث الكمية بنجاح');
      setEditingId(null);
      setNewQuantity('');
    } catch (error) {
      console.error('خطأ في تحديث الكمية', error);
      toast.error('فشل في تحديث الكمية');
    }
  };

  // إنشاء أمر شراء (مبدئي)
  const handleCreateOrder = (product) => {
    toast.info(`جارٍ إنشاء أمر شراء للمنتج: ${product.name} - الكمية المطلوبة: ${product.minStock - product.quantity}`);
    // يمكن توجيه المستخدم إلى صفحة إنشاء أمر شراء مع تعبئة البيانات تلقائياً
  };

  // تصفية المنتجات حسب البحث
  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.sku.toLowerCase().includes(filter.toLowerCase()) ||
      p.supplier.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* عنوان الصفحة مع تحذير */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 space-x-reverse">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            المخزون الحرج
          </h1>
          {products.length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-semibold flex items-center">
              <FaExclamationTriangle className="ml-1" />
              {products.length} منتج بحاجة لإعادة توريد
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="بحث..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* جدول المنتجات الحرجة */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الكمية الحالية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الحد الأدنى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    لا توجد منتجات حرجة
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      product.quantity === 0
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : product.quantity < product.minStock / 2
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {product.price} ر.س
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          min="0"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-600 dark:text-white"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`text-sm font-semibold ${
                            product.quantity === 0
                              ? 'text-red-600 dark:text-red-400'
                              : product.quantity < product.minStock / 2
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {editingId === product.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateQuantity(product.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setNewQuantity('');
                              }}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              إلغاء
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(product.id);
                              setNewQuantity(product.quantity);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="تعديل الكمية"
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleCreateOrder(product)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="إنشاء أمر شراء"
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* بطاقات إحصائية سريعة (اختياري) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي المنتجات الحرجة</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">منتجات نفدت (0)</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {products.filter(p => p.quantity === 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">أقل من نصف الحد</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {products.filter(p => p.quantity > 0 && p.quantity < p.minStock / 2).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">عدد الموردين</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(products.map(p => p.supplier)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriticalStock;
