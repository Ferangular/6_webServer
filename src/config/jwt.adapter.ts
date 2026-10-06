import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from './envs.js';

export class JwtAdapter {
    static generateToken(payload: object, duration: SignOptions['expiresIn'] = '2h'): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (error, token) => {
                resolve(error ? null : token ?? null);
            });
        });
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (error, decoded) => {
                resolve(error ? null : decoded as T);
            });
        });
    }
}
