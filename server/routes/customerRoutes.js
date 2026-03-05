import express from 'express';
import { 
    createCustomer, 
    getAllCustomers, 
    getCustomerById, 
    updateCustomer, 
    deleteCustomer,
    getCustomerBalance,
    getCustomerInvoices
} from '../controllers/customerController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/balance', getCustomerBalance);
router.get('/:id/invoices', getCustomerInvoices);

// Routes محمية
router.post('/', verifyToken, createCustomer);
router.put('/:id', verifyToken, updateCustomer);
router.delete('/:id', verifyToken, verifyManager, deleteCustomer);

export default router;
