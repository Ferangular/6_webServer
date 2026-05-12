import { envs } from './config/envs.js';
import { Server } from './presentation/server.js';
import {AppRoutes} from "./presentation/routes.js";




(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  server.start();
}