// models/Invoice.js
import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    customerName: String, // للفواتير النقدية
    type: {
        type: String,
        enum: ['بيع', 'مرتجع'],
        default: 'بيع'
    },
    paymentMethod: {
        type: String,
        enum: ['نقداً', 'أجل', 'تصريف'],
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            unitPrice: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            }
        }
    ],
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    dueDate: Date,
    status: {
        type: String,
        enum: ['مدفوعة', 'معلقة', 'متأخرة'],
        default: 'معلقة'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }
}, {
    timestamps: true
});

// إنشاء رقم فاتورة تلقائي
InvoiceSchema.pre('save', async function(next) {
    if (!this.invoiceNumber) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999))
            }
        });
        this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Invoice', InvoiceSchema);
