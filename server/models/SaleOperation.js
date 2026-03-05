// models/SaleOperation.js
import mongoose from 'mongoose';

const SaleOperationSchema = new mongoose.Schema({
    operationType: {
        type: String,
        enum: ['بيع', 'توريد', 'تحويل'],
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    sellingWindow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SellingWindow'
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    items: [{
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
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['نقداً', 'أجل', 'تصريف']
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier' // سننشئ هذا لاحقاً
    },
    status: {
        type: String,
        enum: ['معلق', 'مكتمل', 'مرفوض', 'ملغي'],
        default: 'معلق'
    },
    notes: String,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    approvedDate: Date
}, {
    timestamps: true
});

export default mongoose.model('SaleOperation', SaleOperationSchema);
