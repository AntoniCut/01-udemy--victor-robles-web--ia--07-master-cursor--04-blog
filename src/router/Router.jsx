/*
    *  ----------------------------------------------------  *
    *  -----  Router.jsx  --  /src/router/Router.jsx  -----  *
    *  ----------------------------------------------------  *
*/

import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { iniciarTransicionVista } from "../lib/transiciones.js";

/** - `contexto del enrutador propio basado en la History API` */
const RouterContext = createContext(null);

/**
 * --------------------------------------------
 * -----  `ProveedorRouter({ children })`  -----
 * --------------------------------------------
 * - Proveedor que mantiene la ruta actual sincronizada con la History API.
 * @param {{ children: import("react").ReactNode }} props - Componentes hijos.
 * @return {import("react").JSX.Element} - Proveedor del contexto del enrutador.
 */
export const ProveedorRouter = ({ children }) => {
    /** - `ruta actual del navegador` */
    const [ruta, setRuta] = useState(window.location.pathname);

    useEffect(() => {
        //  -----  sincronizar la ruta con los botones atrás / adelante  -----
        const alCambiarHistorial = () => {
            iniciarTransicionVista(() => {
                //  -----  flushSync solo dentro de la view transition  -----
                flushSync(() => {
                    setRuta(window.location.pathname);
                });
            });
        };

        window.addEventListener("popstate", alCambiarHistorial);
        return () => window.removeEventListener("popstate", alCambiarHistorial);
    }, []);

    /**
     * --------------------------------------------------------
     * -----  `navegar(destino, opciones)`  -----
     * --------------------------------------------------------
     * - Cambia la ruta actual usando la History API sin recargar la página.
     * @param {string} destino - Ruta de destino, por ejemplo "/admin".
     * @param {{ reemplazar?: boolean, animar?: boolean }} [opciones] - Opciones de navegación.
     * @return {void}
     */
    const navegar = (destino, opciones = {}) => {
        const { reemplazar = false, animar = true } = opciones;

        //  -----  si ya estamos en la misma ruta, no hacer nada  -----
        if (destino === window.location.pathname) {
            return;
        }

        /**
         * ------------------------------------------
         * -----  `actualizarHistorial()`  -----
         * ------------------------------------------
         * - Actualiza la URL en el historial del navegador.
         * @return {void}
         */
        const actualizarHistorial = () => {
            if (reemplazar) {
                window.history.replaceState({}, "", destino);
            } else {
                window.history.pushState({}, "", destino);
            }
        };

        //  -----  sin animación: no usar flushSync (puede llamarse desde useEffect)  -----
        if (!animar) {
            actualizarHistorial();
            setRuta(destino);
            window.scrollTo(0, 0);
            return;
        }

        //  -----  con view transition: flushSync solo dentro del callback de la API  -----
        iniciarTransicionVista(() => {
            actualizarHistorial();
            flushSync(() => {
                setRuta(destino);
            });
            window.scrollTo(0, 0);
        });
    };

    return (
        <RouterContext.Provider value={{ ruta, navegar }}>
            {children}
        </RouterContext.Provider>
    );
};

/**
 * --------------------------
 * -----  `useRouter()`  -----
 * --------------------------
 * - Hook para acceder a la ruta actual y a la función de navegación.
 * @return {{ ruta: string, navegar: (destino: string, opciones?: { reemplazar?: boolean, animar?: boolean }) => void }} - Estado del enrutador.
 */
export const useRouter = () => useContext(RouterContext);

/**
 * ----------------------------------------------------------------
 * -----  `Enlace({ href, className, ariaLabel, children })`  -----
 * ----------------------------------------------------------------
 * - Enlace interno que navega sin recargar la página.
 * @param {{ href: string, className?: string, ariaLabel?: string, children: import("react").ReactNode }} props - Datos del enlace.
 * @return {import("react").JSX.Element} - Elemento ancla con navegación interna.
 */
export const Enlace = ({ href, className, ariaLabel, children }) => {
    const { navegar } = useRouter();

    //  -----  click en enlace interno: prevenir la recarga y navegar  -----
    const alHacerClick = (evento) => {
        evento.preventDefault();
        navegar(href);
    };

    return (
        <a
            href={href}
            className={className}
            aria-label={ariaLabel}
            onClick={alHacerClick}
        >
            {children}
        </a>
    );
};
