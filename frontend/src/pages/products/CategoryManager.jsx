import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

const CategoryManager = ({ onClose, onCategoriesUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // تحميل الفئات عند فتح المدير
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoryList = await productService.getCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('فشل في تحميل الفئات');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('يرجى إدخال اسم الفئة');
      return;
    }

    try {
      setLoading(true);
      const result = await productService.createCategory(newCategory.trim());
      if (result.success) {
        setNewCategory('');
        await loadCategories();
        toast.success('تمت إضافة الفئة بنجاح');
        // تحديث القائمة في النموذج الرئيسي
        if (onCategoriesUpdated) {
          const updatedCategories = await productService.getCategories();
          onCategoriesUpdated(updatedCategories);
        }
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.message || 'فشل في إضافة الفئة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفئة "${categoryName}"؟`)) {
      return;
    }

    try {
      setLoading(true);
      const result = await productService.deleteCategory(categoryId);
      if (result.success) {
        await loadCategories();
        toast.success('تم حذف الفئة بنجاح');
        // تحديث القائمة في النموذج الرئيسي
        if (onCategoriesUpdated) {
          const updatedCategories = await productService.getCategories();
          onCategoriesUpdated(updatedCategories);
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'فشل في حذف الفئة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">إدارة الفئات</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* إضافة فئة جديدة */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم الفئة الجديدة"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              disabled={loading || !newCategory.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* قائمة الفئات */}
          <div className="border rounded-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                لا توجد فئات
              </div>
            ) : (
              <ul className="divide-y">
                {categories.map((category) => (
                  <li 
                    key={category._id || category.id || category} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <span className="text-gray-900">
                      {typeof category === 'string' ? category : category.name}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(
                        category._id || category.id, 
                        typeof category === 'string' ? category : category.name
                      )}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            إجمالي الفئات: {categories.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
