import React, { useState } from 'react';
import { X, Edit, TrendingUp } from 'lucide-react';

const EditProductPrice = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    price: product.price,
    cost: product.cost,
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating product price:', { productId: product.id, ...formData });
    // هنا سيتم إرسال البيانات إلى الـ API
    alert(`تم تحديث سعر المنتج "${product.name}" بنجاح!`);
    onClose();
  };

  const calculateProfit = () => {
    return formData.price - formData.cost;
  };

  const calculateProfitMargin = () => {
    if (formData.price === 0) return 0;
    return ((calculateProfit() / formData.price) * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Edit className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">تعديل سعر المنتج</h2>
              <p className="text-gray-600">تعديل سعر بيع وتكلفة المنتج</p>
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
          <div className="p-6 space-y-6">
            {/* معلومات المنتج */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">معلومات المنتج</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="ml-2 font-medium">{product.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-gray-600">الفئة:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">المورد:</span>
                  <span className="ml-2 font-medium">{product.supplier}</span>
                </div>
              </div>
            </div>

            {/* الأسعار الحالية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">السعر الحالي</h4>
                <div className="text-2xl font-bold text-blue-700">
                  {product.price} SDG
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  سعر البيع الحالي
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">التكلفة الحالية</h4>
                <div className="text-2xl font-bold text-green-700">
                  {product.cost} SDG
                </div>
                <div className="text-sm text-green-600 mt-1">
                  تكلفة الشراء
                </div>
              </div>
            </div>

            {/* إدخال الأسعار الجديدة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر البيع الجديد (SDG)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التكلفة الجديدة (SDG)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* حساب الربح */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="ml-2 text-green-600" size={20} />
                حساب الربح
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">الربح لكل وحدة</div>
                  <div className="text-lg font-bold text-green-600">
                    {calculateProfit()} SDG
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">نسبة الربح</div>
                  <div className="text-lg font-bold text-blue-600">
                    {calculateProfitMargin()}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">إجمالي الربح</div>
                  <div className="text-lg font-bold text-purple-600">
                    {(calculateProfit() * product.stock).toLocaleString()} SDG
                  </div>
                </div>
              </div>
            </div>

            {/* سبب التعديل */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سبب تعديل السعر (اختياري)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="اكتب سبب تعديل السعر..."
              />
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit size={16} className="ml-2" />
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPrice;
