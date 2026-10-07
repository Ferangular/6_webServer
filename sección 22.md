# Sección 22: carga y publicación de imágenes

## Objetivo

La sección 22 incorpora recepción de archivos `multipart/form-data`, almacenamiento local de imágenes y un endpoint para servirlas. Las cargas se clasifican por tipo de entidad: usuarios, productos o categorías.

## Comparación con la sección 21

El proyecto ya incluía:

- Usuarios, categorías y productos.
- Autenticación mediante JWT.
- Creación protegida de categorías y productos.
- MongoDB, relaciones y paginación.

La sección 22 añade:

- `express-fileupload`.
- Identificadores UUID para nombres de archivo.
- Middleware de recepción y validación de archivos.
- Middleware de tipos permitidos.
- Servicio de almacenamiento local.
- Carga individual y múltiple.
- Rutas protegidas de carga.
- Endpoint público de imágenes.
- Directorio `uploads/` ignorado por Git.

## Dependencias añadidas

- `express-fileupload`: procesamiento de peticiones multipart.
- `@types/express-fileupload`: tipos de TypeScript.
- `uuid`: generación de nombres impredecibles y sin colisiones.

## Configuración de Express

El servidor incorpora `express-fileupload` con:

- Límite máximo de 5 MB por archivo.
- Interrupción inmediata al superar el límite.
- Manejo en memoria antes del guardado.

La referencia permitía 50 MB. Se redujo a 5 MB porque el servicio acepta imágenes y mantiene temporalmente el contenido en memoria.

## `FileUploadMiddleware`

El middleware:

1. Busca archivos bajo el campo multipart `file`.
2. Rechaza peticiones sin archivos.
3. Normaliza un archivo y múltiples archivos a `UploadedFile[]`.
4. Rechaza archivos truncados por superar el límite.
5. Guarda los archivos normalizados en `res.locals.files`.

No modifica `req.body`, evitando mezclar contenido confiable del middleware con datos enviados por el cliente.

## `TypeMiddleware`

Solo acepta estos tipos:

- `users`.
- `products`.
- `categories`.

El tipo se obtiene directamente de `req.params.type`, en lugar de analizar manualmente `req.url`. Esto funciona aunque cambie el prefijo de las rutas.

## `FileUploadService`

El servicio:

1. Comprueba el MIME real declarado por el archivo.
2. Acepta PNG, JPEG, GIF y WebP.
3. Rechaza archivos vacíos.
4. Crea el directorio de destino recursivamente.
5. Genera un nombre UUID.
6. Determina la extensión desde el MIME permitido.
7. Espera a que `file.mv` termine antes de responder.

Los archivos se guardan en:

```text
uploads/
├── users/
├── products/
└── categories/
```

## MIME y extensiones

| MIME permitido | Extensión almacenada |
|---|---|
| `image/png` | `.png` |
| `image/jpeg` | `.jpg` |
| `image/gif` | `.gif` |
| `image/webp` | `.webp` |

No se utiliza la extensión original proporcionada por el cliente. Esto evita nombres manipulados y extensiones dobles.

## Endpoints de carga

| Método | Ruta | Protección | Acción |
|---|---|---|---|
| `POST` | `/api/upload/single/:type` | Bearer JWT | Subir una imagen |
| `POST` | `/api/upload/multiple/:type` | Bearer JWT | Subir varias imágenes |

A diferencia de la referencia, ambas rutas exigen autenticación. Una API no debería permitir escritura anónima en el sistema de archivos.

### Ejemplo con cURL

```bash
curl -X POST http://localhost:3000/api/upload/single/products \
  -H "Authorization: Bearer <token>" \
  -F "file=@product.png"
```

Respuesta:

```json
{
  "fileName": "550e8400-e29b-41d4-a716-446655440000.png"
}
```

## Carga múltiple

La carga múltiple ejecuta las operaciones con `Promise.all` y devuelve una lista:

```json
[
  { "fileName": "uuid-1.jpg" },
  { "fileName": "uuid-2.webp" }
]
```

Todas las partes multipart deben utilizar el campo `file`.

## Publicación de imágenes

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/api/images/:type/:img` | Obtener una imagen almacenada |

Antes de servir el archivo se valida:

- Tipo permitido.
- Nombre con formato UUID y extensión conocida.
- Existencia del archivo.

Un nombre inválido devuelve `400`; un archivo inexistente devuelve `404`.

## Protección contra path traversal

El endpoint no utiliza libremente las cadenas recibidas para construir una ruta. Solo acepta:

- Tipos incluidos en una lista cerrada.
- Nombres formados por caracteres hexadecimales, guiones y una extensión permitida.
- Rutas resueltas desde `process.cwd()/uploads`.

Entradas como `../`, separadores de directorio o extensiones arbitrarias son rechazadas.

## Diferencias y mejoras respecto al curso

- Cargas protegidas mediante JWT.
- Límite reducido de 50 MB a 5 MB.
- Soporte añadido para WebP.
- Extensión derivada de una tabla MIME cerrada.
- Archivos vacíos rechazados.
- Archivos truncados responden con `413`.
- Uso de `res.locals.files` en vez de `req.body.files`.
- Uso de `req.params.type` en vez de dividir la URL.
- Creación recursiva y asíncrona de directorios.
- `file.mv` se espera correctamente.
- Ruta independiente de `__dirname` y compatible con ESM.
- Validación contra path traversal al servir imágenes.
- No se imprimen rutas locales ni errores internos.
- Estado `201` al crear archivos.

## Archivos incorporados

```text
src/config/
└── uuid.adapter.ts

src/presentation/
├── file-upload/
│   ├── controller.ts
│   └── routes.ts
├── images/
│   ├── controller.ts
│   └── routes.ts
├── middlewares/
│   ├── file-upload.middleware.ts
│   └── type.middleware.ts
└── services/
    └── file-upload.service.ts
```

También se actualizaron el servidor, las rutas principales, el índice de configuración y `.gitignore`.

## Limitaciones actuales

- Los archivos se almacenan en el disco local del servidor.
- No se asocia todavía el nombre del archivo al documento de usuario, categoría o producto.
- No hay eliminación automática de imágenes antiguas.
- La validación se basa en MIME declarado; para máxima seguridad puede verificarse la firma binaria.
- El almacenamiento local no se comparte entre varias instancias del servidor.

Para producción suele ser preferible utilizar almacenamiento de objetos o servicios como Cloudinary, S3 o Google Cloud Storage.

## Pruebas recomendadas

- Petición sin archivos: `400`.
- Tipo de entidad inválido: `400`.
- MIME no permitido: `400`.
- Archivo vacío: `400`.
- Archivo superior a 5 MB: `413`.
- Carga sin token: `401`.
- Carga individual válida: `201`.
- Carga múltiple válida: `201`.
- Lectura de imagen válida: `200`.
- Imagen inexistente: `404`.
- Intento de path traversal: `400`.

## Validación realizada

- `npx tsc --noEmit`: sin errores.
- `npx tsc --project tsconfig.spec.json`: sin errores.
- Jest: 1 suite y 2 pruebas unitarias superadas.
- No se almacenaron imágenes reales.
- No se modificaron datos de MongoDB o PostgreSQL.

## Resultado

El servidor puede recibir imágenes individuales o múltiples mediante rutas autenticadas, validar tamaño, tipo y destino, almacenarlas con nombres UUID y servirlas mediante una ruta pública protegida contra manipulación de directorios.
