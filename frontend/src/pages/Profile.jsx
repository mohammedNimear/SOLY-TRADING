
// تعديل pages/Profile.jsx (أضف هذا الزر ضمن معلومات المستخدم)
import { Link } from 'react-router-dom';
import { Key } from 'lucide-react';

// داخل JSX بعد عرض معلومات المستخدم
<div className="mt-6">
  <Link
    to="/change-password"
    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
  >
    <Key className="w-5 h-5 ml-2" />
    تغيير كلمة المرور
  </Link>
</div>
