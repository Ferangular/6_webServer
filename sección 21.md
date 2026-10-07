# Sección 21: productos, relaciones y referencias en MongoDB

## Objetivo

La sección 21 incorpora productos al REST Server. Cada producto pertenece a una categoría y conserva la referencia del usuario autenticado que lo creó. El listado utiliza paginación y `populate` para resolver las referencias de MongoDB.

## Comparación con la sección 20

La sección anterior ya incluía:

- Autenticación mediante Bearer JWT.
- Recuperación segura del usuario autenticado.
- Categorías asociadas a usuarios.
- Paginación reutilizable.
- Modelo preliminar de productos.

La sección 21 añade:

- `CreateProductDto`.
- `ProductService`.
- `ProductController`.
- `ProductRoutes`.
- Creación autenticada de productos.
- Listado público paginado.
- Validación de referencias MongoDB.
- Verificación de existencia y disponibilidad de la categoría.
- Resolución de usuario y categoría mediante `populate`.

## Modelo de producto

El modelo creado en la sección anterior se utiliza ahora desde la API:

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `String` | Nombre obligatorio y único |
| `available` | `Boolean` | Controla si aparece en listados públicos |
| `price` | `Number` | Precio no negativo |
| `description` | `String?` | Descripción opcional |
| `user` | `ObjectId` | Usuario que creó el producto |
| `category` | `ObjectId` | Categoría a la que pertenece |
| `createdAt` | `Date` | Fecha automática de creación |
| `updatedAt` | `Date` | Fecha automática de actualización |

## `CreateProductDto`

El DTO valida:

- Nombre obligatorio y no vacío.
- `available` como booleano real.
- Precio numérico, finito y no negativo.
- Descripción opcional de texto.
- Identificador de usuario válido para MongoDB.
- Identificador de categoría válido para MongoDB.

El id del usuario no se acepta como dato confiable del cliente. El controlador lo obtiene de `res.locals.user`, establecido previamente por el middleware JWT.

## Flujo de creación

1. `AuthMiddleware` valida el Bearer token.
2. Recupera al usuario desde MongoDB.
3. Guarda `UserEntity` en `res.locals.user`.
4. El controlador combina el body con el id confiable del usuario.
5. `CreateProductDto` valida y normaliza los datos.
6. El servicio busca en paralelo un nombre duplicado y la categoría.
7. Rechaza categorías inexistentes o no disponibles.
8. Guarda el producto.
9. Resuelve referencias públicas de usuario y categoría.
10. Devuelve el documento con estado `201`.

## Flujo de listado

1. `PaginationDto` valida `page` y `limit`.
2. El servicio filtra productos disponibles.
3. Cuenta y consulta en paralelo.
4. Ordena por nombre.
5. Aplica `skip` y `limit`.
6. Ejecuta `populate` de usuario y categoría.
7. Calcula páginas y enlaces de navegación.
8. Devuelve la colección paginada.

## Endpoints añadidos

| Método | Ruta | Protección | Acción |
|---|---|---|---|
| `GET` | `/api/products` | Pública | Listar productos disponibles |
| `POST` | `/api/products` | Bearer JWT | Crear un producto |

### Ejemplo de creación

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "Mechanical keyboard",
  "price": 89.99,
  "description": "Keyboard with mechanical switches",
  "available": true,
  "category": "64f1b5d46ab64a1c45678901"
}
```

No debe enviarse `user`; el servidor lo obtiene del token.

### Ejemplo de listado

```http
GET /api/products?page=1&limit=10
```

```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "pages": 1,
  "next": null,
  "prev": null,
  "products": []
}
```

## Uso seguro de `populate`

La referencia del curso utilizaba `populate('user')`, lo que puede incluir el hash de contraseña y otros campos internos. Esta implementación limita los campos:

- Usuario: `name email`.
- Categoría: `name available`.

Así se evita exponer `password`, roles internos u otros datos innecesarios.

## Errores HTTP

| Situación | Estado |
|---|---|
| Entrada o ObjectId inválido | `400` |
| Token ausente o inválido | `401` |
| Categoría inexistente | `404` |
| Categoría no disponible | `400` |
| Producto duplicado | `400` |
| Fallo inesperado de MongoDB | `500` |

## Diferencias y mejoras respecto al curso

- El usuario proviene de `res.locals`, no de `req.body`.
- Se valida el ObjectId del usuario y la categoría.
- Se comprueba que la categoría exista antes de guardar.
- Se rechaza una categoría marcada como no disponible.
- Precio obligatorio como número válido y no negativo.
- Booleanos estrictos, sin conversiones ambiguas.
- Solo se listan productos disponibles.
- Productos ordenados alfabéticamente.
- `next` es `null` al llegar a la última página.
- `populate` limita los campos públicos.
- Los errores internos no exponen información del motor.
- Nombre duplicado y categoría se consultan en paralelo.

## Archivos incorporados

```text
src/domain/dtos/products/
└── create-product.dto.ts

src/presentation/products/
├── controller.ts
└── routes.ts

src/presentation/services/
└── product.service.ts
```

También se actualizaron el índice de DTOs y las rutas principales.

## Pruebas recomendadas

- Crear un producto con token válido.
- Rechazar creación sin token.
- Impedir suplantación enviando otro `user` en el body.
- Rechazar ids de categoría inválidos.
- Responder `404` para categorías inexistentes.
- Rechazar categorías no disponibles.
- Rechazar precios negativos o no numéricos.
- Rechazar nombres duplicados.
- Comprobar que `populate` no incluya contraseñas.
- Comprobar filtros y enlaces de paginación.

## Validación realizada

- `npx tsc --noEmit`: sin errores.
- `npx tsc --project tsconfig.spec.json`: sin errores.
- Jest: 1 suite y 2 pruebas unitarias superadas.
- No se crearon productos ni se modificó MongoDB.
- No se ejecutaron pruebas de integración contra bases de datos.

## Resultado

El REST Server ahora permite crear productos autenticados y listarlos públicamente con paginación. Cada producto queda relacionado con su autor y categoría, mientras las respuestas resuelven únicamente los campos públicos necesarios.
