/*
    *  -------------------------------------------------------------------  *
    *  -----  AdminDashboard.jsx  --  /src/pages/AdminDashboard.jsx  -----  *
    *  -------------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { ModalConfirmacion } from "../components/ModalConfirmacion.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatearFecha } from "../lib/fechas.js";
import { Enlace } from "../router/Router.jsx";
import {
    cambiarPublicado,
    eliminarArticulo,
    nombreCategoria,
    obtenerDelAutor,
} from "../services/articulos.js";
import { obtenerTodas } from "../services/categorias.js";

/**
 * --------------------------------
 * -----  `normalizar(texto)`  -----
 * --------------------------------
 * - Normaliza un texto a minúsculas y sin acentos para comparar búsquedas.
 * @param {string} texto - Texto a normalizar.
 * @return {string} - Texto en minúsculas y sin tildes.
 */
const normalizar = (texto) => {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

/**
 * -------------------------------
 * -----  `AdminDashboard()`  -----
 * -------------------------------
 * - Panel de administración con la tabla de artículos del autor.
 * @return {import("react").JSX.Element} - Página del dashboard de administración.
 */
export const AdminDashboard = () => {
    const { usuario } = useAuth();
    const { mostrarAviso } = useToast();

    /** @type {[Articulo[], Function]} - `artículos del autor` */
    const [articulos, setArticulos] = useState([]);

    /** - `término de búsqueda del panel` */
    const [terminoBusqueda, setTerminoBusqueda] = useState("");

    /** - `identificador de categoría para filtrar (vacío = todas)` */
    const [categoriaFiltro, setCategoriaFiltro] = useState("");

    /** @type {[Categoria[], Function]} - `categorías del selector de filtro` */
    const [categorias, setCategorias] = useState([]);

    /** - `indica si la tabla se está cargando` */
    const [cargando, setCargando] = useState(true);

    /** @type {[Articulo|null, Function]} - `artículo pendiente de eliminar (modal)` */
    const [articuloAEliminar, setArticuloAEliminar] = useState(null);

    useEffect(() => {
        //  -----  cargar los artículos del autor al entrar al panel  -----
        const cargarArticulos = async () => {
            setCargando(true);
            const resultado = await obtenerDelAutor(usuario.id);
            setArticulos(resultado.articulos);

            if (resultado.error) {
                mostrarAviso("No se pudieron cargar los artículos.", "error");
            }

            setCargando(false);
        };

        cargarArticulos();
    }, [usuario.id]);

    useEffect(() => {
        //  -----  cargar categorías para el filtro del listado  -----
        const cargarCategorias = async () => {
            const resultado = await obtenerTodas();
            setCategorias(resultado.categorias);

            if (resultado.error) {
                mostrarAviso("No se pudieron cargar las categorías.", "error");
            }
        };

        cargarCategorias();
    }, []);

    /** - `término de búsqueda normalizado para comparar` */
    const terminoNormalizado = normalizar(terminoBusqueda);

    /** @type {Articulo[]} - `artículos que coinciden con texto y categoría` */
    const articulosFiltrados = articulos.filter((articulo) => {
        //  -----  filtro por categoría seleccionada  -----
        if (categoriaFiltro && articulo.category_id !== categoriaFiltro) {
            return false;
        }

        //  -----  sin término de texto, basta con la categoría  -----
        if (!terminoNormalizado) {
            return true;
        }

        return (
            normalizar(articulo.title).includes(terminoNormalizado) ||
            normalizar(articulo.excerpt ?? "").includes(terminoNormalizado)
        );
    });

    /** - `nombre de la categoría activa en el filtro` */
    const nombreFiltroCategoria =
        categorias.find((categoria) => categoria.id === categoriaFiltro)?.name ??
        "";

    //  -----  click en publicar / despublicar un artículo  -----
    const alCambiarPublicado = async (evento, articulo) => {
        evento.preventDefault();

        const resultado = await cambiarPublicado(articulo.id, !articulo.published);

        if (resultado.error) {
            mostrarAviso("No se pudo cambiar el estado del artículo.", "error");
            return;
        }

        //  -----  actualizar el artículo en la tabla  -----
        setArticulos((previos) =>
            previos.map((previo) =>
                previo.id === articulo.id ? resultado.articulo : previo
            )
        );

        mostrarAviso(
            resultado.articulo.published
                ? "Artículo publicado correctamente."
                : "Artículo despublicado correctamente."
        );
    };

    //  -----  confirmar la eliminación desde el modal  -----
    const alConfirmarEliminar = async () => {
        /** - `artículo que se va a eliminar` */
        const articulo = articuloAEliminar;
        setArticuloAEliminar(null);

        const huboError = await eliminarArticulo(articulo.id);

        if (huboError) {
            mostrarAviso("No se pudo eliminar el artículo.", "error");
            return;
        }

        //  -----  quitar el artículo de la tabla  -----
        setArticulos((previos) =>
            previos.filter((previo) => previo.id !== articulo.id)
        );

        mostrarAviso("Artículo eliminado correctamente.");
    };

    return (
        <>
            <main className="page-dashboard__main">
                <div className="page-dashboard__inner">
                    <header className="page-dashboard__header">
                        <div>
                            <h1 className="page-dashboard__heading text-headline-xl">
                                Gestión de Artículos
                            </h1>
                            <p className="page-dashboard__lead text-body-md">
                                Administra, edita y publica contenido para la plataforma.
                            </p>
                        </div>
                        <Enlace
                            href="/admin/nuevo"
                            className="button button--primary button--lg text-label-md"
                        >
                            <span className="material-symbols-outlined material-symbols-outlined--filled">
                                add_circle
                            </span>
                            Nuevo Artículo
                        </Enlace>
                    </header>
                    <div className="page-dashboard__buscar">
                        <div className="input__control page-dashboard__buscar-texto">
                            <input
                                className="input__field input__field--low input__field--icon"
                                type="text"
                                placeholder="Buscar artículos..."
                                aria-label="Buscar artículos del panel"
                                value={terminoBusqueda}
                                onChange={(evento) =>
                                    setTerminoBusqueda(evento.target.value)
                                }
                            />
                            <span
                                className="material-symbols-outlined input__icon"
                                aria-hidden="true"
                            >
                                search
                            </span>
                        </div>
                        <div className="input page-dashboard__buscar-categoria">
                            <label
                                className="visualmente-oculto"
                                htmlFor="filtro-categoria"
                            >
                                Filtrar por categoría
                            </label>
                            <select
                                className="input__field input__field--low text-body-md"
                                id="filtro-categoria"
                                name="filtro-categoria"
                                aria-label="Filtrar por categoría"
                                value={categoriaFiltro}
                                onChange={(evento) =>
                                    setCategoriaFiltro(evento.target.value)
                                }
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((categoria) => (
                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="card data-table data-table--blog">
                        {cargando && (
                            <div className="cargador" role="status" aria-label="Cargando artículos">
                                <span className="cargador__circulo" aria-hidden="true"></span>
                            </div>
                        )}
                        {!cargando && articulos.length === 0 && (
                            <section className="estado-vacio">
                                <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                                    edit_note
                                </span>
                                <h2 className="estado-vacio__titulo text-headline-md">
                                    Todavía no has creado ningún artículo
                                </h2>
                                <p className="estado-vacio__texto text-body-md">
                                    Crea tu primer artículo con el botón "Nuevo Artículo".
                                </p>
                            </section>
                        )}
                        {!cargando &&
                            articulos.length > 0 &&
                            articulosFiltrados.length === 0 && (
                                <section className="estado-vacio">
                                    <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                                        manage_search
                                    </span>
                                    <h2 className="estado-vacio__titulo text-headline-md">
                                        {terminoBusqueda.trim()
                                            ? `No se encontraron artículos para “${terminoBusqueda}”`
                                            : nombreFiltroCategoria
                                              ? `No hay artículos en “${nombreFiltroCategoria}”`
                                              : "No se encontraron artículos"}
                                    </h2>
                                    <p className="estado-vacio__texto text-body-md">
                                        Prueba con otro término, otra categoría o
                                        limpia los filtros.
                                    </p>
                                    <button
                                        className="button button--secondary button--sm text-label-md"
                                        type="button"
                                        onClick={() => {
                                            setTerminoBusqueda("");
                                            setCategoriaFiltro("");
                                        }}
                                    >
                                        Limpiar filtros
                                    </button>
                                </section>
                            )}
                        {!cargando && articulosFiltrados.length > 0 && (
                            <div className="data-table__scroll">
                                <div className="data-table__head text-label-sm">
                                    <div className="data-table__col--image">Imagen</div>
                                    <div className="data-table__col--title">Título</div>
                                    <div className="data-table__col--category">
                                        Categoría
                                    </div>
                                    <div className="data-table__col--date">Fecha</div>
                                    <div className="data-table__col--status">Estado</div>
                                    <div className="data-table__col--actions">Acciones</div>
                                </div>
                                <div className="data-table__body">
                                    {articulosFiltrados.map((articulo) => (
                                        <div className="data-table__row" key={articulo.id}>
                                            <div className="data-table__col--image">
                                                {articulo.image_url ? (
                                                    <img
                                                        className="data-table__thumb"
                                                        src={articulo.image_url}
                                                        alt={articulo.title}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        className="data-table__thumb data-table__thumb--placeholder"
                                                        aria-hidden="true"
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            sports_esports
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="data-table__col--title">
                                                <div className="data-table__title text-label-md">
                                                    {articulo.title}
                                                </div>
                                                <div className="data-table__subtitle text-label-sm">
                                                    {articulo.excerpt ?? ""}
                                                </div>
                                            </div>
                                            <div className="data-table__col--category text-body-sm data-table__category">
                                                {nombreCategoria(articulo)}
                                            </div>
                                            <div className="data-table__col--date text-body-sm data-table__date">
                                                {formatearFecha(articulo.created_at)}
                                            </div>
                                            <div className="data-table__col--status">
                                                {articulo.published ? (
                                                    <span className="badge badge--live text-label-sm">
                                                        <span className="badge__pulse"></span>
                                                        Publicado
                                                    </span>
                                                ) : (
                                                    <span className="badge badge--draft text-label-sm">
                                                        Borrador
                                                    </span>
                                                )}
                                            </div>
                                            <div className="data-table__col--actions data-table__actions">
                                                <button
                                                    className="data-table__action"
                                                    type="button"
                                                    aria-label={
                                                        articulo.published
                                                            ? "Despublicar"
                                                            : "Publicar"
                                                    }
                                                    title={
                                                        articulo.published
                                                            ? "Despublicar"
                                                            : "Publicar"
                                                    }
                                                    onClick={(evento) =>
                                                        alCambiarPublicado(evento, articulo)
                                                    }
                                                >
                                                    <span className="material-symbols-outlined material-symbols-outlined--lg">
                                                        {articulo.published
                                                            ? "visibility_off"
                                                            : "visibility"}
                                                    </span>
                                                </button>
                                                <Enlace
                                                    href={`/admin/editar/${articulo.id}`}
                                                    className="data-table__action"
                                                    ariaLabel="Editar"
                                                >
                                                    <span className="material-symbols-outlined material-symbols-outlined--lg">
                                                        edit
                                                    </span>
                                                </Enlace>
                                                <button
                                                    className="data-table__action data-table__action--danger"
                                                    type="button"
                                                    aria-label="Eliminar"
                                                    title="Eliminar"
                                                    onClick={(evento) => {
                                                        evento.preventDefault();
                                                        setArticuloAEliminar(articulo);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined material-symbols-outlined--lg">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {!cargando && articulosFiltrados.length > 0 && (
                        <div className="page-dashboard__footer text-label-sm">
                            <span>
                                Mostrando {articulosFiltrados.length}{" "}
                                {articulosFiltrados.length === 1
                                    ? "artículo"
                                    : "artículos"}
                            </span>
                        </div>
                    )}
                </div>
            </main>
            <ModalConfirmacion
                abierto={Boolean(articuloAEliminar)}
                titulo="Eliminar artículo"
                mensaje={
                    articuloAEliminar
                        ? `¿Seguro que quieres eliminar "${articuloAEliminar.title}"? Esta acción no se puede deshacer.`
                        : ""
                }
                alConfirmar={alConfirmarEliminar}
                alCancelar={() => setArticuloAEliminar(null)}
            />
        </>
    );
};
