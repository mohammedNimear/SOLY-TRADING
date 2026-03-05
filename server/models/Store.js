// models/Store.js (التحديث)
import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    location: String,
    employees: [{
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        role: {
            type: String,
            enum: ['مدير', 'مشرف', 'عامل']
        },
        startDate: {
            type: Date,
            default: Date.now
        }
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 0,
                min: 0
            },
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('Store', StoreSchema);
