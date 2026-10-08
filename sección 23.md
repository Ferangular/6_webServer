# Sección 23 — Webhooks (GitHub → Discord)

## Objetivo

Integrar la recepción de webhooks de GitHub en el servidor web. El endpoint recibe eventos
(`star`, `issues`), genera un mensaje legible y lo reenvía a un canal de Discord mediante un
webhook saliente.

El proyecto de referencia (`doc/webhooks-server-fin-seccion-23`) es un servidor Express
independiente (`09-github-webhooks`). En este proyecto se integró como un módulo más del
`AppRoutes`, manteniendo la arquitectura existente (controller + services + interfaces).

## Archivos creados

- **`src/interfaces/github-issue.interface.ts`**: tipos del payload `GitHubIssuePayload` (generado con quicktype).
- **`src/interfaces/github-start.interface.ts`**: tipos del payload `GitHubStarPayload`.
- **`src/interfaces/index.ts`**: barrel con exports `.js` para compatibilidad ESM/NodeNext.
- **`src/presentation/services/github.service.ts`**: `GitHubService` traduce payloads a mensajes:
  - `onStar()`: `"User X starred star on repo"` según `action`.
  - `onIssue()`: mensajes para `opened`, `closed`, `reopened`; fallback para otras acciones.
- **`src/presentation/services/discord.service.ts`**: `DiscordService` envía `{ content: message }`
  con `fetch` (nativo en Node 18+) al `DISCORD_WEBHOOK_URL`. Retorna `boolean`.
- **`src/presentation/github/controller.ts`**: `GithubController.webhookHandler` lee el header
  `x-github-event`, selecciona el handler del servicio y envía el mensaje a Discord.
  Responde `202 Accepted` o `500` si falla el envío.
- **`src/presentation/github/routes.ts`**: `GithubRoutes` expone `POST /`.

## Archivos modificados

- **`src/config/envs.ts`**: nueva variable requerida `DISCORD_WEBHOOK_URL` (validada como URL).
- **`src/presentation/routes.ts`**: `router.use('/api/github', GithubRoutes.routes)`.
- **`.env.template`** y **`.env.test.template`**: `DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...`

## Endpoint

| Método | Ruta | Headers relevantes | Descripción |
|--------|------|--------------------|-------------|
| POST | `/api/github` | `x-github-event: star\|issues` | Recibe el webhook de GitHub y notifica a Discord |

## Flujo

1. GitHub envía `POST /api/github` con `x-github-event` y el payload JSON.
2. El controlador delega en `GitHubService` para construir el mensaje.
3. `DiscordService.notify()` hace `POST` al webhook de Discord.
4. Se responde `202 Accepted` a GitHub.

## Notas

- Para exponer el servidor local a GitHub se puede usar `ngrok` o un túnel similar.
- `fetch` es nativo en Node ≥18; no se necesita axios ni node-fetch.
- Eventos no reconocidos responden con mensaje `Unknown event ...` (también notificado a Discord).
- Configurar `DISCORD_WEBHOOK_URL` en `.env` (y `.env.test` para la suite de Jest).

## Validación

- `npx tsc --noEmit` compila sin errores.
