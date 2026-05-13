import { envs } from './config/envs.js';
import { Server } from './presentation/server.js';
import {AppRoutes} from "./presentation/routes.js";
import {DatabaseConfig} from "./data/index.js";




(async()=> {
  main();
})();


async function main() {
  console.log('Iniciando aplicación...');
  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  // Conexión a PostgreSQL
  const prisma = await DatabaseConfig.connectPostgres();

  server.start();
}