# Guía de Integración Next.js + GeneXus GAM

Este documento explica la arquitectura y los componentes técnicos utilizados para conectar esta aplicación Next.js con el backend de GeneXus GAM.

## 1. Arquitectura de Conexión (CORS Bypass)

Debido a que los navegadores bloquean peticiones directas desde `localhost:3000` a otros puertos o dominios si no hay cabeceras CORS correctas, hemos implementado un **API Proxy**.

### Funcionamiento del Proxy
- **Ruta Local**: La aplicación realiza peticiones a `/api/proxy/[...path]`.
- **Servidor Intermedio**: Next.js recibe esa petición en el servidor (Node.js).
- **Forwarding**: El servidor de Next.js reenvía la petición al servidor real de GeneXus (`http://localhost:8089/...`).
- **Beneficio**: Como la petición final se hace de servidor a servidor, el navegador no impone restricciones de CORS.

> [!NOTE]
> El controlador del proxy se encuentra en: `src/app/api/proxy/[...path]/route.ts`.

---

## 2. Flujo de Autenticación

### Step 1: Login (`authService.ts`)
Se envía una petición `POST` al endpoint `/oauth/access_token` de GAM con:
- `grant_type`: `password`
- `client_id`: El hash de la aplicación GAM.
- `scope`: `fullcontrol`

### Step 2: Persistencia de Sesión (`AuthContext.tsx`)
Una vez recibido el `access_token`:
1. **LocalStorage**: Se guarda para uso del lado del cliente.
2. **Cookies**: Se guarda en una cookie llamada `gam_access_token`.
   - **Fix Crítico**: Si GAM devuelve `expires_in: 0`, el sistema fuerza por defecto 3600 segundos (1 hora) para evitar que la sesión expire inmediatamente.

### Step 3: Obtención del Perfil
Se llama a `/oauth/gam/userinfo` enviando el Bearer Token.
- **Mapeo de Datos**: El backend devuelve snake_case (`first_name`), y el frontend lo mapea automáticamente a camelCase (`firstName`) en el servicio.

---

## 3. Protección de Rutas (Middleware)

La seguridad se gestiona en `src/proxy.ts` (Next.js Middleware).

- **Lógica**: Antes de cargar cualquier página protegida (Dashboard, Pacientes, etc.), el middleware verifica si existe la cookie `gam_access_token`.
- **Redirección**:
  - Si no hay token -> Redirige a `/login`.
  - Si hay token e intentas entrar a `/login` -> Redirige a `/dashboard`.

---

## 4. Variables de Entorno

Para que la conexión funcione, se deben configurar los siguientes valores (normalmente en `.env.local`):

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_GAM_BASE_URL` | Base del servidor GeneXus | `http://localhost:8089/Proyecto` |
| `NEXT_PUBLIC_GAM_CLIENT_ID` | Hash ID de la App en GAM | `SxGuEahcWCnY8vATy67Ew...` |
| `NEXT_PUBLIC_API_BASE_URL` | Base para servicios REST | `.../rest` |

---

## 5. Resumen de Archivos Clave

1. [`auth.ts`](file:///c:/Proyectos/Next/Ambulatorio/src/services/auth.ts): Definición de llamadas a la API de GAM.
2. [`AuthContext.tsx`](file:///c:/Proyectos/Next/Ambulatorio/src/context/AuthContext.tsx): Manejo global del estado de usuario (Provider).
3. [`route.ts`](file:///c:/Proyectos/Next/Ambulatorio/src/app/api/proxy/%5B...path%5D/route.ts): El motor del proxy que evita errores de CORS.
4. [`proxy.ts`](file:///c:/Proyectos/Next/Ambulatorio/src/proxy.ts): Reglas de navegación y protección de rutas.
