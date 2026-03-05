import Transfer from '../models/Transfer.js';
import Store from '../models/Store.js';
import SellingWindow from '../models/SellingWindow.js';
import Product from '../models/Product.js';
import { createError } from '../utils/error.js';

// إنشاء تحويل جديد
export const createTransfer = async (req, res, next) => {
    try {
        const { fromType, from, toType, to, items, notes } = req.body;
        
        // التحقق من المصدر
        let fromDoc;
        if (fromType === 'store') {
            fromDoc = await Store.findById(from);
        } else if (fromType === 'sellingWindow') {
            fromDoc = await SellingWindow.findById(from);
        }

        if (!fromDoc) {
            return next(createError(404, 'المصدر غير موجود'));
        }

        // التحقق من الوجهة
        let toDoc;
        if (toType === 'store') {
            toDoc = await Store.findById(to);
        } else if (toType === 'sellingWindow') {
            toDoc = await SellingWindow.findById(to);
        }

        if (!toDoc) {
            return next(createError(404, 'الوجهة غير موجودة'));
        }

        // التحقق من توفر المنتجات في المصدر
        const transferItems = [];
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(createError(404, `المنتج ${item.product} غير موجود`));
            }

            // التحقق من توفر الكمية
            const sourceProduct = fromDoc.products.find(p => p.product.toString() === item.product);
            if (!sourceProduct || sourceProduct.quantity < item.quantity) {
                return next(createError(400, `الكمية غير متوفرة للمنتج ${product.name}`));
            }

            transferItems.push({
                product: item.product,
                quantity: item.quantity
            });
        }

        // إنشاء رقم التحويل
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const count = await Transfer.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999))
            }
        });
        const transferId = `TRF-${dateStr}-${String(count + 1).padStart(4, '0')}`;

        const transfer = await Transfer.create({
            transferId,
            fromType,
            from,
            fromTypeModel: fromType === 'store' ? 'Store' : 'SellingWindow',
            toType,
            to,
            toTypeModel: toType === 'store' ? 'Store' : 'SellingWindow',
            items: transferItems,
            notes,
            approvedBy: req.user.employee
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء التحويل بنجاح',
            transfer
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على جميع التحويلات
export const getAllTransfers = async (req, res, next) => {
    try {
        const { status, fromType, toType } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (fromType) filter.fromType = fromType;
        if (toType) filter.toType = toType;

        const transfers = await Transfer.find(filter)
            .populate('from', 'name')
            .populate('to', 'name')
            .populate('items.product', 'name')
            .populate('approvedBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transfers.length,
            transfers
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على التحويلات المعلقة
export const getPendingTransfers = async (req, res, next) => {
    try {
        const transfers = await Transfer.find({ status: 'pending' })
            .populate('from', 'name')
            .populate('to', 'name')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transfers.length,
            transfers
        });
    } catch (error) {
        next(error);
    }
};

// الحصول على تحويل بواسطة ID
export const getTransferById = async (req, res, next) => {
    try {
        const transfer = await Transfer.findById(req.params.id)
            .populate('from', 'name')
            .populate('to', 'name')
            .populate('items.product', 'name')
            .populate('approvedBy', 'name');
        
        if (!transfer) {
            return next(createError(404, 'التحويل غير موجود'));
        }

        res.status(200).json({
            success: true,
            transfer
        });
    } catch (error) {
        next(error);
    }
};

// الموافقة على التحويل
export const approveTransfer = async (req, res, next) => {
    try {
        const { status, notes } = req.body; // status: 'approved' أو 'rejected'
        
        const transfer = await Transfer.findById(req.params.id);
        if (!transfer) {
            return next(createError(404, 'التحويل غير موجود'));
        }

        if (transfer.status !== 'pending') {
            return next(createError(400, 'التحويل موثق بالفعل'));
        }

        transfer.status = status;
        transfer.approvedBy = req.user.employee;
        transfer.completedAt = Date.now();
        if (notes) transfer.notes = notes;

        await transfer.save();

        // إذا تم الموافقة، تحديث الكميات
        if (status === 'approved') {
            let fromDoc, toDoc;
            
            // الحصول على المستندات المصدر والوجهة
            if (transfer.fromType === 'store') {
                fromDoc = await Store.findById(transfer.from);
            } else {
                fromDoc = await SellingWindow.findById(transfer.from);
            }

            if (transfer.toType === 'store') {
                toDoc = await Store.findById(transfer.to);
            } else {
                toDoc = await SellingWindow.findById(transfer.to);
            }

            if (fromDoc && toDoc) {
                // خصم الكميات من المصدر
                for (let item of transfer.items) {
                    const fromProductIndex = fromDoc.products.findIndex(
                        p => p.product.toString() === item.product.toString()
                    );
                    if (fromProductIndex > -1) {
                        fromDoc.products[fromProductIndex].quantity -= item.quantity;
                    }
                }

                // إضافة الكميات إلى الوجهة
                for (let item of transfer.items) {
                    const toProductIndex = toDoc.products.findIndex(
                        p => p.product.toString() === item.product.toString()
                    );
                    if (toProductIndex > -1) {
                        toDoc.products[toProductIndex].quantity += item.quantity;
                    } else {
                        toDoc.products.push({
                            product: item.product,
                            quantity: item.quantity
                        });
                    }
                }

                await Promise.all([fromDoc.save(), toDoc.save()]);
            }
        }

        res.status(200).json({
            success: true,
            message: `تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} التحويل بنجاح`,
            transfer
        });
    } catch (error) {
        next(error);
    }
};
