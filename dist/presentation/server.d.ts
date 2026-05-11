interface Options {
    port: number;
    public_path?: string;
}
export declare class Server {
    private app;
    private readonly port;
    private readonly publicPath;
    constructor(options: Options);
    start(): Promise<void>;
}
export {};
//# sourceMappingURL=server.d.ts.map