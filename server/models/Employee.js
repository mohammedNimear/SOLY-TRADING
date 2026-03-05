// models/Employee.js (التحديث)
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['مدير', 'مشرف', 'عامل'],
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'assignedToModel'
    },
    assignedToModel: {
        type: String,
        enum: ['Store', 'SellingWindow']
    },
    salary: {
        type: Number,
        default: 0
    },
    personalExpenses: [{
        description: String,
        amount: Number,
        date: { type: Date, default: Date.now },
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],
    commercialExpenses: [{
        description: String,
        amount: Number,
        date: { type: Date, default: Date.now },
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    }],
    phone: String,
    email: String,
    address: String,
    hireDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default mongoose.model('Employee', employeeSchema);
