import { useState } from "react";
import {config} from '../../variables/config'
import "../../../pages/login/user.css"
import "./forgotPassword.css"
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const serverFront = config.apiUrl;

export function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try{
            await axios.post(`${serverFront}/api/auth/forgot-password`, {email})
            setMessage("Revisa tu bandeja de correo. Recibiras un enlace para restablecer la contraseña")
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al procesar la solicitud")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-background">
            <Helmet>
                <title>Restablecer Contraseña</title>
            </Helmet>
            
            <NavLink to="/login" className="link">Volver a iniciar sesion</NavLink>

            <motion.div
                className="container-login"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h3><strong>Ingrese su correo electronico </strong></h3>
            
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email"
                        placeholder="Coloque su correo" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar"}
                    </button>
                    {message && <p className={`message ${message.includes("error") ? "error" : "success"}`}>{message}</p>}
                </form>
            </motion.div>
        </div>
    );
}