// src/pages/settings/Permissions.jsx
import React, { useState } from 'react';
import { Shield, Users, Edit, Eye, Plus, Save, X } from 'lucide-react';

const Permissions = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'مدير النظام',
      permissions: {
        dashboard: 'full',
        products: 'full',
        sales: 'full',
        customers: 'full',
        employees: 'full',
        suppliers: 'full',
        reports: 'full',
        settings: 'full'
      }
    },
    {
      id: 2,
      name: 'مشرف المبيعات',
      permissions: {
        dashboard: 'view',
        products: 'view',
        sales: 'full',
        customers: 'full',
        employees: 'view',
        suppliers: 'view',
        reports: 'view',
        settings: 'none'
      }
    },
    {
      id: 3,
      name: 'كاشير',
      permissions: {
        dashboard: 'view',
        products: 'view',
        sales: 'create',
        customers: 'view',
        employees: 'none',
        suppliers: 'none',
        reports: 'none',
        settings: 'none'
      }
    }
  ]);

  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', permissions: {} });

  const permissionLevels = [
    { value: 'none', label: 'لا صلاحية' },
    { value: 'view', label: 'عرض فقط' },
    { value: 'create', label: 'إنشاء وعرض' },
    { value: 'full', label: 'تحكم كامل' }
  ];

  const modules = [
    { key: 'dashboard', name: 'لوحة التحكم' },
    { key: 'products', name: 'المنتجات' },
    { key: 'sales', name: 'المبيعات' },
    { key: 'customers', name: 'العملاء' },
    { key: 'employees', name: 'الموظفين' },
    { key: 'suppliers', name: 'الموردين' },
    { key: 'reports', name: 'التقارير' },
    { key: 'settings', name: 'الإعدادات' }
  ];

  const handlePermissionChange = (roleId, moduleKey, level) => {
    setRoles(roles.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [moduleKey]: level } }
        : role
    ));
  };

  const addRole = () => {
    if (newRole.name.trim()) {
      const role = {
        id: Date.now(),
        name: newRole.name,
        permissions: modules.reduce((acc, mod) => {
          acc[mod.key] = 'none';
          return acc;
        }, {})
      };
      setRoles([...roles, role]);
      setNewRole({ name: '', permissions: {} });
      setShowAddRole(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نظام الصلاحيات</h1>
          <p className="text-gray-600 mt-1">إدارة صلاحيات المستخدمين والموظفين</p>
        </div>
        
        <button
          onClick={() => setShowAddRole(true)}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="ml-2" />
          دور جديد
        </button>
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">إضافة دور جديد</h3>
              <button
                onClick={() => setShowAddRole(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الدور
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: مدير المبيعات"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddRole(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={addRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save size={16} className="ml-2" />
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                <Shield className="text-blue-500" size={20} />
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {modules.map((module) => (
                <div key={module.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{module.name}</span>
                  <select
                    value={role.permissions[module.key] || 'none'}
                    onChange={(e) => handlePermissionChange(role.id, module.key, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {permissionLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                حفظ التغييرات
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Legend */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">دليل الصلاحيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-700">لا صلاحية - لا يمكن الوصول للقسم</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-700">عرض فقط - يمكن مشاهدة البيانات فقط</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-700">إنشاء وعرض - يمكن إنشاء ومشاهدة البيانات</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-700">تحكم كامل - جميع الصلاحيات متوفرة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
