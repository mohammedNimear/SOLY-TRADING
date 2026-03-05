import Invoice from '../models/Invoice.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { createError } from '../utils/error.js';
import User from '../models/User.js';        // إضافة هذا السطر
import Employee from '../models/Employee.js'; // تأكد من هذا أيضاً
import Supply from '../models/Supply.js';


// الحصول على إحصائيات لوحة التحكم
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // إحصائيات المبيعات اليومية
    const dailySales = await Invoice.find({
      createdAt: { $gte: today },
      status: 'مدفوعة'
    });
    
    const dailySalesTotal = dailySales.reduce((sum, inv) => sum + inv.total, 0);
    
    // إحصائيات المخزون
    const stores = await Store.find().populate('products.product');
    let totalInventoryValue = 0;
    let lowStockProducts = 0;
    
    stores.forEach(store => {
      store.products.forEach(productItem => {
        if (productItem.product && productItem.product.price) {
          totalInventoryValue += productItem.quantity * productItem.product.price;
          if (productItem.quantity <= 5) { // كمية حرجة
            lowStockProducts++;
          }
        }
      });
    });
    
    // إحصائيات العملاء
    const activeCustomers = await Customer.countDocuments({ isActive: true });
    const pendingInvoices = await Invoice.countDocuments({ status: 'معلقة' });
    
    // إجمالي المبيعات والآجلة
    const allInvoices = await Invoice.find();
    const totalSales = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalDue = allInvoices.reduce((sum, inv) => {
      return sum + (inv.total - inv.paidAmount);
    }, 0);

    res.status(200).json({
      success: true,
      stats: [
        {
          title: 'صندوق النقد',
          value: dailySalesTotal.toLocaleString('ar-EG'),
          currency: 'SDG',
          icon: 'Wallet',
          change: 'اليوم الحالي'
        },
        {
          title: 'إجمالي المبيعات',
          value: totalSales.toLocaleString('ar-EG'),
          currency: 'SDG',
          icon: 'TrendingUp',
          change: 'منذ البداية'
        },
        {
          title: 'المبيعات الآجلة',
          value: totalDue.toLocaleString('ar-EG'),
          currency: 'SDG',
          icon: 'CreditCard',
          change: 'المستحقات الحالية'
        },
        {
          title: 'المنتجات الحرجة',
          value: lowStockProducts.toString(),
          icon: 'AlertTriangle',
          change: 'كمية أقل من 5 وحدات'
        }
      ]
    });
  } catch (error) {
    next(error);
  }
};

// الحصول على الأنشطة الأخيرة
export const getRecentActivities = async (req, res, next) => {
  try {
    const { limit = 10, type } = req.query;
    
    let activities = [];
    
    if (!type || type === 'sales' || type === 'all') {
      // أحدث الفواتير
      const recentInvoices = await Invoice.find()
        .populate('customer', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      activities = activities.concat(recentInvoices.map(inv => ({
        id: inv._id,
        type: 'فاتورة',
        customer: inv.customer ? inv.customer.name : 'عميل نقدي',
        amount: inv.total,
        time: inv.createdAt.toLocaleString('ar-EG'),
        status: inv.status
      })));
    }
    
    if (!type || type === 'products' || type === 'all') {
      // أحدث المنتجات
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      activities = activities.concat(recentProducts.map(prod => ({
        id: prod._id,
        type: 'منتج',
        name: prod.name,
        price: prod.price,
        time: prod.createdAt.toLocaleString('ar-EG')
      })));
    }

    // ترتيب حسب التاريخ
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities = activities.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
};

// الحصول على المنتجات الحرجة
export const getCriticalProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    // جلب جميع المخازن مع المنتجات
    const stores = await Store.find().populate('products.product');
    
    let criticalProductsMap = new Map();
    
    stores.forEach(store => {
      store.products.forEach(productItem => {
        if (productItem.product && productItem.quantity <= 5) {
          const productId = productItem.product._id.toString();
          if (!criticalProductsMap.has(productId)) {
            criticalProductsMap.set(productId, {
              id: productItem.product._id,
              name: productItem.product.name,
              quantity: productItem.quantity,
              minStock: 5,
              store: store.name
            });
          } else {
            // جمع الكميات من جميع المخازن
            const existing = criticalProductsMap.get(productId);
            existing.quantity += productItem.quantity;
          }
        }
      });
    });

    // تحويل الـ Map إلى مصفوفة
    let criticalProducts = Array.from(criticalProductsMap.values());
    
    // ترتيب حسب الكمية (الأقل أولاً)
    criticalProducts.sort((a, b) => a.quantity - b.quantity);
    criticalProducts = criticalProducts.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      products: criticalProducts
    });
  } catch (error) {
    next(error);
  }
};
// الحصول على بيانات الهيدر
export const getHeaderData = async (req, res, next) => {
  try {
    // بيانات المستخدم الحالي
    const user = await User.findById(req.user.id)
      .populate('employee', 'name position role salary');

    // إحصائيات سريعة
    const pendingInvoices = await Invoice.countDocuments({ status: 'معلقة' });
    const pendingSupplies = await Supply.countDocuments({ status: 'معلق' });
    const criticalProducts = await getLowStockCount(); // دالة تحسب المنتجات الحرجة
    const unreadNotifications = 0; // يمكن تطوير هذا لاحقاً

    res.status(200).json({
      success: true,
      headerData: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employee: user.employee ? {
            name: user.employee.name,
            position: user.employee.position,
            role: user.employee.role
          } : null
        },
        quickStats: {
          pendingInvoices,
          pendingSupplies,
          criticalProducts,
          unreadNotifications
        },
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// دالة مساعدة لحساب المنتجات الحرجة
const getLowStockCount = async () => {
  try {
    const stores = await Store.find().populate('products.product');
    let count = 0;
    
    stores.forEach(store => {
      store.products.forEach(productItem => {
        if (productItem.quantity <= 5) { // كمية حرجة
          count++;
        }
      });
    });
    
    return count;
  } catch (error) {
    return 0;
  }
};