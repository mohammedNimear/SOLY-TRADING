
import express from 'express';
import {
    createSale,
    deleteSale,
    getAllSales,
    getSale,
    updateSale,
    getCashTotals,
    getSalesDetails,
    getCashSalesDetails,
    getCreditSalesDetails,
    getDistributionSalesDetails,
    getChartDetails
} from '../controllers/sales.js';
import { verifyAdmin, verifyUser } from '../middleware/verfiyToken.js';

const router = express.Router();

// ========== العمليات الأساسية ==========
// إنشاء فاتورة: مستخدم عادي
router.post('/', verifyUser, createSale);

// تحديث فاتورة: مستخدم عادي (مع تحديد الحقول المسموحة في المتحكم)
router.put('/:id', verifyUser, updateSale);

// حذف فاتورة: مشرف (بسبب التحقق من الآجلة غير المسددة)
router.delete('/:id', verifyAdmin, deleteSale);

// جلب فاتورة واحدة: مستخدم عادي
router.get('/find/:id', verifyUser, getSale);

// جلب جميع الفواتير مع البحث والترقيم: مشرف
router.get('/', verifyAdmin, getAllSales);

// ========== التقارير والإحصائيات ==========
// جميع المسارات التالية تحتاج مشرف (لأنها تظهر بيانات حساسة)

// إجماليات الخزنة (نقدي، آجل، مدفوع، متبقي)
router.get('/cash/totals', verifyAdmin, getCashTotals);

// تفاصيل المبيعات (يومية) مع نطاق تاريخي
router.get('/details', verifyAdmin, getSalesDetails);

// تفاصيل المبيعات النقدية
router.get('/details/cash', verifyAdmin, getCashSalesDetails);

// تفاصيل المبيعات الآجلة
router.get('/details/credit', verifyAdmin, getCreditSalesDetails);

// توزيع المبيعات حسب طريقة الدفع
router.get('/details/distribution', verifyAdmin, getDistributionSalesDetails);

// بيانات الرسم البياني (آخر 7 أيام افتراضياً)
router.get('/chart', verifyAdmin, getChartDetails);

export default router;
