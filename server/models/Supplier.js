// models/Supplier.js
import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    bankAccount: String,
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

export default mongoose.model('Supplier', SupplierSchema);
