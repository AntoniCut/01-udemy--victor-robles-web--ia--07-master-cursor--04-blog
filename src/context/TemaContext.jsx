/*
    *  ---------------------------------------------------------------  *
    *  -----  TemaContext.jsx  --  /src/context/TemaContext.jsx  -----  *
    *  ---------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { createContext, useContext, useEffect, useState } from "react";

/** - `clave de localStorage para persistir el tema` */
const CLAVE_TEMA = "gamerpulse-tema";

/** - `contexto del tema visual (claro / oscuro)` */
const TemaContext = createContext(null);

/**
 * -----------------------------------------
 * -----  `leerTemaInicial()`  -----
 * -----------------------------------------
 * - Lee el tema guardado o, si no hay, la preferencia del sistema.
 * @return {"claro"|"oscuro"} - Tema inicial a aplicar.
 */
const leerTemaInicial = () => {
    try {
        /** @type {string|null} - `tema persistido en localStorage` */
        const guardado = localStorage.getItem(CLAVE_TEMA);

        if (guardado === "claro" || guardado === "oscuro") {
            return guardado;
        }
    } catch {
        //  -----  localStorage no disponible: usar preferencia del sistema  -----
    }

    if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
        return "claro";
    }

    return "oscuro";
};

/**
 * --------------------------------------
 * -----  `aplicarTema(tema)`  -----
 * --------------------------------------
 * - Escribe el atributo data-theme en el documento HTML.
 * @param {"claro"|"oscuro"} tema - Tema a aplicar.
 * @return {void}
 */
const aplicarTema = (tema) => {
    document.documentElement.setAttribute("data-theme", tema);
};

/**
 * ------------------------------------------
 * -----  `ProveedorTema({ children })`  -----
 * ------------------------------------------
 * - Proveedor que gestiona el tema claro/oscuro y lo persiste.
 * @param {{ children: import("react").ReactNode }} props - Componentes hijos.
 * @return {import("react").JSX.Element} - Proveedor del contexto de tema.
 */
export const ProveedorTema = ({ children }) => {
    /** @type {["claro"|"oscuro", Function]} - `tema visual activo` */
    const [tema, setTema] = useState(leerTemaInicial);

    useEffect(() => {
        //  -----  sincronizar atributo HTML y localStorage al cambiar el tema  -----
        aplicarTema(tema);

        try {
            localStorage.setItem(CLAVE_TEMA, tema);
        } catch {
            //  -----  sin persistencia si localStorage falla  -----
        }
    }, [tema]);

    /**
     * ---------------------------
     * -----  `alternarTema()`  -----
     * ---------------------------
     * - Cambia entre tema claro y oscuro.
     * @return {void}
     */
    const alternarTema = () => {
        setTema((previo) => (previo === "oscuro" ? "claro" : "oscuro"));
    };

    return (
        <TemaContext.Provider value={{ tema, alternarTema }}>
            {children}
        </TemaContext.Provider>
    );
};

/**
 * ------------------------
 * -----  `useTema()`  -----
 * ------------------------
 * - Hook para leer y cambiar el tema visual.
 * @return {{ tema: "claro"|"oscuro", alternarTema: () => void }} - Tema activo y función para alternarlo.
 */
export const useTema = () => useContext(TemaContext);
