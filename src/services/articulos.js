/*
    *  ----------------------------------------------------------  *
    *  -----  articulos.js  --  /src/services/articulos.js  -----  *
    *  ----------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { supabase } from "../lib/supabase.js";

/** - `número de artículos por página en el listado público` */
export const ARTICULOS_POR_PAGINA = 6;

/** @type {Map<number, { articulos: Articulo[], total: number }>} - `caché del listado público por página` */
const cachePublicados = new Map();

/** @type {Map<string, Articulo>} - `caché de artículos por slug` */
const cachePorSlug = new Map();

/**
 * ---------------------------------------
 * -----  `guardarEnCacheSlug(lista)`  -----
 * ---------------------------------------
 * - Guarda artículos en la caché por slug para abrir el detalle sin parpadeo.
 * @param {Articulo[]} lista - Artículos a cachear.
 * @return {void}
 */
const guardarEnCacheSlug = (lista) => {
    for (const articulo of lista) {
        cachePorSlug.set(articulo.slug, articulo);
    }
};

/**
 * ------------------------------------
 * -----  `invalidarCachesPublicos()`  -----
 * ------------------------------------
 * - Limpia las cachés públicas tras crear, editar o eliminar.
 * @return {void}
 */
const invalidarCachesPublicos = () => {
    cachePublicados.clear();
    cachePorSlug.clear();
};

/**
 * ----------------------------------------------
 * -----  `leerCachePublicados(pagina)`  -----
 * ----------------------------------------------
 * - Lee la caché del listado público de una página.
 * @param {number} pagina - Número de página.
 * @return {{ articulos: Articulo[], total: number }|null} - Datos cacheados o null.
 */
export const leerCachePublicados = (pagina) => {
    return cachePublicados.get(pagina) ?? null;
};

/**
 * ----------------------------------------
 * -----  `leerCachePorSlug(slug)`  -----
 * ----------------------------------------
 * - Lee la caché de un artículo por su slug.
 * @param {string} slug - Slug del artículo.
 * @return {Articulo|null} - Artículo cacheado o null.
 */
export const leerCachePorSlug = (slug) => {
    return cachePorSlug.get(slug) ?? null;
};

/**
 * ------------------------------------------
 * -----  `obtenerPublicados(pagina)`  -----
 * ------------------------------------------
 * - Obtiene una página de artículos publicados, ordenados del más reciente al más antiguo.
 * @param {number} pagina - Número de página (empieza en 1).
 * @return {Promise<{ articulos: Articulo[], total: number, error: boolean }>} - Artículos, total y estado de error.
 */
