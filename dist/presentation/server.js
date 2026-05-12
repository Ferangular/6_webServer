import express from 'express';
import path from 'path';
export class Server {
    app = express();
    port;
    publicPath;
    routes;
    constructor(options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }
    async start() {
        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
        //* Public Folder
        this.app.use(express.static(this.publicPath));
        //* Routes
        this.app.use(this.routes);
        //* SPA
        this.app.get(/.*/, (req, res) => {
            const indexPath = path.join(process.cwd(), this.publicPath, 'index.html');
            res.sendFile(indexPath);
        });
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
//# sourceMappingURL=server.js.map