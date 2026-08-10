/*
    *  ------------------------------------------------------------------------------  *
    *  -----  EditorEnriquecido.jsx  --  /src/components/EditorEnriquecido.jsx  -----  *
    *  ------------------------------------------------------------------------------  *
*/

import { useEffect, useRef, useState } from "react";
import {
    consultarEstadoComando,
    ejecutarComandoEditor,
} from "../lib/comandoEditor.js";
import {
    contenidoHtmlVacio,
    normalizarContenidoEditor,
    rellenarElementoConHtml,
    serializarElemento,
} from "../lib/html.js";

/**
 * -----------------------------------------
 * -----  `restaurarSeleccion(rango)`  -----
 * -----------------------------------------
 * - Restaura una selección guardada dentro del canvas.
 * @param {Range|null} rango - Rango previamente guardado.
 * @return {void}
 */
const restaurarSeleccion = (rango) => {
    if (!rango) {
        return;
    }

    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);
};

/**
 * ------------------------------------------------------------------
 * -----  `EditorEnriquecido({ valorInicial, alCambiar })`  -----
 * ------------------------------------------------------------------
 * - Editor WYSIWYG con barra de herramientas para el contenido del artículo.
 * @param {{
 *   valorInicial?: string,
 *   alCambiar: (html: string) => void,
 * }} props - Contenido inicial y callback al modificar.
 * @return {import("react").JSX.Element} - Editor de texto enriquecido.
 */
