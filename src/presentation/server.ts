import compression from 'compression';
import express, { Router } from 'express';
import { Server as HttpServer } from 'http';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: HttpServer;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start(): Promise<void> {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(express.static(this.publicPath));
    this.app.use(this.routes);

    this.app.get(/.*/, (req, res) => {
      const indexPath = path.join(process.cwd(), this.publicPath, 'index.html');
      res.sendFile(indexPath);
    });

    await new Promise<void>((resolve, reject) => {
      this.serverListener = this.app.listen(this.port, (error?: Error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  public close(): void {
    this.serverListener?.close();
  }
}