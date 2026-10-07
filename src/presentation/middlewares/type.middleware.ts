import { NextFunction, Request, Response } from 'express';

export class TypeMiddleware {
    static validTypes(validTypes: readonly string[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            const type = req.params.type;
            if (typeof type !== 'string' || !validTypes.includes(type)) {
                res.status(400).json({ error: `Invalid type: ${String(type)}, valid ones: ${validTypes.join(', ')}` });
                return;
            }
            next();
        };
    }
}