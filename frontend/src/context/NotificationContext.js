
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { connectSocket, getSocket, disconnectSocket } from '../socket/socket';

// إنشاء سياق الإشعارات
const NotificationContext = createContext();

// خطاف مخصص لاستخدام السياق
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// مزود الإشعارات
export const NotificationProvider = ({ children }) => {
  const {user} = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token, isAuthenticated } = useAuth();

  // الاتصال بالسوكيت عند تسجيل الدخول وقطع الاتصال عند تسجيل الخروج
  useEffect(() => {
    let socket = null;
    if (isAuthenticated && token) {
      socket = connectSocket(token);
      socket.on('initial_notifications', (initialNotifications) => {
        setNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter((n) => !n.read).length);
      });
      socket.on('new_notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      socket.on('notification_updated', (updatedNotification) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
        );
        setUnreadCount((prev) =>
          updatedNotification.read ? Math.max(0, prev - 1) : prev + 1
        );
      });

      // عند فصل السوكيت
      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected in NotificationProvider');
      });
    } else {
      // إذا لم يكن المستخدم مصادقاً، قطع الاتصال إن وجد
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
    }

    // تنظيف عند إلغاء التثبيت أو تغير isAuthenticated/token
    return () => {
      if (socket) {
        socket.off('initial_notifications');
        socket.off('new_notification');
        socket.off('notification_updated');
      }
    };
  }, [isAuthenticated, token]);

  // تحديد إشعار كمقروء
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // إرسال تأكيد للخادم (اختياري)
    const socket = getSocket();
    if (socket) {
      socket.emit('mark_read', notificationId);
    }
  }, []);

  // تحديد كل الإشعارات كمقروءة
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const socket = getSocket();
    if (socket) {
      socket.emit('mark_all_read');
    }
  }, []);

  // حذف إشعار (اختياري)
  const deleteNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    // يمكن إرسال حدث للخادم إذا أردت
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
