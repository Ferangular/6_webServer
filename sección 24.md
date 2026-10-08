# Sección 24 — Seguridad de webhooks con firma SHA-256

## Objetivo

Validar que cada petición recibida en el webhook procede de GitHub antes de procesarla. GitHub firma el payload con un secreto compartido y envía la firma HMAC SHA-256 en el header `x-hub-signature-256`.

El proyecto de referencia (`doc/webhooks-server-fin-seccion-24-new/webhooks-server-fin-seccion-24-new`) aplica la validación como middleware global. En este proyecto se integró únicamente en la ruta de GitHub para no afectar los demás endpoints de `AppRoutes`.

## Archivo creado

- **`src/presentation/middlewares/github-sha256.middleware.ts`**: `GithubSha256Middleware`:
  - exige el header `x-hub-signature-256` con el prefijo `sha256=`;
  - calcula el HMAC SHA-256 del cuerpo con `GITHUB_WEBHOOK_SECRET`;
  - compara ambas firmas con `timingSafeEqual` para evitar comparaciones vulnerables a ataques de tiempo;
  - llama a `next()` cuando la firma es válida;
  - responde `401 Unauthorized` cuando falta la firma o no coincide.

## Archivos modificados

- **`src/config/envs.ts`**: nueva variable obligatoria `GITHUB_WEBHOOK_SECRET`.
- **`src/presentation/github/routes.ts`**: el middleware se ejecuta antes de `GithubController.webhookHandler`.
- **`.env.template`** y **`.env.test.template`**: incluyen un valor de ejemplo para `GITHUB_WEBHOOK_SECRET`.

## Endpoint protegido

| Método | Ruta | Headers relevantes | Resultado |
|--------|------|--------------------|-----------|
| POST | `/api/github` | `x-github-event`, `x-hub-signature-256` | `202` si la firma es válida; `401` si es inválida |

## Flujo

1. GitHub serializa el payload y calcula un HMAC SHA-256 con el secreto configurado en el webhook.
2. GitHub envía el resultado como `x-hub-signature-256: sha256=...`.
3. Express transforma el JSON y `GithubSha256Middleware` vuelve a serializar `req.body`.
4. El middleware calcula la firma esperada con `createHmac()`.
5. Las firmas se comparan con `timingSafeEqual()`.
6. Solo las peticiones válidas llegan al controlador y generan una notificación en Discord.

## Configuración

El mismo secreto debe configurarse en GitHub y en el entorno local:

```env
GITHUB_WEBHOOK_SECRET=replace-with-your-github-webhook-secret
```

En GitHub se configura en **Settings → Webhooks → Add webhook/Edit → Secret**.

## Diferencias respecto a la referencia

- Se usa `node:crypto` en lugar de Web Crypto para una implementación directa en Node.js.
- Se usa `timingSafeEqual` en vez de una comparación ordinaria.
- El middleware protege solo `POST /api/github`, no todas las rutas de la aplicación.
- La variable se llama `GITHUB_WEBHOOK_SECRET` en vez de `SECRET_TOKEN` para indicar claramente su propósito.

## Validación

- `npx tsc --noEmit` debe compilar sin errores.
- Una petición sin `x-hub-signature-256` debe responder `401`.
- Una petición con una firma calculada con el secreto correcto debe continuar hasta el controlador.
