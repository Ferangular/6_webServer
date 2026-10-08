# Sección 26 — WebSockets con Node.js y `ws`

## Objetivo

Añadir comunicación bidireccional en tiempo real mediante WebSockets. Varios clientes pueden conectarse al servidor, enviar mensajes y recibir inmediatamente los mensajes enviados por los demás clientes.

El proyecto de referencia (`doc/node-ws-wss-main26/node-ws-wss-main`) levanta un servidor WebSocket independiente en el puerto `3000`. En este proyecto, WebSocket y Express comparten el mismo servidor HTTP y el mismo puerto.

## Dependencias añadidas

- **`ws`**: implementación de WebSocket para Node.js.
- **`@types/ws`**: tipos TypeScript de la librería.

## Archivos creados

- **`src/presentation/websockets/websocket.server.ts`**: encapsula el servidor WebSocket, administra conexiones y distribuye cada mensaje al resto de clientes conectados.
- **`public/websocket.html`**: cliente web para conectarse, enviar mensajes, visualizar mensajes recibidos y reconectarse automáticamente.

## Archivo modificado

- **`src/presentation/server.ts`**:
  - monta `WebSocketServer` sobre el servidor HTTP creado por Express;
  - conserva una referencia al servidor WebSocket;
  - cierra WebSocket y HTTP desde `Server.close()`.
- **`package.json`** y **`package-lock.json`**: registran `ws` y `@types/ws`.

## Funcionamiento

1. Express inicia el servidor HTTP en `envs.PORT`.
2. `WebSocketServer` escucha las solicitudes de actualización de protocolo sobre ese mismo servidor.
3. El navegador abre una conexión `ws://` o `wss://` según el protocolo de la página.
4. Cuando un cliente envía texto, el servidor crea un mensaje JSON con `type` y `payload`.
5. El mensaje se distribuye a todos los clientes abiertos excepto al emisor.
6. Si se pierde la conexión, el cliente intenta reconectarse después de 1,5 segundos.

## Formato de los mensajes

El servidor envía objetos JSON serializados:

```json
{
  "type": "custom-message",
  "payload": "Mensaje enviado por otro cliente"
}
```

## Prueba local

1. Iniciar el proyecto:

```bash
npm run dev
```

2. Abrir dos pestañas en:

```text
http://localhost:3000/websocket.html
```

3. Enviar un mensaje desde una pestaña. El mensaje aparecerá en la otra.

## `ws` y `wss`

- `ws://` se utiliza cuando la página se sirve mediante HTTP.
- `wss://` cifra la conexión y se utiliza cuando la página se sirve mediante HTTPS.
- El cliente selecciona automáticamente el protocolo usando `location.protocol` y el host actual, por lo que funciona tanto en desarrollo como detrás de un proxy HTTPS compatible con WebSocket.

## Diferencias respecto a la referencia

- WebSocket reutiliza el servidor HTTP de Express en lugar de abrir otro puerto.
- La lógica está encapsulada en una clase con un método `close()`.
- El cliente no fija `localhost:3000`; calcula protocolo y host dinámicamente.
- El contenido recibido se inserta con `textContent`, evitando interpretar HTML enviado por otro cliente.
- La interfaz muestra el estado, deshabilita el envío sin conexión y se adapta a dispositivos móviles.

## Validación

- `npx tsc --noEmit` debe compilar sin errores.
- Dos clientes abiertos deben mostrar el estado `Online`.
- Un mensaje debe llegar a los demás clientes, pero no regresar al emisor.
- Al reiniciar el servidor, los clientes deben reconectarse automáticamente.
