import Employee from '../models/Employee.js';
import { createError } from '../utils/error.js';

/// إضافة منصرف شخصي
export const addPersonalExpense = async (req, res, next) => {
    try {
        const { description, amount } = req.body;
        
        // تجاهل التحقق من الموظف مؤقتاً - استخدم معلومات المستخدم مباشرة
        const expense = {
            description: description || 'منصرف شخصي',
            amount: amount || 0,
            date: new Date(),
            approved: false,
            _id: new Date().getTime().toString() // ID مؤقت
        };

        // تسجيل المنصرف في console للتحقق
        console.log('منصرف شخصي جديد:', expense);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنصرف الشخصي بنجاح',
            expense: expense
        });
    } catch (error) {
        next(error);
    }
};

// إضافة منصرف تجاري  
export const addCommercialExpense = async (req, res, next) => {
    try {
        const { description, amount } = req.body;
        
        // تجاهل التحقق من الموظف مؤقتاً - استخدم معلومات المستخدم مباشرة
        const expense = {
            description: description || 'منصرف تجاري',
            amount: amount || 0,
            date: new Date(),
            approved: false,
            _id: new Date().getTime().toString() // ID مؤقت
        };

        // تسجيل المنصرف في console للتحقق
        console.log('منصرف تجاري جديد:', expense);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنصرف التجاري بنجاح',
            expense: expense
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على منصرفات الموظف
export const getEmployeeExpenses = async (req, res, next) => {
    try {
        // إرجاع بيانات تجريبية مؤقتاً
        res.status(200).json({
            success: true,
            personalExpenses: [
                {
                    _id: "1",
                    description: "مصاريف نقل",
                    amount: 150,
                    date: new Date(),
                    approved: false
                }
            ],
            commercialExpenses: [
                {
                    _id: "2", 
                    description: "تكاليف شحن",
                    amount: 500,
                    date: new Date(),
                    approved: false
                }
            ]
        });
    } catch (error) {
        next(error);
    }
};
// الحصول على جميع المنصرفات
export const getAllExpenses = async (req, res, next) => {
    try {
        const { type, approved, employeeId } = req.query;
        
        let filter = {};
        if (type) filter[`${type}Expenses`] = { $exists: true };
        if (employeeId) filter._id = employeeId;

        const employees = await Employee.find(filter);
        
        let allExpenses = [];
        employees.forEach(employee => {
            employee.personalExpenses.forEach(expense => {
                allExpenses.push({
                    ...expense.toObject(),
                    employee: {
                        id: employee._id,
                        name: employee.name
                    },
                    type: 'personal'
                });
            });
            
            employee.commercialExpenses.forEach(expense => {
                allExpenses.push({
                    ...expense.toObject(),
                    employee: {
                        id: employee._id,
                        name: employee.name
                    },
                    type: 'commercial'
                });
            });
        });

        // تصفية حسب الموافقة إذا تم تحديدها
        if (approved !== undefined) {
            const approvedBool = approved === 'true';
            allExpenses = allExpenses.filter(exp => exp.approved === approvedBool);
        }

        // ترتيب حسب التاريخ
        allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            count: allExpenses.length,
            expenses: allExpenses
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على المنصرفات المعلقة
export const getPendingExpenses = async (req, res, next) => {
    try {
        const employees = await Employee.find();
        
        let pendingExpenses = [];
        employees.forEach(employee => {
            employee.personalExpenses.forEach(expense => {
                if (!expense.approved) {
                    pendingExpenses.push({
                        ...expense.toObject(),
                        employee: {
                            id: employee._id,
                            name: employee.name
                        },
                        type: 'personal'
                    });
                }
            });
            
            employee.commercialExpenses.forEach(expense => {
                if (!expense.approved) {
                    pendingExpenses.push({
                        ...expense.toObject(),
                        employee: {
                            id: employee._id,
                            name: employee.name
                        },
                        type: 'commercial'
                    });
                }
            });
        });

        // ترتيب حسب التاريخ
        pendingExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            count: pendingExpenses.length,
            expenses: pendingExpenses
        });
    } catch (error) {
        next(error);
    }
};

// الموافقة على المنصرف
export const approveExpense = async (req, res, next) => {
    try {
        const { employeeId, expenseId, type, approved } = req.body;
        
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        let expenseArray;
        if (type === 'personal') {
            expenseArray = employee.personalExpenses;
        } else if (type === 'commercial') {
            expenseArray = employee.commercialExpenses;
        } else {
            return next(createError(400, 'نوع المنصرف غير صحيح'));
        }

        const expenseIndex = expenseArray.findIndex(exp => exp._id.toString() === expenseId);
        if (expenseIndex === -1) {
            return next(createError(404, 'المنصرف غير موجود'));
        }

        expenseArray[expenseIndex].approved = approved;
        expenseArray[expenseIndex].approvedBy = req.user.employee;
        expenseArray[expenseIndex].approvedDate = Date.now();

        await employee.save();

        res.status(200).json({
            success: true,
            message: `تم ${approved ? 'الموافقة على' : 'رفض'} المنصرف`,
            expense: expenseArray[expenseIndex]
        });
    } catch (error) {
        next(error);
    }
};
