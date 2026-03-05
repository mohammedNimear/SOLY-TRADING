import express from 'express';
import { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    updateSupplier, 
    deleteSupplier,
    getSupplierBalance
} from '../controllers/supplierController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.get('/:id/balance', getSupplierBalance);

// Routes محمية
router.post('/', verifyToken, verifyManager, createSupplier);
router.put('/:id', verifyToken, verifyManager, updateSupplier);
router.delete('/:id', verifyToken, verifyManager, deleteSupplier);

export default router;
