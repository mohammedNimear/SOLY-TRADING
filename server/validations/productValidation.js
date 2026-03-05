import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'اسم المنتج مطلوب'
    }),
    
    description: Joi.string().allow(''),
    
    price: Joi.number().positive().required().messages({
        'number.positive': 'السعر يجب أن يكون رقم موجب',
        'any.required': 'السعر مطلوب'
    }),
    
    cost: Joi.number().min(0).default(0),
    
    category: Joi.string().required().messages({
        'any.required': 'الفئة مطلوبة'
    }),
    
    sku: Joi.string().optional(),
    
    supplier: Joi.string().optional()
});

export const updateProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(''),
    price: Joi.number().positive(),
    cost: Joi.number().min(0),
    category: Joi.string(),
    sku: Joi.string().optional(),
    supplier: Joi.string().optional()
});
