// models/SalaryReport.js
import mongoose from 'mongoose';

const SalaryReportSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: Number,
        required: true, // 1-12
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    personalExpenses: [{
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee.personalExpenses'
        },
        amount: Number,
        description: String
    }],
    commercialExpenses: [{
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee.commercialExpenses'
        },
        amount: Number,
        description: String
    }],
    totalPersonalExpenses: {
        type: Number,
        default: 0
    },
    totalCommercialExpenses: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['معلق', 'مدفوع', 'مرفوض'],
        default: 'معلق'
    },
    paidDate: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('SalaryReport', SalaryReportSchema);
