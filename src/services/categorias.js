/*
    *  ------------------------------------------------------------  *
    *  -----  categorias.js  --  /src/services/categorias.js  -----  *
    *  ------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { supabase } from "../lib/supabase.js";

/**
 * ---------------------------
 * -----  `obtenerTodas()`  -----
 * ---------------------------
 * - Obtiene todas las categorías ordenadas por nombre.
 * @return {Promise<{ categorias: Categoria[], error: boolean }>} - Categorías y estado de error.
 */
export const obtenerTodas = async () => {
    const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, created_at")
        .order("name", { ascending: true });

    return { categorias: data ?? [], error: Boolean(error) };
};
