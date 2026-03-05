import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  User, 
  CreditCard, 
  Users as DischargeIcon,
  Calculator,
  Package
} from 'lucide-react';

const NewSale = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: معلومات العميل, 2: المنتجات, 3: المراجعة
  const [formData, setFormData] = useState({
    customer: '',
    paymentMethod: 'نقدي', // نقدي, آجل, تصريف
    dueDate: '',
    products: [],
    discount: 0,
    notes: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);

  // بيانات تجريبية للعملاء والمنتجات
  const customers = [
    { id: 1, name: 'أحمد محمد', phone: '0912345678', type: 'فرد' },
    { id: 2, name: 'علي عبدالله', phone: '0987654321', type: 'شركة' },
    { id: 3, name: 'محمد علي', phone: '0911223344', type: 'فرد' },
    { id: 4, name: 'عمر أحمد', phone: '0955667788', type: 'فرد' }
  ];

  const products = [
    { id: 1, name: 'زيت ذرة 1 لتر', price: 150, stock: 25, sku: 'OIL001' },
    { id: 2, name: 'سكر 1 كيلو', price: 80, stock: 50, sku: 'SUG001' },
    { id: 3, name: 'شاي أخضر', price: 250, stock: 30, sku: 'TEA001' },
    { id: 4, name: 'صابون غسيل', price: 120, stock: 40, sku: 'SOAP001' },
    { id: 5, name: 'قهوة فوري', price: 350, stock: 20, sku: 'COFF001' }
  ];

  const handleAddProduct = () => {
    if (selectedProduct && productQuantity > 0) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const newItem = {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: productQuantity,
          total: product.price * productQuantity
        };
        
        setFormData({
          ...formData,
          products: [...formData.products, newItem]
        });
        
        setSelectedProduct(null);
        setProductQuantity(1);
      }
    }
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter(item => item.id !== productId)
    });
  };

  const getTotalAmount = () => {
    return formData.products.reduce((sum, item) => sum + item.total, 0) - formData.discount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting sale:', formData);
    // هنا سيتم إرسال البيانات إلى الـ API
    alert('تم حفظ الفاتورة بنجاح!');
    onClose();
  };

  const PaymentMethodButton = ({ method, icon: Icon, label, description }) => {
    const isSelected = formData.paymentMethod === method;
    
    return (
      <button
        type="button"
        onClick={() => setFormData({...formData, paymentMethod: method})}
        className={`flex-1 p-4 border rounded-lg text-center transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Icon className={`mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} size={24} />
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">فاتورة بيع جديدة</h2>
              <p className="text-gray-600">إنشاء فاتورة بيع جديدة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > num ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>العميل</span>
            <span>المنتجات</span>
            <span>المراجعة</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Customer Information */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العميل</h3>
                
                {/* Customer Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختيار العميل
                  </label>
                  <select
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر عميل</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone} ({customer.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    طريقة الدفع
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PaymentMethodButton
                      method="نقدي"
                      icon={Calculator}
                      label="نقدي"
                      description="دفع فوري"
                    />
                    <PaymentMethodButton
                      method="أجل"
                      icon={CreditCard}
                      label="آجل"
                      description="دفع لاحق"
                    />
                    <PaymentMethodButton
                      method="تصريف"
                      icon={DischargeIcon}
                      label="تصريف"
                      description="بيع بالتصريف"
                    />
                  </div>
                </div>

                {/* Due Date for Credit Sales */}
                {formData.paymentMethod === 'أجل' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الاستحقاق
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Products Selection */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة المنتجات</h3>
                
                {/* Product Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختيار المنتج
                    </label>
                    <select
                      value={selectedProduct || ''}
                      onChange={(e) => setSelectedProduct(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">اختر منتج</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price} SDG
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                        className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 border-t border-b border-gray-300 text-center"
                        min="1"
                      />
                      <button
                        type="button"
                        onClick={() => setProductQuantity(productQuantity + 1)}
                        className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} className="ml-2" />
                      إضافة المنتج
                    </button>
                  </div>
                </div>

                {/* Selected Products List */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">المنتجات المحددة</h4>
                  {formData.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="mx-auto mb-2" size={32} />
                        <p>لا توجد منتجات محددة</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.products.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.price} SDG
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.total} SDG
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProduct(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  حذف
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Discount */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الخصم (إن وجد)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">مراجعة الفاتورة</h3>
                
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">معلومات العميل</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">العميل:</span>
                      <span className="ml-2 font-medium">
                        {customers.find(c => c.id === Number(formData.customer))?.name || 'غير محدد'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <span className="ml-2 font-medium">{formData.paymentMethod}</span>
                    </div>
                    {formData.paymentMethod === 'أجل' && (
                      <div>
                        <span className="text-gray-600">تاريخ الاستحقاق:</span>
                        <span className="ml-2 font-medium">{formData.dueDate || 'غير محدد'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Summary */}
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.products.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.price} SDG
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.total} SDG
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي المنتجات:</span>
                      <span className="font-medium">
                        {formData.products.reduce((sum, item) => sum + item.total, 0)} SDG
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الخصم:</span>
                      <span className="font-medium text-red-600">
                        {formData.discount} SDG
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>الإجمالي النهائي:</span>
                      <span className="text-blue-600">
                        {getTotalAmount()} SDG
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="أضف أي ملاحظات خاصة بهذه الفاتورة..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  السابق
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <ShoppingCart size={16} className="ml-2" />
                  حفظ الفاتورة
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSale;