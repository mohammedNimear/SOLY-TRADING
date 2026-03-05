import express from 'express';
import { 
    createTransfer, 
    getAllTransfers, 
    getTransferById, 
    approveTransfer,
    getPendingTransfers
} from '../controllers/transferController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة للمشرفين
router.get('/', verifyToken, verifyManager, getAllTransfers);
router.get('/pending', verifyToken, verifyManager, getPendingTransfers);
router.get('/:id', verifyToken, verifyManager, getTransferById);

// Routes للموظفين
router.post('/', verifyToken, createTransfer);

// Routes للموافقات
router.put('/:id/approve', verifyToken, verifyManager, approveTransfer);

export default router;
