import { prisma } from './src/data/index.js';

async function testGetAllTodos() {
  try {
    console.log('Obteniendo todos los todos...');
    
    const todos = await prisma.todo.findMany();
    console.log('Todos encontrados:', todos);
    console.log('Cantidad de todos:', todos.length);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testGetAllTodos();
