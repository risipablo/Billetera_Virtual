import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import "../password/changePassword/changePassword.css";
import axios from "axios";
import { config } from "../variables/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const serverFront = config.apiUrl;


export function ChangeUser({setIsAuthenticated}){
    const [newName, setNewName] = useState("");
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleChangeUser = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post( `${serverFront}/api/auth/change-user`, {newName}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }, withCredentials: true
            })

            setMessage(response.data.message || "Cambio de nombre exitosamente");
            setTimeout(() => {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                navigate('/gasto');
            }, 2000);

        } catch (error) {
            console.error("Error al cambiar el nombre de usuario:", error);
        }
    }

    return(
        <div className="container-setting">
            <Helmet>
                Cambio de nombre de usuario
            </Helmet>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h3><strong>Ingrese su nuevo nombre de usuario</strong></h3>

                <form onSubmit={handleChangeUser}>
                    <input type="text" placeholder="Nuevo nombre de usuario" value={newName} onChange={(e) => setNewName(e.target.value)} required/>
                    <button type="submit">Confirmar</button>
                </form>
                {message && <p className="message">{message}</p>}
            </motion.div>
        </div>
    )

}