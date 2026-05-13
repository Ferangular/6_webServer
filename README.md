# Node con TypeScript - Web Server de Comics

Este es un servidor web desarrollado con Node.js, TypeScript y Express que sirve una aplicación web para visualizar personajes de cómics de Marvel y DC.

## 🦸‍♂️ Funcionalidad de la Aplicación

La aplicación web muestra una interfaz interactiva con las siguientes características:

- **Catálogo de Personajes**: Muestra una lista de personajes de cómics con sus imágenes, nombres y nombres reales
- **Navegación por Editoriales**: Permite filtrar entre Marvel y DC Comics
- **Diseño Responsivo**: Interfaz moderna utilizando Bootstrap 5 y animaciones con Animate.css
- **Arquitectura SPA**: Single Page Application con routing del lado del servidor

### Ejemplo de Funcionamiento

Al iniciar la aplicación, podrás ver:

1. **Página Principal**: Lista de personajes de Marvel Comics con:
   - Imagen del personaje
   - Nombre del superhéroe
   - Nombre real del personaje
   - Título del cómic y número de edición
   - Enlace "Más.." para ver detalles adicionales

2. **Barra de Navegación**: Con opciones para:
   - Asociaciones
   - Marvel
   - DC
   - Búsqueda

3. **URL Dinámica**: La aplicación funciona en `http://localhost:3000/marvel` y otras rutas

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Scripts Disponibles

- **Desarrollo**: `npm run dev` - Inicia el servidor con recarga automática
- **Construcción**: `npm run build` - Compila TypeScript a JavaScript
- **Producción**: `npm run start` - Inicia el servidor en modo producción
- **Con Browser**: `npm run start:browser` - Construye, abre el navegador e inicia el servidor

### 3. Iniciar la Aplicación

#### Opción 1: Desarrollo (recomendado para cambios)
```bash
npm run dev
```

#### Opción 2: Producción con navegador automático
```bash
npm run start:browser
```

#### Opción 3: Producción manual
```bash
npm run build
npm run start
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Arquitectura del Proyecto

```
src/
├── config/
│   └── envs.ts          # Configuración de variables de entorno
├── presentation/
│   └── server.ts        # Clase del servidor Express
├── app.ts               # Punto de entrada principal
├── app.http.ts          # Configuración HTTP
└── app.http2.ts         # Configuración HTTP/2

public/
├── assets/
│   ├── heroes/          # Imágenes de personajes
│   └── index.js         # JavaScript del frontend
├── back/                # Recursos adicionales
└── index.html           # Página principal
```

## 🔧 Configuración de TypeScript

El proyecto utiliza TypeScript con las siguientes configuraciones:

### Dependencias de Desarrollo
```bash
npm i -D typescript @types/node ts-node-dev rimraf
```

### Configuración Inicial
```bash
npx tsc --init --outDir dist/ --rootDir src
```

### Scripts de Package.json
```json
{
  "dev": "tsnd --respawn --clear --esm src/app.ts",
  "build": "rimraf ./dist && tsc",
  "start": "npm run build && node dist/app.js",
  "start:browser": "npm run build && start http://localhost:3000 && node dist/app.js",
  "http": "tsx watch src/app.http.ts",
  "http2": "tsx watch src/app.http2.ts"
}
```

## 🔒 Certificados SSL (Opcional)

Para desarrollo con HTTPS, necesitas configurar OpenSSL en tu sistema. Sigue estos pasos:

### 1. Configurar Variables de Entorno para OpenSSL

Si `openssl` no es reconocido en PowerShell, debes añadirlo a las variables de entorno PATH:

1. **Busca la ubicación de OpenSSL**: Generalmente se encuentra en:
   - `C:\Program Files\Git\usr\bin` (si tienes Git instalado)
   - `C:\Program Files\OpenSSL-Win64\bin` (instalación directa)

2. **Añade al PATH del sistema**:
   - Abre "Variables de entorno del sistema"
   - Busca la variable `Path` y haz clic en "Editar"
   - Añade una nueva entrada con la ruta de OpenSSL
   - Guarda los cambios y reinicia PowerShell

3. **Verifica la instalación**:
   ```bash
   openssl
   ```

   Deberías ver la ayuda de OpenSSL como se muestra en la siguiente imagen:

![OpenSSL en PowerShell](docs/images/openssl_powerhell.png)

### 2. Generar Certificados SSL

Una vez configurado OpenSSL, genera los certificados con:

```bash
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
```

Este comando creará:
- `server.key`: Clave privada del servidor
- `server.crt`: Certificado público válido por 365 días

### 3. Usar los Certificados

Los certificados generados pueden ser utilizados en tu servidor HTTPS para desarrollo local.

# Instalación de Prisma + PostgreSQL + Docker en Node.js + TypeScript + ESM

## 1. Instalar dependencias

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install -D prisma @types/pg
```

---

## 2. Inicializar Prisma

```bash
npx prisma init
```

Esto creará:

```txt
prisma/
.env
prisma.config.ts
```

---

# 3. Configurar Docker PostgreSQL

