/*
    *  ----------------------------------------------------------------  *
    *  -----  Paginacion.jsx  --  /src/components/Paginacion.jsx  -----  *
    *  ----------------------------------------------------------------  *
*/

/**
 * ----------------------------------------------------------------
 * -----  `Paginacion({ pagina, totalPaginas, alCambiar })`  -----
 * ----------------------------------------------------------------
 * - Controles de paginación del listado público de artículos.
 * @param {{ pagina: number, totalPaginas: number, alCambiar: (pagina: number) => void }} props - Estado y callback de paginación.
 * @return {JSX.Element|null} - Navegación de páginas o null si solo hay una.
 */
export const Paginacion = ({ pagina, totalPaginas, alCambiar }) => {
    //  -----  si solo hay una página, no mostrar la paginación  -----
    if (totalPaginas <= 1) {
        return null;
    }

    /** @type {number[]} - `números de página a mostrar` */
    const numeros = [];
    for (let numero = 1; numero <= totalPaginas; numero += 1) {
        numeros.push(numero);
    }

    //  -----  click en anterior: retroceder una página  -----
    const alHacerClickAnterior = (evento) => {
        evento.preventDefault();
        alCambiar(pagina - 1);
    };

    //  -----  click en siguiente: avanzar una página  -----
    const alHacerClickSiguiente = (evento) => {
        evento.preventDefault();
        alCambiar(pagina + 1);
    };

    return (
        <nav className="pagination" aria-label="Paginación">
            <button
                className="pagination__item"
                type="button"
                aria-label="Página anterior"
                disabled={pagina === 1}
                onClick={alHacerClickAnterior}
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {numeros.map((numero) => (
                <button
                    key={numero}
                    className={
                        numero === pagina
                            ? "pagination__item pagination__item--active text-label-md"
                            : "pagination__item text-label-md"
                    }
                    type="button"
                    aria-label={`Página ${numero}`}
                    onClick={(evento) => {
                        evento.preventDefault();
                        alCambiar(numero);
                    }}
                >
                    {numero}
                </button>
            ))}
            <button
                className="pagination__item"
                type="button"
                aria-label="Página siguiente"
                disabled={pagina === totalPaginas}
                onClick={alHacerClickSiguiente}
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </nav>
    );
};
