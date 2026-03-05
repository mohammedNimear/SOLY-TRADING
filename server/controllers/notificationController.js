import Notification from '../models/Notification.js';
import { createError } from '../utils/error.js';

// الحصول على الإشعارات الخاصة بالمستخدم
export const getUserNotifications = async (req, res, next) => {
    try {
        const { limit = 20, unreadOnly = false } = req.query;
        
        let filter = { recipient: req.user.id };
        if (unreadOnly === 'true') {
            filter.read = false;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        next(error);
    }
};

// وضع علامة على الإشعار كمقروء
export const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return next(createError(404, 'الإشعار غير موجود'));
        }

        res.status(200).json({
            success: true,
            message: 'تم وضع علامة على الإشعار كمقروء',
            notification
        });
    } catch (error) {
        next(error);
    }
};

// وضع علامة على جميع الإشعارات كمقروءة
export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'تم وضع علامة على جميع الإشعارات كمقروءة'
        });
    } catch (error) {
        next(error);
    }
};

// حذف الإشعارات القديمة
export const deleteOldNotifications = async (req, res, next) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Notification.deleteMany({
            createdAt: { $lt: thirtyDaysAgo }
        });

        res.status(200).json({
            success: true,
            message: `تم حذف ${result.deletedCount} إشعار قديم`
        });
    } catch (error) {
        next(error);
    }
};
