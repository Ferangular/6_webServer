# Resumen del proyecto y guía de arranque

> Proyecto del curso **"Node.js de cero a experto"** (Sección 14: RestServer).

## Qué hay hecho

Este proyecto es un **REST Server** construido con **Node.js, TypeScript, Express y Prisma + PostgreSQL**. Aunque la primera parte del README habla de una web de cómics, el código actual se ha enfocado en un **CRUD de TODOs**.

### Tecnologías principales

- **Node.js** con **TypeScript** y módulos ESM (`"type": "module"`).
- **Express** como servidor web.
- **Prisma** como ORM con cliente generado en `src/generated/prisma`.
- **PostgreSQL** como base de datos, levantada con **Docker Compose**.
- **Docker Compose** para levantar PostgreSQL localmente.
- **express-validator** para validar requests.
- **dotenv / env-var** para leer variables de entorno.
- **tsx** para ejecutar TypeScript en desarrollo sin compilar.

### Funcionalidad implementada

La API expone el CRUD completo de `Todo` bajo el prefijo `/api/todos`:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/todos` | Lista todos los TODOs |
| `GET` | `/api/todos/:id` | Obtiene un TODO por ID |
| `POST` | `/api/todos` | Crea un nuevo TODO |
| `PUT` | `/api/todos/:id` | Actualiza un TODO (texto y/o fecha de completado) |
| `DELETE` | `/api/todos/:id` | Elimina un TODO |

### Validaciones y DTOs

- `CreateTodoDto` y `UpdateTodoDto` validan que solo lleguen las propiedades permitidas y tengan el tipo correcto.
- `TodoValidators` usa `express-validator` para validar `id` y `text`.
- `validateFields` devuelve un error 400 con los detalles de validación.
- `errorHandler` maneja errores 500 y `notFound` responde 404 para rutas no definidas.

### Base de datos

Modelo de Prisma (`prisma/schema.prisma`):

```prisma
model Todo {
  id          Int       @id @default(autoincrement())
  text        String    @db.VarChar
  completedAt DateTime? @db.Timestamp()
}
```

Las migraciones están en `prisma/migrations/`.

### Estructura de carpetas relevante

```
6_webServer/
├── src/
│   ├── app.ts                         # Punto de entrada
│   ├── app.http.ts / app.http2.ts     # Alternativas HTTP/HTTP2
│   ├── config/envs.ts                 # Variables de entorno
│   ├── data/index.ts                  # Conexión Prisma + PostgreSQL
│   ├── domain/dtos/todos/             # DTOs de creación y actualización
│   ├── presentation/
│   │   ├── server.ts                  # Configuración de Express
│   │   ├── routes.ts                  # Rutas principales /api
│   │   ├── todos/controller.ts        # Lógica del CRUD
│   │   ├── todos/routes.ts            # Definición de rutas /todos
│   │   ├── todos/validators.ts        # Validaciones con express-validator
│   │   └── middlewares/               # not-found, error-handler, validate-fields
│   └── generated/prisma/              # Cliente generado por Prisma
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/                            # Archivos estáticos (SPA fallback)
├── docker-compose.yml                 # PostgreSQL en Docker
├── package.json
├── tsconfig.json
└── test-db.js / test-post.js          # Scripts rápidos de prueba
```

## Cómo arrancar el proyecto

### 1. Requisitos

- Tener instalado **Node.js**.
- Tener instalado **Docker Desktop** (o Docker + Docker Compose).
- Tener **pnpm** o **npm**. El proyecto usa `pnpm-lock.yaml`, por lo que se recomienda `pnpm`.

### 2. Instalar dependencias

```bash
pnpm install
```

Si no tienes `pnpm`:

```bash
npm install
```

### 3. Crear el archivo `.env`

Crea un archivo `.env` en la raíz con el siguiente contenido mínimo:

```env
PORT=3000
PUBLIC_PATH=public

# Esta variable es obligatoria; la app la lee como DATABASE_URL
DATABASE_URL="postgresql://postgres:123456@localhost:5432/TODO?schema=public"

# Estas las usa docker-compose.yml para crear el contenedor
POSTGRES_USER=postgres
POSTGRES_DB=TODO
POSTGRES_PASSWORD=123456

NODE_ENV=development
```

> **Importante:** `src/config/envs.ts` carga `DATABASE_URL` y la asigna a `POSTGRES_URL`, que es lo que usa `src/data/index.ts` para conectar Prisma.

### 4. Levantar PostgreSQL con Docker

```bash
pnpm docker:run
```

O manualmente:

```bash
docker compose -p webserver up -d
```

Verifica que el contenedor esté corriendo:

```bash
docker ps
```

### 5. Aplicar migraciones y generar el cliente de Prisma

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

Si ya tienes migraciones aplicadas y solo cambias el schema:

```bash
pnpm prisma:generate
```

### 6. Iniciar el servidor en desarrollo

```bash
pnpm dev
```

El servidor se levantará en `http://localhost:3000` y recargará automáticamente con cada cambio.

### 7. Probar la API

Puedes usar los scripts de prueba o herramientas como Postman / Thunder Client:

```bash
# Listar TODOs
pnpm tsx test-db.js

# Crear un TODO de prueba
pnpm tsx test-post.js
```

También puedes probar con `curl`:

```bash
# Crear TODO
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"text":"Aprender Node"}'

# Listar TODOs
curl http://localhost:3000/api/todos

# Obtener uno
curl http://localhost:3000/api/todos/1

# Actualizar
curl -X PUT http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"text":"Aprender Node.js","completedAt":"2026-10-02T10:00:00.000Z"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/todos/1
```

## Otros comandos útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor en desarrollo con recarga automática |
| `pnpm http` / `pnpm http2` | Alternativas con servidor HTTP/HTTP2 |
| `pnpm build` | Compila TypeScript a `dist/` |
| `pnpm start` | Ejecuta el servidor compilado (`dist/app.js`) |
| `pnpm start:prod` | Aplica migraciones de producción y arranca |
| `pnpm prisma:studio` | Abre Prisma Studio para ver la base de datos |
| `pnpm docker:down` | Detiene el contenedor de PostgreSQL |

## Notas importantes

- El servidor sirve la carpeta `public/` como archivos estáticos y devuelve `index.html` para cualquier ruta no API (comportamiento SPA).
- Si PostgreSQL no está levantado, la app lanzará un error de conexión al arrancar.
- El proyecto usa **ES Modules**: los imports internos terminan en `.js` aunque el archivo real sea `.ts`.
- Los certificados SSL son opcionales y solo necesarios si quieres probar `app.http2.ts` con HTTPS local.
