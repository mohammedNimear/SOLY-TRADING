import express from 'express';
import { 
    createSalaryReport, 
    getAllSalaryReports, 
    getSalaryReportById, 
    updateSalaryReport, 
    approveSalaryReport,
    getEmployeeSalaries,
    getMonthlySalarySummary
} from '../controllers/salaryController.js';
import { verifyToken, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes للمشرفين
router.get('/', verifyToken, verifyManager, getAllSalaryReports);
router.get('/monthly-summary', verifyToken, verifyManager, getMonthlySalarySummary);
router.get('/:id', verifyToken, verifyManager, getSalaryReportById);
router.put('/:id/approve', verifyToken, verifyManager, approveSalaryReport);

// Routes للموظفين
router.post('/', verifyToken, createSalaryReport);
router.put('/:id', verifyToken, updateSalaryReport);
router.get('/employee/:employeeId', verifyToken, getEmployeeSalaries);

export default router;
