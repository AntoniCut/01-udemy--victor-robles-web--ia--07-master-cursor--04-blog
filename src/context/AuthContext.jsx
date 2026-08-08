/*
    *  ---------------------------------------------------------------  *
    *  -----  AuthContext.jsx  --  /src/context/AuthContext.jsx  -----  *
    *  ---------------------------------------------------------------  *
*/

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

/** - `contexto de autenticación de la aplicación` */
const AuthContext = createContext(null);

/**
 * ------------------------------------------
 * -----  `ProveedorAuth({ children })`  -----
 * ------------------------------------------
 * - Proveedor que gestiona la sesión de Supabase (login, registro y logout).
 * @param {{ children: import("react").ReactNode }} props - Componentes hijos.
 * @return {JSX.Element} - Proveedor del contexto de autenticación.
 */
export const ProveedorAuth = ({ children }) => {
    /** - `usuario autenticado o null si no hay sesión` */
    const [usuario, setUsuario] = useState(null);

    /** - `indica si la sesión inicial todavía se está recuperando` */
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        //  -----  recuperar la sesión activa al cargar la aplicación  -----
        supabase.auth.getSession().then(({ data }) => {
            setUsuario(data.session ? data.session.user : null);
            setCargando(false);
        });

        //  -----  escuchar los cambios de sesión (login, logout, refresco)  -----
        const { data: escucha } = supabase.auth.onAuthStateChange(
            (_evento, sesion) => {
                setUsuario(sesion ? sesion.user : null);
            }
        );

        return () => escucha.subscription.unsubscribe();
    }, []);

    /**
     * -------------------------------------------------
     * -----  `iniciarSesion(correo, contrasena)`  -----
     * -------------------------------------------------
     * - Inicia sesión con correo y contraseña en Supabase.
     * @param {string} correo - Correo electrónico del usuario.
     * @param {string} contrasena - Contraseña del usuario.
     * @return {Promise<string|null>} - Mensaje de error o null si todo fue bien.
     */
    const iniciarSesion = async (correo, contrasena) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena,
        });

        //  -----  si hay error, devolver un mensaje en español  -----
        if (error) {
            if (error.code === "invalid_credentials") {
                return "Credenciales incorrectas. Revisa tu correo y contraseña.";
            }
            if (error.code === "email_not_confirmed") {
                return "Debes confirmar tu correo antes de iniciar sesión.";
            }
            return "No se pudo iniciar sesión. Inténtalo de nuevo.";
        }

        return null;
    };

    /**
     * -----------------------------------------------
     * -----  `registrarse(correo, contrasena)`  -----
     * -----------------------------------------------
     * - Registra un usuario nuevo con correo y contraseña en Supabase.
     * @param {string} correo - Correo electrónico del usuario.
     * @param {string} contrasena - Contraseña del usuario.
     * @return {Promise<{ error: string|null, necesitaConfirmacion: boolean }>} - Resultado del registro.
     */
    const registrarse = async (correo, contrasena) => {
        const { data, error } = await supabase.auth.signUp({
            email: correo,
            password: contrasena,
        });

        //  -----  si hay error, devolver un mensaje en español  -----
        if (error) {
            if (error.code === "user_already_exists") {
                return {
                    error: "Ya existe una cuenta con ese correo electrónico.",
                    necesitaConfirmacion: false,
                };
            }
            if (error.code === "weak_password") {
                return {
                    error: "La contraseña es demasiado débil (mínimo 6 caracteres).",
                    necesitaConfirmacion: false,
                };
            }
            return {
                error: "No se pudo completar el registro. Inténtalo de nuevo.",
                necesitaConfirmacion: false,
            };
        }

        //  -----  si no hay sesión, el usuario debe confirmar su correo  -----
        const necesitaConfirmacion = Boolean(data.user) && !data.session;
        return { error: null, necesitaConfirmacion };
    };

    /**
     * -------------------------------
     * -----  `cerrarSesion()`  -----
     * -------------------------------
     * - Cierra la sesión actual del usuario.
     * @return {Promise<void>}
     */
    const cerrarSesion = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * ------------------------
 * -----  `useAuth()`  -----
 * ------------------------
 * - Hook para acceder al estado de autenticación desde cualquier componente.
 * @return {{ usuario: Object|null, cargando: boolean, iniciarSesion: Function, registrarse: Function, cerrarSesion: Function }} - Estado de autenticación.
 */
export const useAuth = () => useContext(AuthContext);
