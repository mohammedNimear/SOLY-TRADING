import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import productRoutes from './productRoutes.js';
import storeRoutes from './storeRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import supplyRoutes from './supplyRoutes.js';
import customerRoutes from './customerRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import sellingWindowRoutes from './sellingWindowRoutes.js';
import transferRoutes from './transferRoutes.js';
import reportRoutes from './reportRoutes.js';
import salaryRoutes from './salaryRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js'; // إضافة هذا

const router = express.Router();

// المسارات الأساسية
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/products', productRoutes);
router.use('/stores', storeRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/supplies', supplyRoutes);
router.use('/customers', customerRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/windows', sellingWindowRoutes);
router.use('/transfers', transferRoutes);
router.use('/reports', reportRoutes);
router.use('/salaries', salaryRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes); // إضافة هذا

export default router;
