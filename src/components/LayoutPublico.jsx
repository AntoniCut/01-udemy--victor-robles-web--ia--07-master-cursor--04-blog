/*
    *  --------------------------------------------------------------------  *
    *  -----  LayoutPublico.jsx  --  /src/components/LayoutPublico.jsx  -----  *
    *  --------------------------------------------------------------------  *
*/

import { Cabecera } from "./Cabecera.jsx";
import { PiePagina } from "./PiePagina.jsx";

/**
 * --------------------------------------------------------
 * -----  `LayoutPublico({ variante, children })`  -----
 * --------------------------------------------------------
 * - Layout estable de la parte pública: mantiene cabecera y pie
 *   montados al navegar entre páginas.
 * @param {{ variante?: "home"|"article", children: import("react").ReactNode }} props - Variante visual y contenido.
 * @return {import("react").JSX.Element} - Layout público.
 */
export const LayoutPublico = ({ variante = "home", children }) => {
    /** - `clase CSS de la página según la variante` */
    const clasePagina = variante === "article" ? "page-article" : "page-home";

    /** - `clase CSS del main según la variante` */
    const claseMain =
        variante === "article" ? "page-article__main" : "page-home__main";

    return (
        <div className={clasePagina}>
            <Cabecera />
            <main className={claseMain}>{children}</main>
            <PiePagina />
        </div>
    );
};
