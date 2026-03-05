import Supply from '../models/Supply.js';
import Store from '../models/Store.js';
import Supplier from '../models/Supplier.js';
import Product from '../models/Product.js';
import Employee from '../models/Employee.js';
import { createError } from '../utils/error.js';

// إنشاء توريد جديد
export const createSupply = async (req, res, next) => {
    try {
        const { supplier, store, items, discount = 0, tax = 0, notes } = req.body;
        
        // التحقق من المورد
        const supplierDoc = await Supplier.findById(supplier);
        if (!supplierDoc) {
            return next(createError(404, 'المورد غير موجود'));
        }

        // التحقق من المخزن
        const storeDoc = await Store.findById(store);
        if (!storeDoc) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        // التحقق من الموظف من التوكن
        let employee = null;
        if (req.user.employee) {
            employee = await Employee.findById(req.user.employee);
        }
        
        // إذا لم يكن هناك موظف مرتبط، استخدم معلومات المستخدم
        if (!employee) {
            // البحث عن الموظف المرتبط بالمستخدم
            employee = await Employee.findOne({ user: req.user.id });
            if (!employee) {
                return next(createError(404, 'الموظف غير موجود'));
            }
        }

        // حساب الإجماليات
        let subtotal = 0;
        const supplyItems = [];

        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(createError(404, `المنتج ${item.product} غير موجود`));
            }

            const totalPrice = item.quantity * item.unitCost;
            subtotal += totalPrice;

            supplyItems.push({
                product: item.product,
                productName: product.name,
                quantity: item.quantity,
                unitCost: item.unitCost,
                totalPrice
            });
        }

        const totalAmount = subtotal - discount + tax;

        // التحقق من حد الائتمان للمورد
        if (totalAmount > supplierDoc.creditLimit && supplierDoc.creditLimit > 0) {
            return next(createError(400, 'المبلغ يتجاوز حد الائتمان للمورد'));
        }

        const supply = await Supply.create({
            supplier,
            supplierName: supplierDoc.name,
            employee: employee._id, // استخدام ID الموظف
            employeeName: employee.name,
            store,
            storeName: storeDoc.name,
            items: supplyItems,
            subtotal,
            discount,
            tax,
            totalAmount,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء التوريد بنجاح',
            supply
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع التوريدات
export const getAllSupplies = async (req, res, next) => {
    try {
        const { status, supplier, store } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (supplier) filter.supplier = supplier;
        if (store) filter.store = store;

        const supplies = await Supply.find(filter)
            .populate('supplier', 'name')
            .populate('employee', 'name')
            .populate('store', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: supplies.length,
            supplies
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على التوريدات المعلقة
export const getPendingSupplies = async (req, res, next) => {
    try {
        const supplies = await Supply.find({ status: 'معلق' })
            .populate('supplier', 'name')
            .populate('employee', 'name')
            .populate('store', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: supplies.length,
            supplies
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على توريد بواسطة ID
export const getSupplyById = async (req, res, next) => {
    try {
        const supply = await Supply.findById(req.params.id)
            .populate('supplier', 'name')
            .populate('employee', 'name')
            .populate('store', 'name')
            .populate('items.product');
        
        if (!supply) {
            return next(createError(404, 'التوريد غير موجود'));
        }

        res.status(200).json({
            success: true,
            supply
        });
    } catch (error) {
        next(error);
    }
};

// تحديث التوريد
export const updateSupply = async (req, res, next) => {
    try {
        const supply = await Supply.findById(req.params.id);
        if (!supply) {
            return next(createError(404, 'التوريد غير موجود'));
        }

        // لا يمكن تعديل التوريد بعد الموافقة عليه
        if (supply.status !== 'معلق') {
            return next(createError(400, 'لا يمكن تعديل التوريد بعد الموافقة عليه'));
        }

        const { items, discount = 0, tax = 0, notes } = req.body;

        // تحديث العناصر وإعادة حساب الإجماليات
        let subtotal = 0;
        const supplyItems = [];

        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(createError(404, `المنتج ${item.product} غير موجود`));
            }

            const totalPrice = item.quantity * item.unitCost;
            subtotal += totalPrice;

            supplyItems.push({
                product: item.product,
                productName: product.name,
                quantity: item.quantity,
                unitCost: item.unitCost,
                totalPrice
            });
        }

        const totalAmount = subtotal - discount + tax;

        supply.items = supplyItems;
        supply.subtotal = subtotal;
        supply.discount = discount;
        supply.tax = tax;
        supply.totalAmount = totalAmount;
        supply.notes = notes;

        await supply.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث التوريد بنجاح',
            supply
        });
    } catch (error) {
        next(error);
    }
};

// حذف التوريد
export const deleteSupply = async (req, res, next) => {
    try {
        const supply = await Supply.findById(req.params.id);
        if (!supply) {
            return next(createError(404, 'التوريد غير موجود'));
        }

        // لا يمكن حذف التوريد بعد الموافقة عليه
        if (supply.status !== 'معلق') {
            return next(createError(400, 'لا يمكن حذف التوريد بعد الموافقة عليه'));
        }

        await supply.remove();

        res.status(200).json({
            success: true,
            message: 'تم حذف التوريد بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// الموافقة على التوريد
export const approveSupply = async (req, res, next) => {
    try {
        const { status, notes } = req.body; // status: 'مقبول' أو 'مرفوض'
        
        const supply = await Supply.findById(req.params.id);
        if (!supply) {
            return next(createError(404, 'التوريد غير موجود'));
        }

        if (supply.status !== 'معلق') {
            return next(createError(400, 'التوريد موثق بالفعل'));
        }

        supply.status = status;
        supply.approvedBy = req.user.employee;
        supply.approvedDate = Date.now();
        if (notes) supply.notes = notes;

        await supply.save();

        // إذا تم قبول التوريد، تحديث المخزون
        if (status === 'مقبول') {
            const store = await Store.findById(supply.store);
            if (store) {
                for (let item of supply.items) {
                    const productIndex = store.products.findIndex(
                        p => p.product.toString() === item.product.toString()
                    );
                    
                    if (productIndex > -1) {
                        store.products[productIndex].quantity += item.quantity;
                    } else {
                        store.products.push({
                            product: item.product,
                            quantity: item.quantity
                        });
                    }
                }
                await store.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `تم ${status === 'مقبول' ? 'قبول' : 'رفض'} التوريد بنجاح`,
            supply
        });
    } catch (error) {
        next(error);
    }
};
