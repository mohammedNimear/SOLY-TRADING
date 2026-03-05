// models/Transfer.js
import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema({
    transferId: {
        type: String,
        unique: true,
        required: true
    },
    fromType: {
        type: String,
        enum: ['store', 'sellingWindow'],
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'fromTypeModel'
    },
    fromTypeModel: {
        type: String,
        enum: ['Store', 'SellingWindow'],
        required: true
    },
    toType: {
        type: String,
        enum: ['store', 'sellingWindow'],
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'toTypeModel'
    },
    toTypeModel: {
        type: String,
        enum: ['Store', 'SellingWindow'],
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
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
}, {
    timestamps: true
});

// إنشاء رقم متسلسل للتحويل
TransferSchema.pre('save', async function(next) {
    if (!this.transferId) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999))
            }
        });
        this.transferId = `TRF-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Transfer', TransferSchema);
