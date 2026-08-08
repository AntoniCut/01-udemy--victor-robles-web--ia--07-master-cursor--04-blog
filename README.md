# GamerPulse - Blog de Videojuegos

Blog de noticias y artículos de videojuegos con panel de administración privado,
construido con React y Supabase (autenticación y base de datos).

## Funcionalidades

- **Parte pública**
  - Listado de artículos publicados con paginación (6 por página).
  - Artículo destacado en la portada.
  - Página de detalle de artículo con artículos relacionados.
- **Autenticación (Supabase)**
  - Login y registro con correo y contraseña.
  - Protección de rutas: el panel solo es accesible con sesión iniciada.
- **Panel de administración**
  - Crear, editar y eliminar artículos (con modal de confirmación).
  - Publicar / despublicar artículos.
  - Estado visual de cada artículo (Publicado / Borrador).

## Stack

- React 19 + Vite (JavaScript con JSDoc, sin TypeScript).
- Supabase (`@supabase/supabase-js`): autenticación y base de datos con RLS.
- CSS3 nativo con metodología BEM, medidas en `rem` (base 10px) y diseño responsive.
- Enrutador propio con la History API (sin dependencias externas de routing).

## Puesta en marcha

1. Instalar dependencias:

```bash
pnpm install
```

2. Crear el fichero `.env` en la raíz (puedes copiar `.env.example`):

```bash
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publicable
```

3. Arrancar el servidor de desarrollo:

```bash
pnpm dev
```

## Base de datos

La tabla `articles` y sus políticas RLS están definidas en
`supabase/migrations/20260808180000_create_articles_table.sql`:

- Los artículos publicados son visibles para todo el mundo.
- Los usuarios autenticados solo pueden crear, editar y eliminar sus propios artículos.

## Estructura del proyecto

```
src/
  main.jsx               Punto de entrada y proveedores
  App.jsx                Resolución de rutas
  lib/                   Cliente de Supabase y utilidades
  router/                Enrutador propio (History API)
  context/               Contextos de autenticación y avisos
  services/              Acceso a la tabla articles
  components/            Componentes compartidos
  pages/                 Páginas públicas y del panel
  styles/                CSS (sistema Neon-Slate + bloques propios)
types/                   Tipos JSDoc y definiciones globales
design/                  Diseño original de referencia
references/              Plan de implementación
supabase/                Configuración y migraciones
```
