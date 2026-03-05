
import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch } from 'react-icons/fa';
import apiClient from '../../api/axios';

const ProductSection = ({ products, onProductsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // جلب جميع المنتجات عند تحميل المكون (مرة واحدة)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // يمكنك استبدال هذا بطلب حقيقي من API
        const response = await apiClient.get('/products');
        setAllProducts(response.data);
        
        // بيانات تجريبية
        setAllProducts([
          { id: 1, name: 'منتج 1', price: 100, stock: 50 },
          { id: 2, name: 'منتج 2', price: 200, stock: 30 },
          { id: 3, name: 'منتج 3', price: 150, stock: 20 },
          { id: 4, name: 'منتج 4', price: 300, stock: 10 },
        ]);
      } catch (error) {
        console.error('خطأ في جلب المنتجات', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // فلترة المنتجات حسب مصطلح البحث
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchTerm, allProducts]);

  // إضافة منتج إلى القائمة المختارة
  const addProduct = (product) => {
    // التحقق من وجود المنتج بالفعل في القائمة
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      // إذا كان موجوداً، نزيد الكمية
      const updated = [...products];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
      onProductsChange(updated);
    } else {
      // إضافة منتج جديد مع الكمية 1
      const newProduct = {
        ...product,
        quantity: 1,
        total: product.price,
      };
      onProductsChange([...products, newProduct]);
    }
    setSearchTerm('');
  };

  // تحديث كمية منتج
  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const updated = [...products];
    updated[index].quantity = quantity;
    updated[index].total = quantity * updated[index].price;
    onProductsChange(updated);
  };

  // حذف منتج من القائمة
  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    onProductsChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* حقل البحث */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* نتائج البحث */}
      {searchTerm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-3 text-center text-gray-500">جاري التحميل...</p>
          ) : searchResults.length === 0 ? (
            <p className="p-3 text-center text-gray-500">لا توجد نتائج</p>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => addProduct(product)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{product.price} ر.س</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">المخزون: {product.stock}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* قائمة المنتجات المختارة */}
      {products.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">المنتجات المختارة</h4>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.price} ر.س</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-600 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-16">
                    {product.total} ر.س
                  </span>
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
