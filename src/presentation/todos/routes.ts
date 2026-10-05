import { Router } from 'express';
import { TodoDatasourceImpl } from '../../infrastructure/datasources/todo.datasource.impl.js';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl.js';
import { TodosController } from './controller.js';

export class TodoRoutes {
    static get routes(): Router {
        const router = Router();
        const datasource = new TodoDatasourceImpl();
        const repository = new TodoRepositoryImpl(datasource);
        const controller = new TodosController(repository);

        router.get('/', controller.getTodos);
        router.get('/:id', controller.getTodoById);
        router.post('/', controller.createTodo);
        router.put('/:id', controller.updateTodo);
        router.delete('/:id', controller.deleteTodo);

        return router;
    }
}