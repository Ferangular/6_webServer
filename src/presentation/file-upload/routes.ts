import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware.js';
import { TypeMiddleware } from '../middlewares/type.middleware.js';
import { FileUploadService } from '../services/file-upload.service.js';
import { FileUploadController } from './controller.js';

const validTypes = ['users', 'products', 'categories'] as const;

export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new FileUploadController(new FileUploadService());
        router.use(AuthMiddleware.validateJWT);
        router.post('/single/:type', TypeMiddleware.validTypes(validTypes), FileUploadMiddleware.containFiles, controller.uploadFile);
        router.post('/multiple/:type', TypeMiddleware.validTypes(validTypes), FileUploadMiddleware.containFiles, controller.uploadMultipleFiles);
        return router;
    }
}