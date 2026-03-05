import Joi from 'joi';

export const userRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.min': 'الاسم يجب أن يكون 3 أحرف على الأقل',
        'string.max': 'الاسم لا يمكن أن يتجاوز 50 حرف',
        'any.required': 'الاسم مطلوب'
    }),
    
    email: Joi.string().email().required().messages({
        'string.email': 'الرجاء إدخال بريد إلكتروني صحيح',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    
    password: Joi.string().min(6).required().messages({
        'string.min': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    
    employeeId: Joi.string().required().messages({
        'any.required': 'معرف الموظف مطلوب'
    }),
    
    role: Joi.string().valid('admin', 'manager', 'employee', 'viewer').default('employee')
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'الرجاء إدخال بريد إلكتروني صحيح',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    
    password: Joi.string().required().messages({
        'any.required': 'كلمة المرور مطلوبة'
    })
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid('admin', 'manager', 'employee', 'viewer'),
    isActive: Joi.boolean()
});
