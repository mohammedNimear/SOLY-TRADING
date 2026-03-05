// utils/inventoryUtils.js
import Store from '../models/Store.js';
import SellingWindow from '../models/SellingWindow.js';

export const updateInventory = async (transfer) => {
    try {
        // تحديث المخزن/النافذة المصدر
        if (transfer.fromType === 'store') {
            const store = await Store.findById(transfer.from);
            transfer.items.forEach(item => {
                const productIndex = store.products.findIndex(p => 
                    p.product.toString() === item.product.toString()
                );
                if (productIndex > -1) {
                    store.products[productIndex].quantity -= item.quantity;
                }
            });
            await store.save();
        } else {
            const window = await SellingWindow.findById(transfer.from);
            transfer.items.forEach(item => {
                const productIndex = window.products.findIndex(p => 
                    p.product.toString() === item.product.toString()
                );
                if (productIndex > -1) {
                    window.products[productIndex].quantity -= item.quantity;
                }
            });
            await window.save();
        }

        // تحديث المخزن/النافذة الوجهة
        if (transfer.toType === 'store') {
            const store = await Store.findById(transfer.to);
            for (let item of transfer.items) {
                const productIndex = store.products.findIndex(p => 
                    p.product.toString() === item.product.toString()
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
        } else {
            const window = await SellingWindow.findById(transfer.to);
            for (let item of transfer.items) {
                const productIndex = window.products.findIndex(p => 
                    p.product.toString() === item.product.toString()
                );
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
        }

        return true;
    } catch (error) {
        throw new Error(`Error updating inventory: ${error.message}`);
    }
};
