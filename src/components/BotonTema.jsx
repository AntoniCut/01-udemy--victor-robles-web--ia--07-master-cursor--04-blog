/*
    *  --------------------------------------------------------------  *
    *  -----  BotonTema.jsx  --  /src/components/BotonTema.jsx  -----  *
    *  --------------------------------------------------------------  *
*/

import { useTema } from "../context/TemaContext.jsx";

/**
 * ---------------------------------------
 * -----  `BotonTema({ variante })`  -----
 * ---------------------------------------
 * - Botón para alternar entre modo claro y oscuro.
 * @param {{ variante?: "icono"|"nav" }} [props] - Variante visual del control.
 * @return {import("react").JSX.Element} - Control de tema.
 */
export const BotonTema = ({ variante = "icono" }) => {
    const { tema, alternarTema } = useTema();

    /** - `indica si el tema activo es el claro` */
    const esClaro = tema === "claro";

    /** - `etiqueta accesible según el tema destino` */
    const etiqueta = esClaro ? "Activar modo oscuro" : "Activar modo claro";

    /** - `texto visible en la variante de navegación` */
    const texto = esClaro ? "Modo oscuro" : "Modo claro";

    /** - `icono del Material Symbol según el tema destino` */
    const icono = esClaro ? "dark_mode" : "light_mode";

    //  -----  click en el botón: cambiar de tema  -----
    const alHacerClick = (evento) => {
        evento.preventDefault();
        alternarTema();
    };

    if (variante === "nav") {
        return (
            <button
                className="side-nav__link"
                type="button"
                aria-label={etiqueta}
                title={texto}
                onClick={alHacerClick}
            >
                <span className="material-symbols-outlined" aria-hidden="true">
                    {icono}
                </span>
                {texto}
            </button>
        );
    }

    return (
        <button
            className="button button--icon boton-tema"
            type="button"
            aria-label={etiqueta}
            title={texto}
            onClick={alHacerClick}
        >
            <span className="material-symbols-outlined" aria-hidden="true">
                {icono}
            </span>
        </button>
    );
};
