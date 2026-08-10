/*
    *  ----------------------------------------------------------------------  *
    *  -----  ContenidoHtml.jsx  --  /src/components/ContenidoHtml.jsx  -----  *
    *  ----------------------------------------------------------------------  *
*/

import { createElement, useMemo } from "react";
import { pareceHtml, sanitizarHtml, textoPlanoAHtml } from "../lib/html.js";
import { IMAGEN_ARTICULO_FALLBACK } from "../lib/imagenes.js";

/** @type {Record<string, string>} - `mapeo de etiquetas a nombres React` */
const ALIAS = {
    b: "strong",
    i: "em",
};

/**
 * ------------------------------------------
 * -----  `nodoAReact(nodo, clave)`  -----
 * ------------------------------------------
 * - Convierte un nodo DOM sanitizado en un elemento React.
 * @param {Node} nodo - Nodo del DOM.
 * @param {string} clave - Key de React.
 * @return {import("react").ReactNode} - Nodo React equivalente.
 */
const nodoAReact = (nodo, clave) => {
    if (nodo.nodeType === Node.TEXT_NODE) {
        return nodo.textContent;
    }

    if (nodo.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    /** @type {Element} - `elemento HTML` */
    const elemento = /** @type {Element} */ (nodo);
    let etiqueta = elemento.tagName.toLowerCase();

    if (ALIAS[etiqueta]) {
        etiqueta = ALIAS[etiqueta];
    }

    /** @type {Set<string>} - `etiquetas que se renderizan como React` */
    const permitidas = new Set([
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "h1",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "pre",
        "code",
        "img",
    ]);

    /** @type {import("react").ReactNode[]} - `hijos convertidos` */
    const hijos = Array.from(elemento.childNodes)
        .map((hijo, indice) => nodoAReact(hijo, `${clave}-${indice}`))
        .filter((hijo) => hijo !== null && hijo !== undefined);

    if (!permitidas.has(etiqueta)) {
        return hijos;
    }

    if (etiqueta === "br") {
        return createElement("br", { key: clave });
    }

    if (etiqueta === "img") {
        return createElement("img", {
            key: clave,
            src: elemento.getAttribute("src") ?? IMAGEN_ARTICULO_FALLBACK,
            alt: elemento.getAttribute("alt") ?? "",
            onError: (evento) => {
                /** @type {HTMLImageElement} - `imagen que falló al cargar` */
                const imagen = /** @type {HTMLImageElement} */ (
                    evento.currentTarget
                );

                if (!imagen.src.includes(IMAGEN_ARTICULO_FALLBACK)) {
                    imagen.src = IMAGEN_ARTICULO_FALLBACK;
                }
            },
        });
    }

    /** @type {{ key: string, href?: string, rel?: string, target?: string }} - `props del elemento` */
    const props = { key: clave };

    if (etiqueta === "a") {
        props.href = elemento.getAttribute("href") ?? "#";
        props.rel = "noopener noreferrer";
        props.target = "_blank";
    }

    return createElement(
        /** @type {keyof import("react").JSX.IntrinsicElements} */ (etiqueta),
        props,
        hijos.length > 0 ? hijos : null
    );
};

/**
 * -------------------------------------------
 * -----  `ContenidoHtml({ html })`  -----
 * -------------------------------------------
 * - Renderiza HTML de artículo como nodos React seguros (lista blanca).
 * @param {{ html: string }} props - Contenido HTML o texto plano del artículo.
 * @return {import("react").JSX.Element} - Cuerpo tipográfico del artículo.
 */
export const ContenidoHtml = ({ html }) => {
    /** @type {import("react").ReactNode[]} - `nodos React del contenido` */
    const nodos = useMemo(() => {
        /** - `HTML normalizado según venga plano o ya marcado` */
        const preparado = pareceHtml(html)
            ? sanitizarHtml(html)
            : textoPlanoAHtml(html);

        const documento = new DOMParser().parseFromString(
            preparado.trim() === "" ? "<p></p>" : preparado,
            "text/html"
        );

        return Array.from(documento.body.childNodes)
            .map((nodo, indice) => nodoAReact(nodo, String(indice)))
            .filter((nodo) => nodo !== null && nodo !== undefined);
    }, [html]);

    return <div className="article-content__cuerpo">{nodos}</div>;
};
