import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    searchProducts,
    getCategories,        // أضف هذا
    createCategory,       // أضف هذا
    deleteCategory        // أضف هذا
} from '../controllers/productController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// ===== إضافة إدارة الفئات =====
// تأكد أن هذا السطر موجود:
router.get('/categories', getCategories);
router.post('/categories', verifyToken, verifyManager, createCategory);  // إنشاء فئة
router.delete('/categories/:id', verifyToken, verifyManager, deleteCategory); // حذف فئة
// ===== نهاية إدارة الفئات =====

// Routes محمية
router.post('/', verifyToken, verifyManager, createProduct);
router.put('/:id', verifyToken, verifyManager, updateProduct);
router.delete('/:id', verifyToken, verifyManager, deleteProduct);

export default router;
