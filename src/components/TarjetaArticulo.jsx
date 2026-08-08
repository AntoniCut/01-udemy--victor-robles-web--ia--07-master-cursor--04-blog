/*
    *  --------------------------------------------------------------------------  *
    *  -----  TarjetaArticulo.jsx  --  /src/components/TarjetaArticulo.jsx  -----  *
    *  --------------------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { formatearFecha } from "../lib/fechas.js";
import { Enlace } from "../router/Router.jsx";

/**
 * --------------------------------------------
 * -----  `TarjetaArticulo({ articulo })`  -----
 * --------------------------------------------
 * - Tarjeta de un artículo dentro del listado público.
 * @param {{ articulo: Articulo }} props - Artículo a mostrar.
 * @return {import("react").JSX.Element} - Tarjeta enlazada al detalle del artículo.
 */
export const TarjetaArticulo = ({ articulo }) => {
    return (
        <Enlace
            href={`/articulo/${articulo.slug}`}
            className="card card--interactive article-card"
        >
            <article>
                <div className="article-card__media">
                    {articulo.image_url ? (
                        <img
                            className="article-card__image"
                            src={articulo.image_url}
                            alt={articulo.title}
                        />
                    ) : (
                        <div className="article-card__placeholder" aria-hidden="true">
                            <span className="material-symbols-outlined material-symbols-outlined--xl">
                                sports_esports
                            </span>
                        </div>
                    )}
                    <div className="article-card__shade"></div>
                </div>
                <div className="article-card__body">
                    <div className="article-card__meta">
                        <span className="badge text-label-sm">Noticia</span>
                        <span className="article-card__date text-label-sm">
                            {formatearFecha(articulo.created_at)}
                        </span>
                    </div>
                    <h3 className="article-card__title text-headline-sm">
                        {articulo.title}
                    </h3>
                    <p className="article-card__excerpt text-body-md">
                        {articulo.excerpt ?? ""}
                    </p>
                </div>
            </article>
        </Enlace>
    );
};
