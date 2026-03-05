import Supplier from '../models/Supplier.js';
import Supply from '../models/Supply.js';
import { createError } from '../utils/error.js';

// إنشاء مورد جديد
export const createSupplier = async (req, res, next) => {
    try {
        const { name, contactPerson, phone, email, address, company, taxNumber, bankAccount, creditLimit, notes } = req.body;

        const supplier = await Supplier.create({
            name,
            contactPerson,
            phone,
            email,
            address,
            company,
            taxNumber,
            bankAccount,
            creditLimit,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المورد بنجاح',
            supplier
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع الموردين
export const getAllSuppliers = async (req, res, next) => {
    try {
        const suppliers = await Supplier.find({ isActive: true });

        res.status(200).json({
            success: true,
            count: suppliers.length,
            suppliers
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على مورد بواسطة ID
export const getSupplierById = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        
        if (!supplier) {
            return next(createError(404, 'المورد غير موجود'));
        }

        res.status(200).json({
            success: true,
            supplier
        });
    } catch (error) {
        next(error);
    }
};

// تحديث المورد
export const updateSupplier = async (req, res, next) => {
    try {
        const { name, contactPerson, phone, email, address, company, taxNumber, bankAccount, creditLimit, isActive, notes } = req.body;
        
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, contactPerson, phone, email, address, company, taxNumber, bankAccount, creditLimit, isActive, notes },
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return next(createError(404, 'المورد غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث المورد بنجاح',
            supplier
        });
    } catch (error) {
        next(error);
    }
};

// حذف المورد
export const deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        
        if (!supplier) {
            return next(createError(404, 'المورد غير موجود'));
        }

        supplier.isActive = false;
        await supplier.save();

        res.status(200).json({
            success: true,
            message: 'تم تعطيل المورد بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على رصيد المورد
export const getSupplierBalance = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return next(createError(404, 'المورد غير موجود'));
        }

        // حساب إجمالي المشتريات من التوريدات
        const supplies = await Supply.find({ 
            supplier: req.params.id, 
            status: { $in: ['مقبول', 'مكتمل'] } 
        });

        const totalPurchases = supplies.reduce((sum, supply) => sum + supply.totalAmount, 0);
        
        res.status(200).json({
            success: true,
            balance: {
                creditLimit: supplier.creditLimit,
                totalPurchases: totalPurchases,
                remainingCredit: supplier.creditLimit - totalPurchases,
                isActive: supplier.isActive
            }
        });
    } catch (error) {
        next(error);
    }
};
