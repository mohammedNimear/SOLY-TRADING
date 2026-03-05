import express from 'express';
import { 
    createSellingWindow, 
    getAllSellingWindows, 
    getSellingWindowById, 
    updateSellingWindow, 
    deleteSellingWindow,
    addProductToWindow,
    removeProductFromWindow,
    transferToWindow,
    addBulkProductsToWindow
} from '../controllers/sellingWindowController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة
router.get('/', getAllSellingWindows);
router.get('/:id', getSellingWindowById);

// Routes محمية
router.post('/', verifyToken, verifyManager, createSellingWindow);
router.put('/:id', verifyToken, verifyManager, updateSellingWindow);
router.delete('/:id', verifyToken, verifyManager, deleteSellingWindow);

// Routes للمنتجات في النوافذ
router.post('/:id/products', verifyToken, verifyManager, addProductToWindow);
router.delete('/:windowId/products/:productId', verifyToken, verifyManager, removeProductFromWindow);
router.post('/transfer', verifyToken, verifyManager, transferToWindow);
router.post('/:id/products/bulk', verifyToken, verifyManager, addBulkProductsToWindow);

export default router;
