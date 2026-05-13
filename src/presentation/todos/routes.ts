import { Router } from 'express';

import { TodosController } from './controller.js';
import { TodoValidators } from './validators.js';

export class TodoRoutes {

    static get routes(): Router {

        const router = Router();

        const todoController = new TodosController();

        router.get(
            '/',
            todoController.getTodos
        );

        router.get(
            '/:id',
            TodoValidators.getTodoById,
            todoController.getTodoById
        );

        router.post(
            '/',
            TodoValidators.createTodo,
            todoController.createTodo
        );

        router.put(
            '/:id',
            TodoValidators.updateTodo,
            todoController.updateTodo
        );

        router.delete(
            '/:id',
            TodoValidators.deleteTodo,
            todoController.deleteTodo
        );

        return router;
    }
}