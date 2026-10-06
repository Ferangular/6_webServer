# Sección 16: arquitectura limpia y patrón repositorio

## Objetivo

La sección 16 reorganiza el REST Server para separar las reglas del negocio, el acceso a PostgreSQL y la presentación HTTP. Prisma deja de estar acoplado al controlador: ahora se utiliza detrás de un datasource y un repositorio.

## Comparación con el proyecto al finalizar la sección 15

El proyecto ya disponía de Express, PostgreSQL, Prisma, DTOs y un CRUD persistente. Sin embargo, el controlador importaba y utilizaba directamente `PrismaClient`. Esto hacía que la presentación conociera la tecnología concreta de base de datos.

El proyecto de referencia de la sección 16 añade:

- Entidad de dominio `TodoEntity`.
- Contrato abstracto `TodoDatasource`.
- Contrato abstracto `TodoRepository`.
- Implementación Prisma del datasource.
- Implementación del repositorio.
- Casos de uso para las cinco operaciones CRUD.
- Inyección de dependencias desde las rutas.
- Compresión de respuestas HTTP.

## Arquitectura implementada

### Dominio

El directorio `src/domain` no depende de Express ni de Prisma. Contiene:

- `TodoEntity`: representación de una tarea dentro del negocio.
- DTOs: validación y transformación de datos de entrada.
- `TodoDatasource`: operaciones que debe proporcionar cualquier origen de datos.
- `TodoRepository`: operaciones que consumen los casos de uso.
- Casos de uso: `CreateTodo`, `GetTodos`, `GetTodo`, `UpdateTodo` y `DeleteTodo`.

### Infraestructura

El directorio `src/infrastructure` contiene los detalles técnicos:

- `TodoDatasourceImpl` ejecuta las consultas con Prisma.
- Convierte cada registro de PostgreSQL en una `TodoEntity`.
- `TodoRepositoryImpl` implementa el contrato del dominio y delega en el datasource.

### Presentación

El directorio `src/presentation` se ocupa de HTTP:

- Las rutas crean el datasource, el repositorio y el controlador.
- El controlador recibe `TodoRepository` mediante inyección de dependencias.
- Cada endpoint valida la entrada y ejecuta un caso de uso.
- El controlador ya no importa ni utiliza Prisma.

## Flujo de una petición

```text
Cliente HTTP
    -> ruta Express
    -> TodosController
    -> caso de uso
    -> TodoRepository
    -> TodoDatasource
    -> Prisma Client
    -> PostgreSQL
```

La respuesta recorre el camino inverso. El datasource transforma primero el registro de Prisma en una entidad del dominio.

## Responsabilidad de cada capa

| Capa | Responsabilidad | Conoce Prisma |
|---|---|---|
| Presentación | HTTP, códigos de estado y JSON | No |
| Casos de uso | Orquestar una operación de negocio | No |
| Repositorio de dominio | Definir las operaciones disponibles | No |
| Repositorio de infraestructura | Delegar en el datasource | No |
| Datasource de infraestructura | Consultar PostgreSQL | Sí |
| Entidad | Representar y validar el modelo de negocio | No |

## Mejoras aplicadas respecto al código del curso

- Se conservaron ESM, `NodeNext`, Express 5 y extensiones `.js` en imports internos.
- La entidad lanza objetos `Error` en lugar de cadenas.
- Los ids se validan como enteros positivos antes de ejecutar un caso de uso.
- Los errores de registros inexistentes responden con `404`; las entradas inválidas responden con `400`.
- La creación conserva el código HTTP `201`.
- `findUnique` se utiliza para búsquedas por clave primaria.
- Las tareas se devuelven ordenadas por `id`.
- `completedAt` puede ser una fecha o `null`.
- Se añadió `compression` con sus tipos para comprimir respuestas HTTP.

## Archivos añadidos

```text
src/domain/
├── datasources/todo.datasource.ts
├── entities/todo.entity.ts
├── repositories/todo.repository.ts
├── use-cases/todo/
│   ├── create-todo.ts
│   ├── delete-todo.ts
│   ├── get-todo.ts
│   ├── get-todos.ts
│   └── update-todo.ts
└── index.ts

src/infrastructure/
├── datasources/todo.datasource.impl.ts
└── repositories/todo.repository.impl.ts
```

También se actualizaron el controlador, las rutas de tareas y el servidor Express.

## Inyección de dependencias

La composición se realiza en `TodoRoutes`:

1. Se crea `TodoDatasourceImpl`.
2. Se inyecta el datasource en `TodoRepositoryImpl`.
3. Se inyecta el repositorio en `TodosController`.
4. Los métodos del controlador se registran en el router.

Esta composición permite reemplazar Prisma por otro datasource sin cambiar los casos de uso ni el controlador.

## Endpoints conservados

| Método | Ruta | Caso de uso |
|---|---|---|
| `GET` | `/api/todos` | `GetTodos` |
| `GET` | `/api/todos/:id` | `GetTodo` |
| `POST` | `/api/todos` | `CreateTodo` |
| `PUT` | `/api/todos/:id` | `UpdateTodo` |
| `DELETE` | `/api/todos/:id` | `DeleteTodo` |

## Sobre `.gitignore`

El directorio local `postgres/` puede permanecer ignorado porque contiene datos de ejecución. El directorio `prisma/` no debe ignorarse: su esquema y sus migraciones son código fuente necesario para reproducir la base de datos y deben versionarse.

## Validación realizada

- Se instalaron `compression` y `@types/compression`.
- TypeScript se validó mediante `npx tsc --noEmit` sin errores.
- No se aplicaron migraciones ni se modificaron datos de PostgreSQL.
- `npm` sigue informando 10 vulnerabilidades en el árbol de dependencias; no se ejecutó una corrección forzada.

## Resultado

El servidor conserva el mismo contrato REST, pero queda desacoplado de Prisma y organizado en capas. La lógica puede probarse o reutilizarse mediante contratos, y la infraestructura de persistencia puede sustituirse sin cambiar la presentación ni los casos de uso.
