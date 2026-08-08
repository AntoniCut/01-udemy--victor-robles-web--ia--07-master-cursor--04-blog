/*
    *  -----------------------------------------------------------  *
    *  -----  transiciones.js  --  /src/lib/transiciones.js  -----  *
    *  -----------------------------------------------------------  *
*/

/** @type {ViewTransition|null} - `transición de vista en curso, si existe` */
let transicionActiva = null;

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
 * - Ejecuta un cambio de UI dentro de document.startViewTransition.
 *   Si ya hay una transición en curso, aplica el cambio sin lanzar otra.
 * @param {() => void} actualizar - Función que aplica el cambio de estado/DOM.
 * @return {void}
 */
export const iniciarTransicionVista = (actualizar) => {
    /** - `true si el usuario pidió reducir animaciones` */
    const menosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    //  -----  sin soporte, menos movimiento o transición en curso: actualizar al instante  -----
    if (
        menosMovimiento ||
        typeof document.startViewTransition !== "function" ||
        transicionActiva
    ) {
        actualizar();
        return;
    }

    const transicion = document.startViewTransition(actualizar);
    transicionActiva = transicion;

    //  -----  liberar el candado y silenciar abortos al saltar/cancelar la transición  -----
    const liberar = () => {
        if (transicionActiva === transicion) {
            transicionActiva = null;
        }
    };

    transicion.ready.catch(() => {});
    transicion.finished.then(liberar).catch(liberar);
};
