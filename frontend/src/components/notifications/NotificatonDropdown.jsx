
// src/components/NotificationDropdown.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const NotificationDropdown = ({ notifications, onClose }) => {
  return (
    <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden z-50">
      <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">الإشعارات</h3>
        {notifications.length > 0 && (
          <Link
            to="/notifications"
            className="text-sm text-blue-600 hover:underline"
            onClick={onClose}
          >
            عرض الكل
          </Link>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <Link
              key={notification.id}
              to={notification.link || '#'}
              className={`block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0 ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
              onClick={onClose}
            >
              <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notification.date), { 
                  addSuffix: true,
                  locale: ar 
                })}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            لا توجد إشعارات
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