export const obtenerPublicados = async (pagina) => {
    /** - `índice del primer artículo de la página` */
    const desde = (pagina - 1) * ARTICULOS_POR_PAGINA;

    /** - `índice del último artículo de la página` */
    const hasta = desde + ARTICULOS_POR_PAGINA - 1;

    const { data, count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(desde, hasta);

    /** @type {Articulo[]} - `artículos obtenidos de la consulta` */
    const articulos = data ?? [];

    //  -----  guardar en caché si la consulta fue correcta  -----
    if (!error) {
        cachePublicados.set(pagina, { articulos, total: count ?? 0 });
        guardarEnCacheSlug(articulos);
    }

    return { articulos, total: count ?? 0, error: Boolean(error) };
};

/**
 * ------------------------------------
 * -----  `escaparPatron(termino)`  -----
 * ------------------------------------
 * - Escapa los comodines del patrón ILIKE ("%" y "_") para buscar el texto literal.
 * @param {string} termino - Término de búsqueda del usuario.
 * @return {string} - Término seguro para usar como patrón ILIKE.
 */
const escaparPatron = (termino) => {
    return termino.replace(/[%_]/g, "\\$&");
};

/**
 * ----------------------------------------------
 * -----  `buscarArticulos(termino, pagina)`  -----
 * ----------------------------------------------
 * - Busca artículos publicados cuyo título o extracto contenga el término,
 *   ordenados del más reciente al más antiguo y paginados.
 * @param {string} termino - Término de búsqueda (se busca en título y extracto).
 * @param {number} pagina - Número de página (empieza en 1).
 * @return {Promise<{ articulos: Articulo[], total: number, error: boolean }>} - Artículos, total y estado de error.
 */
export const buscarArticulos = async (termino, pagina) => {
    /** - `término limpio y seguro para el patrón ILIKE` */
    const patron = `%${escaparPatron(termino.trim())}%`;

    /** - `índice del primer artículo de la página` */
    const desde = (pagina - 1) * ARTICULOS_POR_PAGINA;

    /** - `índice del último artículo de la página` */
    const hasta = desde + ARTICULOS_POR_PAGINA - 1;

    const { data, count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact" })
        .eq("published", true)
        .or(`title.ilike.${patron},excerpt.ilike.${patron}`)
        .order("created_at", { ascending: false })
        .range(desde, hasta);

    /** @type {Articulo[]} - `artículos encontrados en la consulta` */
    const articulos = data ?? [];

    //  -----  guardar en caché por slug si la consulta fue correcta  -----
    if (!error) {
        guardarEnCacheSlug(articulos);
    }

    return { articulos, total: count ?? 0, error: Boolean(error) };
};

/**
 * -------------------------------------
 * -----  `obtenerPorSlug(slug)`  -----
 * -------------------------------------
 * - Obtiene un artículo publicado a partir de su slug.
 * @param {string} slug - Slug del artículo.
 * @return {Promise<Articulo|null>} - Artículo encontrado o null.
 */
export const obtenerPorSlug = async (slug) => {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    //  -----  guardar en caché si existe  -----
    if (data) {
        cachePorSlug.set(slug, data);
    }

    return data;
};

/**
 * ------------------------------------------------
 * -----  `obtenerRelacionados(slugActual)`  -----
 * ------------------------------------------------
 * - Obtiene los últimos artículos publicados distintos del actual.
 * @param {string} slugActual - Slug del artículo que se está leyendo.
 * @return {Promise<Articulo[]>} - Lista de artículos relacionados.
 */
export const obtenerRelacionados = async (slugActual) => {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .neq("slug", slugActual)
        .order("created_at", { ascending: false })
        .limit(3);

    /** @type {Articulo[]} - `artículos relacionados` */
    const relacionados = data ?? [];
    guardarEnCacheSlug(relacionados);
    return relacionados;
};

/**
 * ---------------------------------
 * -----  `obtenerPorId(id)`  -----
 * ---------------------------------
 * - Obtiene un artículo por su identificador (para el editor).
 * @param {string} id - Identificador del artículo.
 * @return {Promise<Articulo|null>} - Artículo encontrado o null.
 */
export const obtenerPorId = async (id) => {
    const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    return data;
};

/**
 * -------------------------------------------
 * -----  `obtenerDelAutor(autorId)`  -----
 * -------------------------------------------
 * - Obtiene todos los artículos de un autor para el panel de administración.
 * @param {string} autorId - Identificador del autor.
 * @return {Promise<{ articulos: Articulo[], error: boolean }>} - Artículos del autor y estado de error.
 */
export const obtenerDelAutor = async (autorId) => {
    const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", autorId)
        .order("created_at", { ascending: false });

    return { articulos: data ?? [], error: Boolean(error) };
};

/**
 * ----------------------------------
 * -----  `generarSlug(titulo)`  -----
 * ----------------------------------
 * - Genera un slug legible para URL a partir de un título.
 * @param {string} titulo - Título del artículo.
 * @return {string} - Slug en minúsculas, sin acentos y con guiones.
 */
export const generarSlug = (titulo) => {
    return titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

/**
 * ---------------------------------------
 * -----  `crearArticulo(articulo)`  -----
 * ---------------------------------------
 * - Crea un artículo nuevo; si el slug ya existe, añade un sufijo único.
 * @param {Object} articulo - Datos del artículo a insertar.
 * @return {Promise<{ articulo: Articulo|null, error: boolean }>} - Artículo creado y estado de error.
 */
export const crearArticulo = async (articulo) => {
    const { data, error } = await supabase
        .from("articles")
        .insert(articulo)
        .select()
        .single();

    //  -----  si el slug está duplicado, reintentar con un sufijo único  -----
    if (error && error.code === "23505") {
        /** - `slug alternativo con sufijo temporal único` */
        const slugAlternativo = `${articulo.slug}-${Date.now().toString(36)}`;

        const reintento = await supabase
            .from("articles")
            .insert({ ...articulo, slug: slugAlternativo })
            .select()
            .single();

        if (!reintento.error) {
            invalidarCachesPublicos();
        }

        return { articulo: reintento.data, error: Boolean(reintento.error) };
    }

    if (!error) {
        invalidarCachesPublicos();
    }

    return { articulo: data, error: Boolean(error) };
};

/**
 * -----------------------------------------------
 * -----  `actualizarArticulo(id, cambios)`  -----
 * -----------------------------------------------
 * - Actualiza los datos de un artículo existente.
 * @param {string} id - Identificador del artículo.
 * @param {Object} cambios - Campos a modificar.
 * @return {Promise<{ articulo: Articulo|null, error: boolean }>} - Artículo actualizado y estado de error.
 */
export const actualizarArticulo = async (id, cambios) => {
    const { data, error } = await supabase
        .from("articles")
        .update(cambios)
        .eq("id", id)
        .select()
        .single();

    if (!error) {
        invalidarCachesPublicos();
    }

    return { articulo: data, error: Boolean(error) };
};

/**
 * --------------------------------------
 * -----  `eliminarArticulo(id)`  -----
 * --------------------------------------
 * - Elimina un artículo de forma definitiva.
 * @param {string} id - Identificador del artículo.
 * @return {Promise<boolean>} - True si hubo error, false si todo fue bien.
 */
export const eliminarArticulo = async (id) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (!error) {
        invalidarCachesPublicos();
    }

    return Boolean(error);
};

/**
 * ------------------------------------------------
 * -----  `cambiarPublicado(id, publicado)`  -----
 * ------------------------------------------------
 * - Publica o despublica un artículo.
 * @param {string} id - Identificador del artículo.
 * @param {boolean} publicado - Nuevo estado de publicación.
 * @return {Promise<{ articulo: Articulo|null, error: boolean }>} - Artículo actualizado y estado de error.
 */
export const cambiarPublicado = async (id, publicado) => {
    return actualizarArticulo(id, { published: publicado });
};
