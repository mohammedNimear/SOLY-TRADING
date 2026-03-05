import express from 'express';
import { 
    getSalesReport, 
    getInventoryReport, 
    getFinancialReport,
    getEmployeeReport,
    getCustomerReport,
    getProductPerformanceReport
} from '../controllers/reportController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes للتقارير
router.get('/sales', verifyToken, verifyManager, getSalesReport);
router.get('/inventory', verifyToken, verifyManager, getInventoryReport);
router.get('/financial', verifyToken, verifyManager, getFinancialReport);
router.get('/employees', verifyToken, verifyManager, getEmployeeReport);
router.get('/customers', verifyToken, verifyManager, getCustomerReport);
router.get('/products/performance', verifyToken, verifyManager, getProductPerformanceReport);

export default router;
