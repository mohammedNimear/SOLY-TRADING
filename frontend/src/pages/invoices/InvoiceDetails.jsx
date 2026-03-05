// src/pages/invoices/InvoiceDetails.jsx (التحديث للبيانات الحقيقية)
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Download, Mail, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import invoiceService from '../../services/invoiceService';

const InvoiceDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // تحميل تفاصيل الفاتورة
    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        try {
            setLoading(true);
            const response = await invoiceService.getInvoiceById(id);
            setInvoice(response.invoice);
        } catch (err) {
            setError(err.message);
            toast.error('خطأ في تحميل الفاتورة: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // دالة لطباعة الفاتورة
    const handlePrint = () => {
        window.print();
    };

    // دالة لتصدير PDF
    const handleExportPDF = () => {
        toast.promise(
            // محاكاة عملية التصدير
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'جاري تصدير PDF...',
                success: 'تم تصدير الفاتورة كملف PDF',
                error: 'خطأ في تصدير الفاتورة'
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <Mail className="text-red-400" size={24} />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">خطأ في تحميل البيانات</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <button 
                            onClick={loadInvoice}
                            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                    <Mail className="text-yellow-400" size={24} />
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">الفاتورة غير موجودة</h3>
                        <p className="text-sm text-yellow-700 mt-1">لا توجد فاتورة برقم التعريف المطلوب</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} className="ml-2" />
                    العودة
                </button>
                <div className="flex space-x-2">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 print:hidden"
                    >
                        <Printer size={18} />
                        <span>طباعة</span>
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 print:hidden"
                    >
                        <Download size={18} />
                        <span>تصدير PDF</span>
                    </button>
                </div>
            </div>

            {/* Invoice Content - Printable Area */}
            <div className="bg-white rounded-lg shadow border p-6 printable-content">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">فاتورة #{invoice.invoiceNumber}</h1>
                        <p className="text-gray-600">تاريخ الإنشاء: {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div className="text-left">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            invoice.status === 'مدفوعة' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'معلقة' ? 'bg-yellow-100 text-yellow-800' :
                            invoice.status === 'متأخرة' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Company Info */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900">شركة إدارة المخازن</h2>
                        <p className="text-gray-600">الخرطوم - السوق المركزي</p>
                        <p className="text-gray-600">الهاتف: 0912345678</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">معلومات العميل</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">الاسم:</span> {invoice.customerName}</p>
                            {invoice.customer && (
                                <>
                                    <p><span className="text-gray-600">الهاتف:</span> {invoice.customer.phone || 'غير محدد'}</p>
                                    <p><span className="text-gray-600">البريد:</span> {invoice.customer.email || 'غير محدد'}</p>
                                    <p><span className="text-gray-600">العنوان:</span> {invoice.customer.address || 'غير محدد'}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">معلومات الدفع</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">طريقة الدفع:</span> {invoice.paymentMethod}</p>
                            {invoice.paymentMethod === 'أجل' && invoice.dueDate && (
                                <p><span className="text-gray-600">تاريخ الاستحقاق:</span> {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</p>
                            )}
                            <p><span className="text-gray-600">البائع:</span> {invoice.createdBy?.name || 'غير محدد'}</p>
                            <p><span className="text-gray-600">حالة الفاتورة:</span> {invoice.status}</p>
                            {invoice.store && (
                                <p><span className="text-gray-600">المخزن:</span> {invoice.store.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">المنتجات</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.product?.name || 'غير محدد'}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.unitPrice?.toFixed(2) || '0.00'}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{item.totalPrice?.toFixed(2) || '0.00'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md ml-auto">
                        <div className="flex justify-between">
                            <span className="text-gray-600">الإجمالي الفرعي:</span>
                            <span>{invoice.subtotal?.toFixed(2) || '0.00'} SDG</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الضريبة:</span>
                            <span>0.00 SDG</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t col-span-3">
                            <span>الإجمالي:</span>
                            <span>{invoice.total?.toFixed(2) || '0.00'} SDG</span>
                        </div>
                        {invoice.paymentMethod !== 'نقداً' && invoice.paidAmount > 0 && (
                            <div className="flex justify-between col-span-3">
                                <span className="text-gray-600">المدفوع:</span>
                                <span className="text-green-600">{invoice.paidAmount?.toFixed(2) || '0.00'} SDG</span>
                            </div>
                        )}
                        {invoice.total > invoice.paidAmount && (
                            <div className="flex justify-between font-semibold col-span-3">
                                <span>المتبقي:</span>
                                <span className={invoice.total > invoice.paidAmount ? 'text-red-600' : 'text-green-600'}>
                                    {(invoice.total - invoice.paidAmount)?.toFixed(2) || '0.00'} SDG
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-4 mt-6 text-center text-sm text-gray-500">
                    <p>شكراً لثقتكم في خدماتنا</p>
                    <p className="mt-1">هذه الفاتورة مُنشأة إلكترونياً ولا تحتاج إلى توقيع</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
