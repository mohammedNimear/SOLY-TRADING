import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
    updatePassword
} from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes protégées
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.put('/:id/password', verifyToken, updatePassword);

export default router;
