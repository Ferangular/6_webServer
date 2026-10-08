# Sección 25 — Webhooks con funciones serverless en Netlify

## Objetivo

Introducir el modelo serverless de Netlify y trasladar el webhook GitHub → Discord a una función que se ejecuta bajo demanda, sin mantener un servidor Express activo.

El proyecto de referencia (`doc/serverles-webhooks-main`) contiene tres funciones independientes: una respuesta básica, una demostración de variables de entorno y el webhook que notifica a Discord. Estas funciones se integraron en el proyecto existente dentro de `netlify/functions` sin sustituir la API Express.

## Dependencia añadida

- **`@netlify/functions`**: aporta el tipo `Handler` y las definiciones de los eventos y respuestas de las funciones de Netlify.

## Archivos creados

- **`netlify/functions/hello/hello.ts`**: función de ejemplo que devuelve un JSON con estado `200`.
- **`netlify/functions/variables/variables.ts`**: lee `MY_IMPORTANT_VARIABLE` desde el entorno y devuelve `500` si no está configurada.
- **`netlify/functions/github-discord/github-discord.ts`**: recibe eventos de GitHub, genera el mensaje correspondiente y lo envía al webhook de Discord.
- **`netlify/tsconfig.json`**: configuración independiente para comprobar los tipos de las funciones serverless y de las interfaces reutilizadas.

## Archivos modificados

- **`package.json`**:
  - `netlify:dev`: inicia el entorno local mediante Netlify CLI;
  - `typecheck:netlify`: valida las funciones con TypeScript.
- **`.env.template`**: incorpora `MY_IMPORTANT_VARIABLE`.
- **`package-lock.json`**: registra la dependencia `@netlify/functions`.

## Endpoints locales

Al ejecutar Netlify Dev, las funciones quedan disponibles bajo `/.netlify/functions/<nombre>`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/.netlify/functions/hello` | Devuelve el mensaje de prueba |
| GET | `/.netlify/functions/variables` | Devuelve la variable de entorno de ejemplo |
| POST | `/.netlify/functions/github-discord` | Recibe eventos de GitHub y notifica a Discord |

## Flujo del webhook serverless

1. GitHub envía el evento a `/.netlify/functions/github-discord`.
2. Netlify crea una ejecución aislada de la función.
3. La función obtiene `x-github-event` y deserializa el cuerpo.
4. Los eventos `star` e `issues` se convierten en un mensaje legible.
5. La función envía el mensaje a `DISCORD_WEBHOOK_URL`.
6. Devuelve `200` cuando Discord acepta la notificación o `502` cuando el envío falla.

## Configuración

Variables necesarias para las funciones:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-id/your-token
MY_IMPORTANT_VARIABLE=Saludos desde Netlify
```

En producción deben configurarse desde el panel de Netlify y no incluirse secretos reales en el repositorio.

## Ejecución local

Netlify CLI debe estar instalada o disponible mediante `npx`. El script configurado se ejecuta con:

```bash
npm run netlify:dev
```

También puede iniciarse sin instalación global mediante:

```bash
npx netlify dev
```

## Despliegue

Después de autenticar y vincular el proyecto con Netlify:

```bash
npx netlify deploy --prod
```

La URL generada para GitHub tendrá esta forma:

```text
https://<sitio>.netlify.app/.netlify/functions/github-discord
```

## Diferencias respecto a la referencia

- Las funciones conviven con la aplicación Express existente.
- El webhook reutiliza las interfaces tipadas `GitHubStarPayload` y `GitHubIssuePayload`; la referencia utiliza `any`.
- Los errores de configuración y de Discord producen respuestas HTTP explícitas.
- Se añadió una comprobación TypeScript separada para incluir `netlify/functions`, ya que el `tsconfig.json` principal solo compila `src`.

## Validación

- `npx tsc --noEmit` valida la aplicación Express.
- `npm run typecheck:netlify` valida las funciones serverless.
- `npm run netlify:dev` permite probar los endpoints antes del despliegue.
