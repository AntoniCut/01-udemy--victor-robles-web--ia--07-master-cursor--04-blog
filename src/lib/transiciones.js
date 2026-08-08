/*
    *  -----------------------------------------------------------  *
    *  -----  transiciones.js  --  /src/lib/transiciones.js  -----  *
    *  -----------------------------------------------------------  *
*/

/**
 * ----------------------------------------------------
 * -----  `nombreTransicionImagen(slug)`  -----
 * ----------------------------------------------------
 * - Nombre de view-transition compartido para la imagen de un artículo.
 * @param {string} slug - Slug del artículo.
 * @return {string} - Identificador CSS válido para view-transition-name.
 */
export const nombreTransicionImagen = (slug) => `vt-img-${slug}`;

/**
 * ----------------------------------------------------
 * -----  `nombreTransicionTitulo(slug)`  -----
 * ----------------------------------------------------
 * - Nombre de view-transition compartido para el título de un artículo.
 * @param {string} slug - Slug del artículo.
 * @return {string} - Identificador CSS válido para view-transition-name.
 */
export const nombreTransicionTitulo = (slug) => `vt-titulo-${slug}`;

/**
 * --------------------------------------------------
 * -----  `iniciarTransicionVista(actualizar)`  -----
 * --------------------------------------------------
 * - Ejecuta un cambio de UI dentro de document.startViewTransition,
 *   con fallback si el navegador no lo soporta o el usuario prefiere menos movimiento.
 * @param {() => void} actualizar - Función que aplica el cambio de estado/DOM.
 * @return {void}
 */
export const iniciarTransicionVista = (actualizar) => {
    /** - `true si el usuario pidió reducir animaciones` */
    const menosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    //  -----  sin soporte o con menos movimiento: actualizar al instante  -----
    if (menosMovimiento || typeof document.startViewTransition !== "function") {
        actualizar();
        return;
    }

    //  -----  silenciar abortos por estado inválido (navegación rápida, etc.)  -----
    const transicion = document.startViewTransition(actualizar);
    transicion.finished.catch(() => {});
};
