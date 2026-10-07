import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { ProductService } from '../services/product.service.js';
import { ProductController } from './controller.js';

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ProductController(new ProductService());
        router.get('/', controller.getProducts);
        router.post('/', AuthMiddleware.validateJWT, controller.createProduct);
        return router;
    }
}