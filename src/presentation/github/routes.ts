import { Router } from 'express';
import { GithubSha256Middleware } from '../middlewares/github-sha256.middleware.js';
import { GithubController } from './controller.js';


export class GithubRoutes {

  static get routes(): Router {

    const router = Router();
    const controller = new GithubController();

    router.post(
      '/',
      GithubSha256Middleware.verifyGithubSignature,
      controller.webhookHandler,
    );

    return router;
  }

}
