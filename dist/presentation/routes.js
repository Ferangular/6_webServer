import { Router } from 'express';
import { TodoRoutes } from './todos/routes.js';
export class AppRoutes {
    static get routes() {
        const router = Router();
        router.use('/api/todos', TodoRoutes.routes);
        return router;
    }
}
//# sourceMappingURL=routes.js.map