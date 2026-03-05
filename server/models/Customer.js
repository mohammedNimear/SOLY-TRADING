import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['فرد', 'شركة'],
        required: true
    },
    contactPerson: String,
    phone: {
        type: String,
        required: true
    },
    email: String,
    address: String,
    company: String,
    taxNumber: String,
    creditLimit: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: String
}, {
    timestamps: true
});

export default mongoose.model('Customer', customerSchema);
