// src/pages/products/ProductCategories.jsx (إضافة إلى Products.jsx)
import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Save, X } from 'lucide-react';

const ProductCategories = ({ categories, onCategoriesUpdate }) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      onCategoriesUpdate(updatedCategories);
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const updateCategory = (oldName, newName) => {
    if (newName.trim() && newName !== oldName) {
      const updatedCategories = categories.map(cat => 
        cat === oldName ? newName.trim() : cat
      );
      onCategoriesUpdate(updatedCategories);
    }
    setEditingCategory(null);
    setEditValue('');
  };

  const deleteCategory = (categoryName) => {
    if (window.confirm(`هل أنت متأكد من حذف الفئة "${categoryName}"؟`)) {
      const updatedCategories = categories.filter(cat => cat !== categoryName);
      onCategoriesUpdate(updatedCategories);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">تصنيفات المنتجات</h3>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Plus size={16} className="ml-1" />
          فئة جديدة
        </button>
      </div>

      {showAddCategory && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اسم الفئة الجديدة"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save size={16} className="ml-1" />
              حفظ
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategory('');
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            {editingCategory === category ? (
              <div className="flex-1 flex items-center space-x-2 space-x-reverse">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && updateCategory(category, editValue)}
                />
                <button
                  onClick={() => updateCategory(category, editValue)}
                  className="p-1 text-green-600 hover:text-green-800"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <Tag className="text-gray-400 ml-2" size={16} />
                  <span className="text-sm font-medium text-gray-900">{category}</span>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setEditValue(category);
                    }}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="mx-auto mb-2" size={32} />
          <p>لا توجد تصنيفات</p>
          <p className="text-sm mt-1">ابدأ بإضافة تصنيف جديد</p>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;
