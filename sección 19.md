# Sección 19: validación de correo electrónico

## Objetivo

La sección 19 completa el flujo de registro incorporando el envío de un correo de confirmación. El usuario recibe un enlace firmado con JWT y, al abrirlo, el servidor marca su correo como validado en MongoDB.

## Comparación con la sección 18

La sección 18 ya incluía:

- Registro e inicio de sesión.
- MongoDB y Mongoose.
- Hash de contraseñas con bcrypt.
- Generación y validación de JWT.
- Entidad y modelo de usuario.

La sección 19 añade:

- Envío de correos mediante Nodemailer.
- Servicio de correo inyectable.
- Token JWT específico para validar el correo.
- Enlace de confirmación con expiración.
- Endpoint de validación.
- Actualización de `emailValidated` en MongoDB.
- Variables de entorno para proveedor SMTP y URL pública.
- Error de dominio `401 Unauthorized`.

## Dependencias añadidas

- `nodemailer`: transporte y envío de correos.
- `@types/nodemailer`: tipos de TypeScript.

## Servicio de correo

`EmailService` encapsula Nodemailer y recibe mediante el constructor:

- Servicio de correo.
- Cuenta remitente.
- Contraseña o clave de aplicación.

El método `sendEmail` admite destinatario, asunto, HTML y archivos adjuntos opcionales. Devuelve `true` al enviar correctamente y `false` si el proveedor rechaza la operación.

Las credenciales no están escritas en el código fuente; se obtienen de variables de entorno.

## Flujo de registro actualizado

1. Se valida `RegisterUserDto`.
2. Se comprueba que el correo no exista.
3. Se cifra la contraseña.
4. Se guarda el usuario en MongoDB con `emailValidated: false`.
5. Se crea un JWT de validación con el correo.
6. Se construye el enlace público.
7. Se envía el correo de confirmación.
8. Se crea el token normal de autenticación.
9. Se devuelve el usuario sin contraseña y el token.

Si el correo no puede enviarse, la API devuelve un error interno en lugar de confirmar que todo terminó correctamente.

## Token de validación

El token de correo contiene:

```json
{
  "email": "usuario@example.com"
}
```

Su duración es de 15 minutos, menor que la del token normal de sesión. El enlace generado tiene esta forma:

```text
http://localhost:3000/api/auth/validate-email/<token>
```

El token se codifica antes de incorporarlo a la URL.

## Endpoint añadido

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/api/auth/validate-email/:token` | Validar el correo del usuario |

## Flujo de validación

1. El controlador comprueba que exista un token de texto.
2. `JwtAdapter.validateToken` valida firma y expiración.
3. Se extrae el correo del payload.
4. Se busca el usuario en MongoDB.
5. Si existe, `emailValidated` cambia a `true`.
6. Si ya estaba validado, la operación termina correctamente sin escribir de nuevo.
7. La API devuelve un mensaje de confirmación.

## Errores HTTP

| Situación | Estado |
|---|---|
| Token ausente o payload sin correo | `400` |
| Token inválido o expirado | `401` |
| Usuario inexistente | `404` |
| Fallo de JWT, MongoDB o proveedor de correo | `500` |

Se añadió `CustomError.unauthorized` para representar el estado `401` dentro del dominio.

## Inyección de dependencias

La composición se realiza en `AuthRoutes`:

1. Se crea `EmailService` con la configuración del entorno.
2. Se inyecta en `AuthService`.
3. Se inyecta `AuthService` en `AuthController`.
4. El controlador se registra en las rutas.

Esto permite sustituir el proveedor real por un servicio simulado durante las pruebas sin cambiar la lógica de autenticación.

## Variables de entorno añadidas

```env
MAILER_SERVICE=gmail
MAILER_EMAIL=your-email@example.com
MAILER_SECRET_KEY=your-app-password
WEBSERVICE_URL=http://localhost:3000
```

### Recomendaciones

- En Gmail debe utilizarse una contraseña de aplicación, no la contraseña normal.
- `MAILER_SECRET_KEY` nunca debe incluirse en Git.
- `WEBSERVICE_URL` debe apuntar al dominio público en producción.
- Cada entorno debe utilizar sus propias credenciales.

## Diferencias y mejoras respecto a la referencia

- El token de validación expira en 15 minutos.
- El token se codifica para su inclusión segura en la URL.
- La ruta pública conserva el prefijo real `/api/auth`.
- La validación es idempotente: abrir el enlace otra vez no genera un error.
- Un token inválido devuelve `401`, no un error genérico.
- Un usuario inexistente devuelve `404`.
- Los errores inesperados no se imprimen ni se exponen al cliente.
- Se conserva el error original cuando ya es un `CustomError`.
- Las credenciales del proveedor se validan al iniciar la aplicación.
- La interfaz de archivos adjuntos utiliza el nombre correcto `attachments`.

## Puesta en marcha

1. Configurar las nuevas variables en `.env`.
2. Crear una contraseña de aplicación en el proveedor de correo.
3. Asegurar que MongoDB esté disponible.
4. Iniciar el servidor:

```bash
npm run dev
```

5. Registrar un usuario mediante `POST /api/auth/register`.
6. Abrir el enlace recibido por correo.
7. Comprobar en MongoDB que `emailValidated` sea `true`.

## Pruebas recomendadas

- Simular `EmailService` para verificar el registro sin enviar correos reales.
- Validar un token correcto.
- Rechazar un token expirado o alterado.
- Responder `404` cuando el correo del token no exista.
- Comprobar que una segunda validación sea idempotente.
- Comprobar que un fallo del proveedor produzca `500`.

## Validación realizada

- `npx tsc --noEmit`: sin errores.
- `npx tsc --project tsconfig.spec.json`: sin errores.
- Jest: 1 suite y 2 pruebas unitarias superadas.
- No se enviaron correos reales.
- No se modificaron usuarios en MongoDB.
- No se ejecutaron pruebas de integración contra bases de datos.

## Observación de seguridad

`npm audit` informa actualmente 47 vulnerabilidades en el árbol completo de dependencias, incluida una crítica. No se ejecutó `npm audit fix --force` porque puede introducir cambios incompatibles. Debe revisarse el informe detallado y actualizarse cada paquete de manera controlada antes de desplegar en producción.

## Resultado

El registro ahora entrega un correo de confirmación con un JWT temporal. El endpoint de validación verifica el token, localiza al usuario y actualiza `emailValidated`, manteniendo separadas la presentación, la autenticación y la infraestructura de correo.
