/*
    *  --------------------------------------------------------------------------  *
    *  -----  TarjetaArticulo.jsx  --  /src/components/TarjetaArticulo.jsx  -----  *
    *  --------------------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { formatearFecha } from "../lib/fechas.js";
import {
    nombreTransicionImagen,
    nombreTransicionTitulo,
} from "../lib/transiciones.js";
import { Enlace } from "../router/Router.jsx";
import { nombreCategoria } from "../services/articulos.js";

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
                            style={{
                                viewTransitionName: nombreTransicionImagen(
                                    articulo.slug
                                ),
                            }}
                        />
                    ) : (
                        <div
                            className="article-card__placeholder"
                            aria-hidden="true"
                            style={{
                                viewTransitionName: nombreTransicionImagen(
                                    articulo.slug
                                ),
                            }}
                        >
                            <span className="material-symbols-outlined material-symbols-outlined--xl">
                                sports_esports
                            </span>
                        </div>
                    )}
                    <div className="article-card__shade"></div>
                </div>
                <div className="article-card__body">
                    <div className="article-card__meta">
                        <span className="badge text-label-sm">
                            {nombreCategoria(articulo)}
                        </span>
                        <span className="article-card__date text-label-sm">
                            {formatearFecha(articulo.created_at)}
                        </span>
                    </div>
                    <h3
                        className="article-card__title text-headline-sm"
                        style={{
                            viewTransitionName: nombreTransicionTitulo(
                                articulo.slug
                            ),
                        }}
                    >
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
