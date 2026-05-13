import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "../config/envs.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
    connectionString: envs.POSTGRES_URL,
});

export const prisma = new PrismaClient({
    adapter
});

export class DatabaseConfig {

    static async connectPostgres() {

        await this.testPostgresConnection();

        return prisma;
    }

    private static async testPostgresConnection() {

        try {

            await prisma.$connect();

            console.log('✅ Conexión a PostgreSQL exitosa');

            await prisma.$queryRaw`SELECT 1`;

            console.log('✅ Consulta de prueba ejecutada correctamente');

        } catch (error) {

            console.error('❌ Error al conectar a PostgreSQL:', error);

            throw error;

        }
    }
}