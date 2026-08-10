/*
    *  -----------------------------------------------  *
    *  -----  fechas.js  --  /src/lib/fechas.js  -----  *
    *  -----------------------------------------------  *
*/

import { htmlATextoPlano, pareceHtml } from "./html.js";

/**
 * ----------------------------------
 * -----  `formatearFecha(iso)`  -----
 * ----------------------------------
 * - Convierte una fecha ISO en un texto legible en español.
 * @param {string} iso - Fecha en formato ISO.
 * @return {string} - Fecha formateada, por ejemplo "24 oct 2024".
 */
export const formatearFecha = (iso) => {
    const fecha = new Date(iso);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/**
 * ----------------------------------------------
 * -----  `calcularMinutosLectura(contenido)`  -----
 * ----------------------------------------------
 * - Estima los minutos de lectura de un texto (200 palabras por minuto).
 * @param {string} contenido - Texto completo del artículo (plano o HTML).
 * @return {number} - Minutos de lectura estimados (mínimo 1).
 */
export const calcularMinutosLectura = (contenido) => {
    /** - `texto visible sin etiquetas HTML` */
    const texto = pareceHtml(contenido)
        ? htmlATextoPlano(contenido)
        : contenido;

    /** - `número de palabras del contenido` */
    const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palabras / 200));
};
