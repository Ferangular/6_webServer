import express from 'express';
import path from 'path';
export class Server {
    app = express();
    port;
    publicPath;
    constructor(options) {
        const { port, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
    }
    async start() {
        //* Middlewares
        //* Public Folder
        this.app.use(express.static(this.publicPath));
        //* SPA fallback
        this.app.get('/*splat', (req, res) => {
            const indexPath = path.join(process.cwd(), this.publicPath, 'index.html');
            res.sendFile(indexPath);
        });
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
//# sourceMappingURL=server.js.map