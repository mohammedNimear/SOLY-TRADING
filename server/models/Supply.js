// models/Supply.js
import mongoose from 'mongoose';

const SupplySchema = new mongoose.Schema({
    supplyNumber: {
        type: String,
        // إزالة unique: true و required: true مؤقتاً
        // unique: true,
        // required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    supplierName: {
        type: String,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitCost: {
            type: Number,
            required: true,
            min: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    notes: String,
    status: {
        type: String,
        enum: ['معلق', 'مقبول', 'مرفوض', 'مكتمل'],
        default: 'معلق'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    approvedDate: Date,
    receivedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// إنشاء رقم توريد تلقائي
SupplySchema.pre('save', async function(next) {
    if (!this.supplyNumber) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999))
            }
        });
        this.supplyNumber = `SUP-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    
    // حساب الإجماليات تلقائياً
    if (this.items && this.items.length > 0) {
        this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
        this.totalAmount = this.subtotal - this.discount + this.tax;
    }
    
    next();
});


// تحديث المخزون بعد قبول التوريد
SupplySchema.post('save', async function(doc) {
    try {
        // فقط عند قبول أو إكمال التوريد
        if (doc.status === 'مقبول' || doc.status === 'مكتمل') {
            const Store = mongoose.model('Store');
            const store = await Store.findById(doc.store);
            if (store) {
                for (let item of doc.items) {
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
    } catch (error) {
        console.error('خطأ في تحديث المخزن:', error);
    }
});

export default mongoose.model('Supply', SupplySchema);
