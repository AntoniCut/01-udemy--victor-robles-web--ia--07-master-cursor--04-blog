/*
    *  -----------------------------------------------------------------  *
    *  -----  ToastContext.jsx  --  /src/context/ToastContext.jsx  -----  *
    *  -----------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { createContext, useContext, useState } from "react";

/** - `contexto de avisos visuales (toasts) de la aplicación` */
const ToastContext = createContext(null);

/**
 * -------------------------------------------
 * -----  `ProveedorToast({ children })`  -----
 * -------------------------------------------
 * - Proveedor que muestra avisos visuales temporales en el DOM.
 * @param {{ children: import("react").ReactNode }} props - Componentes hijos.
 * @return {JSX.Element} - Proveedor del contexto de avisos.
 */
export const ProveedorToast = ({ children }) => {
    /** @type {[Aviso[], Function]} - `lista de avisos visibles` */
    const [avisos, setAvisos] = useState([]);

    /**
     * ----------------------------------------
     * -----  `mostrarAviso(mensaje, tipo)`  -----
     * ----------------------------------------
     * - Añade un aviso visual que desaparece automáticamente a los 4 segundos.
     * @param {string} mensaje - Texto del aviso.
     * @param {"exito"|"error"} [tipo] - Tipo visual del aviso.
     * @return {void}
     */
    const mostrarAviso = (mensaje, tipo = "exito") => {
        /** - `identificador único del aviso` */
        const id = Date.now() + Math.random();

        setAvisos((previos) => [...previos, { id, mensaje, tipo }]);

        //  -----  eliminar el aviso pasados 4 segundos  -----
        setTimeout(() => {
            setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ mostrarAviso }}>
            {children}
            <div className="toast-lista" role="status" aria-live="polite">
                {avisos.map((aviso) => (
                    <div
                        key={aviso.id}
                        className={`toast toast--${aviso.tipo}`}
                    >
                        <span className="material-symbols-outlined toast__icono">
                            {aviso.tipo === "exito" ? "check_circle" : "error"}
                        </span>
                        <span className="toast__mensaje text-body-md">
                            {aviso.mensaje}
                        </span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

/**
 * -------------------------
 * -----  `useToast()`  -----
 * -------------------------
 * - Hook para mostrar avisos visuales desde cualquier componente.
 * @return {{ mostrarAviso: (mensaje: string, tipo?: "exito"|"error") => void }} - Función para mostrar avisos.
 */
export const useToast = () => useContext(ToastContext);
