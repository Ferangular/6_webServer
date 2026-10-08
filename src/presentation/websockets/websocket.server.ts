import { Server as HttpServer } from 'node:http';
import { WebSocket, WebSocketServer as WsServer } from 'ws';

export class WebSocketServer {
  private static current?: WebSocketServer;
  private readonly wss: WsServer;

  constructor(server: HttpServer) {
    this.wss = new WsServer({ server, path: '/ws' });
    WebSocketServer.current = this;
    this.configure();
  }

  static get instance(): WebSocketServer {
    if (!WebSocketServer.current) {
      throw new Error('WebSocketServer is not initialized');
    }

    return WebSocketServer.current;
  }

  private configure(): void {
    this.wss.on('connection', (socket) => {
      socket.on('error', console.error);

      socket.on('message', (data) => {
        this.sendMessage('custom-message', data.toString());
      });
    });
  }

  sendMessage(type: string, payload: unknown): void {
    const message = JSON.stringify({ type, payload });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: false });
      }
    });
  }

  close(): void {
    WebSocketServer.current = undefined;
    this.wss.close();
  }
}
