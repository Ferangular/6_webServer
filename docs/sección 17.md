# Sección 17: pruebas automáticas del REST Server

## Objetivo

La sección 17 incorpora pruebas automáticas al servidor construido con arquitectura limpia, Express, Prisma y PostgreSQL. También adapta el servidor para poder iniciarlo, inspeccionarlo y cerrarlo durante las pruebas.

## Comparación con la sección 16

Al terminar la sección 16, el proyecto ya tenía:

- Arquitectura por capas.
- Entidades, DTOs, datasources y repositorios.
- Casos de uso.
- Inyección de dependencias.
- Persistencia mediante Prisma y PostgreSQL.

La sección 17 añade principalmente:

- Jest y `ts-jest`.
- Supertest para probar endpoints Express.
- Configuración de variables de entorno para pruebas.
- Base de datos de prueba independiente.
- Pruebas unitarias e integración.
- Cobertura de código.
- Un servidor que puede cerrarse después de cada suite.
- Errores de dominio con códigos HTTP explícitos.
- Docker Compose para PostgreSQL local.

## Dependencias incorporadas

- `jest`: ejecutor de pruebas.
- `ts-jest`: transformación de TypeScript para Jest.
- `@types/jest`: tipos de Jest.
- `supertest`: peticiones HTTP contra Express.
- `@types/supertest`: tipos de Supertest.
- `dotenv-cli`: ejecución de Prisma con `.env.test`.

TypeScript se ajustó de la versión 6 a la versión estable 5.9.3 porque `ts-jest` 29 requiere TypeScript menor que 6.

## Configuración de Jest

`jest.config.ts` configura:

- Entorno Node.
- Transformación ESM de TypeScript con `ts-jest`.
- Resolución de imports internos terminados en `.js` hacia sus fuentes `.ts`.
- Carga de `setupTests.ts` antes de ejecutar suites.
- Cobertura con el proveedor V8.
- Directorio `coverage` para los resultados.

## Entorno de pruebas

`setupTests.ts` intenta cargar `.env.test`. Por seguridad, el proyecto incluye únicamente `.env.test.template`; el archivo real está ignorado por Git.

La base de datos de pruebas debe ser diferente de la base de desarrollo. El ejemplo utiliza:

```env
POSTGRES_URL=postgresql://postgres:123456@localhost:5433/TODO_TEST
```

Nunca se debe ejecutar una suite que borre datos contra la base de desarrollo o producción.

## Docker Compose

Se añadió `docker-compose.yml` con PostgreSQL 15.3. Lee usuario, contraseña, base de datos y puerto desde variables de entorno, publica el puerto configurado y conserva los datos en `postgres/`.

El directorio `postgres/` permanece ignorado porque contiene datos locales del motor.

## Servidor preparado para pruebas

La clase `Server` ahora:

- Expone `app` como propiedad pública de solo lectura para Supertest.
- Conserva la referencia devuelta por `app.listen`.
- Espera hasta que el servidor haya empezado a escuchar.
- Ofrece `close()` para liberar el puerto después de las pruebas.
- Tipifica el listener mediante `HttpServer` en lugar de `any`.

## Errores de dominio

Se añadió `CustomError`, que contiene:

- Mensaje de error.
- Código de estado HTTP.
- Factorías `badRequest` y `notFound`.

El datasource lanza `CustomError.notFound` cuando una tarea no existe. El controlador responde con el código indicado. Los errores no reconocidos devuelven `500`, evitando presentar errores internos como entradas incorrectas.

## Pruebas añadidas

### Prueba unitaria

`tests/domain/entities/todo.entity.test.ts` comprueba:

- Creación de una entidad válida.
- Cálculo de `isCompleted`.
- Rechazo de ids inválidos.

Esta prueba no necesita PostgreSQL.

### Pruebas de integración

`tests/presentation/todos/routes.test.ts` cubre:

- Listado de tareas.
- Creación de una tarea.
- Validación del cuerpo de creación.
- Actualización de texto y fecha.
- Eliminación y posterior respuesta `404`.

Antes de cada prueba se eliminan las tareas de la base configurada en `.env.test`. Por esta razón es obligatorio utilizar una base exclusiva para pruebas.

## Scripts disponibles

| Script | Función |
|---|---|
| `npm test` | Ejecutar todas las pruebas una vez |
| `npm run test:watch` | Ejecutar Jest en modo observación |
| `npm run test:coverage` | Generar informe de cobertura |
| `npm run prisma:migrate:test` | Aplicar migraciones usando `.env.test` |

## Preparación de la base de pruebas

1. Copiar `.env.test.template` como `.env.test`.
2. Confirmar que `POSTGRES_URL` apunta exclusivamente a una base de pruebas.
3. Iniciar PostgreSQL.
4. Ejecutar `npm run prisma:migrate:test`.
5. Ejecutar `npm test`.

## Validación realizada

- `npx tsc --noEmit`: completado sin errores.
- Prueba unitaria de `TodoEntity`: 1 suite y 2 pruebas superadas.
- Las pruebas de integración fueron creadas pero no ejecutadas, porque no se debe borrar información sin confirmar una base de datos exclusiva de pruebas.
- No se aplicaron migraciones ni se modificaron datos de PostgreSQL.

## Seguridad y control de versiones

- `.env.test` está ignorado para evitar publicar credenciales.
- `.env.test.template` sí debe versionarse.
- `coverage/` está ignorado porque es un artefacto generado.
- `prisma/` debe versionarse porque contiene el esquema y las migraciones.
- No se copiaron las credenciales reales incluidas en el proyecto antiguo de referencia.

## Observación sobre dependencias

Después de añadir el stack de Jest 29, `npm audit` informa 39 vulnerabilidades en el árbol completo, muchas asociadas a dependencias transitivas antiguas del entorno de pruebas. No se ejecutó `npm audit fix --force`, ya que podría introducir cambios incompatibles. Conviene actualizar Jest y `ts-jest` cuando exista una combinación estable compatible con las versiones futuras de TypeScript.

## Resultado

El proyecto mantiene su arquitectura limpia y ahora dispone de infraestructura reproducible para pruebas unitarias, pruebas HTTP de integración, cobertura y una base de datos aislada. El servidor puede abrirse y cerrarse correctamente durante las suites, y los errores de dominio conservan su código HTTP desde la infraestructura hasta la respuesta.
