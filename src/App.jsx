/*
    *  ---------------------------------------  *
    *  -----  App.jsx  --  /src/App.jsx  -----  *
    *  ---------------------------------------  *
*/

import { LayoutAdmin } from "./components/LayoutAdmin.jsx";
import { LayoutPublico } from "./components/LayoutPublico.jsx";
import { RutaProtegida } from "./components/RutaProtegida.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { AdminEditor } from "./pages/AdminEditor.jsx";
import { Buscar } from "./pages/Buscar.jsx";
import { DetalleArticulo } from "./pages/DetalleArticulo.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Enlace, useRouter } from "./router/Router.jsx";

/**
 * ----------------------------
 * -----  `NoEncontrada()`  -----
 * ----------------------------
 * - Contenido de error para rutas que no existen.
 * @return {import("react").JSX.Element} - Bloque 404.
 */
const NoEncontrada = () => {
    return (
        <section className="estado-vacio">
            <span className="material-symbols-outlined material-symbols-outlined--xl estado-vacio__icono">
                explore_off
            </span>
            <h1 className="estado-vacio__titulo text-headline-md">
                Página no encontrada
            </h1>
            <p className="estado-vacio__texto text-body-md">
                La página que buscas no existe.
            </p>
            <Enlace
                href="/"
                className="button button--primary button--md text-label-md"
            >
                Volver al inicio
            </Enlace>
        </section>
    );
};

/**
 * ----------------------------------
 * -----  `contenidoAdmin(ruta)`  -----
 * ----------------------------------
 * - Resuelve la página del panel según la ruta actual.
 * @param {string} ruta - Ruta actual del navegador.
 * @return {{ variante: "dashboard"|"editor", pagina: import("react").ReactNode }|null} - Variante y página, o null.
 */
const contenidoAdmin = (ruta) => {
    if (ruta === "/admin") {
        return { variante: "dashboard", pagina: <AdminDashboard /> };
    }

    if (ruta === "/admin/nuevo") {
        return { variante: "editor", pagina: <AdminEditor /> };
    }

    if (ruta.startsWith("/admin/editar/")) {
        /** - `identificador del artículo extraído de la ruta` */
        const id = ruta.replace("/admin/editar/", "");
        return { variante: "editor", pagina: <AdminEditor id={id} /> };
    }

    return null;
};

/**
 * --------------------
 * -----  `App()`  -----
 * --------------------
 * - Componente raíz que resuelve la ruta actual y renderiza la página.
 * @return {import("react").JSX.Element} - Página correspondiente a la ruta actual.
 */
export const App = () => {
    const { ruta } = useRouter();

    /** - `camino de la ruta sin los parámetros de consulta` */
    const camino = ruta.split("?")[0];

    /** @type {URLSearchParams} - `parámetros de consulta de la ruta` */
    const parametros = new URLSearchParams(ruta.split("?")[1] ?? "");

    //  -----  login a pantalla completa (sin layout público)  -----
    if (camino === "/login") {
        return <Login />;
    }

    //  -----  panel de administración con barra lateral estable  -----
    const admin = contenidoAdmin(camino);
    if (admin) {
        return (
            <RutaProtegida>
                <LayoutAdmin variante={admin.variante}>
                    {admin.pagina}
                </LayoutAdmin>
            </RutaProtegida>
        );
    }

    //  -----  parte pública: un solo layout para no desmontar cabecera/pie  -----
    /** - `variante visual del layout público` */
    const variantePublica = camino.startsWith("/articulo/") ? "article" : "home";

    /** - `contenido de la zona principal pública` */
    let contenidoPublico = <NoEncontrada />;

    if (camino === "/") {
        contenidoPublico = <Home />;
    } else if (camino.startsWith("/articulo/")) {
        /** - `slug del artículo extraído de la ruta` */
        const slug = camino.replace("/articulo/", "");
        //  -----  key=slug reinicia el estado y evita view-transition-name duplicados  -----
        contenidoPublico = <DetalleArticulo key={slug} slug={slug} />;
    } else if (camino === "/buscar") {
        //  -----  término de búsqueda desde el parámetro "q"  -----
        const query = parametros.get("q") ?? "";
        //  -----  key=query reinicia la paginación al cambiar el término  -----
        contenidoPublico = <Buscar key={query} query={query} />;
    }

    return (
        <LayoutPublico variante={variantePublica}>
            {contenidoPublico}
        </LayoutPublico>
    );
};
