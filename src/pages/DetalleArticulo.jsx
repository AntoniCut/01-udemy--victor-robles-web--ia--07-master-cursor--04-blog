/*
    *  ---------------------------------------------------------------------  *
    *  -----  DetalleArticulo.jsx  --  /src/pages/DetalleArticulo.jsx  -----  *
    *  ---------------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { Cabecera } from "../components/Cabecera.jsx";
import { PiePagina } from "../components/PiePagina.jsx";
import { calcularMinutosLectura, formatearFecha } from "../lib/fechas.js";
import { Enlace } from "../router/Router.jsx";
import { obtenerPorSlug, obtenerRelacionados } from "../services/articulos.js";

/**
 * ------------------------------------------
 * -----  `DetalleArticulo({ slug })`  -----
 * ------------------------------------------
 * - Página pública con el detalle completo de un artículo.
 * @param {{ slug: string }} props - Slug del artículo a mostrar.
 * @return {JSX.Element} - Página de detalle del artículo.
 */
export const DetalleArticulo = ({ slug }) => {
    /** @type {[Articulo|null, Function]} - `artículo cargado` */
    const [articulo, setArticulo] = useState(null);

    /** @type {[Articulo[], Function]} - `artículos relacionados` */
    const [relacionados, setRelacionados] = useState([]);

    /** - `indica si el artículo se está cargando` */
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        //  -----  cargar el artículo y los relacionados por su slug  -----
        const cargarDetalle = async () => {
            setCargando(true);
            const encontrado = await obtenerPorSlug(slug);
            setArticulo(encontrado);

            if (encontrado) {
                const otros = await obtenerRelacionados(slug);
                setRelacionados(otros);
            }

            setCargando(false);
        };

        cargarDetalle();
    }, [slug]);

    /** @type {string[]} - `párrafos del contenido del artículo` */
    const parrafos = articulo
        ? articulo.content.split(/\n\s*\n/).filter((texto) => texto.trim() !== "")
        : [];

    return (
        <div className="page-article">
            <Cabecera />
            <main className="page-article__main">
                {cargando && (
                    <div className="cargador" role="status" aria-label="Cargando artículo">
                        <span className="cargador__circulo" aria-hidden="true"></span>
                    </div>
                )}
                {!cargando && !articulo && (
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
                )}
                {!cargando && articulo && (
                    <>
                        <article className="article">
                            <header className="article__header">
                                <div className="badge article__badge">Noticia</div>
                                <h1 className="article__title text-headline-xl">
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
                                {articulo.image_url && (
                                    <div className="article__cover">
                                        <img
                                            className="article__cover-image"
                                            src={articulo.image_url}
                                            alt={articulo.title}
                                        />
                                        <div className="article__cover-overlay"></div>
                                    </div>
                                )}
                            </header>
                            <div className="article-content">
                                {articulo.excerpt && (
                                    <p className="article-content__lead text-body-lg">
                                        {articulo.excerpt}
                                    </p>
                                )}
                                {parrafos.map((parrafo, indice) => (
                                    <p key={indice}>{parrafo}</p>
                                ))}
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
                                                    Noticia
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
                )}
            </main>
            <PiePagina />
        </div>
    );
};
