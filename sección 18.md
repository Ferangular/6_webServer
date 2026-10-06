# Sección 18: autenticación con MongoDB, bcrypt y JWT

## Objetivo

La sección 18 introduce un segundo dominio en el servidor: autenticación de usuarios. Las tareas continúan almacenadas en PostgreSQL mediante Prisma, mientras que los usuarios se almacenan en MongoDB mediante Mongoose.

## Comparación con la sección 17

El proyecto ya disponía de:

- REST Server con Express y TypeScript.
- Arquitectura limpia para tareas.
- PostgreSQL y Prisma.
- Pruebas con Jest y Supertest.
- Errores de dominio.

La sección 18 añade:

- MongoDB y Mongoose.
- Modelo persistente de usuarios.
- Registro e inicio de sesión.
- Hash de contraseñas con bcrypt.
- Generación y validación de JWT.
- DTOs de autenticación.
- Entidad de usuario.
- Rutas `/api/auth`.
- Docker Compose con MongoDB y PostgreSQL.

## Arquitectura de datos

El servidor utiliza dos bases de datos:

| Información | Base de datos | Tecnología |
|---|---|---|
| Tareas | PostgreSQL | Prisma |
| Usuarios | MongoDB | Mongoose |

La conexión con MongoDB se establece antes de iniciar Express. Si MongoDB no está disponible, la aplicación no debe empezar a aceptar peticiones de autenticación.

## Modelo de usuario

El modelo de Mongoose contiene:

| Campo | Descripción |
|---|---|
| `name` | Nombre obligatorio |
| `email` | Correo único, normalizado a minúsculas |
| `emailValidated` | Indica si el correo fue validado |
| `password` | Contraseña almacenada como hash |
| `img` | Imagen opcional |
| `roles` | Lista de roles permitidos |

Los roles disponibles son `USER_ROLE` y `ADMIN_ROLE`. El rol predeterminado es `USER_ROLE`.

## DTOs de autenticación

### `RegisterUserDto`

Valida:

- Nombre obligatorio y no vacío.
- Correo obligatorio y con formato válido.
- Contraseña obligatoria.
- Longitud mínima de seis caracteres.
- Normalización del correo a minúsculas.

### `LoginUserDto`

Valida:

- Correo obligatorio y válido.
- Contraseña obligatoria.
- Longitud mínima de seis caracteres.

## Entidad `UserEntity`

La entidad transforma documentos de Mongoose en objetos del dominio y valida sus propiedades obligatorias. La contraseña forma parte de la entidad interna para poder comprobar credenciales, pero se elimina mediante desestructuración antes de construir una respuesta HTTP.

## Adaptador bcrypt

`bcryptAdapter` encapsula las funciones de `bcryptjs`:

- `hash`: genera un salt y cifra la contraseña.
- `compare`: compara una contraseña recibida con el hash almacenado.

Las contraseñas nunca se guardan ni se devuelven en texto plano.

## Adaptador JWT

`JwtAdapter` proporciona:

- `generateToken`: firma un payload usando `JWT_SEED` y una duración configurable.
- `validateToken`: verifica la firma y devuelve el payload o `null`.

El token incluye actualmente el identificador y correo del usuario. La clave `JWT_SEED` debe ser larga, aleatoria, privada y diferente por entorno.

## Servicio de autenticación

### Registro

1. Comprueba si el correo ya existe.
2. Cifra la contraseña.
3. Guarda el usuario en MongoDB.
4. Convierte el documento a `UserEntity`.
5. Elimina la contraseña de la respuesta.
6. Genera un JWT real.
7. Devuelve usuario y token con estado `201`.

### Inicio de sesión

1. Busca al usuario por correo.
2. Comprueba la contraseña con bcrypt.
3. Convierte el documento en entidad.
4. Elimina la contraseña de la respuesta.
5. Genera un JWT.
6. Devuelve usuario y token.

## Endpoints añadidos

| Método | Ruta | Acción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar un usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |

### Ejemplo de registro

```json
{
  "name": "Fernando",
  "email": "fernando@example.com",
  "password": "123456"
}
```

### Ejemplo de respuesta

```json
{
  "user": {
    "id": "...",
    "name": "Fernando",
    "email": "fernando@example.com",
    "emailValidated": false,
    "roles": ["USER_ROLE"]
  },
  "token": "..."
}
```

## Variables de entorno

Además de las variables existentes se requieren:

```env
MONGO_URL=mongodb://mongo-user:123456@localhost:27017
MONGO_DB_NAME=AUTH_DB
MONGO_USER=mongo-user
MONGO_PASSWORD=123456
MONGO_PORT=27017
JWT_SEED=replace-with-a-long-random-secret
```

Las credenciales mostradas son únicamente valores locales de ejemplo.

## Docker Compose

`docker-compose.yml` define dos servicios:

- `mongo-db` con MongoDB 6.0.6.
- `postgres-db` con PostgreSQL 15.3.

Los datos locales se almacenan en `mongo/` y `postgres/`; ambos directorios están ignorados por Git.

## Diferencias y mejoras respecto al código del curso

- Se mantienen las rutas de tareas además de añadir autenticación.
- El registro devuelve `201`.
- El registro genera un JWT real, no el valor temporal `ABC` del proyecto de referencia.
- `validateToken` está implementado; en la referencia aparecía pendiente.
- El correo se normaliza a minúsculas.
- La contraseña nunca aparece en la respuesta.
- Los errores internos no exponen detalles técnicos.
- Se utiliza `roles` de forma consistente en modelo y entidad.
- Se añadió desconexión explícita de Mongoose para futuras pruebas.
- Se mantienen ESM, Express 5, `NodeNext` y los imports con extensión `.js`.

## Dependencias añadidas

- `mongoose`.
- `bcryptjs`.
- `jsonwebtoken`.
- `@types/jsonwebtoken`.

## Puesta en marcha

1. Completar `.env` usando `.env.template`.
2. Elegir una clave segura para `JWT_SEED`.
3. Iniciar las bases de datos:

```bash
docker compose up -d
```

4. Aplicar las migraciones de PostgreSQL si aún no existen.
5. Iniciar el servidor:

```bash
npm run dev
```

## Validación realizada

- `npx tsc --noEmit`: sin errores.
- `npx tsc --project tsconfig.spec.json`: sin errores.
- Prueba unitaria existente de `TodoEntity`: 1 suite y 2 pruebas superadas.
- No se inició Docker ni se escribieron usuarios en MongoDB.
- No se ejecutaron las pruebas de integración contra bases de datos.

## Seguridad pendiente para futuras secciones

- Añadir middleware para validar JWT en rutas privadas.
- Implementar verificación de correo electrónico.
- Limitar intentos de inicio de sesión.
- Configurar CORS y cabeceras de seguridad.
- Rotar y proteger `JWT_SEED` en un gestor de secretos.
- Crear pruebas de integración con una base Mongo exclusiva para test.

## Resultado

El servidor ahora gestiona tareas con PostgreSQL y usuarios con MongoDB. El registro y el inicio de sesión validan datos, protegen contraseñas mediante bcrypt y entregan tokens JWT verificables, manteniendo las funcionalidades y pruebas construidas en secciones anteriores.
