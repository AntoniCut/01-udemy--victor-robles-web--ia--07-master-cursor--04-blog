/*
    *  ------------------------------------------------------------------------------  *
    *  -----  ImagenConFallback.jsx  --  /src/components/ImagenConFallback.jsx  -----  *
    *  ------------------------------------------------------------------------------  *
*/

import { useEffect, useState } from "react";
import {
    IMAGEN_ARTICULO_FALLBACK,
    resolverUrlImagen,
} from "../lib/imagenes.js";

/**
 * -----------------------------------------------------------------------
 * -----  `ImagenConFallback({ src, alt, className, style, loading })`  -----
 * -----------------------------------------------------------------------
 * - Imagen de artículo que usa el fallback si la URL falla o está vacía.
 * @param {{
 *   src?: string|null,
 *   alt: string,
 *   className?: string,
 *   style?: import("react").CSSProperties,
 *   loading?: "lazy"|"eager",
 * }} props - Atributos de la imagen.
 * @return {import("react").JSX.Element} - Elemento img con respaldo.
 */
export const ImagenConFallback = ({
    src,
    alt,
    className = "",
    style,
    loading = "lazy",
}) => {
    /** - `URL mostrada (original o fallback)` */
    const [urlActual, setUrlActual] = useState(() => resolverUrlImagen(src));

    useEffect(() => {
        //  -----  al cambiar la fuente, volver a intentar la URL original  -----
        setUrlActual(resolverUrlImagen(src));
    }, [src]);

    //  -----  si la imagen no carga, sustituir por el fallback  -----
    const alError = (evento) => {
        evento.preventDefault();

        if (urlActual !== IMAGEN_ARTICULO_FALLBACK) {
            setUrlActual(IMAGEN_ARTICULO_FALLBACK);
        }
    };

    return (
        <img
            className={className}
            src={urlActual}
            alt={alt}
            style={style}
            loading={loading}
            onError={alError}
        />
    );
};

/**
 * -------------------------------------------------------------------
 * -----  `FondoImagenConFallback({ src, className, style })`  -----
 * -------------------------------------------------------------------
 * - Contenedor con background-image que cae al fallback si la URL falla.
 * @param {{
 *   src?: string|null,
 *   className?: string,
 *   style?: import("react").CSSProperties,
 * }} props - Fuente y estilos del fondo.
 * @return {import("react").JSX.Element} - Contenedor con imagen de fondo.
 */
export const FondoImagenConFallback = ({ src, className = "", style }) => {
    /** - `URL del fondo mostrada` */
    const [urlActual, setUrlActual] = useState(() => resolverUrlImagen(src));

    useEffect(() => {
        /** - `URL candidata a cargar` */
        const candidata = resolverUrlImagen(src);

        //  -----  sin URL útil: usar fallback al instante  -----
        if (candidata === IMAGEN_ARTICULO_FALLBACK) {
            setUrlActual(IMAGEN_ARTICULO_FALLBACK);
            return;
        }

        /** @type {HTMLImageElement} - `precarga para detectar errores` */
        const precarga = new Image();

        precarga.onload = () => {
            setUrlActual(candidata);
        };

        precarga.onerror = () => {
            setUrlActual(IMAGEN_ARTICULO_FALLBACK);
        };

        precarga.src = candidata;

        return () => {
            precarga.onload = null;
            precarga.onerror = null;
        };
    }, [src]);

    return (
        <div
            className={className}
            style={{
                ...style,
                backgroundImage: `url("${urlActual}")`,
            }}
            aria-hidden="true"
        ></div>
    );
};
