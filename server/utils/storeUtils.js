// utils/storeUtils.js
import Store from '../models/Store.js';

// إضافة كمية من منتج إلى مخزن
export const addProductToStore = async (storeId, productId, quantity) => {
    try {
        const store = await Store.findById(storeId);
        const productIndex = store.products.findIndex(p => 
            p.product.toString() === productId.toString()
        );
        
        if (productIndex > -1) {
            // تحديث الكمية الموجودة
            store.products[productIndex].quantity += quantity;
        } else {
            // إضافة منتج جديد
            store.products.push({
                product: productId,
                quantity: quantity
            });
        }
        
        await store.save();
        return store;
    } catch (error) {
        throw new Error(`Error adding product to store: ${error.message}`);
    }
};

// خصم كمية من منتج من مخزن
export const removeProductFromStore = async (storeId, productId, quantity) => {
    try {
        const store = await Store.findById(storeId);
        const productIndex = store.products.findIndex(p => 
            p.product.toString() === productId.toString()
        );
        
        if (productIndex > -1) {
            if (store.products[productIndex].quantity >= quantity) {
                store.products[productIndex].quantity -= quantity;
                // إزالة المنتج إذا أصبحت الكمية صفر
                if (store.products[productIndex].quantity === 0) {
                    store.products.splice(productIndex, 1);
                }
                await store.save();
                return store;
            } else {
                throw new Error('الكمية المطلوبة أكبر من الكمية المتاحة');
            }
        } else {
            throw new Error('المنتج غير موجود في المخزن');
        }
    } catch (error) {
        throw new Error(`Error removing product from store: ${error.message}`);
    }
};

// الحصول على جرد المخزن
export const getStoreInventory = async (storeId) => {
    try {
        const store = await Store.findById(storeId)
            .populate('products.product', 'name sku category price cost')
            .populate('manager', 'name');
        
        return store;
    } catch (error) {
        throw new Error(`Error getting store inventory: ${error.message}`);
    }
};

// التحقق من المنتجات الحرجة
export const getCriticalProducts = async (storeId, threshold = 10) => {
    try {
        const store = await Store.findById(storeId)
            .populate('products.product', 'name sku');
        
        const criticalProducts = store.products.filter(p => p.quantity <= threshold);
        return criticalProducts;
    } catch (error) {
        throw new Error(`Error getting critical products: ${error.message}`);
    }
};
