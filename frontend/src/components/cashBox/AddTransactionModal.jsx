
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransactionSchema = Yup.object().shape({
  type: Yup.string().oneOf(['income', 'expense']).required('نوع الحركة مطلوب'),
  amount: Yup.number().positive('المبلغ يجب أن يكون أكبر من صفر').required('المبلغ مطلوب'),
  description: Yup.string().required('الوصف مطلوب'),
  date: Yup.date().required('التاريخ مطلوب'),
});

const AddTransactionModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إضافة حركة جديدة</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaTimes />
            </button>
          </div>

          <Formik
            initialValues={{
              type: 'income',
              amount: '',
              description: '',
              date: new Date(),
            }}
            validationSchema={TransactionSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              onSubmit(values);
              resetForm();
              onClose();
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="p-6 space-y-4">
                {/* نوع الحركة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع الحركة
                  </label>
                  <div className="flex space-x-4 space-x-reverse">
                    <label className="flex items-center">
                      <Field type="radio" name="type" value="income" className="ml-2" />
                      <span className="text-gray-700 dark:text-gray-300">قبض</span>
                    </label>
                    <label className="flex items-center">
                      <Field type="radio" name="type" value="expense" className="ml-2" />
                      <span className="text-gray-700 dark:text-gray-300">صرف</span>
                    </label>
                  </div>
                  <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* المبلغ */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    المبلغ
                  </label>
                  <Field
                    type="number"
                    name="amount"
                    id="amount"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل المبلغ"
                  />
                  <ErrorMessage name="amount" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* التاريخ */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    التاريخ
                  </label>
                  <DatePicker
                    selected={values.date}
                    onChange={(date) => setFieldValue('date', date)}
                    dateFormat="yyyy/MM/dd"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholderText="اختر التاريخ"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* الوصف */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الوصف
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="وصف الحركة"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
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
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
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

export default AddTransactionModal;
