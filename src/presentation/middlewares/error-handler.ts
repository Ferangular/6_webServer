import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    console.error(err);

    res.status(500).json({
        ok: false,
        statusCode: 500,
        error: 'Internal Server Error',
    });
};