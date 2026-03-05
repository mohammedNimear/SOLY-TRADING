import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// إنشاء مخزن جديد
export const createStore = async (req, res, next) => {
    try {
        const { name, desc, location } = req.body;

        const store = await Store.create({
            name,
            desc,
            location
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء المخزن بنجاح',
            store
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع المخازن
export const getAllStores = async (req, res, next) => {
    try {
        const stores = await Store.find().populate('employees.employee', 'name position')
                                    .populate('manager', 'name')
                                    .populate('products.product', 'name price sku');

        res.status(200).json({
            success: true,
            count: stores.length,
            stores
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على مخزن بواسطة ID
export const getStoreById = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id)
            .populate('employees.employee', 'name position')
            .populate('manager', 'name')
            .populate('products.product', 'name price sku');
        
        if (!store) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        res.status(200).json({
            success: true,
            store
        });
    } catch (error) {
        next(error);
    }
};

// تحديث المخزن
export const updateStore = async (req, res, next) => {
   try {
        const { name, desc, location, manager } = req.body;
        
        // استخدام findByIdAndUpdate مع new: true للحصول على المستند المحدث
        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { name, desc, location, manager },
            { new: true, runValidators: true }
        ).populate('manager', 'name');

        if (!store) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث المخزن بنجاح',
            store
        });
    } catch (error) {
        next(error);
    }
};

// حذف المخزن
export const deleteStore = async (req, res, next) => {
    try {
        // استخدام findByIdAndDelete بدلاً من remove
        const store = await Store.findByIdAndDelete(req.params.id);
        
        if (!store) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم حذف المخزن بنجاح'
        });
    } catch (error) {
        next(error);
    }
};


// إضافة منتج إلى المخزن
export const addProductToStore = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        
        const store = await Store.findById(req.params.id);
        if (!store) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(createError(404, 'المنتج غير موجود'));
        }

        const productIndex = store.products.findIndex(p => p.product.toString() === productId);
        
        if (productIndex > -1) {
            store.products[productIndex].quantity += quantity;
        } else {
            store.products.push({
                product: productId,
                quantity
            });
        }

        await store.save();

        res.status(200).json({
            success: true,
            message: 'تم إضافة المنتج إلى المخزن بنجاح',
            store
        });
    } catch (error) {
        next(error);
    }
};

// إزالة منتج من المخزن
export const removeProductFromStore = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.storeId);
        if (!store) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        store.products = store.products.filter(
            p => p.product.toString() !== req.params.productId
        );

        await store.save();

        res.status(200).json({
            success: true,
            message: 'تم إزالة المنتج من المخزن بنجاح',
            store
        });
    } catch (error) {
        next(error);
    }
};

// تحويل بين المخازن
export const transferBetweenStores = async (req, res, next) => {
    try {
        const { fromStoreId, toStoreId, productId, quantity } = req.body;

        const fromStore = await Store.findById(fromStoreId);
        const toStore = await Store.findById(toStoreId);

        if (!fromStore || !toStore) {
            return next(createError(404, 'أحد المخازن غير موجود'));
        }

        // التحقق من توفر الكمية في المخزن المصدر
        const fromProductIndex = fromStore.products.findIndex(
            p => p.product.toString() === productId
        );

        if (fromProductIndex === -1 || fromStore.products[fromProductIndex].quantity < quantity) {
            return next(createError(400, 'الكمية غير متوفرة في المخزن المصدر'));
        }

        // خصم الكمية من المخزن المصدر
        fromStore.products[fromProductIndex].quantity -= quantity;

        // إضافة الكمية إلى المخزن المستلم
        const toProductIndex = toStore.products.findIndex(
            p => p.product.toString() === productId
        );

        if (toProductIndex > -1) {
            toStore.products[toProductIndex].quantity += quantity;
        } else {
            toStore.products.push({
                product: productId,
                quantity
            });
        }

        await Promise.all([fromStore.save(), toStore.save()]);

        res.status(200).json({
            success: true,
            message: 'تم التحويل بين المخازن بنجاح'
        });
    } catch (error) {
        next(error);
    }
};
