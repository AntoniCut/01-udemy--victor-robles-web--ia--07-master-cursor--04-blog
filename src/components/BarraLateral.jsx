/*
    *  --------------------------------------------------------------------  *
    *  -----  BarraLateral.jsx  --  /src/components/BarraLateral.jsx  -----  *
    *  --------------------------------------------------------------------  *
*/

import { useAuth } from "../context/AuthContext.jsx";
import { Enlace, useRouter } from "../router/Router.jsx";
import { BotonTema } from "./BotonTema.jsx";

/**
 * -----------------------------
 * -----  `BarraLateral()`  -----
 * -----------------------------
 * - Navegación del panel de administración: barra lateral en escritorio
 *   y barra superior en móvil.
 * @return {import("react").JSX.Element} - Navegación completa del panel.
 */
export const BarraLateral = () => {
    const { usuario, cerrarSesion } = useAuth();
    const { navegar } = useRouter();

    /** - `inicial del correo del usuario para el avatar` */
    const inicial = usuario?.email ? usuario.email.charAt(0).toUpperCase() : "?";

    //  -----  click en cerrar sesión: salir y volver a la portada  -----
    const alHacerClickSalir = async (evento) => {
        evento.preventDefault();
        await cerrarSesion();
        navegar("/");
    };

    return (
        <>
            <nav
                className="side-nav side-nav--desktop"
                aria-label="Navegación de administración"
            >
                <div className="side-nav__identity">
                    <span className="side-nav__avatar side-nav__avatar--letra" aria-hidden="true">
                        {inicial}
                    </span>
                    <div>
                        <div className="side-nav__title">GamerPulse</div>
                        <div className="side-nav__subtitle">{usuario?.email}</div>
                    </div>
                </div>
                <Enlace
                    href="/admin/nuevo"
                    className="button button--primary side-nav__cta text-label-md"
                >
                    <span className="material-symbols-outlined material-symbols-outlined--filled">
                        add
                    </span>
                    Nuevo Artículo
                </Enlace>
                <div className="side-nav__nav">
                    <Enlace href="/admin" className="side-nav__link side-nav__link--active">
                        <span className="material-symbols-outlined material-symbols-outlined--filled">
                            edit_note
                        </span>
                        Artículos
                    </Enlace>
                    <Enlace href="/" className="side-nav__link">
                        <span className="material-symbols-outlined">public</span>
                        Ver el blog
                    </Enlace>
                </div>
                <div className="side-nav__footer">
                    <BotonTema variante="nav" />
                    <button
                        className="side-nav__link side-nav__link--danger"
                        type="button"
                        onClick={alHacerClickSalir}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
            <header className="admin-topbar">
                <Enlace href="/admin" className="admin-topbar__brand">
                    GamerPulse
                </Enlace>
                <div className="admin-topbar__acciones">
                    <BotonTema />
                    <Enlace
                        href="/admin/nuevo"
                        className="button button--primary button--sm text-label-md"
                        ariaLabel="Nuevo artículo"
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--sm">
                            add
                        </span>
                        Nuevo
                    </Enlace>
                    <Enlace
                        href="/"
                        className="button button--secondary button--sm text-label-md"
                        ariaLabel="Ver el blog"
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--sm">
                            public
                        </span>
                        Blog
                    </Enlace>
                    <button
                        className="button button--icon"
                        type="button"
                        aria-label="Cerrar sesión"
                        onClick={alHacerClickSalir}
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </header>
        </>
    );
};
