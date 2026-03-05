
import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
    items: [
        {
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
            unitPrice: {
                type: Number,
                required: true,
                min: 0
            },
            total: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['نقدي', 'أجل','تصريف'],
        required: true
    },
    payed: {
        type: Number,
        default: 0,
        min: 0
    },
    rest_money: {
        type: Number,
        default: 0
    },
    paymentDate: {
        type: Date,
        required: function() {
            return this.paymentMethod === 'أجل';
        }
    },
    status: {
        type: String,
        enum: ['ممتازة', 'متكررة', 'معلقة'],
        default: 'معلقة'
    },
    note: String,
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    
}, {
    timestamps: true
});

// Middleware: بعد حفظ الفاتورة، نقوم بتحديث كميات المخزن
SaleSchema.post('save', async function(doc) {
    try {
        const Store = mongoose.model('Store');
        const store = await Store.findById(doc.store);
        if (!store) return;

        for (const item of doc.items) {
            const idx = store.items.findIndex(p => p.product.toString() === item.product.toString());
            if (idx > -1) {
                store.items[idx].quantity -= item.quantity;
            }
        }
        await store.save();
    } catch (error) {
        console.error('خطأ في تحديث المخزن بعد عملية البيع:', error);
    }
});

export default mongoose.model('Sale', SaleSchema);
