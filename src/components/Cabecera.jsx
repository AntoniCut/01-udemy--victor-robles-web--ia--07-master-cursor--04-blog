/*
    *  ------------------------------------------------------------  *
    *  -----  Cabecera.jsx  --  /src/components/Cabecera.jsx  -----  *
    *  ------------------------------------------------------------  *
*/

import { useAuth } from "../context/AuthContext.jsx";
import { Enlace } from "../router/Router.jsx";

/**
 * -------------------------
 * -----  `Cabecera()`  -----
 * -------------------------
 * - Cabecera pública con la marca, la navegación y el acceso al panel.
 * @return {JSX.Element} - Cabecera de la parte pública.
 */
export const Cabecera = () => {
    const { usuario } = useAuth();

    return (
        <header className="top-nav top-nav--bordered">
            <div className="top-nav__brand-group">
                <Enlace href="/" className="top-nav__brand">
                    GamerPulse
                </Enlace>
                <nav aria-label="Navegación principal">
                    <ul className="top-nav__list">
                        <li>
                            <Enlace
                                href="/"
                                className="top-nav__link top-nav__link--active"
                            >
                                Noticias
                            </Enlace>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="top-nav__actions">
                {usuario ? (
                    <Enlace
                        href="/admin"
                        className="button button--primary button--sm top-nav__cta text-label-md"
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--sm">
                            dashboard
                        </span>
                        Panel
                    </Enlace>
                ) : (
                    <Enlace
                        href="/login"
                        className="button button--primary button--sm top-nav__cta text-label-md"
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--sm">
                            login
                        </span>
                        Acceder
                    </Enlace>
                )}
            </div>
        </header>
    );
};
