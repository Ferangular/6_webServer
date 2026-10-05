import { UpdateTodoDto } from '../../dtos/index.js';
import { TodoEntity } from '../../entities/todo.entity.js';
import { TodoRepository } from '../../repositories/todo.repository.js';

export class UpdateTodo {
    constructor(private readonly repository: TodoRepository) {}

    execute(dto: UpdateTodoDto): Promise<TodoEntity> {
        return this.repository.updateById(dto);
    }
}
