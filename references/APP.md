# Blog de Videojuegos con React + Supabase

La aplicación está completa y funcionando. El plan está copiado en `references/plan-blog-videojuegos-react-supabase.md` y el servidor de desarrollo sigue corriendo en **[http://localhost:5173](http://localhost:5173/)**.



## Qué se ha construido

### Frontend (React 19 + Vite, instalado con pnpm, sin dependencias externas más allá de React y supabase-js):

Parte pública: portada con artículo destacado (hero) y listado paginado de 6 artículos por página, página de detalle con artículos relacionados, y página 404. Todo con el diseño Neon-Slate: reutilicé el gamerpulse.css del diseño (ya cumplía BEM estricto, rem con base 10px y responsive) y añadí en src/styles/extra.css los bloques nuevos (modal, toast, alertas, cargador, estados vacíos).
Login/Registro (/login): pestañas para iniciar sesión y registrarse, con mensajes de error/éxito visuales en el DOM (nada de alert).
Panel de administración (/admin, protegido): tabla de artículos con estado Publicado/Borrador, botones para publicar/despublicar, editar y eliminar (con modal de confirmación con los estilos de la web), y editor completo para crear/editar con extracto, imagen de portada y botones "Guardar Borrador" / "Publicar".
Protección de rutas: enrutador propio con la History API (sin react-router, respetando la regla de no añadir dependencias) y componente RutaProtegida que redirige a /login sin sesión.
Convenciones aplicadas: banners de cabecera de longitud exacta en todos los ficheros (verificados con script), JSDoc con el formato de 5 guiones, arrow functions, sin var/innerHTML, y jsconfig.json + carpeta types/.


### Backend (Supabase, vía MCP):

El .env quedó configurado con la clave publicable obtenida del proyecto BlogVideojuegosMasterCursor.
Encontré y corregí un problema real: la tabla articles tenía RLS pero le faltaban los GRANT a los roles anon y authenticated (la API devolvía 403). Lo arreglé con la migración 20260808190000_grant_articles_privileges.sql, aplicada también en remoto.
Segunda migración de seguridad (20260808191000_security_hardening.sql) que resuelve los avisos de los advisors: search_path fijado en set_updated_at y revocado el EXECUTE público de rls_auto_enable. Los advisors ahora solo muestran un aviso que se activa desde el dashboard (protección de contraseñas filtradas).
Verificado con datos reales
Probé el flujo completo contra Supabase: registro → confirmación → login → inserción de 9 artículos de demostración (8 publicados y 1 borrador) respetando RLS. Como anónimo solo se ven los 8 publicados, y la página 2 devuelve los 2 esperados.

### Dos cosas a tener en cuenta:

Usuario de prueba creado: [admin@gamerpulse.dev](mailto:admin@gamerpulse.dev) / GamerPulse2026! (lo confirmé por SQL; puedes entrar directamente con él).
La confirmación por correo está activada en el proyecto: los usuarios que se registren desde la web verán el mensaje "Revisa tu correo". Si prefieres acceso inmediato, desactiva "Confirm email" en Authentication → Sign In / Up del dashboard de Supabase.