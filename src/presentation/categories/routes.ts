import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { CategoryService } from '../services/category.service.js';
import { CategoryController } from './controller.js';

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new CategoryController(new CategoryService());
        router.get('/', controller.getCategories);
        router.post('/', AuthMiddleware.validateJWT, controller.createCategory);
        return router;
    }
}