/*
    *  -----------------------------------------------  *
    *  -----  Home.jsx  --  /src/pages/Home.jsx  -----  *
    *  -----------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { Paginacion } from "../components/Paginacion.jsx";
import { TarjetaArticulo } from "../components/TarjetaArticulo.jsx";
import { formatearFecha } from "../lib/fechas.js";
import { Enlace } from "../router/Router.jsx";
import {
    ARTICULOS_POR_PAGINA,
    leerCachePublicados,
    obtenerPublicados,
} from "../services/articulos.js";

/**
 * ---------------------
 * -----  `Home()`  -----
 * ---------------------
 * - Portada pública con el listado paginado de artículos publicados.
 * @return {import("react").JSX.Element} - Contenido de la página de inicio.
 */
export const Home = () => {
    /** @type {{ articulos: Articulo[], total: number }|null} - `caché inicial de la página 1` */
    const cacheInicial = leerCachePublicados(1);

    /** @type {[Articulo[], Function]} - `artículos de la página actual` */
    const [articulos, setArticulos] = useState(
        () => cacheInicial?.articulos ?? []
    );

    /** - `total de artículos publicados` */
    const [total, setTotal] = useState(() => cacheInicial?.total ?? 0);

    /** - `página actual del listado` */
    const [pagina, setPagina] = useState(1);

    /** - `indica si todavía no hay contenido para mostrar` */
    const [cargando, setCargando] = useState(() => !cacheInicial);

    /** - `indica si hubo un error al cargar` */
    const [error, setError] = useState(false);

    useEffect(() => {
        /** - `bandera para ignorar respuestas de una petición cancelada` */
        let cancelado = false;

        //  -----  si hay caché de esta página, mostrarla al instante  -----
        const cache = leerCachePublicados(pagina);
        if (cache) {
            setArticulos(cache.articulos);
            setTotal(cache.total);
            setError(false);
            setCargando(false);
        } else if (articulos.length === 0) {
            setCargando(true);
        }

        //  -----  refrescar los datos en segundo plano  -----
        const cargarArticulos = async () => {
            const resultado = await obtenerPublicados(pagina);
            if (cancelado) {
                return;
            }

            setArticulos(resultado.articulos);
            setTotal(resultado.total);
            setError(resultado.error);
            setCargando(false);
        };

        cargarArticulos();

        return () => {
            cancelado = true;
        };
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

    //  -----  spinner solo en la primera carga sin datos  -----
    if (cargando && articulos.length === 0) {
        return (
            <div className="cargador" role="status" aria-label="Cargando artículos">
                <span className="cargador__circulo" aria-hidden="true"></span>
            </div>
        );
    }

    if (error && articulos.length === 0) {
        return (
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
        );
    }

    if (!error && total === 0) {
        return (
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
        );
    }

    return (
        <>
            {destacado && (
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
            {articulosGrid.length > 0 && (
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
            <Paginacion
                pagina={pagina}
                totalPaginas={totalPaginas}
                alCambiar={alCambiarPagina}
            />
        </>
    );
};
