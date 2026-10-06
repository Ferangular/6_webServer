# Sección 20: middleware JWT, categorías y paginación

## Objetivo

La sección 20 utiliza los tokens generados durante el login para proteger operaciones privadas. También introduce categorías almacenadas en MongoDB, relaciones con usuarios y respuestas paginadas.

## Comparación con la sección 19

El proyecto ya incluía:

- Registro e inicio de sesión.
- Contraseñas protegidas con bcrypt.
- Tokens JWT.
- Validación de correo electrónico.
- MongoDB para usuarios y PostgreSQL para tareas.

La sección 20 añade:

- Middleware de autenticación JWT.
- Recuperación del usuario autenticado desde MongoDB.
- Modelo de categorías.
- Modelo base de productos para secciones posteriores.
- Creación protegida de categorías.
- Listado público paginado.
- DTOs de categorías y paginación.
- Servicio, controlador y rutas de categorías.

## Middleware de autenticación

`AuthMiddleware.validateJWT` ejecuta el siguiente flujo:

1. Lee la cabecera `Authorization`.
2. Exige exactamente el formato `Bearer <token>`.
3. Valida firma y expiración mediante `JwtAdapter`.
4. Comprueba que el payload contenga el id del usuario.
5. Busca al usuario en MongoDB.
6. Convierte el documento en una `UserEntity`.
7. Guarda la entidad en `res.locals.user`.
8. Continúa hacia el controlador mediante `next()`.

Si falta el token, tiene formato incorrecto, está vencido o su usuario ya no existe, responde con `401`.

## Mejora de seguridad sobre la referencia

El proyecto del curso almacenaba al usuario autenticado en `req.body.user`. Esta implementación utiliza `res.locals.user` para separar los datos confiables del servidor del cuerpo controlado por el cliente. Así se evita que un usuario intente suplantar la identidad enviando una propiedad `user` en el JSON.

Tampoco se imprimen tokens ni errores internos en la consola.

## Modelo de categoría

| Campo | Descripción |
|---|---|
| `name` | Nombre obligatorio, único, sin espacios exteriores y en minúsculas |
| `available` | Estado lógico; predeterminado en `true` |
| `user` | Referencia obligatoria al usuario creador |
| `createdAt` | Fecha automática de creación |
| `updatedAt` | Fecha automática de actualización |

La relación con el usuario se almacena como `ObjectId` con referencia al modelo `User`.

## Modelo base de producto

Aunque todavía no se publican rutas de productos, se añadió el modelo presentado en la sección:

- Nombre único.
- Estado disponible.
- Precio no negativo.
- Descripción opcional.
- Referencia al usuario creador.
- Referencia obligatoria a una categoría.
- Fechas automáticas.

Este modelo prepara la siguiente etapa del curso sin exponer funcionalidad incompleta.

## `CreateCategoryDto`

Valida y normaliza:

- `name` debe ser un texto no vacío.
- El nombre se guarda sin espacios exteriores y en minúsculas.
- `available` debe ser booleano cuando se proporciona.
- El valor predeterminado de `available` es `true`.

A diferencia de la referencia, valores como la cadena `"false"` no se convierten silenciosamente. Una API JSON debe recibir booleanos JSON reales.

## `PaginationDto`

Valida:

- `page` y `limit` deben ser enteros.
- `page` debe ser mayor que cero.
- `limit` debe estar entre 1 y 100.
- Valores predeterminados: página 1 y límite 10.

El límite máximo evita consultas accidentales o abusivas con miles de documentos.

## Servicio de categorías

### Crear categoría

1. Comprueba que el nombre no esté registrado.
2. Asocia la categoría con el id del usuario autenticado.
3. Guarda el documento en MongoDB.
4. Devuelve únicamente id, nombre y disponibilidad.

### Listar categorías

1. Cuenta los documentos y obtiene la página en paralelo.
2. Ordena alfabéticamente por nombre.
3. Aplica `skip` y `limit`.
4. Calcula la cantidad total de páginas.
5. Construye enlaces `next` y `prev` solo cuando existen.
6. Devuelve una representación pública de las categorías.

## Endpoints añadidos

| Método | Ruta | Protección | Acción |
|---|---|---|---|
| `GET` | `/api/categories` | Pública | Listar categorías paginadas |
| `POST` | `/api/categories` | Bearer JWT | Crear una categoría |

### Crear una categoría

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Computers",
  "available": true
}
```

### Consultar una página

```http
GET /api/categories?page=2&limit=10
```

### Respuesta paginada

```json
{
  "page": 2,
  "limit": 10,
  "total": 35,
  "pages": 4,
  "next": "/api/categories?page=3&limit=10",
  "prev": "/api/categories?page=1&limit=10",
  "categories": []
}
```

## Composición de dependencias

`CategoryRoutes`:

1. Crea `CategoryService`.
2. Lo inyecta en `CategoryController`.
3. Registra el listado público.
4. Coloca `AuthMiddleware.validateJWT` antes del controlador de creación.

El controlador solo recibe una petición de creación cuando el middleware ya identificó un usuario válido.

## Archivos incorporados

```text
src/data/mongo/models/
├── category.model.ts
└── product.model.ts

src/domain/dtos/
├── category/create-category.dto.ts
└── shared/pagination.dto.ts

src/presentation/
├── categories/
│   ├── controller.ts
│   └── routes.ts
├── middlewares/auth.middleware.ts
└── services/category.service.ts
```

También se actualizaron los índices de dominio y datos, y las rutas principales.

## Diferencias y mejoras respecto al curso

- Usuario autenticado almacenado en `res.locals`, no en el body.
- Formato Bearer comprobado estrictamente.
- Payload JWT validado antes de consultar MongoDB.
- Excepciones inesperadas responden con `500` sin exponer detalles.
- Paginación limitada a 100 elementos.
- `next` es `null` en la última página.
- Categorías ordenadas por nombre.
- Nombre normalizado para reducir duplicados por mayúsculas.
- Valores booleanos estrictos.
- Fechas automáticas mediante `timestamps`.
- Precio de producto restringido a valores no negativos.

## Pruebas recomendadas

- Middleware sin cabecera: `401`.
- Esquema distinto de Bearer: `401`.
- Token expirado o alterado: `401`.
- Token de un usuario eliminado: `401`.
- Creación autenticada: `201`.
- Nombre duplicado: `400`.
- Paginación inválida: `400`.
- Primera, intermedia y última página.
- Intento de suplantación mediante `body.user`.

## Validación realizada

- `npx tsc --noEmit`: sin errores.
- `npx tsc --project tsconfig.spec.json`: sin errores.
- Jest: 1 suite y 2 pruebas unitarias superadas.
- No se inició MongoDB ni se escribieron categorías.
- No se ejecutaron pruebas de integración contra bases de datos.

## Resultado

El token JWT ya se utiliza para autenticar operaciones privadas. Los usuarios autenticados pueden crear categorías asociadas a su identidad, mientras cualquier cliente puede consultar categorías mediante una respuesta paginada y limitada.
