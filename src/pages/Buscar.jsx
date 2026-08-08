/*
    *  ---------------------------------------------------  *
    *  -----  Buscar.jsx  --  /src/pages/Buscar.jsx  -----  *
    *  ---------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { Paginacion } from "../components/Paginacion.jsx";
import { TarjetaArticulo } from "../components/TarjetaArticulo.jsx";
import { Enlace } from "../router/Router.jsx";
import {
    ARTICULOS_POR_PAGINA,
    buscarArticulos,
} from "../services/articulos.js";

/**
 * --------------------------------
 * -----  `Buscar({ query })`  -----
 * --------------------------------
 * - Página de resultados de búsqueda: lista paginada de artículos
 *   cuyo título o extracto contienen el término buscado.
 * @param {{ query: string }} props - Término de búsqueda desde la URL.
 * @return {import("react").JSX.Element} - Resultados de la búsqueda.
 */
export const Buscar = ({ query }) => {
    /** @type {[Articulo[], Function]} - `artículos de la página actual` */
    const [articulos, setArticulos] = useState([]);

    /** - `total de artículos encontrados` */
    const [total, setTotal] = useState(0);

    /** - `página actual de los resultados` */
    const [pagina, setPagina] = useState(1);

    /** - `indica si se está buscando` */
    const [cargando, setCargando] = useState(true);

    /** - `indica si hubo un error al buscar` */
    const [error, setError] = useState(false);

    useEffect(() => {
        //  -----  sin término de búsqueda, no consultar  -----
        if (!query.trim()) {
            setArticulos([]);
            setTotal(0);
            setError(false);
            setCargando(false);
            return;
        }

        /** - `bandera para ignorar respuestas de una petición cancelada` */
        let cancelado = false;
        setCargando(true);

        //  -----  buscar en título y extracto, paginado  -----
        const cargarResultados = async () => {
            const resultado = await buscarArticulos(query, pagina);
            if (cancelado) {
                return;
            }

            setArticulos(resultado.articulos);
            setTotal(resultado.total);
            setError(resultado.error);
            setCargando(false);
        };

        cargarResultados();

        return () => {
            cancelado = true;
        };
    }, [query, pagina]);

    /** - `número total de páginas de resultados` */
    const totalPaginas = Math.ceil(total / ARTICULOS_POR_PAGINA);

    /** - `texto con el número de resultados (singular o plural)` */
    const textoResultados =
        total === 1
            ? "Se encontró 1 resultado"
            : `Se encontraron ${total} resultados`;

    //  -----  cambio de página desde la paginación  -----
    const alCambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
        window.scrollTo(0, 0);
    };

    //  -----  búsqueda vacía: indicar cómo buscar  -----
    if (!query.trim()) {
        return (
            <section className="estado-vacio">
                <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                    search
                </span>
                <h2 className="estado-vacio__titulo text-headline-md">
                    Buscar artículos
                </h2>
                <p className="estado-vacio__texto text-body-md">
                    Escribe un término en el buscador para encontrar noticias
                    de videojuegos.
                </p>
            </section>
        );
    }

    //  -----  spinner mientras se busca  -----
    if (cargando) {
        return (
            <div className="cargador" role="status" aria-label="Buscando artículos">
                <span className="cargador__circulo" aria-hidden="true"></span>
            </div>
        );
    }

    //  -----  error al buscar  -----
    if (error) {
        return (
            <section className="estado-vacio">
                <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                    error
                </span>
                <h2 className="estado-vacio__titulo text-headline-md">
                    No se pudieron cargar los resultados
                </h2>
                <p className="estado-vacio__texto text-body-md">
                    Inténtalo de nuevo dentro de unos instantes.
                </p>
            </section>
        );
    }

    //  -----  sin resultados para el término  -----
    if (total === 0) {
        return (
            <section className="estado-vacio">
                <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                    manage_search
                </span>
                <h2 className="estado-vacio__titulo text-headline-md">
                    No se encontraron artículos para “{query}”
                </h2>
                <p className="estado-vacio__texto text-body-md">
                    Prueba con otro término de búsqueda.
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
            <div className="section-heading">
                <h2 className="section-heading__title text-headline-md">
                    Resultados para “{query}”
                </h2>
                <div className="section-heading__line"></div>
            </div>
            <p className="search-results__count text-body-md">
                {textoResultados}
            </p>
            <div className="article-grid">
                {articulos.map((articulo) => (
                    <TarjetaArticulo key={articulo.id} articulo={articulo} />
                ))}
            </div>
            <Paginacion
                pagina={pagina}
                totalPaginas={totalPaginas}
                alCambiar={alCambiarPagina}
            />
        </>
    );
};
