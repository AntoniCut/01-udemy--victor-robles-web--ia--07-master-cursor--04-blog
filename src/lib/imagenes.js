/*
    *  ---------------------------------------------------  *
    *  -----  imagenes.js  --  /src/lib/imagenes.js  -----  *
    *  ---------------------------------------------------  *
*/

/** - `ruta de la imagen de respaldo para portadas de artículos` */
export const IMAGEN_ARTICULO_FALLBACK = "/img/articulo-fallback.svg";

/**
 * --------------------------------------------------
 * -----  `resolverUrlImagen(url)`  -----
 * --------------------------------------------------
 * - Devuelve la URL de la imagen o el fallback si está vacía.
 * @param {string|null|undefined} url - URL original de la portada.
 * @return {string} - URL usable en un <img> o background-image.
 */
export const resolverUrlImagen = (url) => {
    if (!url || url.trim() === "") {
        return IMAGEN_ARTICULO_FALLBACK;
    }

    return url.trim();
};
