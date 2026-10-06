import { Router } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from './controller.js';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new AuthController(new AuthService());
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);
        return router;
    }
}
