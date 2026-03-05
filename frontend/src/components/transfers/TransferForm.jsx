// src/components/transfers/TransferForm.jsx
import React, { useState } from 'react';
import { X, Plus, Save, ArrowRightLeft } from 'lucide-react';

const TransferForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fromType: 'store',
    from: '',
    toType: 'sellingWindow',
    to: '',
    items: [{ product: '', quantity: 1 }],
    notes: ''
  });

  const [stores, setStores] = useState([
    { id: '1', name: 'المخزن الرئيسي - السوق العربي' },
    { id: '2', name: 'المخزن الفرعي - الحي الغربي' },
    { id: '3', name: 'المخزن المركزي - المدينة' },
    { id: '4', name: 'المخزن الشمالي - المنطقة الشمالية' },
    { id: '5', name: 'المخزن الجنوبي - المنطقة الجنوبية' }
  ]);

  const [sellingWindows] = useState([
    { id: '1', name: 'نافذة البيع 1 - السوق المركزي' },
    { id: '2', name: 'نافذة البيع 2 - الحي التجاري' },
    { id: '3', name: 'نافذة البيع 3 - المجمع التجاري' },
    { id: '4', name: 'نافذة البيع 4 - المنطقة الصناعية' },
    { id: '5', name: 'نافذة البيع 5 - المدينة الجديدة' },
    { id: '6', name: 'نافذة البيع 6 - السوق الشمالي' },
    { id: '7', name: 'نافذة البيع 7 - السوق الجنوبي' }
  ]);

  const [products] = useState([
    { id: '1', name: 'زيت ذرة 1 لتر', sku: 'OIL001' },
    { id: '2', name: 'سكر 1 كيلو', sku: 'SUG001' },
    { id: '3', name: 'شاي أخضر 100 غرام', sku: 'TEA001' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addProductItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }]
    });
  };

  const removeProductItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateProductItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ArrowRightLeft className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">تحويل بضاعة جديد</h2>
              <p className="text-gray-600">نقل المنتجات بين المخازن ونوافذ البيع</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* معلومات التحويل */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* المصدر */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">المصدر</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المصدر *
                  </label>
                  <select
                    value={formData.fromType}
                    onChange={(e) => setFormData({...formData, fromType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="store">مخزن</option>
                    <option value="sellingWindow">نافذة بيع</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.fromType === 'store' ? 'المخزن' : 'نافذة البيع'} *
                  </label>
                  <select
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر...</option>
                    {(formData.fromType === 'store' ? stores : sellingWindows).map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* الوجهة */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">الوجهة</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الوجهة *
                  </label>
                  <select
                    value={formData.toType}
                    onChange={(e) => setFormData({...formData, toType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="store">مخزن</option>
                    <option value="sellingWindow">نافذة بيع</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.toType === 'store' ? 'المخزن' : 'نافذة البيع'} *
                  </label>
                  <select
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر...</option>
                    {(formData.toType === 'store' ? stores : sellingWindows).map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* المنتجات */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">المنتجات</h3>
                <button
                  type="button"
                  onClick={addProductItem}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Plus size={16} />
                  <span>إضافة منتج</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المنتج *
                      </label>
                      <select
                        value={item.product}
                        onChange={(e) => updateProductItem(index, 'product', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر المنتج</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الكمية *
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateProductItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductItem(index)}
                          className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ملاحظات */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="أضف أي ملاحظات حول التحويل..."
              />
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={18} />
              <span>حفظ التحويل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;