export const EditorEnriquecido = ({ valorInicial = "", alCambiar }) => {
    /** @type {import("react").RefObject<HTMLDivElement|null>} - `canvas editable` */
    const canvasRef = useRef(null);

    /** @type {import("react").RefObject<Range|null>} - `selección guardada para insertar enlaces` */
    const rangoGuardadoRef = useRef(null);

    /** - `formato de bloque seleccionado en el desplegable` */
    const [formatoBloque, setFormatoBloque] = useState("p");

    /** @type {["enlace"|"imagen"|null, Function]} - `panel auxiliar visible` */
    const [panel, setPanel] = useState(null);

    /** - `URL escrita en el panel de enlace o imagen` */
    const [urlTemporal, setUrlTemporal] = useState("");

    /** - `indica si el canvas no tiene texto visible` */
    const [estaVacio, setEstaVacio] = useState(
        contenidoHtmlVacio(normalizarContenidoEditor(valorInicial))
    );

    /** @type {[Record<string, boolean>, Function]} - `estado activo de botones de formato` */
    const [activos, setActivos] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
    });

    useEffect(() => {
        //  -----  pintar el contenido inicial una sola vez al montar  -----
        if (!canvasRef.current) {
            return;
        }

        rellenarElementoConHtml(
            canvasRef.current,
            normalizarContenidoEditor(valorInicial)
        );

        /** - `HTML serializado tras el relleno inicial` */
        const htmlInicial = serializarElemento(canvasRef.current);
        setEstaVacio(contenidoHtmlVacio(htmlInicial));
        alCambiar(htmlInicial);
    }, []);

    /**
     * ----------------------------------------
     * -----  `actualizarEstadosActivos()`  -----
     * ----------------------------------------
     * - Sincroniza qué botones de formato están activos según la selección.
     * @return {void}
     */
    const actualizarEstadosActivos = () => {
        setActivos({
            bold: consultarEstadoComando("bold"),
            italic: consultarEstadoComando("italic"),
            underline: consultarEstadoComando("underline"),
            strikeThrough: consultarEstadoComando("strikeThrough"),
        });
    };

    /**
     * --------------------------------
     * -----  `emitirCambio()`  -----
     * --------------------------------
     * - Serializa el canvas y notifica al padre.
     * @return {void}
     */
    const emitirCambio = () => {
        if (!canvasRef.current) {
            return;
        }

        /** - `HTML actual del canvas` */
        const html = serializarElemento(canvasRef.current);
        setEstaVacio(contenidoHtmlVacio(html));
        alCambiar(html);
        actualizarEstadosActivos();
    };

    /**
     * --------------------------------------
     * -----  `guardarSeleccion()`  -----
     * --------------------------------------
     * - Guarda el rango actual para reutilizarlo al insertar enlace o imagen.
     * @return {void}
     */
    const guardarSeleccion = () => {
        const seleccion = window.getSelection();
        if (!seleccion || seleccion.rangeCount === 0) {
            rangoGuardadoRef.current = null;
            return;
        }

        rangoGuardadoRef.current = seleccion.getRangeAt(0).cloneRange();
    };

    /**
     * ------------------------------------------
     * -----  `ejecutarComando(comando)`  -----
     * ------------------------------------------
     * - Aplica un comando de formato sobre la selección del canvas.
     * @param {string} comando - Nombre del comando de edición.
     * @param {string} [valor] - Valor opcional del comando.
     * @return {void}
     */
    const ejecutarComando = (comando, valor = "") => {
        if (!canvasRef.current) {
            return;
        }

        canvasRef.current.focus();
        ejecutarComandoEditor(comando, valor);
        emitirCambio();
    };

    /**
     * --------------------------------------------
     * -----  `alCambiarFormatoBloque(evento)`  -----
     * --------------------------------------------
     * - Cambia el tipo de bloque (párrafo, título, cita...).
     * @param {import("react").ChangeEvent<HTMLSelectElement>} evento - Cambio del select.
     * @return {void}
     */
    const alCambiarFormatoBloque = (evento) => {
        evento.preventDefault();
        /** - `etiqueta de bloque elegida` */
        const etiqueta = evento.target.value;
        setFormatoBloque(etiqueta);
        ejecutarComando("formatBlock", `<${etiqueta}>`);
    };

    /**
     * --------------------------------
     * -----  `abrirPanel(tipo)`  -----
     * --------------------------------
     * - Abre el panel de URL para enlace o imagen.
     * @param {"enlace"|"imagen"} tipo - Tipo de inserción.
     * @return {void}
     */
    const abrirPanel = (tipo) => {
        guardarSeleccion();
        setUrlTemporal("");
        setPanel(tipo);
    };

    /**
     * --------------------------------
     * -----  `cerrarPanel()`  -----
     * --------------------------------
     * - Cierra el panel auxiliar de URL.
     * @return {void}
     */
    const cerrarPanel = () => {
        setPanel(null);
        setUrlTemporal("");
        rangoGuardadoRef.current = null;
    };

    /**
     * ----------------------------------
     * -----  `confirmarPanel()`  -----
     * ----------------------------------
     * - Inserta el enlace o la imagen con la URL indicada.
     * @return {void}
     */
    const confirmarPanel = () => {
        /** - `URL limpia del campo` */
        const url = urlTemporal.trim();
        if (!url || !canvasRef.current) {
            cerrarPanel();
            return;
        }

        canvasRef.current.focus();
        restaurarSeleccion(rangoGuardadoRef.current);

        if (panel === "enlace") {
            ejecutarComandoEditor("createLink", url);
            /** @type {HTMLAnchorElement[]} - `enlaces del canvas` */
            const enlaces = Array.from(
                canvasRef.current.querySelectorAll("a[href]")
            );
            for (const enlace of enlaces) {
                if (enlace.getAttribute("href") === url) {
                    enlace.setAttribute("rel", "noopener noreferrer");
                    enlace.setAttribute("target", "_blank");
                }
            }
        }

        if (panel === "imagen") {
            const imagen = document.createElement("img");
            imagen.src = url;
            imagen.alt = "";

            const seleccion = window.getSelection();
            if (seleccion && seleccion.rangeCount > 0) {
                const rango = seleccion.getRangeAt(0);
                rango.deleteContents();
                rango.insertNode(imagen);
                rango.setStartAfter(imagen);
                rango.collapse(true);
                seleccion.removeAllRanges();
                seleccion.addRange(rango);
            } else {
                canvasRef.current.appendChild(imagen);
            }
        }

        emitirCambio();
        cerrarPanel();
    };

    //  -----  cambios de selección: actualizar botones activos  -----
    useEffect(() => {
        const alCambiarSeleccion = () => {
            if (
                canvasRef.current &&
                canvasRef.current.contains(document.activeElement)
            ) {
                actualizarEstadosActivos();
            }
        };

        document.addEventListener("selectionchange", alCambiarSeleccion);
        return () => {
            document.removeEventListener("selectionchange", alCambiarSeleccion);
        };
    }, []);

    return (
        <div className="card card--panel rich-editor">
            <div
                className="rich-editor__toolbar"
                role="toolbar"
                aria-label="Formato del texto"
            >
                <div className="rich-editor__group">
                    <label className="visualmente-oculto" htmlFor="formato-bloque">
                        Formato de bloque
                    </label>
                    <select
                        className="rich-editor__select"
                        id="formato-bloque"
                        aria-label="Formato de bloque"
                        value={formatoBloque}
                        onChange={alCambiarFormatoBloque}
                    >
                        <option value="p">Párrafo</option>
                        <option value="h2">Título 1</option>
                        <option value="h3">Título 2</option>
                        <option value="blockquote">Cita</option>
                        <option value="pre">Código</option>
                    </select>
                </div>
                <div className="rich-editor__group">
                    <button
                        className={
                            activos.bold
                                ? "button button--icon rich-editor__tool--activo"
                                : "button button--icon"
                        }
                        type="button"
                        title="Negrita"
                        aria-label="Negrita"
                        aria-pressed={activos.bold}
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("bold");
                        }}
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--filled">
                            format_bold
                        </span>
                    </button>
                    <button
                        className={
                            activos.italic
                                ? "button button--icon rich-editor__tool--activo"
                                : "button button--icon"
                        }
                        type="button"
                        title="Cursiva"
                        aria-label="Cursiva"
                        aria-pressed={activos.italic}
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("italic");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_italic
                        </span>
                    </button>
                    <button
                        className={
                            activos.underline
                                ? "button button--icon rich-editor__tool--activo"
                                : "button button--icon"
                        }
                        type="button"
                        title="Subrayado"
                        aria-label="Subrayado"
                        aria-pressed={activos.underline}
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("underline");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_underlined
                        </span>
                    </button>
                    <button
                        className={
                            activos.strikeThrough
                                ? "button button--icon rich-editor__tool--activo"
                                : "button button--icon"
                        }
                        type="button"
                        title="Tachado"
                        aria-label="Tachado"
                        aria-pressed={activos.strikeThrough}
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("strikeThrough");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_strikethrough
                        </span>
                    </button>
                </div>
                <div className="rich-editor__group">
                    <button
                        className="button button--icon"
                        type="button"
                        title="Lista con viñetas"
                        aria-label="Lista con viñetas"
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("insertUnorderedList");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_list_bulleted
                        </span>
                    </button>
                    <button
                        className="button button--icon"
                        type="button"
                        title="Lista numerada"
                        aria-label="Lista numerada"
                        onClick={(evento) => {
                            evento.preventDefault();
                            ejecutarComando("insertOrderedList");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_list_numbered
                        </span>
                    </button>
                    <button
                        className="button button--icon"
                        type="button"
                        title="Cita"
                        aria-label="Cita"
                        onClick={(evento) => {
                            evento.preventDefault();
                            setFormatoBloque("blockquote");
                            ejecutarComando("formatBlock", "<blockquote>");
                        }}
                    >
                        <span className="material-symbols-outlined">
                            format_quote
                        </span>
                    </button>
                </div>
                <div className="rich-editor__group">
                    <button
                        className="button button--icon"
                        type="button"
                        title="Insertar enlace"
                        aria-label="Insertar enlace"
                        onClick={(evento) => {
                            evento.preventDefault();
                            abrirPanel("enlace");
                        }}
                    >
                        <span className="material-symbols-outlined">link</span>
                    </button>
                    <button
                        className="button button--icon"
                        type="button"
                        title="Insertar imagen"
                        aria-label="Insertar imagen"
                        onClick={(evento) => {
                            evento.preventDefault();
                            abrirPanel("imagen");
                        }}
                    >
                        <span className="material-symbols-outlined">image</span>
                    </button>
                    <button
                        className="button button--icon"
                        type="button"
                        title="Bloque de código"
                        aria-label="Bloque de código"
                        onClick={(evento) => {
                            evento.preventDefault();
                            setFormatoBloque("pre");
                            ejecutarComando("formatBlock", "<pre>");
                        }}
                    >
                        <span className="material-symbols-outlined">code</span>
                    </button>
                </div>
            </div>
            {panel && (
                <div className="rich-editor__panel">
                    <label
                        className="input__label text-label-sm"
                        htmlFor="url-editor"
                    >
                        {panel === "enlace"
                            ? "URL del enlace"
                            : "URL de la imagen"}
                    </label>
                    <div className="rich-editor__panel-fila">
                        <input
                            className="input__field input__field--low text-body-md"
                            id="url-editor"
                            type="url"
                            placeholder="https://ejemplo.com"
                            value={urlTemporal}
                            onChange={(evento) =>
                                setUrlTemporal(evento.target.value)
                            }
                            onKeyDown={(evento) => {
                                if (evento.key === "Enter") {
                                    evento.preventDefault();
                                    confirmarPanel();
                                }
                                if (evento.key === "Escape") {
                                    evento.preventDefault();
                                    cerrarPanel();
                                }
                            }}
                        />
                        <button
                            className="button button--primary button--sm text-label-md"
                            type="button"
                            onClick={(evento) => {
                                evento.preventDefault();
                                confirmarPanel();
                            }}
                        >
                            Insertar
                        </button>
                        <button
                            className="button button--secondary button--sm text-label-md"
                            type="button"
                            onClick={(evento) => {
                                evento.preventDefault();
                                cerrarPanel();
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            <div
                className={
                    estaVacio
                        ? "rich-editor__canvas rich-editor__canvas--vacio text-body-md"
                        : "rich-editor__canvas text-body-md"
                }
                ref={canvasRef}
                id="contenido"
                role="textbox"
                aria-multiline="true"
                aria-label="Contenido del artículo"
                contentEditable="true"
                suppressContentEditableWarning={true}
                data-placeholder="Comienza a escribir tu artículo aquí..."
                onInput={emitirCambio}
                onBlur={emitirCambio}
            ></div>
        </div>
    );
};
