import { prisma } from './src/data/index.js';
import { CreateTodoDto } from './src/domain/dtos/todos/create-todo.dto.ts';

async function testPostTodo() {
  try {
    console.log('Creando un nuevo todo...');
    
    // Simular el body de la petición POST
    const todoBody = {
      text: 'Todo de prueba desde script'
    };
    
    // Usar el DTO para validar y crear
    const [error, createTodoDto] = CreateTodoDto.create(todoBody);
    
    if (error) {
      console.error('Error en DTO:', error);
      return;
    }
    
    console.log('DTO válido:', createTodoDto);
    
    // Crear en la base de datos
    const todo = await prisma.todo.create({
      data: createTodoDto
    });
    
    console.log('Todo creado exitosamente:', todo);
    
    // Verificar que se guardó
    const allTodos = await prisma.todo.findMany();
    console.log('Todos en la base de datos:', allTodos);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testPostTodo();
