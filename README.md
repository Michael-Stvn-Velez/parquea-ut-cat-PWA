# Parquea UT CAT PWA

Aplicación web progresiva (React + Vite + TypeScript) para gestionar parqueaderos, reservas, portería y métricas administrativas de **Parquea UT CAT Medellín**.

Este documento es un tutorial para clonar, configurar y arrancar el proyecto en tu máquina.

---

## Qué necesitas antes de empezar

| Requisito | Detalle |
|---|---|
| **Node.js** | Versión 20 o superior (recomendado). Comprueba con `node -v` |
| **npm** | Viene con Node.js. Comprueba con `npm -v` |
| **Backend** | API `parquea-ut-cat-backend` corriendo (por defecto en `http://localhost:5258`) |
| **Navegador** | Chrome o Edge recomendados para probar la PWA |

> La PWA no funciona sola: necesita la API backend activa y con CORS habilitado para `http://localhost:5173` (ya está configurado en el backend del proyecto).

---

## Tutorial: inicializar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd parquea-ut-cat-pwa
```

Si ya tienes el código en local, solo entra a la carpeta del proyecto:

```bash
cd parquea-ut-cat-pwa
```

### 2. Instalar dependencias

```bash
npm install
```

Esto descarga React, Vite, TypeScript, `vite-plugin-pwa`, axios y el resto de paquetes listados en `package.json`.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Abre `.env` y verifica que apunte a tu API:

```env
VITE_API_BASE_URL=http://localhost:5258
```

Si el backend corre en otro host o puerto, cámbialo aquí. Vite solo expone variables que empiezan por `VITE_`.

### 4. Arrancar el backend

Antes de levantar el frontend, inicia la API (`parquea-ut-cat-backend`) en `http://localhost:5258` (o la URL que hayas puesto en `.env`).

Puedes comprobar que responde visitando:

```text
http://localhost:5258/api/health
```

### 5. Arrancar el frontend en desarrollo

```bash
npm run dev
```

Abre el navegador en:

```text
http://localhost:5173
```

Deberías ver la pantalla de login / registro. Si la API está bien conectada, puedes entrar a `/health` en la app para validar el estado del backend.

### 6. (Opcional) Build de producción y preview

Para generar el build con service worker e iconos PWA:

```bash
npm run build
npm run preview
```

`preview` sirve el contenido de `dist/` (útil para probar la instalación como PWA en un entorno más cercano a producción).

---

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Compila TypeScript y genera el build de producción + service worker |
| `npm run preview` | Sirve el build de `dist/` |
| `npm run lint` | Ejecuta oxlint |

---

## Instalar como PWA

1. Arranca la API y luego `npm run dev` (o `npm run build && npm run preview`).
2. En Chrome/Edge abre `http://localhost:5173`.
3. Usa el icono de instalación en la barra de direcciones, o menú → **Instalar aplicación**.
4. En Android (Chrome): menú → **Agregar a pantalla de inicio**.
5. En iOS (Safari): Compartir → **Agregar a pantalla de inicio**.

El manifest y el service worker los genera `vite-plugin-pwa` (modo `standalone`, iconos 192/512). En desarrollo el SW está habilitado (`devOptions.enabled: true`).

---

## Roles y pantallas

| Rol | Acceso principal |
|---|---|
| Público | Login, registro (solo ESTUDIANTE/PROFESOR) |
| ESTUDIANTE / PROFESOR | Mis reservas, nueva reserva, ticket/QR, parqueaderos, perfil |
| GUARDA | Portería (verify/check-in/check-out), crear/editar parqueaderos |
| ADMIN | Todo lo de GUARDA + métricas `/admin` + detalle/cancelación de reservas |

Homes por rol:

- Estudiante/Profesor → `/reservas`
- Guarda → `/porteria`
- Admin → `/admin`

El registro público no crea `GUARDA` ni `ADMIN`. Para probar esos roles, cambia el campo `Rol` en MariaDB y vuelve a iniciar sesión.

---

## Flujos API cubiertos

- Auth: register, login, me, refresh automático en 401
- Parqueaderos: list, get, create, update, reserved-spots-teacher
- Reservas: create, my-reservations, getById, cancel
- Access control: parking-availability, verify, check-in, check-out
- Admin: occupancy-stats
- Health: `/api/health`

---

## Estructura del proyecto

```text
src/
  api/         clientes tipados (axios)
  auth/        sesión, tokens, roles
  components/  shell, toasts
  pages/       pantallas por flujo
  routes/      guards de autenticación/autorización
  types/       DTOs del dominio
  styles/      estilos globales
public/        favicon e iconos PWA
```

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---|---|
| La app carga pero fallan login/reservas | ¿Está corriendo el backend? ¿`VITE_API_BASE_URL` es correcta? |
| Error de CORS en consola | Confirma que el backend permite origen `http://localhost:5173` |
| Cambios en `.env` no se aplican | Reinicia `npm run dev` (Vite lee env al arrancar) |
| `npm install` falla | Usa Node 20+; borra `node_modules` y `package-lock.json` solo si es necesario, luego vuelve a instalar |
| No aparece “Instalar aplicación” | Prueba con `build` + `preview`, o usa Chrome/Edge; en HTTP local a veces hay limitaciones |

---

## Notas de desarrollo

- Zona horaria de negocio: `America/Bogota`
- Errores ASP.NET `ProblemDetails` se muestran en español
- Tokens en `localStorage` (`parquea.auth.tokens`)
- Si no defines `VITE_API_BASE_URL`, el cliente usa por defecto `http://localhost:5258`
