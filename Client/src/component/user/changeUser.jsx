import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import "../password/changePassword/changePassword.css";
import axios from "axios";
import { config } from "../variables/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const serverFront = config.apiUrl;


export function ChangeUser({ setIsAuthenticated }) {
    const [newName, setNewName] = useState("");
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Estado para errores
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const navigate = useNavigate();

    const handleChangeUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serverFront}/api/auth/change-user`, 
                { newName }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            setMessage(response.data.message || "Nombre cambiado exitosamente");
            
            setTimeout(() => {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                navigate('/gasto'); // O quizás a '/login'
            }, 2000);

        } catch (error) {
            console.error("Error al cambiar el nombre de usuario:", error);
            // Manejo específico de errores
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError("Error al cambiar el nombre. Intenta nuevamente.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="container-setting">
            <Helmet>
                <title>Cambio de nombre de usuario</title>
            </Helmet>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3><strong>Ingrese su nuevo nombre de usuario</strong></h3>

                <form onSubmit={handleChangeUser}>
                    <input 
                        type="text" 
                        placeholder="Nuevo nombre de usuario" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        required
                        disabled={isLoading} // Deshabilitar durante carga
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Procesando..." : "Confirmar"}
                    </button>
                </form>
                
                {message && <p className="message success">{message}</p>}
                {error && <p className="message error">{error}</p>}
            </motion.div>
        </div>
    )
}