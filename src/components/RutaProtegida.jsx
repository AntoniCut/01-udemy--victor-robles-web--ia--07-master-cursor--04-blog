/*
    *  ----------------------------------------------------------------------  *
    *  -----  RutaProtegida.jsx  --  /src/components/RutaProtegida.jsx  -----  *
    *  ----------------------------------------------------------------------  *
*/

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../router/Router.jsx";

/**
 * ------------------------------------------
 * -----  `RutaProtegida({ children })`  -----
 * ------------------------------------------
 * - Protege una ruta: si no hay sesión redirige al login.
 * @param {{ children: import("react").ReactNode }} props - Contenido protegido.
 * @return {JSX.Element|null} - Contenido protegido, un cargador o null.
 */
export const RutaProtegida = ({ children }) => {
    const { usuario, cargando } = useAuth();
    const { navegar } = useRouter();

    useEffect(() => {
        //  -----  redirigir al login si no hay sesión activa  -----
        if (!cargando && !usuario) {
            navegar("/login");
        }
    }, [cargando, usuario]);

    //  -----  mientras se recupera la sesión, mostrar el cargador  -----
    if (cargando) {
        return (
            <div className="cargador" role="status" aria-label="Cargando">
                <span className="cargador__circulo" aria-hidden="true"></span>
            </div>
        );
    }

    //  -----  si no hay usuario, no renderizar el contenido protegido  -----
    if (!usuario) {
        return null;
    }

    return children;
};
