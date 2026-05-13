import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateFields = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const errors = validationResult(req);

    if ( errors.isEmpty() ) {
        next();
        return;
    }

    res.status(400).json({
        ok: false,
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation error',
        details: errors.array().map(error => ({
            field: error.type === 'field' ? error.path : undefined,
            message: error.msg,
            location: error.type === 'field' ? error.location : undefined,
            value: error.type === 'field' ? error.value : undefined,
        })),
    });
};