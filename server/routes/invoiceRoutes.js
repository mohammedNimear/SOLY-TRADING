// routes/invoiceRoutes.js
import express from 'express';
import { 
    createInvoice, 
    getAllInvoices, 
    getInvoiceById, 
    updateInvoice, 
    deleteInvoice,
    getInvoiceByNumber,
    getDailySales,
    getPendingInvoices,
    getInvoicesByCustomer,
    getMonthlySales,
    cancelInvoice
} from '../controllers/invoiceController.js';
import { verifyToken, verifyManager, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة (محمية برمز التحقق)
router.get('/', verifyToken, getAllInvoices);
router.get('/daily-sales', verifyToken, getDailySales);
router.get('/monthly-sales', verifyToken, getMonthlySales);
router.get('/pending', verifyToken, getPendingInvoices);
router.get('/customer/:customerId', verifyToken, getInvoicesByCustomer);
router.get('/number/:invoiceNumber', verifyToken, getInvoiceByNumber);
router.get('/:id', verifyToken, getInvoiceById);

// Routes لإنشاء وتعديل الفواتير (للموظفين والmanagers)
router.post('/', verifyToken, createInvoice);
router.put('/:id', verifyToken, updateInvoice);

// Routes خاصة (للإدارة فقط)
router.delete('/:id', verifyToken, verifyManager, deleteInvoice);
router.post('/:id/cancel', verifyToken, verifyManager, cancelInvoice);

export default router;
