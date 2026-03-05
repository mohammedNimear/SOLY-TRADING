import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { createError } from '../utils/error.js';
import crypto from 'crypto';

// التسجيل
// التسجيل
export const register = async (req, res, next) => {
    try {
        const { name, email, password, employeeId, role } = req.body;

        // التحقق من وجود الموظف
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return next(createError(404, 'الموظف غير موجود'));
        }

        // التحقق من أن البريد الإلكتروني غير مستخدم
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(400, 'البريد الإلكتروني مستخدم بالفعل'));
        }

        // إنشاء المستخدم
        const user = await User.create({
            name,
            email,
            password,
            role,
            employee: employeeId
        });

        // ربط الموظف بالمستخدم
        employee.user = user._id;
        await employee.save();

        // إنشاء التوكن
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


// تسجيل الدخول
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // التحقق من وجود البريد الإلكتروني
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(createError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة'));
        }

        // التحقق من كلمة المرور
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return next(createError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة'));
        }

        // التحقق من تفعيل الحساب
        if (!user.isActive) {
            return next(createError(401, 'الحساب غير مفعل'));
        }

        // تحديث آخر تسجيل دخول
        user.lastLogin = Date.now();
        await user.save();

        // إنشاء التوكن
        const token = user.generateAuthToken();

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }).status(200).json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

// تسجيل الخروج
export const logout = (req, res) => {
    res.clearCookie('access_token').status(200).json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
    });
};

// نسيان كلمة المرور
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(createError(404, 'لا يوجد مستخدم بهذا البريد الإلكتروني'));
        }

        // إنشاء توكن إعادة تعيين كلمة المرور
        const resetToken = user.createPasswordResetToken();
        await user.save();

        // هنا يجب إرسال البريد الإلكتروني مع الرابط
        const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

        res.status(200).json({
            success: true,
            message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
            resetURL // للتطوير فقط
        });

    } catch (error) {
        next(error);
    }
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // تشفير التوكن
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // البحث عن المستخدم
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(createError(400, 'توكن إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية'));
        }

        // تحديث كلمة المرور
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'تم تغيير كلمة المرور بنجاح'
        });

    } catch (error) {
        next(error);
    }
};
