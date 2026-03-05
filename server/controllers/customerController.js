import Customer from '../models/Customer.js';
import Invoice from '../models/Invoice.js';
import { createError } from '../utils/error.js';

// إنشاء عميل جديد
export const createCustomer = async (req, res, next) => {
    try {
        const { name, type, contactPerson, phone, email, address, company, taxNumber, creditLimit } = req.body;

        const customer = await Customer.create({
            name,
            type,
            contactPerson,
            phone,
            email,
            address,
            company,
            taxNumber,
            creditLimit
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء العميل بنجاح',
            customer
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع العملاء
export const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find({ isActive: true });

        res.status(200).json({
            success: true,
            count: customers.length,
            customers
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على عميل بواسطة ID
export const getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        
        if (!customer) {
            return next(createError(404, 'العميل غير موجود'));
        }

        res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        next(error);
    }
};

// تحديث العميل
export const updateCustomer = async (req, res, next) => {
    try {
        const { name, type, contactPerson, phone, email, address, company, taxNumber, creditLimit, isActive } = req.body;
        
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, type, contactPerson, phone, email, address, company, taxNumber, creditLimit, isActive },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return next(createError(404, 'العميل غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث العميل بنجاح',
            customer
        });
    } catch (error) {
        next(error);
    }
};

// حذف العميل
export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        
        if (!customer) {
            return next(createError(404, 'العميل غير موجود'));
        }

        customer.isActive = false;
        await customer.save();

        res.status(200).json({
            success: true,
            message: 'تم تعطيل العميل بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على رصيد العميل
export const getCustomerBalance = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return next(createError(404, 'العميل غير موجود'));
        }

        // حساب إجمالي الفواتير
        const invoices = await Invoice.find({ 
            customer: req.params.id, 
            status: { $ne: 'مرفوضة' } 
        });

        const totalInvoices = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
        const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
        const balance = totalInvoices - totalPaid;
        
        res.status(200).json({
            success: true,
            balance: {
                creditLimit: customer.creditLimit,
                totalInvoices: totalInvoices,
                totalPaid: totalPaid,
                outstandingBalance: balance,
                isActive: customer.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على فواتير العميل
export const getCustomerInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find({ customer: req.params.id })
            .populate('createdBy', 'name')
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
