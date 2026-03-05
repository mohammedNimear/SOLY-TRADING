// src/pages/sales/Sales.jsx - النسخة المحدثة
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import ProductSearch from '../../components/sales/ProductSearch';
import SaleItemsTable from '../../components/sales/SaleItemsTable';
import SaleSummary from '../../components/sales/SaleSummary';
import PaymentSection from '../../components/sales/PaymentSection';
import { useProducts, useSales } from '../../context';

const Sales = () => {
  const { createSale, loading } = useSales();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('new-sale');
  const [saleItems, setSaleItems] = useState([]);
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);

  // حساب الإجماليات
  const calculateTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = discount;
    const total = subtotal - discountAmount;
    return { subtotal, discount: discountAmount, total };
  };

  const totals = calculateTotals();

  // إضافة منتج للبيع
  const addProductToSale = (product) => {
    const existingItem = saleItems.find(item => item.productId === product._id);
    if (existingItem) {
      // زيادة الكمية إذا كان المنتج موجوداً
      setSaleItems(prev => prev.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      // إضافة منتج جديد
      setSaleItems(prev => [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        total: product.price
      }]);
    }
  };

  // تحديث الكمية
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newTotal = quantity * item.price;
        return { ...item, quantity, total: newTotal };
      }
      return item;
    }));
  };

  // تحديث الخصم
  const updateDiscount = (productId, discount) => {
    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newTotal = (item.quantity * item.price) - discount;
        return { ...item, discount, total: newTotal };
      }
      return item;
    }));
  };

  // إزالة منتج
  const removeProduct = (productId) => {
    setSaleItems(prev => prev.filter(item => item.productId !== productId));
  };

  // حفظ عملية البيع
  const handleSaveSale = async () => {
    if (saleItems.length === 0) {
      alert('يرجى إضافة منتجات للبيع');
      return;
    }

    try {
      const saleData = {
        customer,
        paymentMethod,
        products: saleItems,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        notes
      };

      await createSale(saleData);
      // إعادة تعيين النموذج
      setSaleItems([]);
      setCustomer('');
      setPaymentMethod('cash');
      setNotes('');
      setDiscount(0);
      alert('تم حفظ عملية البيع بنجاح!');
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المبيعات</h1>
          <p className="text-gray-600">إدارة عمليات البيع وفواتير العملاء</p>
        </div>
        
        <button
          onClick={() => setActiveTab('new-sale')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>عملية بيع جديدة</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('new-sale')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'new-sale'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart size={16} className="inline ml-2" />
              عملية بيع جديدة
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={16} className="inline ml-2" />
              تاريخ المبيعات
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp size={16} className="inline ml-2" />
              الإحصائيات
            </button>
          </nav>
        </div>

        {/* New Sale Tab */}
        {activeTab === 'new-sale' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* العمود الأيسر - المنتجات والبحث */}
              <div className="lg:col-span-2 space-y-6">
                {/* البحث عن المنتجات */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">البحث عن المنتجات</h3>
                  <ProductSearch onAddProduct={addProductToSale} />
                </div>

                {/* جدول المنتجات المختارة */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">المنتجات المختارة</h3>
                  <SaleItemsTable 
                    items={saleItems}
                    onUpdateQuantity={updateQuantity}
                    onUpdateDiscount={updateDiscount}
                    onRemove={removeProduct}
                  />
                </div>
              </div>

              {/* العمود الأيمن - الملخص والدفع */}
              <div className="space-y-6">
                {/* ملخص العملية */}
                <SaleSummary 
                  totals={totals}
                  onSave={handleSaveSale}
                  onCancel={() => setSaleItems([])}
                />

                {/* قسم الدفع */}
                <PaymentSection 
                  total={totals.total}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  customerId={customer}
                  setCustomerId={setCustomer}
                  notes={notes}
                  setNotes={setNotes}
                />

                {/* خصم إضافي */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">خصم إضافي</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        مبلغ الخصم
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="mx-auto mb-4" size={48} />
              <p>سيتم إضافة تاريخ المبيعات هنا</p>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="mx-auto mb-4" size={48} />
              <p>سيتم إضافة الإحصائيات هنا</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
