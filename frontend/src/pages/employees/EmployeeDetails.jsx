// src/pages/employees/EmployeeDetails.jsx
import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, DollarSign, Calendar, Clock, FileText } from 'lucide-react';

const EmployeeDetails = ({ employee, onClose }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: '2024-01-15', status: 'حضور', hours: 8 },
    { date: '2024-01-14', status: 'حضور', hours: 8 },
    { date: '2024-01-13', status: 'غياب', hours: 0 },
    { date: '2024-01-12', status: 'حضور', hours: 8 },
    { date: '2024-01-11', status: 'حضور', hours: 8 }
  ]);
  
  const [salaryRecords, setSalaryRecords] = useState([
    { month: 'يناير 2024', basic: 3000, bonus: 500, deductions: 200, total: 3300 },
    { month: 'ديسمبر 2023', basic: 3000, bonus: 300, deductions: 150, total: 3150 },
    { month: 'نوفمبر 2023', basic: 3000, bonus: 400, deductions: 100, total: 3300 }
  ]);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق المبلغ
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  // الحصول على حالة الحضور
  const getAttendanceStatus = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'حضور' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 font-bold text-lg">
                {employee.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] space-y-6">
          {/* معلومات الموظف */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات الموظف</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Phone size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الهاتف:</span>
                <span className="ml-2 font-medium">{employee.phone || 'غير محدد'}</span>
              </div>
              
              {employee.email && (
                <div className="flex items-center">
                  <Mail size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">البريد:</span>
                  <span className="ml-2 font-medium">{employee.email}</span>
                </div>
              )}
              
              {employee.address && (
                <div className="flex items-center">
                  <MapPin size={16} className="ml-2 text-gray-400" />
                  <span className="text-gray-600">العنوان:</span>
                  <span className="ml-2 font-medium">{employee.address}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <DollarSign size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الراتب الشهري:</span>
                <span className="ml-2 font-medium">
                  {formatAmount(employee.salary)} ر.س
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">تاريخ التوظيف:</span>
                <span className="ml-2 font-medium">
                  {employee.hireDate ? formatDate(employee.hireDate) : 'غير محدد'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock size={16} className="ml-2 text-gray-400" />
                <span className="text-gray-600">الحالة:</span>
                <span className={`ml-2 font-medium ${employee.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {employee.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">28</div>
              <div className="text-sm text-gray-600">أيام حضور</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">3,300</div>
              <div className="text-sm text-gray-600">آخر راتب (ر.س)</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">معدل الحضور</div>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">120</div>
              <div className="text-sm text-gray-600">ساعة عمل</div>
            </div>
          </div>

          {/* سجل الحضور */}
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">سجل الحضور (آخر 30 يوم)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الساعات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getAttendanceStatus(record.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {record.hours} ساعة
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* سجل الرواتب */}
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">سجل الرواتب</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الشهر
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الراتب الأساسي
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المكافآت
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخصومات
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجمالي
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaryRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.month}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatAmount(record.basic)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                        +{formatAmount(record.bonus)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
                        -{formatAmount(record.deductions)} ر.س
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatAmount(record.total)} ر.س
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* الملاحظات */}
          {employee.notes && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">الملاحظات</h3>
              <p className="text-gray-700">{employee.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
