/*
    *  -----------------------------------------------  *
    *  -----  types.d.js  --  /types/types.d.js  -----  *
    *  -----------------------------------------------  *
*/

/**
 * @typedef {Object} Articulo
 * @property {string} id - Identificador único del artículo.
 * @property {string} title - Título del artículo.
 * @property {string} slug - Slug único para la URL pública.
 * @property {string|null} excerpt - Extracto o resumen breve.
 * @property {string} content - Contenido completo del artículo.
 * @property {string|null} image_url - URL de la imagen de portada.
 * @property {boolean} published - Indica si el artículo está publicado.
 * @property {string} author_id - Identificador del autor (auth.users).
 * @property {string} created_at - Fecha de creación (ISO).
 * @property {string} updated_at - Fecha de última modificación (ISO).
 */

/**
 * @typedef {Object} Aviso
 * @property {number} id - Identificador único del aviso.
 * @property {string} mensaje - Texto que se muestra al usuario.
 * @property {"exito"|"error"} tipo - Tipo visual del aviso.
 */
