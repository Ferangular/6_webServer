import { Request, Response } from 'express';
import { prisma } from '../../data/index.js';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo.dto.js';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto.js';

export class TodosController {

    //* DI
    constructor() { }

    public getTodos = async( req: Request, res: Response ) => {
        const todos = await prisma.todo.findMany();
        return res.json( todos );
    };

    public getTodoById = async( req: Request, res: Response ) => {
        const idParam = req.params.id;

        if ( !idParam ) {
            return res.status( 400 ).json( { error: 'ID argument is required' } );
        }

        const id = +idParam;

        if ( isNaN( id ) ) {
            return res.status( 400 ).json( { error: 'ID argument is not a number' } );
        }

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        return ( todo )
            ? res.json( todo )
            : res.status( 404 ).json( { error: `TODO with id ${ id } not found` } );
    };

    public createTodo = async( req: Request, res: Response ) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        return res.json( todo );
    };

    public updateTodo = async ( req: Request, res: Response ): Promise<void> => {

        const idParam = req.params.id;

        if ( !idParam ) {
            res.status(400).json({ error: 'ID argument is required' });
            return;
        }

        const id = Number(idParam);

        const [ error, updateTodoDto ] = UpdateTodoDto.create({
            ...req.body,
            id,
        });

        if ( error || !updateTodoDto ) {
            res.status(400).json({ error });
            return;
        }

        const todo = await prisma.todo.findFirst({
            where: { id },
        });

        if ( !todo ) {
            res.status(404).json({
                error: `Todo with id ${ id } not found`,
            });
            return;
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto.values,
        });

        res.json( updatedTodo );
    };

    public deleteTodo = async(req: Request, res: Response) => {
        const idParam = req.params.id;

        if ( !idParam ) {
            return res.status( 400 ).json( { error: 'ID argument is required' } );
        }

        const id = +idParam;

        if ( isNaN( id ) ) {
            return res.status( 400 ).json( { error: 'ID argument is not a number' } );
        }

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if ( !todo ) return res.status(404).json({ error: `Todo with id ${ id } not found` });

        const deleted = await prisma.todo.delete({
            where: { id }
        });

        return ( deleted )
            ? res.json( deleted )
            : res.status(400).json({ error: `Todo with id ${ id } not found` });
    };

}