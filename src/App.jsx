/*
    *  ---------------------------------------  *
    *  -----  App.jsx  --  /src/App.jsx  -----  *
    *  ---------------------------------------  *
*/

import { Cabecera } from "./components/Cabecera.jsx";
import { PiePagina } from "./components/PiePagina.jsx";
import { RutaProtegida } from "./components/RutaProtegida.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { AdminEditor } from "./pages/AdminEditor.jsx";
import { DetalleArticulo } from "./pages/DetalleArticulo.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Enlace, useRouter } from "./router/Router.jsx";

/**
 * ----------------------------
 * -----  `NoEncontrada()`  -----
 * ----------------------------
 * - Página de error para rutas que no existen.
 * @return {JSX.Element} - Página 404.
 */
const NoEncontrada = () => {
    return (
        <div className="page-home">
            <Cabecera />
            <main className="page-home__main">
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
            </main>
            <PiePagina />
        </div>
    );
};

/**
 * --------------------
 * -----  `App()`  -----
 * --------------------
 * - Componente raíz que resuelve la ruta actual y renderiza la página.
 * @return {JSX.Element} - Página correspondiente a la ruta actual.
 */
export const App = () => {
    const { ruta } = useRouter();

    //  -----  rutas públicas  -----
    if (ruta === "/") {
        return <Home />;
    }

    if (ruta === "/login") {
        return <Login />;
    }

    if (ruta.startsWith("/articulo/")) {
        /** - `slug del artículo extraído de la ruta` */
        const slug = ruta.replace("/articulo/", "");
        return <DetalleArticulo slug={slug} />;
    }

    //  -----  rutas protegidas del panel de administración  -----
    if (ruta === "/admin") {
        return (
            <RutaProtegida>
                <AdminDashboard />
            </RutaProtegida>
        );
    }

    if (ruta === "/admin/nuevo") {
        return (
            <RutaProtegida>
                <AdminEditor />
            </RutaProtegida>
        );
    }

    if (ruta.startsWith("/admin/editar/")) {
        /** - `identificador del artículo extraído de la ruta` */
        const id = ruta.replace("/admin/editar/", "");
        return (
            <RutaProtegida>
                <AdminEditor id={id} />
            </RutaProtegida>
        );
    }

    //  -----  cualquier otra ruta: página no encontrada  -----
    return <NoEncontrada />;
};
