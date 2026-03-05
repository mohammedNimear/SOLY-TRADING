import SellingWindow from '../models/SellingWindow.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// إنشاء نافذة بيع جديدة
export const createSellingWindow = async (req, res, next) => {
    try {
        const { name, desc, location, manager } = req.body;

        const window = await SellingWindow.create({
            name,
            desc,
            location,
            manager
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء نافذة البيع بنجاح',
            window
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع نوافذ البيع
export const getAllSellingWindows = async (req, res, next) => {
    try {
        const windows = await SellingWindow.find({ isActive: true })
            .populate('employees.employee', 'name position')
            .populate('manager', 'name')
            .populate('products.product', 'name price sku');

        res.status(200).json({
            success: true,
            count: windows.length,
            windows
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على نافذة بيع بواسطة ID
export const getSellingWindowById = async (req, res, next) => {
    try {
        const window = await SellingWindow.findById(req.params.id)
            .populate('employees.employee', 'name position')
            .populate('manager', 'name')
            .populate('products.product', 'name price sku');
        
        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        res.status(200).json({
            success: true,
            window
        });
    } catch (error) {
        next(error);
    }
};

// تحديث نافذة البيع
export const updateSellingWindow = async (req, res, next) => {
    try {
        const { name, desc, location, manager, isActive } = req.body;
        
        const window = await SellingWindow.findByIdAndUpdate(
            req.params.id,
            { name, desc, location, manager, isActive },
            { new: true, runValidators: true }
        ).populate('manager', 'name');

        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث نافذة البيع بنجاح',
            window
        });
    } catch (error) {
        next(error);
    }
};

// حذف نافذة البيع
export const deleteSellingWindow = async (req, res, next) => {
    try {
        const window = await SellingWindow.findById(req.params.id);
        
        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        window.isActive = false;
        await window.save();

        res.status(200).json({
            success: true,
            message: 'تم تعطيل نافذة البيع بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// إضافة منتج إلى النافذة
export const addProductToWindow = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        
        const window = await SellingWindow.findById(req.params.id);
        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(createError(404, 'المنتج غير موجود'));
        }

        const productIndex = window.products.findIndex(p => p.product.toString() === productId);
        
        if (productIndex > -1) {
            window.products[productIndex].quantity += quantity;
        } else {
            window.products.push({
                product: productId,
                quantity
            });
        }

        await window.save();

        res.status(200).json({
            success: true,
            message: 'تم إضافة المنتج إلى النافذة بنجاح',
            window
        });
    } catch (error) {
        next(error);
    }
};

// إزالة منتج من النافذة
export const removeProductFromWindow = async (req, res, next) => {
    try {
        const window = await SellingWindow.findById(req.params.windowId);
        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        window.products = window.products.filter(
            p => p.product.toString() !== req.params.productId
        );

        await window.save();

        res.status(200).json({
            success: true,
            message: 'تم إزالة المنتج من النافذة بنجاح',
            window
        });
    } catch (error) {
        next(error);
    }
};

// تحويل منتجات من المخزن إلى النافذة
export const transferToWindow = async (req, res, next) => {
    try {
        const { storeId, windowId, productId, quantity } = req.body;

        const store = await Store.findById(storeId);
        const window = await SellingWindow.findById(windowId);

        if (!store || !window) {
            return next(createError(404, 'المخزن أو النافذة غير موجودة'));
        }

        // التحقق من توفر الكمية في المخزن
        const storeProductIndex = store.products.findIndex(
            p => p.product.toString() === productId
        );

        if (storeProductIndex === -1 || store.products[storeProductIndex].quantity < quantity) {
            return next(createError(400, 'الكمية غير متوفرة في المخزن'));
        }

        // خصم الكمية من المخزن
        store.products[storeProductIndex].quantity -= quantity;

        // إضافة الكمية إلى النافذة
        const windowProductIndex = window.products.findIndex(
            p => p.product.toString() === productId
        );

        if (windowProductIndex > -1) {
            window.products[windowProductIndex].quantity += quantity;
        } else {
            window.products.push({
                product: productId,
                quantity
            });
        }

        await Promise.all([store.save(), window.save()]);

        res.status(200).json({
            success: true,
            message: 'تم التحويل إلى النافذة بنجاح'
        });
    } catch (error) {
        next(error);
    }
};
// إضافة مجموعة منتجات إلى النافذة
export const addBulkProductsToWindow = async (req, res, next) => {
    try {
        const { products } = req.body; // array of {product, quantity}
        
        const window = await SellingWindow.findById(req.params.id);
        if (!window) {
            return next(createError(404, 'نافذة البيع غير موجودة'));
        }

        // التحقق من المنتجات وإضافتها
        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(createError(404, `المنتج ${item.product} غير موجود`));
            }

            const productIndex = window.products.findIndex(p => p.product.toString() === item.product);
            
            if (productIndex > -1) {
                window.products[productIndex].quantity += item.quantity;
            } else {
                window.products.push({
                    product: item.product,
                    quantity: item.quantity
                });
            }
        }

        await window.save();

        res.status(200).json({
            success: true,
            message: 'تم إضافة المنتجات إلى النافذة بنجاح',
            window
        });
    } catch (error) {
        next(error);
    }
};
