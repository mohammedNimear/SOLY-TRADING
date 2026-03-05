import Employee from '../models/Employee.js';
import Store from '../models/Store.js'; // التأكد من هذا الاستيراد
import User from '../models/User.js';
import { createError } from '../utils/error.js';


// إنشاء موظف جديد
export const createEmployee = async (req, res, next) => {
    try {
        const { name, position, role, phone, email, address, salary, assignedTo, assignedToModel, userId } = req.body;

        const employee = await Employee.create({
            name,
            position,
            role,
            phone,
            email,
            address,
            salary,
            assignedTo,
            assignedToModel
        });

        // ربط الموظف بالمستخدم تلقائياً إذا تم توفير userId
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                employee: employee._id
            });
        }

        // تحديث المخزن أو النافذة لربط الموظف
        if (assignedTo && assignedToModel) {
            if (assignedToModel === 'Store') {
                try {
                    await Store.findByIdAndUpdate(assignedTo, {
                        $push: {
                            employees: {
                                employee: employee._id,
                                role: role,
                                startDate: Date.now()
                            }
                        }
                    });
                } catch (storeError) {
                    console.error('خطأ في تحديث المخزن:', storeError);
                }
            }
        }

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الموظف بنجاح',
            employee
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع الموظفين
export const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user', 'name email role');
        
        res.status(200).json({
            success: true,
            count: employees.length,
            employees
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على موظف بواسطة ID
export const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('assignedTo');
        
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        // إذا كان هناك مستخدم مرتبط، نعرض معلوماته
        if (employee.user) {
            console.log('الموظف مرتبط بالمستخدم:', employee.user.email);
        }

        res.status(200).json({
            success: true,
            employee
        });
    } catch (error) {
        next(error);
    }
};

// تحديث الموظف
export const updateEmployee = async (req, res, next) => {
    try {
        const { name, position, role, phone, email, address, salary, isActive } = req.body;
        
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, position, role, phone, email, address, salary, isActive },
            { new: true, runValidators: true }
        ).populate('user');

        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث الموظف بنجاح',
            employee
        });
    } catch (error) {
        next(error);
    }
};

// حذف الموظف
export const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        // حذف المستخدم المرتبط
        if (employee.user) {
            await User.findByIdAndDelete(employee.user);
        }

        await employee.remove();

        res.status(200).json({
            success: true,
            message: 'تم حذف الموظف بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على منصرفات الموظف
export const getEmployeeExpenses = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        res.status(200).json({
            success: true,
            personalExpenses: employee.personalExpenses,
            commercialExpenses: employee.commercialExpenses
        });
    } catch (error) {
        next(error);
    }
};

// الموافقة على المنصرفات
export const approveExpense = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const { type, approved } = req.body; // type: 'personal' or 'commercial'
        
        const employee = await Employee.findById(req.user.employee);
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
        expenseArray[expenseIndex].approvedBy = req.user.id;
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
// إضافة منصرف شخصي
export const addPersonalExpense = async (req, res, next) => {
    try {
        const { description, amount } = req.body;
        
        // البحث عن الموظف المرتبط بالمستخدم الحالي
        const employee = await Employee.findOne({ user: req.user.id });
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        employee.personalExpenses.push({
            description,
            amount,
            date: Date.now(),
            approved: false
        });

        await employee.save();

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنصرف الشخصي بنجاح',
            expense: employee.personalExpenses[employee.personalExpenses.length - 1]
        });
    } catch (error) {
        next(error);
    }
};

// إضافة منصرف تجاري
export const addCommercialExpense = async (req, res, next) => {
    try {
        const { description, amount } = req.body;
        
        // البحث عن الموظف المرتبط بالمستخدم الحالي
        const employee = await Employee.findOne({ user: req.user.id });
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        employee.commercialExpenses.push({
            description,
            amount,
            date: Date.now(),
            approved: false
        });

        await employee.save();

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنصرف التجاري بنجاح',
            expense: employee.commercialExpenses[employee.commercialExpenses.length - 1]
        });
    } catch (error) {
        next(error);
    }
};
