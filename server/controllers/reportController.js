import Invoice from '../models/Invoice.js';
import Store from '../models/Store.js';
import SellingWindow from '../models/SellingWindow.js';
import Product from '../models/Product.js';
import Employee from '../models/Employee.js';
import Customer from '../models/Customer.js';
import Supply from '../models/Supply.js';
import { createError } from '../utils/error.js';

// تقرير المبيعات
export const getSalesReport = async (req, res, next) => {
    try {
        const { startDate, endDate, storeId } = req.query;
        
        let dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        let filter = {};
        if (Object.keys(dateFilter).length > 0) {
            filter.createdAt = dateFilter;
        }
        if (storeId) filter.store = storeId;

        const invoices = await Invoice.find(filter);
        
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const totalDue = totalSales - totalPaid;

        // تحليل حسب طريقة الدفع
        const paymentMethods = {};
        invoices.forEach(invoice => {
            if (!paymentMethods[invoice.paymentMethod]) {
                paymentMethods[invoice.paymentMethod] = { count: 0, amount: 0 };
            }
            paymentMethods[invoice.paymentMethod].count++;
            paymentMethods[invoice.paymentMethod].amount += invoice.total;
        });

        res.status(200).json({
            success: true,
            report: {
                period: { startDate, endDate },
                totals: {
                    totalInvoices: invoices.length,
                    totalSales,
                    totalPaid,
                    totalDue
                },
                paymentMethods,
                topStores: await getTopStores(invoices)
            }
        });
    } catch (error) {
        next(error);
    }
};

// تقرير المخزون
export const getInventoryReport = async (req, res, next) => {
    try {
        const stores = await Store.find().populate('products.product', 'name price cost');
        const windows = await SellingWindow.find().populate('products.product', 'name price cost');

        let inventorySummary = [];
        let totalValue = 0;

        // تجميع بيانات المخازن
        stores.forEach(store => {
            store.products.forEach(productItem => {
                if (productItem.product) {
                    const value = productItem.quantity * productItem.product.price;
                    totalValue += value;
                    inventorySummary.push({
                        location: store.name,
                        product: productItem.product.name,
                        quantity: productItem.quantity,
                        price: productItem.product.price,
                        value
                    });
                }
            });
        });

        // تجميع بيانات النوافذ
        windows.forEach(window => {
            window.products.forEach(productItem => {
                if (productItem.product) {
                    const value = productItem.quantity * productItem.product.price;
                    totalValue += value;
                    inventorySummary.push({
                        location: window.name,
                        product: productItem.product.name,
                        quantity: productItem.quantity,
                        price: productItem.product.price,
                        value
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            report: {
                totalValue,
                items: inventorySummary,
                summary: {
                    totalLocations: stores.length + windows.length,
                    totalProducts: [...new Set(inventorySummary.map(item => item.product))].length
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// التقرير المالي
export const getFinancialReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        let dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        // المبيعات
        const salesFilter = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        const invoices = await Invoice.find(salesFilter);
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalSalesPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

        // المشتريات
        const supplyFilter = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};
        const supplies = await Supply.find(supplyFilter);
        const totalPurchases = supplies.reduce((sum, sup) => sum + sup.totalAmount, 0);

        // حساب الأرباح (بسيط)
        const profit = totalSalesPaid - totalPurchases;

        res.status(200).json({
            success: true,
            report: {
                period: { startDate, endDate },
                income: {
                    totalSales,
                    totalReceived: totalSalesPaid
                },
                expenses: {
                    totalPurchases
                },
                profit,
                cashFlow: totalSalesPaid - totalPurchases
            }
        });
    } catch (error) {
        next(error);
    }
};

// تقرير الموظفين
export const getEmployeeReport = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user', 'email role');
        
        const employeeStats = await Promise.all(employees.map(async employee => {
            // حساب عدد الفواتير التي أنشأها
            const invoiceCount = await Invoice.countDocuments({ createdBy: employee.user });
            
            // حساب عدد التوريدات التي قام بها
            const supplyCount = await Supply.countDocuments({ employee: employee._id });

            return {
                id: employee._id,
                name: employee.name,
                position: employee.position,
                role: employee.user ? employee.user.role : 'غير مرتبط',
                hireDate: employee.hireDate,
                isActive: employee.isActive,
                performance: {
                    invoicesCreated: invoiceCount,
                    suppliesCreated: supplyCount
                }
            };
        }));

        res.status(200).json({
            success: true,
            report: {
                totalEmployees: employees.length,
                activeEmployees: employees.filter(e => e.isActive).length,
                employees: employeeStats
            }
        });
    } catch (error) {
        next(error);
    }
};

// تقرير العملاء
export const getCustomerReport = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        
        const customerStats = await Promise.all(customers.map(async customer => {
            // حساب عدد الفواتير
            const invoices = await Invoice.find({ customer: customer._id });
            const totalInvoices = invoices.length;
            const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
            const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
            const outstanding = totalAmount - totalPaid;

            return {
                id: customer._id,
                name: customer.name,
                type: customer.type,
                creditLimit: customer.creditLimit,
                totalInvoices,
                totalAmount,
                totalPaid,
                outstanding,
                isActive: customer.isActive
            };
        }));

        res.status(200).json({
            success: true,
            report: {
                totalCustomers: customers.length,
                activeCustomers: customers.filter(c => c.isActive).length,
                customers: customerStats
            }
        });
    } catch (error) {
        next(error);
    }
};

// تقرير أداء المنتجات
export const getProductPerformanceReport = async (req, res, next) => {
    try {
        const products = await Product.find();
        
        const productStats = await Promise.all(products.map(async product => {
            // حساب عدد مرات البيع
            const invoiceItems = await Invoice.aggregate([
                { $unwind: "$items" },
                { $match: { "items.product": product._id } },
                { $group: { 
                    _id: null, 
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: "$items.totalPrice" }
                }}
            ]);

            const stats = invoiceItems[0] || { totalQuantity: 0, totalRevenue: 0 };
            const profit = stats.totalRevenue - (stats.totalQuantity * (product.cost || 0));

            return {
                id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                cost: product.cost,
                unitsSold: stats.totalQuantity,
                revenue: stats.totalRevenue,
                profit,
                profitMargin: product.price > 0 ? ((product.price - product.cost) / product.price * 100) : 0
            };
        }));

        // ترتيب حسب الأرباح
        productStats.sort((a, b) => b.profit - a.profit);

        res.status(200).json({
            success: true,
            report: {
                topPerforming: productStats.slice(0, 10),
                bottomPerforming: productStats.slice(-10),
                totalProducts: productStats.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// دالة مساعدة للحصول على أفضل المخازن
const getTopStores = async (invoices) => {
    const storeTotals = {};
    
    invoices.forEach(invoice => {
        if (invoice.store) {
            if (!storeTotals[invoice.store]) {
                storeTotals[invoice.store] = { total: 0, count: 0 };
            }
            storeTotals[invoice.store].total += invoice.total;
            storeTotals[invoice.store].count++;
        }
    });

    return storeTotals;
};
