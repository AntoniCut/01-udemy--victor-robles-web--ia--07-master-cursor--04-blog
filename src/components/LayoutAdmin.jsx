/*
    *  ----------------------------------------------------------------  *
    *  -----  LayoutAdmin.jsx  --  /src/components/LayoutAdmin.jsx  -----  *
    *  ----------------------------------------------------------------  *
*/

import { BarraLateral } from "./BarraLateral.jsx";

/**
 * ------------------------------------------------------
 * -----  `LayoutAdmin({ variante, children })`  -----
 * ------------------------------------------------------
 * - Layout estable del panel: mantiene la barra lateral montada
 *   al navegar entre dashboard y editor.
 * @param {{ variante?: "dashboard"|"editor", children: import("react").ReactNode }} props - Variante visual y contenido.
 * @return {import("react").JSX.Element} - Layout del panel de administración.
 */
export const LayoutAdmin = ({ variante = "dashboard", children }) => {
    /** - `clase CSS de la página según la variante` */
    const clasePagina = variante === "editor" ? "page-editor" : "page-dashboard";

    return (
        <div className={clasePagina}>
            <BarraLateral />
            {children}
        </div>
    );
};
