import { prisma } from './src/data/index.js';

async function testConnection() {
  try {
    console.log('Probando conexión a la base de datos...');
    const todos = await prisma.todo.findMany();
    console.log('Todos encontrados:', todos);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

testConnection();
