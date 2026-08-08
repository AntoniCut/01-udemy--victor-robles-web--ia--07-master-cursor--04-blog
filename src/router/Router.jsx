/*
    *  ----------------------------------------------------  *
    *  -----  Router.jsx  --  /src/router/Router.jsx  -----  *
    *  ----------------------------------------------------  *
*/

import { createContext, useContext, useEffect, useState } from "react";

/** - `contexto del enrutador propio basado en la History API` */
const RouterContext = createContext(null);

/**
 * --------------------------------------------
 * -----  `ProveedorRouter({ children })`  -----
 * --------------------------------------------
 * - Proveedor que mantiene la ruta actual sincronizada con la History API.
 * @param {{ children: import("react").ReactNode }} props - Componentes hijos.
 * @return {JSX.Element} - Proveedor del contexto del enrutador.
 */
export const ProveedorRouter = ({ children }) => {
    /** - `ruta actual del navegador` */
    const [ruta, setRuta] = useState(window.location.pathname);

    useEffect(() => {
        //  -----  sincronizar la ruta con los botones atrás / adelante  -----
        const alCambiarHistorial = () => {
            setRuta(window.location.pathname);
        };

        window.addEventListener("popstate", alCambiarHistorial);
        return () => window.removeEventListener("popstate", alCambiarHistorial);
    }, []);

    /**
     * ------------------------------
     * -----  `navegar(destino)`  -----
     * ------------------------------
     * - Cambia la ruta actual usando la History API sin recargar la página.
     * @param {string} destino - Ruta de destino, por ejemplo "/admin".
     * @return {void}
     */
    const navegar = (destino) => {
        window.history.pushState({}, "", destino);
        setRuta(destino);
        window.scrollTo(0, 0);
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
 * @return {{ ruta: string, navegar: (destino: string) => void }} - Estado del enrutador.
 */
export const useRouter = () => useContext(RouterContext);

/**
 * ----------------------------------------------------------------
 * -----  `Enlace({ href, className, ariaLabel, children })`  -----
 * ----------------------------------------------------------------
 * - Enlace interno que navega sin recargar la página.
 * @param {{ href: string, className?: string, ariaLabel?: string, children: import("react").ReactNode }} props - Datos del enlace.
 * @return {JSX.Element} - Elemento ancla con navegación interna.
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
