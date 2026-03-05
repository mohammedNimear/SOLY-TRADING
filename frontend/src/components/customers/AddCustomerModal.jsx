
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';

// مخطط التحقق من صحة بيانات العميل
const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('اسم العميل مطلوب'),
  phone: Yup.string().required('رقم الهاتف مطلوب').matches(/^[0-9]+$/, 'رقم هاتف غير صالح'),
  email: Yup.string().email('البريد الإلكتروني غير صالح'),
  address: Yup.string(),
  taxNumber: Yup.string(),
});

const AddCustomerModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaTimes />
            </button>
          </div>

          <Formik
            initialValues={
              initialData || {
                name: '',
                phone: '',
                email: '',
                address: '',
                taxNumber: '',
              }
            }
            validationSchema={CustomerSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              onSubmit(values);
              resetForm();
              onClose();
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="p-6 space-y-4">
                {/* الاسم */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الاسم <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل اسم العميل"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل رقم الهاتف"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="example@domain.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* العنوان */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    العنوان
                  </label>
                  <Field
                    as="textarea"
                    name="address"
                    id="address"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل العنوان"
                  />
                </div>

                {/* الرقم الضريبي */}
                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الرقم الضريبي
                  </label>
                  <Field
                    type="text"
                    name="taxNumber"
                    id="taxNumber"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل الرقم الضريبي"
                  />
                </div>

                {/* أزرار */}
                <div className="flex justify-end space-x-4 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : isEditing ? 'تحديث' : 'حفظ'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
