/*
    *  ---------------------------------------------------  *
    *  -----  supabase.js  --  /src/lib/supabase.js  -----  *
    *  ---------------------------------------------------  *
*/

/// <reference path="../../types/global.d.ts" />

import { createClient } from "@supabase/supabase-js";

/** @type {string} - `URL del proyecto de Supabase` */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/** @type {string} - `Clave publicable (anon) del proyecto de Supabase` */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** - `Cliente de Supabase compartido por toda la aplicación` */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
