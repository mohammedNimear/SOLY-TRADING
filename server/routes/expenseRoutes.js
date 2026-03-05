import express from 'express';
import { 
    addPersonalExpense, 
    addCommercialExpense, 
    getEmployeeExpenses, 
    approveExpense,
    getAllExpenses,
    getPendingExpenses
} from '../controllers/expenseController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes عامة للموظفين
router.post('/personal', verifyToken, addPersonalExpense);
router.post('/commercial', verifyToken, addCommercialExpense);
router.get('/my-expenses', verifyToken, getEmployeeExpenses);

// Routes للمشرفين
router.get('/', verifyToken, verifyManager, getAllExpenses);
router.get('/pending', verifyToken, verifyManager, getPendingExpenses);
router.put('/:id/approve', verifyToken, verifyManager, approveExpense);

export default router;
