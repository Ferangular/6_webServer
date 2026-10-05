import { CreateTodoDto, UpdateTodoDto } from '../dtos/index.js';
import { TodoEntity } from '../entities/todo.entity.js';

export abstract class TodoDatasource {
    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
    abstract getAll(): Promise<TodoEntity[]>;
    abstract findById(id: number): Promise<TodoEntity>;
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
    abstract deleteById(id: number): Promise<TodoEntity>;
}
