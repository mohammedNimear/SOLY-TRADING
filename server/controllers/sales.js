// متحكمات المبيعات (الفواتير) - إنشاء، قراءة، تحديث، حذف، وإحصائيات متقدمة

import Sale from '../models/Sale.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';
import mongoose from 'mongoose';

export const createSale = async (req, res, next) => {
    try {
        const { store, employer, customer, products } = req.body;

        const storeDoc = await Store.findById(store).populate('products.product');
        if (!storeDoc) {
            return next(createError(404, 'المخزن غير موجود'));
        }

        for (const item of products) {
            const storeProduct = storeDoc.products.find(p => p.product._id.toString() === item.product);
            if (!storeProduct || storeProduct.quantity < item.quantity) {
                return next(createError(400, `المنتج ${item.productName || 'غير معروف'} غير متوفر بالكمية المطلوبة`));
            }
        }

        const newSale = new Sale(req.body);
        const savedSale = await newSale.save();

        const populatedSale = await Sale.findById(savedSale._id)
            .populate('employer', 'name')
            .populate('customer', 'name phone')
            .populate('store', 'name')
            .populate('products.product', 'name price sku');

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الفاتورة بنجاح',
            data: populatedSale
        });
    } catch (err) {
        next(err);
    }
};

export const updateSale = async (req, res, next) => {
    try {
        const allowedUpdates = ['note', 'status', 'payed', 'rest_money', 'paymentDate'];
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const updatedSale = await Sale.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).populate('employer', 'name')
         .populate('customer', 'name phone')
         .populate('store', 'name')
         .populate('products.product', 'name price sku');

        if (!updatedSale) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        res.status(200).json({
            success: true,
            message: 'تم تحديث الفاتورة بنجاح',
            data: updatedSale
        });
    } catch (err) {
        next(err);
    }
};

export const deleteSale = async (req, res, next) => {
    try {
        const saleId = req.params.id;
        const sale = await Sale.findById(saleId);

        if (!sale) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        if (sale.paymentMethod === 'أجل' && sale.rest_money > 0) {
            return next(createError(400, 'لا يمكن حذف فاتورة آجلة غير مسددة'));
        }

        await Sale.findByIdAndDelete(saleId);

        res.status(200).json({
            success: true,
            message: 'تم حذف الفاتورة بنجاح'
        });
    } catch (err) {
        next(err);
    }
};

export const getSale = async (req, res, next) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('employer', 'name')
            .populate('customer', 'name phone address taxNumber')
            .populate('store', 'name location')
            .populate('products.product', 'name price sku description');

        if (!sale) {
            return next(createError(404, 'الفاتورة غير موجودة'));
        }

        res.status(200).json({
            success: true,
            data: sale
        });
    } catch (err) {
        next(err);
    }
};

export const getAllSales = async (req, res, next) => {
    try {
        let { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc', paymentMethod, status } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        let query = {};

        if (paymentMethod) query.paymentMethod = paymentMethod;
        if (status) query.status = status;

        if (search) {
            query.$or = [
                { note: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Sale.countDocuments(query);
        const sales = await Sale.find(query)
            .populate('employer', 'name')
            .populate('customer', 'name phone')
            .populate('store', 'name')
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(limit);

        const pages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: sales,
            total,
            page,
            pages,
            limit
        });
    } catch (err) {
        next(err);
    }
};

// دوال الإحصائيات
export const getCashTotals = async (req, res, next) => {
    try {
        const result = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalCash: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'نقدي'] }, '$totalPrice', 0] } },
                    totalCredit: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'أجل'] }, '$totalPrice', 0] } },
                    totalPayed: { $sum: '$payed' },
                    totalRest: { $sum: '$rest_money' }
                }
            }
        ]);

        const totals = result[0] || { totalCash: 0, totalCredit: 0, totalPayed: 0, totalRest: 0 };

        res.status(200).json({
            success: true,
            data: totals
        });
    } catch (err) {
        next(err);
    }
};

export const getSalesDetails = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const details = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    total: { $sum: '$totalPrice' },
                    cashTotal: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'نقدي'] }, '$totalPrice', 0] } },
                    creditTotal: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'أجل'] }, '$totalPrice', 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (err) {
        next(err);
    }
};

export const getCashSalesDetails = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = { paymentMethod: 'نقدي' };
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const details = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    total: { $sum: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (err) {
        next(err);
    }
};

export const getCreditSalesDetails = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = { paymentMethod: 'أجل' };
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const details = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    total: { $sum: '$totalPrice' },
                    totalRest: { $sum: '$rest_money' },
                    totalPayed: { $sum: '$payed' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (err) {
        next(err);
    }
};

export const getDistributionSalesDetails = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const distribution = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$paymentMethod',
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: distribution
        });
    } catch (err) {
        next(err);
    }
};

export const getChartDetails = async (req, res, next) => {
    try {
        const { days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const chartData = await Sale.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    totalSales: { $sum: '$totalPrice' },
                    cashSales: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'نقدي'] }, '$totalPrice', 0] } },
                    creditSales: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'أجل'] }, '$totalPrice', 0] } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (err) {
        next(err);
    }
};
