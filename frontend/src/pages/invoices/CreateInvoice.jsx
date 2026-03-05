// src/pages/invoices/CreateInvoice.jsx - النسخة المحدثة
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Search } from 'lucide-react';
import { useCustomers, useProducts, useSales, useStores } from '../../context';

const CreateInvoice = () => {
  const { createInvoice, loading } = useSales();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const { stores } = useStores();
  
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    customerName: '',
    paymentMethod: 'cash',
    items: [],
    store: '',
    notes: '',
    discount: 0,
    tax: 0
  });

  const [searchResults, setSearchResults] = useState([]);

  // حساب الإجماليات
  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * invoiceData.tax) / 100;
    const total = taxableAmount + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // إضافة منتج للفاتورة
  const addProductToInvoice = (product) => {
    const newItem = {
      product: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      total: product.price
    };
    
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    setSearchResults([]);
  };

  // تحديث منتج في الفاتورة
  const updateItem = (index, field, value) => {
    setInvoiceData(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        total: field === 'quantity' || field === 'price' 
          ? (field === 'quantity' ? value : updatedItems[index].quantity) * 
            (field === 'price' ? value : updatedItems[index].price)
          : updatedItems[index].total
      };
      return { ...prev, items: updatedItems };
    });
  };

  // حذف منتج من الفاتورة
  const removeItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // البحث في المنتجات
  const searchProducts = (query) => {
    if (query.length > 1) {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // حفظ الفاتورة
  const handleSaveInvoice = async () => {
    try {
      // التحقق من البيانات المطلوبة
      if (!invoiceData.customer) {
        alert('يرجى اختيار العميل');
        return;
      }
      
      if (!invoiceData.store) {
        alert('يرجى اختيار المخزن');
        return;
      }
      
      if (invoiceData.items.length === 0) {
        alert('يرجى إضافة منتجات للفاتورة');
        return;
      }

      // إضافة اسم العميل
      const customerInfo = customers.find(c => c._id === invoiceData.customer);
      const invoiceToSend = {
        ...invoiceData,
        customerName: customerInfo?.name || invoiceData.customerName,
        subtotal: parseFloat(totals.subtotal),
        discountAmount: parseFloat(totals.discountAmount),
        taxAmount: parseFloat(totals.taxAmount),
        total: parseFloat(totals.total)
      };

      await createInvoice(invoiceToSend);
      alert('تم حفظ الفاتورة بنجاح!');
      
      // إعادة تعيين النموذج
      setInvoiceData({
        customer: '',
        customerName: '',
        paymentMethod: 'cash',
        items: [],
        store: '',
        notes: '',
        discount: 0,
        tax: 0
      });
      
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('حدث خطأ أثناء حفظ الفاتورة');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">فاتورة جديدة</h1>
          <p className="text-gray-600">إنشاء فاتورة بيع جديدة للعميل</p>
        </div>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X size={16} className="ml-2" />
          إلغاء
        </button>
      </div>

      {/* Invoice Form */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 space-y-6">
          {/* معلومات الفاتورة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العميل *
              </label>
              <select
                value={invoiceData.customer}
                onChange={(e) => setInvoiceData({...invoiceData, customer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر العميل</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المخزن *
              </label>
              <select
                value={invoiceData.store}
                onChange={(e) => setInvoiceData({...invoiceData, store: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر المخزن</option>
                {stores.map(store => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طريقة الدفع
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['cash', 'card', 'credit', 'bank'].map((method) => (
                <button
                  key={method}
                  onClick={() => setInvoiceData({...invoiceData, paymentMethod: method})}
                  className={`px-4 py-2 rounded-lg border ${
                    invoiceData.paymentMethod === method
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {method === 'cash' && 'نقدي'}
                  {method === 'card' && 'بطاقة'}
                  {method === 'credit' && 'آجل'}
                  {method === 'bank' && 'تحويل بنكي'}
                </button>
              ))}
            </div>
          </div>

          {/* البحث عن المنتجات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إضافة منتجات
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ابحث عن منتج بالاسم أو SKU..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => searchProducts(e.target.value)}
              />
              
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => addProductToInvoice(product)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="ml-3 text-emerald-600 font-medium">
                          {product.price} ر.س
                        </span>
                        <Plus className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* جدول المنتجات */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">المنتجات</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-right">المنتج</th>
                    <th className="py-2 px-4 text-right">السعر</th>
                    <th className="py-2 px-4 text-right">الكمية</th>
                    <th className="py-2 px-4 text-right">الإجمالي</th>
                    <th className="py-2 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20 p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-16 p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="py-2 px-4">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* الإجماليات */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخصم (%)
                  </label>
                  <input
                    type="number"
                    value={invoiceData.discount}
                    onChange={(e) => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الضريبة (%)
                  </label>
                  <input
                    type="number"
                    value={invoiceData.tax}
                    onChange={(e) => setInvoiceData({...invoiceData, tax: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-right">
                  <span className="font-medium">الإجمالي الفرعي:</span>
                  <br />
                  <span>{totals.subtotal} ر.س</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">الخصم:</span>
                  <br />
                  <span>{totals.discountAmount} ر.س</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">قبل الضريبة:</span>
                  <br />
                  <span>{totals.taxableAmount} ر.س</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">الضريبة:</span>
                  <br />
                  <span>{totals.taxAmount} ر.س</span>
                </div>
                <div className="text-right font-bold text-lg col-span-2 border-t pt-2">
                  <span>الإجمالي:</span>
                  <br />
                  <span>{totals.total} ر.س</span>
                </div>
              </div>
            </div>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="ملاحظات إضافية حول الفاتورة..."
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveInvoice}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={18} className="ml-2" />
                  حفظ الفاتورة
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
