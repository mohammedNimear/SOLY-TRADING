// دوال التحقق من التوكن (JWT) والصلاحيات
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    // التحقق من التوكن في الكوكيز أو الهيدر
    const token = req.cookies.access_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return next(createError(401, 'المستخدم غير مسجل الدخول'));
    }
    
    // التأكد من وجود JWT_SECRET
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(createError(401, 'الرمز منتهي الصلاحية'));
            }
            return next(createError(403, 'الرمز غير صحيح'));
        }
        
        req.user = decoded;
        next();
    });
};

// التحقق من هوية المستخدم
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        
        // التحقق من ID المستخدم أو الصلاحيات الإدارية
        if (req.user.id === req.params.id || req.user.role === 'admin') { // ✅ تم التحديث
            next();
        } else {
            return next(createError(403, 'غير مسموح لك بالوصول إلى هذا الحساب'));
        }
    });
};

// التحقق من صلاحيات المشرف
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        
        if (req.user.role === 'admin') { // ✅ تم التحديث
            next();
        } else {
            return next(createError(403, 'غير مسموح لك بالوصول إلى هذه الميزة (يتطلب صلاحية مشرف)'));
        }
    });
};

// التحقق من المدير أو المشرف
export const verifyManager = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        
        if (req.user.role === 'admin' || req.user.role === 'manager') { // ✅ تم التحديث
            next();
        } else {
            return next(createError(403, 'غير مسموح لك بالوصول إلى هذه الميزة (يتطلب صلاحية مدير أو مشرف)'));
        }
    });
};
