import { Router } from 'express';
import { AuthRoutes } from './auth/routes.js';
import { CategoryRoutes } from './categories/routes.js';
import { ProductRoutes } from './products/routes.js';
import { FileUploadRoutes } from './file-upload/routes.js';
import { ImageRoutes } from './images/routes.js';
import { TodoRoutes } from './todos/routes.js';
import { GithubRoutes } from './github/routes.js';
import { TicketRoutes } from './tickets/routes.js';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/categories', CategoryRoutes.routes);
        router.use('/api/products', ProductRoutes.routes);
        router.use('/api/upload', FileUploadRoutes.routes);
        router.use('/api/images', ImageRoutes.routes);
        router.use('/api/todos', TodoRoutes.routes);
        router.use('/api/github', GithubRoutes.routes);
        router.use('/api/ticket', TicketRoutes.routes);
        return router;
    }
}