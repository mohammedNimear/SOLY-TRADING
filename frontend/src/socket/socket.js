
import { io } from 'socket.io-client';

// يمكنك ضبط الرابط الأساسي للسوكيت عبر متغير البيئة
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8800';

let socket = null;

/**
 * الاتصال بالسوكيت وإرجاع الكائن
 * @param {string} token - توكن المصادقة (JWT)
 * @returns {object} كائن السوكيت
 */
export const connectSocket = (token) => {
  // إذا كان السوكيت موجوداً بالفعل، نعيده دون إنشاء جديد
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'], // استخدام websocket فقط لتجنب مشاكل polling
  });

  // أحداث أساسية
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Socket connection error:', error.message);
  });

  return socket;
};

/**
 * الحصول على كائن السوكيت الحالي (إذا كان موجوداً)
 * @returns {object|null} كائن السوكيت أو null
 */
export const getSocket = () => socket;

/**
 * فصل الاتصال يدوياً
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
