import { envs } from './config/envs.js';
import { MongoDatabase } from './data/index.js';
import { AppRoutes } from './presentation/routes.js';
import { Server } from './presentation/server.js';

(async () => {
  await main();
})();

async function main(): Promise<void> {
  await MongoDatabase.connect({ mongoUrl: envs.MONGO_URL, dbName: envs.MONGO_DB_NAME });

  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  await server.start();
}