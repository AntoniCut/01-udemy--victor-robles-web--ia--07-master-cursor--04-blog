/*
    *  -------------------------------------------------  *
    *  -----  global.d.ts  --  /types/global.d.ts  -----  *
    *  -------------------------------------------------  *
*/

/// <reference types="react" />
/// <reference types="react-dom" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ViewTransition {
    readonly ready: Promise<void>;
    readonly finished: Promise<void>;
    readonly updateCallbackDone: Promise<void>;
    skipTransition: () => void;
}

interface Document {
    startViewTransition?: (
        actualizar?: () => void | Promise<void>
    ) => ViewTransition;
}
