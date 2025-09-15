# CaseroOk

Plataforma para descubrir y compartir opiniones anónimas sobre viviendas y caseros en España.

## Enlaces

- Web: https://caserook.com
- Mapa de opiniones: https://caserook.com/map
- Añadir opinión: https://caserook.com/add-review
- Aviso legal: https://caserook.com/aviso-legal
- Privacidad: https://caserook.com/politica-privacidad
- Cookies: https://caserook.com/cookies
- Condiciones de uso: https://caserook.com/condiciones-uso
- Términos y condiciones: https://caserook.com/terminosycondiciones

## Características

- Búsqueda y exploración de opiniones por dirección en un mapa interactivo (Leaflet + MapLibre).
- Envío de opiniones anónimas con identificadores hasheados (SHA‑256 en cliente) para agrupar por casero/gestor sin exponer datos personales.
- Inicio de sesión con Supabase (email OTP y Google).
- Moderación y notificaciones internas (función serverless a Telegram).
- SEO básico y páginas legales integradas.

## Tecnologías

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Mapas: Leaflet + MapLibre (estilo OpenFreeMap “liberty”)
- Backend: Supabase (DB, Auth, RPC, Edge Functions)
- Hosting/SSR estático: Vercel

## Requisitos

- Node.js 18 o superior
- Cuenta/proyecto en Supabase
- Claves de API para geocodificación (HERE)

## Puesta en marcha

1) Instalar dependencias

```bash
npm install
```

2) Variables de entorno

Crea un archivo `.env` en la raíz con las claves necesarias (no compartas secretos reales):

```bash
# Frontend
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Geocoding (HERE)
VITE_HERE_API_KEY=tu-clave-de-here

# Opcional: notificaciones a Telegram vía función serverless (Vercel)
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
# Opcional: restringir orígenes
# ALLOWED_ORIGIN=https://caserook.com

# Local (si usas Edge Functions o scripts que necesiten Service Role)
SUPABASE_URL=tu-url-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

3) Desarrollo local

```bash
npm run dev
```

4) Build de producción y preview

```bash
npm run build
npm run preview
```

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo (Vite).
- `npm run build`: Compila TypeScript y construye el sitio para producción.
- `npm run preview`: Sirve la build localmente.
- `npm run lint`: Linter con ESLint.
- `npm run format`: Formatea con Prettier.

## Integraciones y backend

- Supabase
  - Autenticación: email OTP y Google OAuth (callbacks en `/auth/callback`).
  - Tablas y vistas: el frontend consume una vista pública `public_reviews` para el mapa y usa sesiones de review (`review_sessions`) en el flujo del formulario.
  - RPC/Procedimientos: el cliente llama a funciones como `get_gestion_step5_data` y `upsert_gestion_step5_and_mark_review_session` para persistir pasos del formulario.
  - Edge Function: `reject-review` (en `supabase/functions/reject-review.ts`) que requiere `RESEND_API_KEY` y `RESEND_SENDER` para notificar rechazos por email.

- Función serverless (Vercel)
  - Endpoint `api/notify-telegram.ts` para mandar un resumen de reseñas a Telegram sin exponer el token en cliente. Usa `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` y opcionalmente `ALLOWED_ORIGIN`.

- Mapas
  - Capa vectorial con MapLibre y estilo público de OpenFreeMap (no requiere clave).
  - Geocodificación con HERE (requiere `VITE_HERE_API_KEY`).

## Privacidad y anonimización

- Los identificadores sensibles (nombre/teléfono/email del casero) nunca se envían en claro.
- Se normalizan y hashean en el cliente (SHA‑256) para permitir el agrupado de opiniones sin reidentificar.
- Consulta las páginas legales para más detalles:
  - Privacidad: https://caserook.com/politica-privacidad
  - Condiciones de uso: https://caserook.com/condiciones-uso
  - Buenas prácticas: https://caserook.com/buenas-practicas

## Despliegue

- El proyecto está preparado para Vercel (ver `vercel.json` para rewrites y cabeceras).
- Asegúrate de configurar las variables de entorno en Vercel (Frontend y Functions).

## Contribuir

1. Crea una rama descriptiva.
2. Ejecuta `npm run lint` y `npm run format` antes de abrir PR.
3. Describe claramente cambios funcionales o de datos.

## Soporte

- Web: https://caserook.com
- Email de contacto: caserook@gmail.com
