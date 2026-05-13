import { prisma } from './src/data/index.js';

async function testGetTodoById() {
  try {
    console.log('Obteniendo todo con ID 1...');
    
    const todo = await prisma.todo.findFirst({
      where: { id: 1 }
    });
    
    if (todo) {
      console.log('Todo encontrado:', todo);
    } else {
      console.log('Todo no encontrado');
    }
    
    // Probar con un ID que no existe
    console.log('\nProbando con ID 999...');
    const todoNotFound = await prisma.todo.findFirst({
      where: { id: 999 }
    });
    
    if (todoNotFound) {
      console.log('Todo encontrado:', todoNotFound);
    } else {
      console.log('Todo con ID 999 no encontrado (como se esperaba)');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testGetTodoById();
