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

## 📚 Documentación y Recursos

- [Express.js Documentation](https://expressjs.com/)
- [HTTP/2 Book](https://hpbn.co/http2/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [TS-Node-dev](https://www.npmjs.com/package/ts-node-dev)

## 🎯 Características Técnicas

- **Node.js** con **TypeScript**
- **Express** como framework web
- **Bootstrap 5** para el diseño UI
- **Animate.css** para animaciones
- **ES Modules** para imports modernos
- **Hot Reload** en modo desarrollo
- **Static File Serving** para recursos frontend