Crear:

```txt
docker-compose.yml
```

```yml
services:

  postgres-db:
    image: postgres:17.5

    container_name: postgres-webserver

    restart: always

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: TODO

    ports:
      - "5432:5432"

    volumes:
      - ./postgres:/var/lib/postgresql/data
```

---

## 4. Configurar `.env`

```env
PORT=3000
PUBLIC_PATH=public

DATABASE_URL="postgresql://postgres:123456@localhost:5432/TODO?schema=public"

POSTGRES_URL=postgresql://postgres:123456@localhost:5432/TODO
POSTGRES_USER=postgres
POSTGRES_DB=TODO
POSTGRES_PORT=5432
POSTGRES_PASSWORD=123456

NODE_ENV=development
```

---

# 5. IMPORTANTE - Error común Prisma 7

Prisma 7 NO usa:

```env
POSTGRES_URL
```

Prisma necesita:

```env
DATABASE_URL
```

Si no existe, aparecerá:

```txt
PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL
```

---

## 6. Configurar `prisma.config.ts`

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

## 7. Configurar `prisma/schema.prisma`

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
}

model Todo {
  id          Int       @id @default(autoincrement())
  text        String
  completedAt DateTime?
}
```

---

# 8. IMPORTANTE - Configuración ESM correcta

El proyecto usa:

```json
"type": "module"
```

y TypeScript:

```json
"module": "NodeNext",
"moduleResolution": "NodeNext"
```

Por tanto:

## Prisma debe usar:

```prisma
moduleFormat = "esm"
```

NO:

```prisma
moduleFormat = "cjs"
```

---

## 9. Configurar `tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",

    "target": "ES2023",

    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "lib": ["ES2023"],
    "types": ["node"],

    "sourceMap": true,

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,

    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    "resolveJsonModule": true,

    "ignoreDeprecations": "6.0"
  },

  "include": ["src/**/*"],

  "exclude": ["node_modules", "dist"]
}
```

---

# 10. IMPORTANTE - Imports ESM

Con:

```json
"type": "module"
```

los imports internos deben llevar `.js`:

```ts
import { AppRoutes } from './presentation/routes.js';
```

aunque el archivo real sea `.ts`.

---

## 11. Scripts recomendados en `package.json`

```json
{
  "scripts": {
    "dev": "tsx watch src/app.ts",

    "build": "rimraf ./dist && tsc",

    "start": "node dist/app.js",

    "start:prod": "npm run prisma:migrate:prod && npm run start",

    "start:browser": "npm run build && start http://localhost:3000 && node dist/app.js",

    "prisma:generate": "prisma generate",

    "prisma:migrate": "prisma migrate dev",

    "prisma:migrate:prod": "prisma migrate deploy",

    "prisma:studio": "prisma studio",

    "docker:build": "docker compose -p webserver build",

    "docker:run": "docker compose -p webserver up -d",

    "docker:down": "docker compose -p webserver down"
  }
}
```

---

# 12. Levantar PostgreSQL Docker

MUY IMPORTANTE:

Antes de ejecutar migraciones Prisma, PostgreSQL debe estar levantado.

## Levantar Docker

```bash
npm run docker:run
```

o:

```bash
docker compose -p webserver up -d
```

---

# 13. Error común Docker apagado

Si PostgreSQL no está levantado aparecerá:

```txt
P1001: Can't reach database server at localhost:5432
```

Solución:

```bash
npm run docker:run
```

---

## 14. Crear primera migración

```bash
npm run prisma:migrate
```

Nombre sugerido:

```txt
init
```

Ejemplo correcto:

```txt
Applying migration `20260512094132_init`

Your database is now in sync with your schema.
```

---

## 15. Generar Prisma Client

```bash
npm run prisma:generate
```

---

## 16. Usar Prisma Client

Crear:

```txt
src/data/postgres/index.ts
```

```ts
import { PrismaClient } from '../../generated/prisma/client.js';

export const prisma = new PrismaClient();
```

---

## 17. Abrir Prisma Studio

```bash
npm run prisma:studio
```

---

## 18. Comandos útiles

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Producción

```bash
npm run start:prod
```

### Levantar Docker

```bash
npm run docker:run
```

### Parar Docker

```bash
npm run docker:down
```

### Ver contenedores

```bash
docker ps
```

### Ver logs PostgreSQL

```bash
docker logs postgres-webserver
```

## 📚 Documentación y Recursos

- [Express.js Documentation](https://expressjs.com/)
- [HTTP/2 Book](https://hpbn.co/http2/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TS-Node-dev](https://www.npmjs.com/package/ts-node-dev)
- [Prisma Documentation](https://www.prisma.io/docs/prisma-orm/quickstart/postgresql)

## 🎯 Características Técnicas

- **Node.js** con **TypeScript**
- **Express** como framework web
- **Bootstrap 5** para el diseño UI
- **Animate.css** para animaciones
- **ES Modules** para imports modernos
- **Hot Reload** en modo desarrollo
- **Static File Serving** para recursos frontend
