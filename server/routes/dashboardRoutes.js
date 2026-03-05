import express from 'express';
import { 
    getDashboardStats, 
    getRecentActivities, 
    getCriticalProducts,
    getHeaderData
} from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes للوحة التحكم
router.get('/stats', verifyToken, getDashboardStats);        // إضافة هذا
router.get('/activities', verifyToken, getRecentActivities);
router.get('/critical-products', verifyToken, getCriticalProducts);
router.get('/header-data', verifyToken, getHeaderData);

export default router;
