/*
    *  -----------------------------------------  *
    *  -----  main.jsx  --  /src/main.jsx  -----  *
    *  -----------------------------------------  *
*/

import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { ProveedorAuth } from "./context/AuthContext.jsx";
import { ProveedorToast } from "./context/ToastContext.jsx";
import { ProveedorRouter } from "./router/Router.jsx";
import "./styles/gamerpulse.css";
import "./styles/extra.css";

/** @type {HTMLDivElement} - `Contenedor raíz de la aplicación` */
const contenedorRaiz = /** @type {HTMLDivElement} */ (
    document.getElementById("root")
);

createRoot(contenedorRaiz).render(
    <ProveedorRouter>
        <ProveedorAuth>
            <ProveedorToast>
                <App />
            </ProveedorToast>
        </ProveedorAuth>
    </ProveedorRouter>
);
