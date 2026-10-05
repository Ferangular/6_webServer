import { prisma } from '../../data/postgres/index.js';
import { CreateTodoDto, CustomError, TodoDatasource, TodoEntity, UpdateTodoDto } from '../../domain/index.js';

export class TodoDatasourceImpl implements TodoDatasource {
    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const todo = await prisma.todo.create({ data: createTodoDto });
        return TodoEntity.fromObject(todo);
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany({ orderBy: { id: 'asc' } });
        return todos.map(TodoEntity.fromObject);
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) throw CustomError.notFound(`Todo with id ${id} not found`);
        return TodoEntity.fromObject(todo);
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById(updateTodoDto.id);
        const todo = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto.values,
        });
        return TodoEntity.fromObject(todo);
    }

    async deleteById(id: number): Promise<TodoEntity> {
        await this.findById(id);
        const todo = await prisma.todo.delete({ where: { id } });
        return TodoEntity.fromObject(todo);
    }
}
