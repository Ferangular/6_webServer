import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/index.js';
import { UserModel } from '../../data/index.js';
import { UserEntity } from '../../domain/index.js';

export class AuthMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authorization = req.header('Authorization');
        if (!authorization) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const [type, token, extra] = authorization.trim().split(/\s+/);
        if (type !== 'Bearer' || !token || extra) {
            res.status(401).json({ error: 'Invalid Bearer token' });
            return;
        }

        try {
            const payload = await JwtAdapter.validateToken<{ id?: string }>(token);
            if (!payload?.id) {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }
            const user = await UserModel.findById(payload.id);
            if (!user) {
                res.status(401).json({ error: 'Invalid token user' });
                return;
            }
            res.locals.user = UserEntity.fromObject(user.toObject());
            next();
        } catch {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}