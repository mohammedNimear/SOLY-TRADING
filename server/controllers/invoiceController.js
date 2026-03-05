import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { createError } from '../utils/error.js';

// إنشاء فاتورة جديدة
export const createInvoice = async (req, res, next) => {
    try {
        console.log('Request body:', req.body); // للتصحيح

        const { customer, customerName, paymentMethod, items, store, note } = req.body;

        // التحقق من وجود البيانات المطلوبة
        if (!store) {
            return next(createError(400, 'المخزن مطلوب'));
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return next(createError(400, 'العناصر مطلوبة'));
        }

        // باقي الكود كما هو...

    } catch (error) {
        console.error('Backend error:', error); // للتصحيح
        next(error);
    }
};

// الحصول على جميع الفواتير
export const getAllInvoices = async (req, res, next) => {
    try {
        const { status, paymentMethod, customer, startDate, endDate } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        if (customer) filter.customer = customer;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(filter)
            .populate('customer', 'name')
            .populate('createdBy', 'name')
            .populate('store', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            invoices
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على الفواتير المعلقة
export const getPendingInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find({ status: 'معلقة' })
            .populate('customer', 'name')
            .populate('createdBy', 'name')
            .populate('store', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            invoices
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على فاتورة بواسطة ID
export const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('customer', 'name creditLimit')
            .populate('createdBy', 'name')
            .populate('store', 'name')
            .populate('items.product');

        if (!invoice) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على فاتورة برقمها
export const getInvoiceByNumber = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber })
            .populate('customer', 'name creditLimit')
            .populate('createdBy', 'name')
            .populate('store', 'name')
            .populate('items.product');

        if (!invoice) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        next(error);
    }
};

// تحديث الفاتورة
export const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        // التحقق من أن المستخدم هو من أنشأ الفاتورة أو مدير
        if (invoice.createdBy.toString() !== req.user.id && !req.user.roles.includes('manager')) {
            return next(createError(403, 'غير مخول بتعديل هذه الفاتورة'));
        }
        const { paidAmount, status, note } = req.body;

        if (paidAmount !== undefined) {
            invoice.paidAmount = paidAmount;
            if (paidAmount >= invoice.total) {
                invoice.status = 'مدفوعة';
            } else if (paidAmount > 0) {
                invoice.status = 'معلقة';
            }
        }

        if (status) invoice.status = status;
        if (note) invoice.note = note;

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث الفاتورة بنجاح',
            invoice
        });
    } catch (error) {
        next(error);
    }
};

// حذف الفاتورة
export const deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        // لا يمكن حذف الفاتورة المدفوعة
        if (invoice.status === 'مدفوعة') {
            return next(createError(400, 'لا يمكن حذف الفاتورة المدفوعة'));
        }

        await invoice.remove();

        res.status(200).json({
            success: true,
            message: 'تم حذف الفاتورة بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على المبيعات اليومية
export const getDailySales = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const invoices = await Invoice.find({
            createdAt: { $gte: today },
            status: 'مدفوعة'
        });

        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

        res.status(200).json({
            success: true,
            date: today,
            totalInvoices: invoices.length,
            totalSales,
            totalPaid,
            invoices: invoices.map(inv => ({
                invoiceNumber: inv.invoiceNumber,
                total: inv.total,
                paidAmount: inv.paidAmount
            }))
        });
    } catch (error) {
        next(error);
    }
};
export const getMonthlySales = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        const startDate = new Date(year || new Date().getFullYear(), (month - 1) || new Date().getMonth(), 1);
        const endDate = new Date(year || new Date().getFullYear(), (month - 1) || new Date().getMonth() + 1, 0);

        const invoices = await Invoice.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'مدفوعة'
        });

        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalInvoices = invoices.length;

        res.status(200).json({
            success: true,
            period: { startDate, endDate },
            totalSales,
            totalInvoices,
            averagePerDay: totalSales / (endDate.getDate() - startDate.getDate() + 1)
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على الفواتير حسب العميل

export const cancelInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        // لا يمكن إلغاء الفاتورة المدفوعة أو الملغاة مسبقاً
        if (invoice.status === 'مدفوعة' || invoice.status === 'ملغاة') {
            return next(createError(400, 'لا يمكن إلغاء هذه الفاتورة'));
        }

        invoice.status = 'ملغاة';
        await invoice.save();

        // استرجاع الكمية إلى المخزن
        const storeDoc = await Store.findById(invoice.store);
        for (let item of invoice.items) {
            const productIndex = storeDoc.products.findIndex(
                p => p.product.toString() === item.product.toString()
            );
            if (productIndex > -1) {
                storeDoc.products[productIndex].quantity += item.quantity;
            }
        }
        await storeDoc.save();

        res.status(200).json({
            success: true,
            message: 'تم إلغاء الفاتورة واسترجاع الكمية إلى المخزن',
            invoice
        });
    } catch (error) {
        next(error);
    }
};

export const getInvoicesByCustomer = async (req, res, next) => {
    try {
        const customerId = req.params.customerId;
        const invoices = await Invoice.find({ customer: customerId })
            .populate('customer', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            customerId,
            invoices
        });
    } catch (error) {
        next(error);
    }
};