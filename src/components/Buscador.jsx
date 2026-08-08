/*
    *  ------------------------------------------------------------  *
    *  -----  Buscador.jsx  --  /src/components/Buscador.jsx  -----  *
    *  ------------------------------------------------------------  *
*/

import { useState } from "react";
import { useRouter } from "../router/Router.jsx";

/**
 * --------------------------
 * -----  `Buscador()`  -----
 * --------------------------
 * - Formulario de búsqueda de la cabecera pública: envía el término
 *   a la página de resultados con el parámetro de consulta "q".
 * @return {import("react").JSX.Element} - Formulario de búsqueda.
 */
export const Buscador = () => {
    const { navegar } = useRouter();

    /** - `término de búsqueda escrito por el usuario` */
    const [termino, setTermino] = useState("");

    //  -----  envío del formulario: ir a la página de resultados  -----
    const alEnviar = (evento) => {
        evento.preventDefault();

        /** - `término sin espacios sobrantes` */
        const consulta = termino.trim();

        //  -----  si está vacío, no hacer nada  -----
        if (!consulta) {
            return;
        }

        navegar(`/buscar?q=${encodeURIComponent(consulta)}`);
    };

    return (
        <form className="top-nav__search" role="search" onSubmit={alEnviar}>
            <input
                className="top-nav__search-input"
                type="text"
                placeholder="Buscar..."
                aria-label="Buscar artículos"
                value={termino}
                onChange={(evento) => setTermino(evento.target.value)}
            />
            <button
                className="top-nav__search-submit"
                type="submit"
                aria-label="Buscar"
            >
                <span
                    className="material-symbols-outlined top-nav__search-icon"
                    aria-hidden="true"
                >
                    search
                </span>
            </button>
        </form>
    );
};
