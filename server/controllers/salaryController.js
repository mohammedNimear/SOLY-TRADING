import SalaryReport from '../models/SalaryReport.js';
import Employee from '../models/Employee.js';
import { createError } from '../utils/error.js';

// إنشاء تقرير راتب جديد
export const createSalaryReport = async (req, res, next) => {
    try {
        const { employee, month, year, baseSalary, notes } = req.body;
        
        // التحقق من الموظف
        const employeeDoc = await Employee.findById(employee);
        if (!employeeDoc) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        // التحقق من عدم وجود تقرير سابق لنفس الشهر
        const existingReport = await SalaryReport.findOne({ employee, month, year });
        if (existingReport) {
            return next(createError(400, 'تقرير الراتب لهذا الشهر موجود بالفعل'));
        }

        // حساب المنصرفات الشخصية والتجارية
        let totalPersonalExpenses = 0;
        let totalCommercialExpenses = 0;
        const personalExpenses = [];
        const commercialExpenses = [];

        // تصفية المنصرفات المعتمدة لهذا الشهر
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        employeeDoc.personalExpenses.forEach(expense => {
            if (expense.approved && expense.date >= startDate && expense.date <= endDate) {
                totalPersonalExpenses += expense.amount;
                personalExpenses.push({
                    expense: expense._id,
                    amount: expense.amount,
                    description: expense.description
                });
            }
        });

        employeeDoc.commercialExpenses.forEach(expense => {
            if (expense.approved && expense.date >= startDate && expense.date <= endDate) {
                totalCommercialExpenses += expense.amount;
                commercialExpenses.push({
                    expense: expense._id,
                    amount: expense.amount,
                    description: expense.description
                });
            }
        });

        // حساب الراتب الصافي
        const netSalary = baseSalary - totalPersonalExpenses - totalCommercialExpenses;

        const salaryReport = await SalaryReport.create({
            employee,
            month,
            year,
            baseSalary,
            personalExpenses,
            commercialExpenses,
            totalPersonalExpenses,
            totalCommercialExpenses,
            netSalary,
            createdBy: req.user.id,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء تقرير الراتب بنجاح',
            salaryReport
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع تقارير الرواتب
export const getAllSalaryReports = async (req, res, next) => {
    try {
        const { status, employee, month, year } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (employee) filter.employee = employee;
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const reports = await SalaryReport.find(filter)
            .populate('employee', 'name position')
            .populate('createdBy', 'name')
            .sort({ year: -1, month: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على تقرير راتب بواسطة ID
export const getSalaryReportById = async (req, res, next) => {
    try {
        const report = await SalaryReport.findById(req.params.id)
            .populate('employee', 'name position salary')
            .populate('createdBy', 'name');
        
        if (!report) {
            return next(createError(404, 'تقرير الراتب غير موجود'));
        }

        res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        next(error);
    }
};

// تحديث تقرير الراتب
export const updateSalaryReport = async (req, res, next) => {
    try {
        const report = await SalaryReport.findById(req.params.id);
        if (!report) {
            return next(createError(404, 'تقرير الراتب غير موجود'));
        }

        // لا يمكن تعديل التقرير بعد الموافقة عليه
        if (report.status !== 'معلق') {
            return next(createError(400, 'لا يمكن تعديل التقرير بعد الموافقة عليه'));
        }

        const { baseSalary, notes } = req.body;

        // إعادة حساب المنصرفات إذا تم تغيير الراتب الأساسي
        if (baseSalary !== undefined) {
            report.baseSalary = baseSalary;
            report.netSalary = baseSalary - report.totalPersonalExpenses - report.totalCommercialExpenses;
        }

        if (notes) report.notes = notes;

        await report.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث تقرير الراتب بنجاح',
            report
        });
    } catch (error) {
        next(error);
    }
};

// الموافقة على تقرير الراتب
export const approveSalaryReport = async (req, res, next) => {
    try {
        const { status, notes } = req.body; // status: 'مدفوع' أو 'مرفوض'
        
        const report = await SalaryReport.findById(req.params.id);
        if (!report) {
            return next(createError(404, 'تقرير الراتب غير موجود'));
        }

        if (report.status !== 'معلق') {
            return next(createError(400, 'التقرير موثق بالفعل'));
        }

        report.status = status;
        report.paidDate = status === 'مدفوع' ? Date.now() : undefined;
        if (notes) report.notes = notes;

        await report.save();

        res.status(200).json({
            success: true,
            message: `تم ${status === 'مدفوع' ? 'دفع' : 'رفض'} تقرير الراتب بنجاح`,
            report
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على رواتب موظف معين
export const getEmployeeSalaries = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const { year } = req.query;

        let filter = { employee: employeeId };
        if (year) filter.year = parseInt(year);

        const reports = await SalaryReport.find(filter)
            .populate('employee', 'name')
            .sort({ year: -1, month: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على ملخص الرواتب الشهري
export const getMonthlySalarySummary = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        
        let filter = {};
        if (month) filter.month = parseInt(month);
        if (year) filter.year = parseInt(year);

        const reports = await SalaryReport.find(filter);
        
        const summary = {
            totalReports: reports.length,
            totalBaseSalary: reports.reduce((sum, r) => sum + r.baseSalary, 0),
            totalPersonalExpenses: reports.reduce((sum, r) => sum + r.totalPersonalExpenses, 0),
            totalCommercialExpenses: reports.reduce((sum, r) => sum + r.totalCommercialExpenses, 0),
            totalNetSalary: reports.reduce((sum, r) => sum + r.netSalary, 0),
            paidReports: reports.filter(r => r.status === 'مدفوع').length,
            pendingReports: reports.filter(r => r.status === 'معلق').length
        };

        res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        next(error);
    }
};
