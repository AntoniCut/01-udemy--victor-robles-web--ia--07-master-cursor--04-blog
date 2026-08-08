/*
    *  --------------------------------------------------------------  *
    *  -----  PiePagina.jsx  --  /src/components/PiePagina.jsx  -----  *
    *  --------------------------------------------------------------  *
*/

import { Enlace } from "../router/Router.jsx";

/**
 * --------------------------
 * -----  `PiePagina()`  -----
 * --------------------------
 * - Pie de página público con la marca y los enlaces básicos.
 * @return {JSX.Element} - Pie de página de la parte pública.
 */
export const PiePagina = () => {
    return (
        <footer className="site-footer site-footer--line">
            <div className="site-footer__brand">GamerPulse</div>
            <nav className="site-footer__nav" aria-label="Enlaces del pie">
                <Enlace href="/" className="site-footer__link">
                    Inicio
                </Enlace>
                <Enlace href="/login" className="site-footer__link">
                    Acceso
                </Enlace>
            </nav>
            <div className="site-footer__copy">
                © 2026 GamerPulse. Noticias de alto rendimiento.
            </div>
        </footer>
    );
};
