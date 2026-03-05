import express from 'express';
import { 
    createSupply, 
    getAllSupplies, 
    getSupplyById, 
    updateSupply, 
    deleteSupply,
    approveSupply,
    getPendingSupplies
} from '../controllers/supplyController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة للمشرفين
router.get('/', verifyToken, verifyManager, getAllSupplies);
router.get('/pending', verifyToken, verifyManager, getPendingSupplies);
router.get('/:id', verifyToken, verifyManager, getSupplyById);

// Routes للموظفين
router.post('/', verifyToken, createSupply);
router.put('/:id', verifyToken, updateSupply);
router.delete('/:id', verifyToken, deleteSupply);

// Routes للموافقات
router.put('/:id/approve', verifyToken, verifyManager, approveSupply);

export default router;
