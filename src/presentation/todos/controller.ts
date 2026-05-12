import { Request, Response } from 'express';

const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date(), deleted: false },
    { id: 2, text: 'Buy bread', completedAt: null, deleted: false },
    { id: 3, text: 'Buy butter', completedAt: new Date(), deleted: false },
];

export class TodosController {

    //* DI
    constructor() { }


    public getTodos = ( req: Request, res: Response ) => {
        const { status } = req.query;

        let filteredTodos = todos;

        if (status === 'active') {
            filteredTodos = todos.filter(todo => !todo.deleted);
        } else if (status === 'deleted') {
            filteredTodos = todos.filter(todo => todo.deleted);
        }

        return res.json( filteredTodos );
    };

    public getTodoById = ( req: Request, res: Response ): void => {

        const id = +req.params.id!;

        if ( isNaN( id ) ) {
            res.status( 400 ).json({
                error: 'ID argument is not a number'
            });
            return;
        }

        const todo = todos.find( todo => todo.id === id );

        if ( !todo ) {
            res.status( 404 ).json({
                error: `TODO with id ${ id } not found`
            });
            return;
        }

        res.json( todo );
    };

    public createTodo = ( req: Request, res: Response ): void => {

        const { text } = req.body;

        if ( !text ) {
            res.status( 400 ).json({
                error: 'Text property is required'
            });
            return;
        }

        const newTodo = {
            id: todos.length + 1,
            text,
            completedAt: null,
            deleted: false
        };

        todos.push( newTodo );

        res.json( newTodo );
    };

    public updateTodo = ( req: Request, res: Response ): void => {

        const id = +req.params.id!;

        if ( isNaN( id ) ) {
            res.status( 400 ).json({
                error: 'ID argument is not a number'
            });
            return;
        }

        const todo = todos.find( todo => todo.id === id && !todo.deleted );

        if ( !todo ) {
            res.status( 404 ).json({
                error: `Todo with id ${ id } not found`
            });
            return;
        }

        const { text, completedAt } = req.body;

        todo.text = text || todo.text;

        if ( completedAt === 'null' ) {
            todo.completedAt = null;
        } else {
            todo.completedAt = new Date( completedAt || todo.completedAt );
        }

        res.json( todo );
    };

    public deleteTodo = ( req: Request, res: Response ): void => {

        const id = +req.params.id!;

        if ( isNaN( id ) ) {
            res.status( 400 ).json({
                error: 'ID argument is not a number'
            });
            return;
        }

        const todo = todos.find( todo => todo.id === id );

        if ( !todo ) {
            res.status( 404 ).json({
                error: `Todo with id ${ id } not found`
            });
            return;
        }
        todo.deleted = true;
        //todos.splice( todos.indexOf( todo ), 1 );

        res.json( todo );
    };



}