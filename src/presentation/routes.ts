import { Router } from 'express';
import { AuthRoutes } from './auth/routes.js';
import { TodoRoutes } from './todos/routes.js';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/todos', TodoRoutes.routes);
        return router;
    }
}