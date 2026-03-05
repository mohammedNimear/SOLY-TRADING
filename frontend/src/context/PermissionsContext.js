
// src/context/PermissionsContext.jsx
import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

// تعريف الصلاحيات الممكنة (يمكن توسيعها)
export const ACTIONS = {
  VIEW_SALES: 'view_sales',
  ADD_SALE: 'add_sale',
  EDIT_SALE: 'edit_sale',
  DELETE_SALE: 'delete_sale',
  VIEW_SUPPLIES: 'view_supplies',
  ADD_SUPPLY: 'add_supply',
  EDIT_SUPPLY: 'edit_supply',
  DELETE_SUPPLY: 'delete_supply',
  VIEW_PRODUCTS: 'view_products',
  EDIT_PRODUCT_PRICE: 'edit_product_price',
  VIEW_STORES: 'view_stores',
  MANAGE_STORES: 'manage_stores',
  VIEW_CASHBOX: 'view_cashbox',
  MANAGE_CASHBOX: 'manage_cashbox', // إيداع/سحب يدوي
  VIEW_REPORTS: 'view_reports',
  MANAGE_USERS: 'manage_users',
};

// تعريف الأدوار والصلاحيات المرتبطة بها
const ROLE_PERMISSIONS = {
  admin: Object.values(ACTIONS), // كل الصلاحيات
  user: [
    ACTIONS.VIEW_SALES,
    ACTIONS.ADD_SALE, // يمكنه إضافة مبيعات
    // ACTIONS.EDIT_SALE, // لا يمكنه تعديل المبيعات القديمة (اختياري)
    // ACTIONS.DELETE_SALE, // لا يمكنه الحذف
    ACTIONS.VIEW_SUPPLIES,
    ACTIONS.ADD_SUPPLY, // يمكنه إضافة توريد
    ACTIONS.VIEW_PRODUCTS,
    ACTIONS.VIEW_STORES,
    ACTIONS.VIEW_CASHBOX,
    // لا يمكنه إدارة الخزنة يدوياً (إيداع/سحب)
  ],
  // يمكن إضافة أدوار أخرى مثل 'manager', 'accountant'...
};

export const PermissionsContext = createContext();

export const  usePermissions = () => {
  const context = useContext(PermissionsContext);
    if(!context){
      throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
  }

export const PermissionsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  

  // دالة للتحقق من صلاحية محددة
  const hasPermission = (action) => {
    if (!user) return false;
    // المدير (isAdmin أو role = admin) لديه كل الصلاحيات
    if (user.isAdmin || user.role === 'admin') return true;
    // للمستخدمين العاديين، نتحقق من قائمة صلاحيات الدور
    const role = user.role || 'user'; // افتراضي
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(action);
  };

  // دالة للتحقق من صلاحية الوصول لصفحة كاملة (مثلاً في حماية المسارات)
  const canAccess = (requiredActions) => {
    if (typeof requiredActions === 'string') {
      return hasPermission(requiredActions);
    }
    if (Array.isArray(requiredActions)) {
      return requiredActions.some(action => hasPermission(action));
    }
    return false;
  };

  const value = {
    hasPermission,
    canAccess,
    isAdmin: user?.isAdmin || user?.role === 'admin',
    role: user?.role || 'guest',
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

const Unauthorized = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-red-600">غير مصرح</h1>
      <p className="mt-4">ليس لديك صلاحية الوصول إلى هذه الصفحة.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        العودة للرئيسية
      </Link>
    </div>
  );
};

 export default Unauthorized;


// ب. إخفاء عمود الإجراءات (تعديل/حذف) لبعض المستخدمين

// ```jsx
// // داخل جدول المبيعات
// const { hasPermission } = useContext(PermissionsContext);
// const canEdit = hasPermission(ACTIONS.EDIT_SALE);
// const canDelete = hasPermission(ACTIONS.DELETE_SALE);

// // في عمود الإجراءات
// <td>
//   {canEdit && <button onClick={() => editSale(sale.id)}>تعديل</button>}
//   {canDelete && <button onClick={() => deleteSale(sale.id)}>حذف</button>}
// </td>
// ```

// ج. حماية صفحة كاملة باستخدام مكون ProtectedRoute

// يمكنك إنشاء مكون ProtectedRoute يتحقق من الصلاحية قبل عرض الصفحة.

// ```jsx
// // src/components/ProtectedRoute.jsx
// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { PermissionsContext } from '../context/PermissionsContext';
// const ProtectedRoute = ({ children, requiredActions }) => {
//   const { canAccess } = useContext(PermissionsContext);
//   if (!canAccess(requiredActions)) {
//     return <Navigate to="/unauthorized" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;
// ```

// ثم استخدمه في App.jsx:

// ```jsx
// <Route
//   path="/cash-box"
//   element={
//     <ProtectedRoute requiredActions={ACTIONS.VIEW_CASHBOX}>
//       <CashBox />
//     </ProtectedRoute>
//   }
// />
// <Route
//   path="/new-sale"
//   element={
//     <ProtectedRoute requiredActions={ACTIONS.ADD_SALE}>
//       <NewSale />
//     </ProtectedRoute>
//   }
// />
// ```

// ---



// src/pages/Unauthorized.jsx


