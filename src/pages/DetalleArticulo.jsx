/*
    *  ---------------------------------------------------------------------  *
    *  -----  DetalleArticulo.jsx  --  /src/pages/DetalleArticulo.jsx  -----  *
    *  ---------------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { ContenidoHtml } from "../components/ContenidoHtml.jsx";
import { calcularMinutosLectura, formatearFecha } from "../lib/fechas.js";
import {
    nombreTransicionImagen,
    nombreTransicionTitulo,
} from "../lib/transiciones.js";
import { Enlace } from "../router/Router.jsx";
import {
    leerCachePorSlug,
    nombreCategoria,
    obtenerPorSlug,
    obtenerRelacionados,
} from "../services/articulos.js";

/**
 * ------------------------------------------
 * -----  `DetalleArticulo({ slug })`  -----
 * ------------------------------------------
 * - Página pública con el detalle completo de un artículo.
 * @param {{ slug: string }} props - Slug del artículo a mostrar.
 * @return {import("react").JSX.Element} - Contenido del detalle del artículo.
 */
export const DetalleArticulo = ({ slug }) => {
    /** @type {Articulo|null} - `artículo en caché para este slug` */
    const cacheInicial = leerCachePorSlug(slug);

    /** @type {[Articulo|null, Function]} - `artículo cargado` */
    const [articulo, setArticulo] = useState(() => cacheInicial);

    /** @type {[Articulo[], Function]} - `artículos relacionados` */
    const [relacionados, setRelacionados] = useState([]);

    /** - `indica si todavía no hay contenido para mostrar` */
    const [cargando, setCargando] = useState(() => !cacheInicial);

    useEffect(() => {
        /** - `bandera para ignorar respuestas de una petición cancelada` */
        let cancelado = false;

        //  -----  limpiar relacionados al instante para no duplicar view-transition-name  -----
        setRelacionados([]);

        //  -----  si hay caché, pintar al instante sin vaciar la pantalla  -----
        const cache = leerCachePorSlug(slug);
        if (cache) {
            setArticulo(cache);
            setCargando(false);
        } else {
            setArticulo(null);
            setCargando(true);
        }

        //  -----  refrescar el artículo y los relacionados  -----
        const cargarDetalle = async () => {
            const encontrado = await obtenerPorSlug(slug);
            if (cancelado) {
                return;
            }

            setArticulo(encontrado);

            if (encontrado) {
                const otros = await obtenerRelacionados(slug);
                if (!cancelado) {
                    //  -----  excluir el artículo actual por si la API lo devolviera  -----
                    setRelacionados(
                        otros.filter((relacionado) => relacionado.slug !== slug)
                    );
                }
            } else {
                setRelacionados([]);
            }

            setCargando(false);
        };

        cargarDetalle();

        return () => {
            cancelado = true;
        };
    }, [slug]);

    //  -----  spinner solo si no hay artículo en pantalla  -----
    if (cargando && !articulo) {
        return (
            <div className="cargador" role="status" aria-label="Cargando artículo">
                <span className="cargador__circulo" aria-hidden="true"></span>
            </div>
        );
    }

    if (!cargando && !articulo) {
        return (
            <section className="estado-vacio">
                <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                    search_off
                </span>
                <h1 className="estado-vacio__titulo text-headline-md">
                    Artículo no encontrado
                </h1>
                <p className="estado-vacio__texto text-body-md">
                    El artículo que buscas no existe o ya no está publicado.
                </p>
                <Enlace
                    href="/"
                    className="button button--primary button--md text-label-md"
                >
                    Volver al inicio
                </Enlace>
            </section>
        );
    }

    return (
        <>
            <article className="article">
                <header className="article__header">
                    <div className="badge article__badge">
                        {nombreCategoria(articulo)}
                    </div>
                    <h1
                        className="article__title text-headline-xl"
                        style={{
                            viewTransitionName: nombreTransicionTitulo(articulo.slug),
                        }}
                    >
                        {articulo.title}
                    </h1>
                    <div className="article__byline text-label-md">
                        <span>{formatearFecha(articulo.created_at)}</span>
                        <span>•</span>
                        <div className="article__read-time">
                            <span className="material-symbols-outlined material-symbols-outlined--sm">
                                schedule
                            </span>
                            <span>
                                {calcularMinutosLectura(articulo.content)} min lectura
                            </span>
                        </div>
                    </div>
                    {articulo.image_url ? (
                        <div className="article__cover">
                            <img
                                className="article__cover-image"
                                src={articulo.image_url}
                                alt={articulo.title}
                                style={{
                                    viewTransitionName: nombreTransicionImagen(
                                        articulo.slug
                                    ),
                                }}
                            />
                            <div className="article__cover-overlay"></div>
                        </div>
                    ) : (
                        <div
                            className="article__cover article__cover--placeholder"
                            style={{
                                viewTransitionName: nombreTransicionImagen(
                                    articulo.slug
                                ),
                            }}
                            aria-hidden="true"
                        >
                            <span className="material-symbols-outlined material-symbols-outlined--xl">
                                sports_esports
                            </span>
                        </div>
                    )}
                </header>
                <div className="article-content">
                    {articulo.excerpt && (
                        <p className="article-content__lead text-body-lg">
                            {articulo.excerpt}
                        </p>
                    )}
                    <ContenidoHtml html={articulo.content} />
                </div>
            </article>
            {relacionados.length > 0 && (
                <aside className="article-sidebar">
                    <div className="related">
                        <div className="related__heading">
                            <div className="related__pulse" aria-hidden="true"></div>
                            <h2 className="related__title text-label-md">
                                Artículos Relacionados
                            </h2>
                        </div>
                        {relacionados.map((relacionado) => (
                            <Enlace
                                key={relacionado.id}
                                href={`/articulo/${relacionado.slug}`}
                                className="related__item"
                            >
                                <div className="related__thumb">
                                    {relacionado.image_url ? (
                                        <img
                                            src={relacionado.image_url}
                                            alt={relacionado.title}
                                        />
                                    ) : (
                                        <span
                                            className="related__thumb--placeholder"
                                            aria-hidden="true"
                                        >
                                            <span className="material-symbols-outlined">
                                                sports_esports
                                            </span>
                                        </span>
                                    )}
                                </div>
                                <div className="related__meta">
                                    <span className="related__category text-label-sm">
                                        {nombreCategoria(relacionado)}
                                    </span>
                                    <h3 className="related__headline text-body-md">
                                        {relacionado.title}
                                    </h3>
                                </div>
                            </Enlace>
                        ))}
                    </div>
                </aside>
            )}
        </>
    );
};
