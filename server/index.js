import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

// استيراد المكونات الداخلية
import connectDB from './config/db.js';
import router from './routes/index.js';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// إعدادات CORS للسماح بالطلبات من الواجهة الأمامية
const corsOptions = {
    origin: [
        'https://soly-trading.netlify.app',
        'http://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middlewares الأساسية
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Logging Middleware (للتطوير)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// استخدام المسارات
app.use('/api', router);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'الخادم يعمل بشكل طبيعي',
        timestamp: new Date().toISOString()
    });
});

// مسار تجريبي رئيسي
app.get('/', (req, res) => {
    res.send('🌐 Soly ERP API is running');
});

// معالج للمسارات غير الموجودة - ✅ التصحيح هنا
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'الرابط غير موجود'
    });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'حدث خطأ غير متوقع';
    
    // تسجيل الخطأ في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err.stack);
    }
    
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// إعداد Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            'https://soly-trading.netlify.app',
            'http://localhost:3000'
        ],
        credentials: true
    }
});

// معالجة اتصالات Socket.IO
io.on('connection', (socket) => {
    console.log('📱 مستخدم متصل:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('🔌 مستخدم غير متصل:', socket.id);
    });
});

// تشغيل الخادم
const port = process.env.PORT || 8800;
server.listen(port, () => {
    connectDB();
    console.log(`🚀 الخادم يعمل على المنفذ ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { io };
