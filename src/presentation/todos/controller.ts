import { Request, Response } from 'express';
import { prisma } from '../../data/postgres/index.js';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos/index.js';

export class TodosController {
    constructor() { }

    public getTodos = async (req: Request, res: Response): Promise<void> => {
        const todos = await prisma.todo.findMany({ orderBy: { id: 'asc' } });
        res.json(todos);
    };

    public getTodoById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID argument must be a positive integer' });
            return;
        }
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
            res.status(404).json({ error: `TODO with id ${id} not found` });
            return;
        }
        res.json(todo);
    };

    public createTodo = async (req: Request, res: Response): Promise<void> => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error || !createTodoDto) {
            res.status(400).json({ error });
            return;
        }
        const todo = await prisma.todo.create({ data: createTodoDto });
        res.status(201).json(todo);
    };

    public updateTodo = async (req: Request, res: Response): Promise<void> => {
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id: req.params.id });
        if (error || !updateTodoDto) {
            res.status(400).json({ error });
            return;
        }
        const existingTodo = await prisma.todo.findUnique({ where: { id: updateTodoDto.id } });
        if (!existingTodo) {
            res.status(404).json({ error: `Todo with id ${updateTodoDto.id} not found` });
            return;
        }
        const todo = await prisma.todo.update({ where: { id: updateTodoDto.id }, data: updateTodoDto.values });
        res.json(todo);
    };

    public deleteTodo = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'ID argument must be a positive integer' });
            return;
        }
        const existingTodo = await prisma.todo.findUnique({ where: { id } });
        if (!existingTodo) {
            res.status(404).json({ error: `Todo with id ${id} not found` });
            return;
        }
        const todo = await prisma.todo.delete({ where: { id } });
        res.json(todo);
    };
}
