/*
    *  -----------------------------------------------  *
    *  -----  Home.jsx  --  /src/pages/Home.jsx  -----  *
    *  -----------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { Cabecera } from "../components/Cabecera.jsx";
import { PiePagina } from "../components/PiePagina.jsx";
import { Paginacion } from "../components/Paginacion.jsx";
import { TarjetaArticulo } from "../components/TarjetaArticulo.jsx";
import { formatearFecha } from "../lib/fechas.js";
import { Enlace } from "../router/Router.jsx";
import {
    ARTICULOS_POR_PAGINA,
    obtenerPublicados,
} from "../services/articulos.js";

/**
 * ---------------------
 * -----  `Home()`  -----
 * ---------------------
 * - Portada pública con el listado paginado de artículos publicados.
 * @return {JSX.Element} - Página de inicio del blog.
 */
export const Home = () => {
    /** @type {[Articulo[], Function]} - `artículos de la página actual` */
    const [articulos, setArticulos] = useState([]);

    /** - `total de artículos publicados` */
    const [total, setTotal] = useState(0);

    /** - `página actual del listado` */
    const [pagina, setPagina] = useState(1);

    /** - `indica si el listado se está cargando` */
    const [cargando, setCargando] = useState(true);

    /** - `indica si hubo un error al cargar` */
    const [error, setError] = useState(false);

    useEffect(() => {
        //  -----  cargar la página de artículos publicados  -----
        const cargarArticulos = async () => {
            setCargando(true);
            const resultado = await obtenerPublicados(pagina);
            setArticulos(resultado.articulos);
            setTotal(resultado.total);
            setError(resultado.error);
            setCargando(false);
        };

        cargarArticulos();
    }, [pagina]);

    /** - `número total de páginas del listado` */
    const totalPaginas = Math.ceil(total / ARTICULOS_POR_PAGINA);

    /** @type {Articulo|null} - `artículo destacado (solo en la primera página)` */
    const destacado = pagina === 1 && articulos.length > 0 ? articulos[0] : null;

    /** @type {Articulo[]} - `artículos del grid (sin el destacado)` */
    const articulosGrid = destacado ? articulos.slice(1) : articulos;

    //  -----  cambio de página desde la paginación  -----
    const alCambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
        window.scrollTo(0, 0);
    };

    return (
        <div className="page-home">
            <Cabecera />
            <main className="page-home__main">
                {cargando && (
                    <div className="cargador" role="status" aria-label="Cargando artículos">
                        <span className="cargador__circulo" aria-hidden="true"></span>
                    </div>
                )}
                {!cargando && error && (
                    <section className="estado-vacio">
                        <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                            error
                        </span>
                        <h2 className="estado-vacio__titulo text-headline-md">
                            No se pudieron cargar los artículos
                        </h2>
                        <p className="estado-vacio__texto text-body-md">
                            Inténtalo de nuevo dentro de unos instantes.
                        </p>
                    </section>
                )}
                {!cargando && !error && total === 0 && (
                    <section className="estado-vacio">
                        <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                            sports_esports
                        </span>
                        <h2 className="estado-vacio__titulo text-headline-md">
                            Todavía no hay artículos publicados
                        </h2>
                        <p className="estado-vacio__texto text-body-md">
                            Vuelve pronto para descubrir las últimas noticias de videojuegos.
                        </p>
                    </section>
                )}
                {!cargando && !error && destacado && (
                    <section className="hero">
                        {destacado.image_url ? (
                            <div
                                className="hero__media"
                                style={{ backgroundImage: `url("${destacado.image_url}")` }}
                            ></div>
                        ) : (
                            <div className="hero__media hero__media--placeholder"></div>
                        )}
                        <div className="hero__overlay"></div>
                        <div className="hero__content">
                            <div className="hero__meta">
                                <span className="badge text-label-sm">
                                    <span className="badge__pulse"></span>
                                    Destacado
                                </span>
                                <span className="hero__time text-label-sm">
                                    {formatearFecha(destacado.created_at)}
                                </span>
                            </div>
                            <h1 className="hero__title text-headline-lg-mobile">
                                {destacado.title}
                            </h1>
                            <p className="hero__excerpt text-body-lg">
                                {destacado.excerpt ?? ""}
                            </p>
                            <div>
                                <Enlace
                                    href={`/articulo/${destacado.slug}`}
                                    className="button button--primary button--lg text-label-md"
                                >
                                    Leer Artículo
                                    <span className="material-symbols-outlined material-symbols-outlined--sm">
                                        arrow_forward
                                    </span>
                                </Enlace>
                            </div>
                        </div>
                    </section>
                )}
                {!cargando && !error && articulosGrid.length > 0 && (
                    <section>
                        <div className="section-heading">
                            <h2 className="section-heading__title text-headline-md">
                                Últimas Noticias
                            </h2>
                            <div className="section-heading__line"></div>
                        </div>
                        <div className="article-grid">
                            {articulosGrid.map((articulo) => (
                                <TarjetaArticulo key={articulo.id} articulo={articulo} />
                            ))}
                        </div>
                    </section>
                )}
                {!cargando && !error && (
                    <Paginacion
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        alCambiar={alCambiarPagina}
                    />
                )}
            </main>
            <PiePagina />
        </div>
    );
};
