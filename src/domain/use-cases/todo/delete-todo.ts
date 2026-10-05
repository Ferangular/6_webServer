import { TodoEntity } from '../../entities/todo.entity.js';
import { TodoRepository } from '../../repositories/todo.repository.js';

export class DeleteTodo {
    constructor(private readonly repository: TodoRepository) {}

    execute(id: number): Promise<TodoEntity> {
        return this.repository.deleteById(id);
    }
}
