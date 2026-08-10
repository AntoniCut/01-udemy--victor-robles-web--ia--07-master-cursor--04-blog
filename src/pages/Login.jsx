/*
    *  -------------------------------------------------  *
    *  -----  Login.jsx  --  /src/pages/Login.jsx  -----  *
    *  -------------------------------------------------  *
*/

import { useEffect, useState } from "react";
import { BotonTema } from "../components/BotonTema.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useRouter } from "../router/Router.jsx";

/**
 * ----------------------
 * -----  `Login()`  -----
 * ----------------------
 * - Página de acceso con pestañas para iniciar sesión y registrarse.
 * @return {import("react").JSX.Element} - Página de login y registro.
 */
export const Login = () => {
    const { usuario, cargando, iniciarSesion, registrarse } = useAuth();
    const { navegar } = useRouter();

    /** @type {["login"|"registro", Function]} - `pestaña activa del formulario` */
    const [pestana, setPestana] = useState("login");

    /** - `correo electrónico introducido` */
    const [correo, setCorreo] = useState("");

    /** - `contraseña introducida` */
    const [contrasena, setContrasena] = useState("");

    /** - `confirmación de la contraseña (solo registro)` */
    const [confirmacion, setConfirmacion] = useState("");

    /** @type {[{ tipo: "exito"|"error", texto: string }|null, Function]} - `mensaje visual del formulario` */
    const [mensaje, setMensaje] = useState(null);

    /** - `indica si el formulario se está enviando` */
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        //  -----  si ya hay sesión, salir de /login fuera del ciclo de render  -----
        if (cargando || !usuario) {
            return;
        }

        /** - `evita redirigir si el efecto se limpia antes del microtask` */
        let cancelado = false;

        queueMicrotask(() => {
            if (!cancelado) {
                navegar("/admin", { reemplazar: true, animar: false });
            }
        });

        return () => {
            cancelado = true;
        };
    }, [cargando, usuario]);

    //  -----  cambio de pestaña: limpiar el mensaje  -----
    const alCambiarPestana = (nuevaPestana) => {
        setPestana(nuevaPestana);
        setMensaje(null);
    };

    //  -----  submit del formulario de acceso / registro  -----
    const alEnviarFormulario = async (evento) => {
        evento.preventDefault();
        setMensaje(null);
        setEnviando(true);

        //  -----  iniciar sesión  -----
        if (pestana === "login") {
            const error = await iniciarSesion(correo, contrasena);
            if (error) {
                setMensaje({ tipo: "error", texto: error });
            } else {
                //  -----  reemplazar /login para que "atrás" no vuelva al formulario  -----
                navegar("/admin", { reemplazar: true });
            }
        }
        //  -----  registrar un usuario nuevo  -----
        else {
            if (contrasena !== confirmacion) {
                setMensaje({
                    tipo: "error",
                    texto: "Las contraseñas no coinciden.",
                });
                setEnviando(false);
                return;
            }

            const resultado = await registrarse(correo, contrasena);
            if (resultado.error) {
                setMensaje({ tipo: "error", texto: resultado.error });
            } else if (resultado.necesitaConfirmacion) {
                setMensaje({
                    tipo: "exito",
                    texto: "Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.",
                });
            } else {
                navegar("/admin", { reemplazar: true });
            }
        }

        setEnviando(false);
    };

    return (
        <div className="page-login">
            <div className="page-login__tema">
                <BotonTema />
            </div>
            <div className="page-login__glow-bar" aria-hidden="true"></div>
            <main className="login">
                <div className="login__brand">
                    <h1 className="login__title text-headline-xl">GamerPulse</h1>
                    <p className="login__subtitle text-label-md">
                        Portal de Acceso al Sistema
                    </p>
                </div>
                <div className="card login__card">
                    <div className="login__tabs">
                        <button
                            className={
                                pestana === "login"
                                    ? "login__tab login__tab--active text-label-md"
                                    : "login__tab text-label-md"
                            }
                            type="button"
                            onClick={(evento) => {
                                evento.preventDefault();
                                alCambiarPestana("login");
                            }}
                        >
                            Iniciar Sesión
                            {pestana === "login" && (
                                <span className="login__tab-glow" aria-hidden="true"></span>
                            )}
                        </button>
                        <button
                            className={
                                pestana === "registro"
                                    ? "login__tab login__tab--active text-label-md"
                                    : "login__tab text-label-md"
                            }
                            type="button"
                            onClick={(evento) => {
                                evento.preventDefault();
                                alCambiarPestana("registro");
                            }}
                        >
                            Registrarse
                            {pestana === "registro" && (
                                <span className="login__tab-glow" aria-hidden="true"></span>
                            )}
                        </button>
                    </div>
                    {mensaje && (
                        <p
                            className={`alerta alerta--${mensaje.tipo} text-body-md`}
                            role="alert"
                        >
                            <span className="material-symbols-outlined alerta__icono">
                                {mensaje.tipo === "exito" ? "check_circle" : "error"}
                            </span>
                            {mensaje.texto}
                        </p>
                    )}
                    <form className="login__form" onSubmit={alEnviarFormulario}>
                        <div className="input">
                            <label className="input__label text-label-sm" htmlFor="correo">
                                Correo Electrónico
                            </label>
                            <div className="input__control">
                                <span className="material-symbols-outlined material-symbols-outlined--filled input__icon">
                                    mail
                                </span>
                                <input
                                    className="input__field input__field--icon text-body-md"
                                    id="correo"
                                    name="correo"
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                    type="email"
                                    value={correo}
                                    onChange={(evento) => setCorreo(evento.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input">
                            <label
                                className="input__label text-label-sm"
                                htmlFor="contrasena"
                            >
                                Contraseña
                            </label>
                            <div className="input__control">
                                <span className="material-symbols-outlined material-symbols-outlined--filled input__icon">
                                    lock
                                </span>
                                <input
                                    className="input__field input__field--icon text-body-md"
                                    id="contrasena"
                                    name="contrasena"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    type="password"
                                    value={contrasena}
                                    onChange={(evento) => setContrasena(evento.target.value)}
                                />
                            </div>
                        </div>
                        {pestana === "registro" && (
                            <div className="input">
                                <label
                                    className="input__label text-label-sm"
                                    htmlFor="confirmacion"
                                >
                                    Repite la Contraseña
                                </label>
                                <div className="input__control">
                                    <span className="material-symbols-outlined material-symbols-outlined--filled input__icon">
                                        lock_reset
                                    </span>
                                    <input
                                        className="input__field input__field--icon text-body-md"
                                        id="confirmacion"
                                        name="confirmacion"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        type="password"
                                        value={confirmacion}
                                        onChange={(evento) =>
                                            setConfirmacion(evento.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        <div className="login__submit-wrap">
                            <button
                                className="button button--primary button--block button--lg text-label-md"
                                type="submit"
                                disabled={enviando}
                            >
                                <span className="material-symbols-outlined">
                                    {pestana === "login" ? "login" : "person_add"}
                                </span>
                                {pestana === "login" ? "Autenticar" : "Crear Cuenta"}
                            </button>
                        </div>
                    </form>
                    <div className="login__orb" aria-hidden="true"></div>
                </div>
            </main>
        </div>
    );
};
