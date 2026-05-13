import { Request, Response } from 'express';

export const notFound = (
    req: Request,
    res: Response
): void => {

    res.status(404).json({
        ok: false,
        statusCode: 404,
        error: 'Route not found',
        path: req.originalUrl,
    });
};