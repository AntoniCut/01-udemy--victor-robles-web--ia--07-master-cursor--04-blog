/*
    *  -------------------------------------------------------------  *
    *  -----  AdminEditor.jsx  --  /src/pages/AdminEditor.jsx  -----  *
    *  -------------------------------------------------------------  *
*/

/// <reference path="../../types/types.d.js" />

import { useEffect, useState } from "react";
import { EditorEnriquecido } from "../components/EditorEnriquecido.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { formatearFecha } from "../lib/fechas.js";
import { contenidoHtmlVacio, sanitizarHtml } from "../lib/html.js";
import { useRouter } from "../router/Router.jsx";
import {
    actualizarArticulo,
    crearArticulo,
    generarSlug,
    obtenerPorId,
} from "../services/articulos.js";
import { obtenerTodas } from "../services/categorias.js";

/**
 * ----------------------------------
 * -----  `AdminEditor({ id })`  -----
 * ----------------------------------
 * - Editor para crear un artículo nuevo o editar uno existente.
 * @param {{ id?: string }} props - Identificador del artículo a editar (opcional).
 * @return {import("react").JSX.Element} - Página del editor de artículos.
 */
export const AdminEditor = ({ id }) => {
    const { usuario } = useAuth();
    const { mostrarAviso } = useToast();
    const { navegar } = useRouter();

    /** - `título del artículo` */
    const [titulo, setTitulo] = useState("");

    /** - `contenido del artículo` */
    const [contenido, setContenido] = useState("");

    /** - `extracto del artículo` */
    const [extracto, setExtracto] = useState("");

    /** - `URL de la imagen de portada` */
    const [imagenUrl, setImagenUrl] = useState("");

    /** - `identificador de la categoría seleccionada` */
    const [categoriaId, setCategoriaId] = useState("");

    /** @type {[Categoria[], Function]} - `categorías disponibles en el selector` */
    const [categorias, setCategorias] = useState([]);

    /** - `indica si el artículo está publicado` */
    const [publicado, setPublicado] = useState(false);

    /** - `fecha de última modificación (solo al editar)` */
    const [modificado, setModificado] = useState("");

    /** - `indica si el artículo a editar se está cargando` */
    const [cargando, setCargando] = useState(Boolean(id));

    /** - `indica si se está guardando el artículo` */
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        //  -----  cargar las categorías del selector  -----
        const cargarCategorias = async () => {
            const resultado = await obtenerTodas();
            setCategorias(resultado.categorias);

            if (resultado.error) {
                mostrarAviso("No se pudieron cargar las categorías.", "error");
            }
        };

        cargarCategorias();
    }, []);

    useEffect(() => {
        //  -----  si hay id, cargar el artículo a editar  -----
        if (!id) {
            return;
        }

        const cargarArticulo = async () => {
            setCargando(true);
            const articulo = await obtenerPorId(id);

            //  -----  si no existe o no es del autor, volver al panel  -----
            if (!articulo || articulo.author_id !== usuario.id) {
                mostrarAviso("No se encontró el artículo a editar.", "error");
                navegar("/admin");
                return;
            }

            setTitulo(articulo.title);
            setContenido(articulo.content);
            setExtracto(articulo.excerpt ?? "");
            setImagenUrl(articulo.image_url ?? "");
            setCategoriaId(articulo.category_id ?? "");
            setPublicado(articulo.published);
            setModificado(articulo.updated_at);
            setCargando(false);
        };

        cargarArticulo();
    }, [id]);

    /**
     * ----------------------------------
     * -----  `guardar(publicar)`  -----
     * ----------------------------------
     * - Valida el formulario y crea o actualiza el artículo.
     * @param {boolean} publicar - Estado de publicación con el que guardar.
     * @return {Promise<void>}
     */
    const guardar = async (publicar) => {
        //  -----  validación visual de los campos obligatorios  -----
        if (titulo.trim() === "" || contenidoHtmlVacio(contenido)) {
            mostrarAviso("El título y el contenido son obligatorios.", "error");
            return;
        }

        setGuardando(true);

        /** - `datos comunes del artículo a guardar` */
        const datos = {
            title: titulo.trim(),
            content: sanitizarHtml(contenido),
            excerpt: extracto.trim() === "" ? null : extracto.trim(),
            image_url: imagenUrl.trim() === "" ? null : imagenUrl.trim(),
            category_id: categoriaId === "" ? null : categoriaId,
            published: publicar,
        };

        //  -----  actualizar un artículo existente  -----
        if (id) {
            const resultado = await actualizarArticulo(id, datos);

            if (resultado.error) {
                mostrarAviso("No se pudo guardar el artículo.", "error");
                setGuardando(false);
                return;
            }
        }
        //  -----  crear un artículo nuevo  -----
        else {
            const resultado = await crearArticulo({
                ...datos,
                slug: generarSlug(titulo),
                author_id: usuario.id,
            });

            if (resultado.error) {
                mostrarAviso("No se pudo crear el artículo.", "error");
                setGuardando(false);
                return;
            }
        }

        mostrarAviso(
            publicar
                ? "Artículo publicado correctamente."
                : "Borrador guardado correctamente."
        );
        navegar("/admin");
    };

    //  -----  click en guardar borrador  -----
    const alHacerClickBorrador = (evento) => {
        evento.preventDefault();
        guardar(false);
    };

    //  -----  click en publicar  -----
    const alHacerClickPublicar = (evento) => {
        evento.preventDefault();
        guardar(true);
    };

    //  -----  submit del formulario: guardar con el estado actual  -----
    const alEnviarFormulario = (evento) => {
        evento.preventDefault();
        guardar(publicado);
    };

    return (
        <main className="page-editor__main">
            <div className="page-editor__bg" aria-hidden="true"></div>
            {cargando ? (
                <div className="cargador" role="status" aria-label="Cargando artículo">
                    <span className="cargador__circulo" aria-hidden="true"></span>
                </div>
            ) : (
                <form onSubmit={alEnviarFormulario}>
                        <header className="page-editor__header">
                            <div>
                                <div className="page-editor__breadcrumb text-label-sm">
                                    <span>Artículos</span>
                                    <span className="material-symbols-outlined material-symbols-outlined--sm">
                                        chevron_right
                                    </span>
                                    <span className="page-editor__breadcrumb-current">
                                        {id ? "Editar Artículo" : "Redactar Nuevo"}
                                    </span>
                                </div>
                                <h1 className="page-editor__heading text-headline-md">
                                    Editor de Artículos
                                </h1>
                            </div>
                            <div className="page-editor__actions">
                                <button
                                    className="button button--secondary button--md text-label-md"
                                    type="button"
                                    disabled={guardando}
                                    onClick={alHacerClickBorrador}
                                >
                                    Guardar Borrador
                                </button>
                                <button
                                    className="button button--primary button--md text-label-md"
                                    type="button"
                                    disabled={guardando}
                                    onClick={alHacerClickPublicar}
                                >
                                    Publicar
                                    <span className="material-symbols-outlined material-symbols-outlined--md">
                                        send
                                    </span>
                                </button>
                            </div>
                        </header>
                        <div className="page-editor__workspace">
                            <div className="page-editor__content">
                                <div className="card card--panel editor-title">
                                    <label className="visualmente-oculto" htmlFor="titulo">
                                        Título del artículo
                                    </label>
                                    <input
                                        className="editor-title__input text-headline-lg"
                                        id="titulo"
                                        name="titulo"
                                        placeholder="Ingresa el título del artículo..."
                                        type="text"
                                        value={titulo}
                                        onChange={(evento) => setTitulo(evento.target.value)}
                                    />
                                    <div
                                        className="editor-title__underline"
                                        aria-hidden="true"
                                    ></div>
                                </div>
                                <EditorEnriquecido
                                    key={id ?? "nuevo"}
                                    valorInicial={contenido}
                                    alCambiar={setContenido}
                                />
                            </div>
                            <aside className="page-editor__aside">
                                <div className="card card--panel editor-panel">
                                    <h2 className="editor-panel__heading text-label-md">
                                        <span className="material-symbols-outlined material-symbols-outlined--md">
                                            info
                                        </span>
                                        Estado del Documento
                                    </h2>
                                    <div className="editor-panel__row">
                                        <span className="text-label-sm editor-panel__meta-label">
                                            Visibilidad
                                        </span>
                                        {publicado ? (
                                            <span className="badge badge--status">
                                                <span className="badge__pulse"></span>
                                                Publicado
                                            </span>
                                        ) : (
                                            <span className="badge badge--status">
                                                <span className="badge__pulse badge__pulse--error"></span>
                                                Borrador
                                            </span>
                                        )}
                                    </div>
                                    {modificado && (
                                        <div className="editor-panel__meta">
                                            <span className="editor-panel__meta-label text-label-sm">
                                                Última modificación
                                            </span>
                                            <span className="editor-panel__meta-value text-body-md">
                                                {formatearFecha(modificado)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="card card--panel editor-panel">
                                    <h2 className="editor-panel__heading text-label-md">
                                        <span className="material-symbols-outlined material-symbols-outlined--md">
                                            label
                                        </span>
                                        Metadatos
                                    </h2>
                                    <div className="editor-panel__fields">
                                        <div className="input">
                                            <label
                                                className="input__label text-label-sm"
                                                htmlFor="categoria"
                                            >
                                                Categoría Principal
                                            </label>
                                            <select
                                                className="input__field input__field--low text-body-md"
                                                id="categoria"
                                                name="categoria"
                                                aria-label="Categoría Principal"
                                                value={categoriaId}
                                                onChange={(evento) =>
                                                    setCategoriaId(evento.target.value)
                                                }
                                            >
                                                <option value="">
                                                    Selecciona una categoría
                                                </option>
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
                                        <div className="input">
                                            <label
                                                className="input__label text-label-sm"
                                                htmlFor="extracto"
                                            >
                                                Extracto
                                            </label>
                                            <textarea
                                                className="input__field input__field--low text-body-md editor-panel__extracto"
                                                id="extracto"
                                                name="extracto"
                                                placeholder="Resumen breve que se muestra en el listado..."
                                                value={extracto}
                                                onChange={(evento) =>
                                                    setExtracto(evento.target.value)
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card--panel editor-panel">
                                    <h2 className="editor-panel__heading text-label-md">
                                        <span className="material-symbols-outlined material-symbols-outlined--md">
                                            image
                                        </span>
                                        Imagen de Portada
                                    </h2>
                                    <div className="editor-panel__fields">
                                        <div className="input">
                                            <label
                                                className="input__label text-label-sm"
                                                htmlFor="imagen"
                                            >
                                                URL de la imagen
                                            </label>
                                            <input
                                                className="input__field input__field--low text-body-md"
                                                id="imagen"
                                                name="imagen"
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                                type="url"
                                                value={imagenUrl}
                                                onChange={(evento) =>
                                                    setImagenUrl(evento.target.value)
                                                }
                                            />
                                        </div>
                                        {imagenUrl.trim() !== "" && (
                                            <img
                                                className="editor-panel__vista-previa"
                                                src={imagenUrl}
                                                alt="Vista previa de la portada"
                                            />
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                </form>
            )}
        </main>
    );
};
