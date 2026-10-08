# Sección 27 — API REST y WebSockets: sistema de turnos

## Objetivo

Combinar una API REST con WebSockets para construir un sistema de turnos. Las operaciones se ejecutan mediante HTTP y los cambios importantes se transmiten en tiempo real a todos los clientes conectados.

El proyecto de referencia (`doc/ws-rest-api-main-27/ws-rest-api-main`) separa las pantallas para crear turnos, atenderlos y mostrarlos públicamente. En este proyecto se integró el flujo completo en la API existente y se añadió un panel web unificado.

## Archivos creados

- **`src/presentation/tickets/ticket.interface.ts`**: define `Ticket` y el resultado de las operaciones.
- **`src/presentation/tickets/ticket.service.ts`**: administra la cola en memoria, asigna turnos y publica eventos WebSocket.
- **`src/presentation/tickets/controller.ts`**: adapta las operaciones del servicio a respuestas HTTP.
- **`src/presentation/tickets/routes.ts`**: declara los endpoints REST.
- **`public/tickets.html`**: panel para crear, atender, finalizar y visualizar turnos.
- **`public/tickets.css`**: estilos adaptables del panel.
- **`public/tickets.js`**: cliente REST y WebSocket con reconexión automática.

## Archivos modificados

- **`src/presentation/websockets/websocket.server.ts`**:
  - utiliza el endpoint `/ws`;
  - expone una instancia compartida;
  - permite enviar eventos tipados a todos los clientes conectados.
- **`src/presentation/routes.ts`**: registra `TicketRoutes` bajo `/api/ticket`.
- **`public/websocket.html`**: conecta ahora con `/ws`.

## Modelo de turno

Cada turno contiene:

```text
id             Identificador UUID
number         Número correlativo
createdAt      Fecha de creación
handledAtDesk  Escritorio que lo atiende
handledAt      Fecha de asignación
 done           Indica si la atención terminó
```

Los datos se mantienen en memoria y se reinician al detener el servidor.

## Endpoints REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ticket` | Obtiene todos los turnos |
| GET | `/api/ticket/last` | Obtiene el último número generado |
| GET | `/api/ticket/pending` | Obtiene los turnos pendientes |
| GET | `/api/ticket/working-on` | Obtiene los últimos cuatro turnos atendidos |
| POST | `/api/ticket` | Genera un nuevo turno |
| GET | `/api/ticket/draw/:desk` | Asigna el siguiente turno a un escritorio |
| PUT | `/api/ticket/done/:ticketId` | Finaliza un turno |

## Eventos WebSocket

El servidor WebSocket escucha en `/ws` y publica objetos JSON con `type` y `payload`.

| Evento | Payload | Momento de emisión |
|--------|---------|--------------------|
| `on-ticket-count-changed` | Número de pendientes | Al crear o asignar un turno |
| `on-working-changed` | Últimos cuatro turnos atendidos | Al asignar un turno |
| `custom-message` | Texto recibido | Al recibir un mensaje WebSocket directo |

## Flujo

1. Un cliente crea un turno con `POST /api/ticket`.
2. `TicketService` incrementa el número y almacena el turno.
3. WebSocket publica la nueva cantidad pendiente.
4. Un escritorio solicita el siguiente turno mediante `/draw/:desk`.
5. El servicio asigna el primer turno pendiente y actualiza el historial.
6. WebSocket actualiza simultáneamente el contador y la pantalla pública.
7. El escritorio finaliza la atención mediante `/done/:ticketId`.

## Prueba local

Iniciar el servidor:

```bash
npm run dev
```

Abrir el panel en una o varias pestañas:

```text
http://localhost:3000/tickets.html
```

Las pestañas reciben inmediatamente los cambios del contador y de los turnos en atención.

## Diferencias respecto a la referencia

- El sistema se integra con la aplicación Express existente.
- HTTP y WebSocket comparten servidor, puerto y ciclo de vida.
- Se utilizan UUID, interfaces estrictas y respuestas HTTP adecuadas para errores.
- El cliente calcula dinámicamente `ws://` o `wss://` y el host actual.
- La interfaz reúne creación, escritorio y pantalla pública en un panel adaptable.
- El contenido se construye con `textContent`, sin insertar HTML procedente de datos externos.

## Validación

- `npx tsc --noEmit` debe compilar sin errores.
- Crear un turno debe incrementar el número y el contador de pendientes.
- Atender un turno debe reducir los pendientes y actualizar todas las pantallas.
- Reiniciar el servidor debe activar la reconexión automática del cliente.
