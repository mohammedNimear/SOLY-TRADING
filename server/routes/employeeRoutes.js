import express from 'express';
import { 
    createEmployee, 
    getAllEmployees, 
    getEmployeeById, 
    updateEmployee, 
    deleteEmployee,
    getEmployeeExpenses,
    approveExpense
} from '../controllers/employeeController.js';
import { verifyToken, verifyAdmin, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes للمشرفين والإداريين
router.post('/', verifyToken, verifyManager, createEmployee);
router.get('/', verifyToken, getAllEmployees);
router.get('/:id', verifyToken, getEmployeeById);
router.put('/:id', verifyToken, verifyManager, updateEmployee);
router.delete('/:id', verifyToken, verifyAdmin, deleteEmployee);

// Routes للمنصرفات
router.get('/:id/expenses', verifyToken, getEmployeeExpenses);
router.put('/expenses/:expenseId/approve', verifyToken, verifyManager, approveExpense);

export default router;
