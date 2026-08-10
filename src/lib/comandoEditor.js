/*
    *  -------------------------------------------------------------  *
    *  -----  comandoEditor.js  --  /src/lib/comandoEditor.js  -----  *
    *  -------------------------------------------------------------  *
*/

/**
 * @typedef {Object} DocumentoComandos
 * @property {(comando: string, mostrarUi?: boolean, valor?: string) => boolean} execCommand
 * @property {(comando: string) => boolean} queryCommandState
 */

/**
 * ----------------------------------------------------
 * -----  `obtenerDocumentoConComandos()`  -----
 * ----------------------------------------------------
 * - Accede a los comandos de edición del documento tipados sin
 *   la marca deprecada de las definiciones DOM actuales.
 *   (execCommand sigue siendo la API práctica para contentEditable
 *   sin dependencias externas.)
 * @return {DocumentoComandos} - Documento con métodos de comando.
 */
const obtenerDocumentoConComandos = () => {
    return /** @type {DocumentoComandos} */ (
        /** @type {unknown} */ (document)
    );
};

/**
 * ----------------------------------------------
 * -----  `ejecutarComandoEditor(comando, valor)`  -----
 * ----------------------------------------------
 * - Ejecuta un comando de formato sobre la selección actual.
 * @param {string} comando - Identificador del comando (bold, italic...).
 * @param {string} [valor] - Valor opcional del comando.
 * @return {boolean} - True si el comando se aplicó.
 */
export const ejecutarComandoEditor = (comando, valor = "") => {
    return obtenerDocumentoConComandos().execCommand(comando, false, valor);
};

/**
 * ------------------------------------------------
 * -----  `consultarEstadoComando(comando)`  -----
 * ------------------------------------------------
 * - Indica si un comando de formato está activo en la selección.
 * @param {string} comando - Identificador del comando.
 * @return {boolean} - True si el formato está activo.
 */
export const consultarEstadoComando = (comando) => {
    return obtenerDocumentoConComandos().queryCommandState(comando);
};
