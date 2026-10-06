import { Router } from 'express';
import { envs } from '../../config/index.js';
import { AuthService } from '../services/auth.service.js';
import { EmailService } from '../services/email.service.js';
import { AuthController } from './controller.js';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
        const controller = new AuthController(new AuthService(emailService));

        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);
        router.get('/validate-email/:token', controller.validateEmail);
        return router;
    }
}