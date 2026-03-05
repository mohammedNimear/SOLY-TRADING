import express from 'express';
import { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteOldNotifications 
} from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getUserNotifications);
router.put('/:id/read', verifyToken, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);
router.delete('/old', verifyToken, deleteOldNotifications);

export default router;
