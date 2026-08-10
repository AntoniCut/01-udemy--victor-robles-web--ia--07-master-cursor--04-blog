/*
    *  -------------------------------------------  *
    *  -----  html.js  --  /src/lib/html.js  -----  *
    *  -------------------------------------------  *
*/

/** @type {Set<string>} - `etiquetas HTML permitidas en el contenido` */
const ETIQUETAS_PERMITIDAS = new Set([
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
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

/** @type {Record<string, string>} - `etiquetas equivalentes normalizadas` */
const ALIAS_ETIQUETA = {
    b: "strong",
    i: "em",
};

/**
 * --------------------------------
 * -----  `escaparTexto(texto)`  -----
 * --------------------------------
 * - Escapa caracteres especiales para insertarlos como texto seguro.
 * @param {string} texto - Texto a escapar.
 * @return {string} - Texto escapado.
 */
const escaparTexto = (texto) => {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
};

/**
 * -------------------------------------
 * -----  `esUrlSegura(url)`  -----
 * -------------------------------------
 * - Comprueba que la URL use un protocolo seguro (http, https o relativa).
 * @param {string} url - URL a validar.
 * @return {boolean} - True si la URL es aceptable.
 */
const esUrlSegura = (url) => {
    const limpia = url.trim();
    if (!limpia) {
        return false;
    }

    if (limpia.startsWith("/") || limpia.startsWith("#")) {
        return true;
    }

    try {
        const parseada = new URL(limpia, window.location.origin);
        return parseada.protocol === "http:" || parseada.protocol === "https:";
    } catch {
        return false;
    }
};

/**
 * ---------------------------------------------
 * -----  `serializarNodo(nodo)`  -----
 * ---------------------------------------------
 * - Convierte un nodo del DOM en HTML serializado de forma controlada.
 * @param {Node} nodo - Nodo a serializar.
 * @return {string} - HTML del nodo.
 */
const serializarNodo = (nodo) => {
    if (nodo.nodeType === Node.TEXT_NODE) {
        return escaparTexto(nodo.textContent ?? "");
    }

    if (nodo.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    /** @type {Element} - `elemento a serializar` */
    const elemento = /** @type {Element} */ (nodo);
    let etiqueta = elemento.tagName.toLowerCase();

    if (ALIAS_ETIQUETA[etiqueta]) {
        etiqueta = ALIAS_ETIQUETA[etiqueta];
    }

    if (!ETIQUETAS_PERMITIDAS.has(etiqueta)) {
        /** - `contenido interno de etiquetas no permitidas` */
        let interior = "";
        for (const hijo of elemento.childNodes) {
            interior += serializarNodo(hijo);
        }
        return interior;
    }

    if (etiqueta === "br") {
        return "<br>";
    }

    if (etiqueta === "img") {
        const src = elemento.getAttribute("src") ?? "";
        const alt = elemento.getAttribute("alt") ?? "";
        if (!esUrlSegura(src)) {
            return "";
        }
        return `<img src="${escaparTexto(src)}" alt="${escaparTexto(alt)}">`;
    }

    /** - `atributos serializados del elemento` */
    let atributos = "";
    if (etiqueta === "a") {
        const href = elemento.getAttribute("href") ?? "";
        if (!esUrlSegura(href)) {
            /** - `texto del enlace inválido sin etiqueta` */
            let interior = "";
            for (const hijo of elemento.childNodes) {
                interior += serializarNodo(hijo);
            }
            return interior;
        }
        atributos = ` href="${escaparTexto(href)}" rel="noopener noreferrer" target="_blank"`;
    }

    /** - `HTML de los hijos` */
    let hijos = "";
    for (const hijo of elemento.childNodes) {
        hijos += serializarNodo(hijo);
    }

    return `<${etiqueta}${atributos}>${hijos}</${etiqueta}>`;
};

/**
 * --------------------------------
 * -----  `sanitizarHtml(html)`  -----
 * --------------------------------
 * - Limpia HTML dejando solo etiquetas y atributos permitidos.
 * @param {string} html - HTML de entrada.
 * @return {string} - HTML sanitizado.
 */
export const sanitizarHtml = (html) => {
    const documento = new DOMParser().parseFromString(html, "text/html");

    /** - `resultado sanitizado` */
    let resultado = "";
    for (const hijo of documento.body.childNodes) {
        resultado += serializarNodo(hijo);
    }

    return resultado;
};

/**
 * ------------------------------------
 * -----  `pareceHtml(contenido)`  -----
 * ------------------------------------
 * - Indica si el contenido parece HTML (para migrar textos planos).
 * @param {string} contenido - Contenido a inspeccionar.
 * @return {boolean} - True si contiene etiquetas HTML.
 */
export const pareceHtml = (contenido) => {
    return /<[a-z][\s\S]*>/i.test(contenido);
};

/**
 * ------------------------------------------
 * -----  `textoPlanoAHtml(texto)`  -----
 * ------------------------------------------
 * - Convierte texto plano con párrafos separados a HTML básico.
 * @param {string} texto - Texto plano del artículo.
 * @return {string} - HTML con párrafos.
 */
export const textoPlanoAHtml = (texto) => {
    /** @type {string[]} - `párrafos no vacíos` */
    const parrafos = texto
        .split(/\n\s*\n/)
        .map((parrafo) => parrafo.trim())
        .filter((parrafo) => parrafo !== "");

    if (parrafos.length === 0) {
        return "<p><br></p>";
    }

    return parrafos
        .map((parrafo) => {
            const conSaltos = escaparTexto(parrafo).replace(/\n/g, "<br>");
            return `<p>${conSaltos}</p>`;
        })
        .join("");
};

/**
 * ----------------------------------------------------
 * -----  `normalizarContenidoEditor(contenido)`  -----
 * ----------------------------------------------------
 * - Prepara el contenido para el editor: sanitiza HTML o convierte texto plano.
 * @param {string} contenido - Contenido guardado del artículo.
 * @return {string} - HTML listo para el canvas editable.
 */
export const normalizarContenidoEditor = (contenido) => {
    if (!contenido || contenido.trim() === "") {
        return "<p><br></p>";
    }

    if (pareceHtml(contenido)) {
        /** - `HTML sanitizado del contenido existente` */
        const limpio = sanitizarHtml(contenido);
        return limpio.trim() === "" ? "<p><br></p>" : limpio;
    }

    return textoPlanoAHtml(contenido);
};

/**
 * --------------------------------------
 * -----  `htmlATextoPlano(html)`  -----
 * --------------------------------------
 * - Extrae el texto visible de un fragmento HTML.
 * @param {string} html - HTML del artículo.
 * @return {string} - Texto plano.
 */
export const htmlATextoPlano = (html) => {
    const documento = new DOMParser().parseFromString(html, "text/html");
    return documento.body.textContent ?? "";
};

/**
 * ----------------------------------------
 * -----  `contenidoHtmlVacio(html)`  -----
 * ----------------------------------------
 * - Indica si el HTML no tiene texto visible para el usuario.
 * @param {string} html - HTML a evaluar.
 * @return {boolean} - True si está vacío.
 */
export const contenidoHtmlVacio = (html) => {
    return htmlATextoPlano(html).trim() === "";
};

/**
 * ----------------------------------------------
 * -----  `rellenarElementoConHtml(elemento, html)`  -----
 * ----------------------------------------------
 * - Vacía un elemento y lo rellena con nodos HTML sanitizados (sin innerHTML).
 * @param {HTMLElement} elemento - Contenedor destino.
 * @param {string} html - HTML a insertar.
 * @return {void}
 */
export const rellenarElementoConHtml = (elemento, html) => {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }

    const documento = new DOMParser().parseFromString(
        sanitizarHtml(html),
        "text/html"
    );

    for (const hijo of Array.from(documento.body.childNodes)) {
        elemento.appendChild(document.importNode(hijo, true));
    }

    //  -----  si quedó vacío, dejar un párrafo editable  -----
    if (!elemento.firstChild) {
        const parrafo = document.createElement("p");
        parrafo.appendChild(document.createElement("br"));
        elemento.appendChild(parrafo);
    }
};

/**
 * ----------------------------------------------
 * -----  `serializarElemento(elemento)`  -----
 * ----------------------------------------------
 * - Lee el HTML sanitizado de un contenedor contenteditable.
 * @param {HTMLElement} elemento - Canvas del editor.
 * @return {string} - HTML sanitizado.
 */
export const serializarElemento = (elemento) => {
    /** - `HTML acumulado de los hijos` */
    let resultado = "";
    for (const hijo of elemento.childNodes) {
        resultado += serializarNodo(hijo);
    }

    return resultado.trim() === "" ? "<p><br></p>" : resultado;
};
