import { Request, Response } from 'express';
import { CreateTodo, CreateTodoDto, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo, UpdateTodoDto } from '../../domain/index.js';

export class TodosController {
    constructor(private readonly todoRepository: TodoRepository) {}

    private handleError = (error: unknown, res: Response): void => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    };

    public getTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            res.json(await new GetTodos(this.todoRepository).execute());
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getTodoById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID argument must be a positive integer' });
            return;
        }
        try {
            res.json(await new GetTodo(this.todoRepository).execute(id));
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public createTodo = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = CreateTodoDto.create(req.body);
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.status(201).json(await new CreateTodo(this.todoRepository).execute(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };

    public updateTodo = async (req: Request, res: Response): Promise<void> => {
        const [error, dto] = UpdateTodoDto.create({ ...req.body, id: req.params.id });
        if (error || !dto) {
            res.status(400).json({ error });
            return;
        }
        try {
            res.json(await new UpdateTodo(this.todoRepository).execute(dto));
        } catch (caughtError) {
            this.handleError(caughtError, res);
        }
    };

    public deleteTodo = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID argument must be a positive integer' });
            return;
        }
        try {
            res.json(await new DeleteTodo(this.todoRepository).execute(id));
        } catch (error) {
            this.handleError(error, res);
        }
    };
}