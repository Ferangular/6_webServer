# Sección 15: REST Server con PostgreSQL y Prisma

## Objetivo

La sección sustituye el arreglo de tareas en memoria por persistencia real en PostgreSQL mediante Prisma ORM. La API conserva los endpoints REST de tareas y añade DTOs para validar los datos de entrada.

## Comparación realizada

### Lo que ya tenía el proyecto

- Servidor Express 5 con TypeScript y módulos ESM.
- Variables `PORT` y `PUBLIC_PATH` validadas con `env-var`.
- Archivos estáticos y fallback para la SPA.
- Rutas REST bajo `/api/todos`.
- Operaciones GET, POST, PUT y DELETE.
- Una implementación temporal basada en un arreglo en memoria.

### Lo que aportaba el proyecto de referencia

- Prisma Client como acceso a datos.
- PostgreSQL configurado mediante `POSTGRES_URL`.
- Esquema Prisma para la tabla `todo`.
- Migración inicial de base de datos.
- DTOs `CreateTodoDto` y `UpdateTodoDto`.
- Controlador asíncrono con persistencia real.
- Scripts para generar Prisma Client y desplegar migraciones.

## Cambios incorporados

- Se añadieron `prisma` y `@prisma/client`.
- Se creó `prisma/schema.prisma` con el modelo `Todo`, mapeado a la tabla `todo`.
- Se añadió la migración inicial para PostgreSQL.
- Se creó una instancia compartida de `PrismaClient` en `src/data/postgres/index.ts`.
- Se crearon DTOs de creación y actualización en `src/domain/dtos/todos`.
- El controlador dejó de usar el arreglo local y ahora ejecuta CRUD con Prisma.
- `POST /api/todos` responde con estado `201`.
- Los identificadores deben ser enteros positivos.
- El texto no puede estar vacío.
- `completedAt` acepta una fecha válida o `null` para marcar una tarea como pendiente.
- Se añadieron las variables de PostgreSQL a `.env.template`.
- Se añadieron scripts de generación y migración de Prisma.

## Modelo de datos

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | `Int` | Clave primaria y autoincremental |
| `text` | `String` | Obligatorio |
| `completedAt` | `DateTime?` | Opcional; `null` indica tarea pendiente |

## Endpoints

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/api/todos` | Obtener todas las tareas |
| `GET` | `/api/todos/:id` | Obtener una tarea por id |
| `POST` | `/api/todos` | Crear una tarea |
| `PUT` | `/api/todos/:id` | Actualizar texto o fecha de finalización |
| `DELETE` | `/api/todos/:id` | Eliminar definitivamente una tarea |

### Ejemplos de cuerpos JSON

Crear una tarea:

```json
{
  "text": "Aprender Prisma"
}
```

Marcarla como completada:

```json
{
  "completedAt": "2026-10-05T10:00:00.000Z"
}
```

Volver a dejarla pendiente:

```json
{
  "completedAt": null
}
```

## Puesta en marcha

1. Configurar PostgreSQL y copiar las variables de `.env.template` a `.env`.
2. Ajustar `POSTGRES_URL` con el usuario, contraseña, host, puerto y base de datos reales.
3. Instalar dependencias con `npm install`.
4. Generar Prisma Client con `npm run prisma:generate`.
5. Aplicar la migración en desarrollo con `npm run prisma:migrate:dev` o en producción con `npm run prisma:migrate:prod`.
6. Iniciar el servidor con `npm run dev`.

## Diferencias deliberadas respecto al curso

- Se mantiene Express 5, ESM y `tsx`, que ya formaban parte del proyecto actual.
- Los imports internos conservan la extensión `.js`, necesaria con `NodeNext`.
- Los DTOs son más estrictos: eliminan espacios exteriores, rechazan textos vacíos y validan ids positivos.
- El modelo Prisma usa `Todo` en TypeScript y `@@map("todo")` para conservar el nombre de tabla del curso.
- El borrado es físico, igual que en el código final de referencia; no se conserva el campo temporal `deleted` usado por el arreglo anterior.

## Validación realizada

- Prisma Client se generó correctamente con Prisma 6.19.3.
- TypeScript se comprobó con `npx tsc --noEmit` sin errores.
- No se ejecutó una prueba de conexión ni la migración contra PostgreSQL para evitar modificar una base de datos sin confirmación.

## Observaciones

- `npm install` informó vulnerabilidades en el árbol de dependencias. Conviene revisar `npm audit` antes de producción y no ejecutar correcciones forzadas sin comprobar cambios incompatibles.
- La API requiere que PostgreSQL esté disponible antes de atender operaciones de tareas.
