import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { createError } from '../utils/error.js';

// الحصول على جميع المستخدمين
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('employee', 'name position');
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على مستخدم بواسطة ID
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('employee');
        
        if (!user) {
            return next(createError(404, 'المستخدم غير موجود'));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// تحديث المستخدم
export const updateUser = async (req, res, next) => {
    try {
        const { name, email, role, isActive } = req.body;
        
        // التحقق من أن المستخدم يمكنه تعديل نفسه أو أنه مشرف
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return next(createError(403, 'غير مسموح لك بتعديل هذا المستخدم'));
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, isActive },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next(createError(404, 'المستخدم غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث المستخدم بنجاح',
            user
        });
    } catch (error) {
        next(error);
    }
};

// حذف المستخدم
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return next(createError(404, 'المستخدم غير موجود'));
        }

        // إزالة العلاقة مع الموظف
        await Employee.findByIdAndUpdate(user.employee, { user: null });

        await user.remove();

        res.status(200).json({
            success: true,
            message: 'تم حذف المستخدم بنجاح'
        });
    } catch (error) {
        next(error);
    }
};

// تحديث كلمة المرور
export const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id).select('+password');
        
        if (!user) {
            return next(createError(404, 'المستخدم غير موجود'));
        }

        // التحقق من كلمة المرور الحالية
        const isPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isPasswordCorrect) {
            return next(createError(401, 'كلمة المرور الحالية غير صحيحة'));
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث كلمة المرور بنجاح'
        });
    } catch (error) {
        next(error);
    }
};
