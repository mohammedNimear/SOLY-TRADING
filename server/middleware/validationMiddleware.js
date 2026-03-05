import { createError } from '../utils/error.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(createError(400, error.details[0].message));
        }
        next();
    };
};
