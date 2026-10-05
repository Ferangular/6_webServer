import { TodoEntity } from '../../entities/todo.entity.js';
import { TodoRepository } from '../../repositories/todo.repository.js';

export class GetTodos {
    constructor(private readonly repository: TodoRepository) {}

    execute(): Promise<TodoEntity[]> {
        return this.repository.getAll();
    }
}
