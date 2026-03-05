import express from 'express';
import { 
    createStore, 
    getAllStores, 
    getStoreById, 
    updateStore, 
    deleteStore,
    addProductToStore,
    removeProductFromStore,
    transferBetweenStores
} from '../controllers/storeController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Routes محمية
router.post('/', verifyToken, verifyManager, createStore);
router.put('/:id', verifyToken, verifyManager, updateStore);
router.delete('/:id', verifyToken, verifyManager, deleteStore);

// Routes للمنتجات في المخازن
router.post('/:id/products', verifyToken, verifyManager, addProductToStore);
router.delete('/:storeId/products/:productId', verifyToken, verifyManager, removeProductFromStore);
router.post('/transfer', verifyToken, verifyManager, transferBetweenStores);

export default router;
