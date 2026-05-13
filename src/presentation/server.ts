import express, { Router } from 'express';
import path from 'path';
import {notFound} from "./middlewares/not-found.js";
import {errorHandler} from "./middlewares/error-handler.js";

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  private app = express();
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


    //* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );


    //* Routes
    this.app.use( this.routes );


    //* SPA
    this.app.get(/.*/, (req, res) => {
      const indexPath = path.join(process.cwd(), this.publicPath, 'index.html');
      res.sendFile(indexPath);
    });

    //* 404 Middleware
    this.app.use( notFound );

    //* Global Error Handler
    this.app.use( errorHandler );

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

}