import { CreateTodoDto } from '../../dtos/index.js';
import { TodoEntity } from '../../entities/todo.entity.js';
import { TodoRepository } from '../../repositories/todo.repository.js';

export class CreateTodo {
    constructor(private readonly repository: TodoRepository) {}

    execute(dto: CreateTodoDto): Promise<TodoEntity> {
        return this.repository.create(dto);
    }
}
