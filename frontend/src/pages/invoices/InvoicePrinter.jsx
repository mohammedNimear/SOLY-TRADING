// src/components/invoices/InvoicePrinter.jsx
import React from 'react';
import { Printer, Download, X } from 'lucide-react';

const InvoicePrinter = ({ invoice, onClose }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-SA').format(amount || 0);
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = () => {
    // هنا سيتم تنفيذ تحميل الفاتورة بصيغة PDF
    alert('جارٍ تجهيز تحميل الفاتورة...');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden print:w-full print:max-w-none">
        {/* Header - غير ظاهر في الطباعة */}
        <div className="flex items-center justify-between p-6 border-b print:hidden">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Printer className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">طباعة الفاتورة</h2>
              <p className="text-gray-600">فاتورة رقم: {invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={downloadInvoice}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="ml-2" />
              تحميل PDF
            </button>
            <button
              onClick={printInvoice}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer size={16} className="ml-2" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content - ظاهر في الطباعة */}
        <div className="p-8 print:p-0">
          <div className="max-w-2xl mx-auto bg-white print:bg-white">
            {/* Company Header */}
            <div className="text-center mb-8 print:mb-4">
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">فاتورة مبيعات</h1>
              <p className="text-gray-600 mt-2 print:text-sm">شركة الأمثلة التجارية</p>
              <p className="text-gray-600 print:text-sm">العنوان: الرياض، المملكة العربية السعودية</p>
              <p className="text-gray-600 print:text-sm">الهاتف: 0123456789</p>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 print:gap-4 print:mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 print:text-base">معلومات الفاتورة</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الفاتورة:</span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-medium">
                      {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">طريقة الدفع:</span>
                    <span className="font-medium">
                      {invoice.paymentMethod === 'cash' ? 'نقدي' : 
                       invoice.paymentMethod === 'card' ? 'بطاقة' : 
                       invoice.paymentMethod === 'credit' ? 'آجل' : 'تحويل بنكي'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 print:text-base">معلومات العميل</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{invoice.customerName}</span>
                  </div>
                  {invoice.customer?.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{invoice.customer.phone}</span>
                    </div>
                  )}
                  {invoice.customer?.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">العنوان:</span>
                      <span className="font-medium">{invoice.customer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 print:mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">المنتج</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">الكمية</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">السعر</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2 text-sm">{item.productName}</td>
                      <td className="py-3 px-2 text-sm text-center">{item.quantity}</td>
                      <td className="py-3 px-2 text-sm text-left">{formatAmount(item.price)} ر.س</td>
                      <td className="py-3 px-2 text-sm text-left">{formatAmount(item.total)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="w-64 ml-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">الإجمالي الفرعي:</span>
                  <span>{formatAmount(invoice.subtotal)} ر.س</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">الخصم:</span>
                    <span className="text-red-600">-{formatAmount(invoice.discount)} ر.س</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">الضريبة:</span>
                    <span className="text-blue-600">+{formatAmount(invoice.tax)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                  <span>الإجمالي:</span>
                  <span>{formatAmount(invoice.total)} ر.س</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 print:mt-8">
              <div className="border-t pt-4 text-sm text-gray-600">
                <p>شكراً لتعاملكم معنا</p>
                <p className="mt-1">نتمنى لكم يوماً سعيداً</p>
                <p className="mt-2 text-xs">فاتورة مطبوعة بواسطة نظام Soly ERP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrinter;
