/*
    *  ------------------------------------------------------------------------------  *
    *  -----  ModalConfirmacion.jsx  --  /src/components/ModalConfirmacion.jsx  -----  *
    *  ------------------------------------------------------------------------------  *
*/

/**
 * ------------------------------------------------------------------------------------
 * -----  `ModalConfirmacion({ abierto, titulo, mensaje, alConfirmar, alCancelar })`  -----
 * ------------------------------------------------------------------------------------
 * - Ventana modal de confirmación con los estilos de la web.
 * @param {{ abierto: boolean, titulo: string, mensaje: string, alConfirmar: () => void, alCancelar: () => void }} props - Estado y callbacks del modal.
 * @return {JSX.Element|null} - Modal de confirmación o null si está cerrado.
 */
export const ModalConfirmacion = ({
    abierto,
    titulo,
    mensaje,
    alConfirmar,
    alCancelar,
}) => {
    //  -----  si el modal está cerrado, no renderizar nada  -----
    if (!abierto) {
        return null;
    }

    //  -----  click en el fondo oscuro: cerrar el modal  -----
    const alHacerClickFondo = (evento) => {
        evento.preventDefault();
        alCancelar();
    };

    //  -----  click en cancelar  -----
    const alHacerClickCancelar = (evento) => {
        evento.preventDefault();
        alCancelar();
    };

    //  -----  click en confirmar  -----
    const alHacerClickConfirmar = (evento) => {
        evento.preventDefault();
        alConfirmar();
    };

    return (
        <div className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
            <div className="modal__fondo" onClick={alHacerClickFondo}></div>
            <section className="card modal__cuadro">
                <h2 className="modal__titulo text-headline-md">{titulo}</h2>
                <p className="modal__texto text-body-md">{mensaje}</p>
                <div className="modal__acciones">
                    <button
                        className="button button--secondary button--md text-label-md"
                        type="button"
                        onClick={alHacerClickCancelar}
                    >
                        Cancelar
                    </button>
                    <button
                        className="button button--danger button--md text-label-md"
                        type="button"
                        onClick={alHacerClickConfirmar}
                    >
                        <span className="material-symbols-outlined material-symbols-outlined--md">
                            delete
                        </span>
                        Eliminar
                    </button>
                </div>
            </section>
        </div>
    );
};
