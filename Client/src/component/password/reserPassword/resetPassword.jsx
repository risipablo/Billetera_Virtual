import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { config } from "../../variables/config";

const serverFront = config.apiUrl;



export function ResertPassword(){
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, SetMessage] = useState('')
    const [loading, setLoading] = useState(false);
    const { token } = useParams()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword){
            SetMessage("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        if(newPassword.length < 8){
            SetMessage("La nueva contraseña debe tener al menos 8 caracteres");
            setLoading(false);
            return;
        }


        try {
            await axios.post(`${serverFront}/api/auth/reset-password`, {token, newPassword})
            SetMessage('¡Contraseña actualizada! Redirigiendo...');
            setTimeout(() => navigate('/login'), 3000);
            
        } catch (err) {
            SetMessage(err.response?.data?.message || "Error al restablecer la contraseña")
        }
    }


    return(
        <div className="change-container">
            <form onSubmit={handleSubmit} className="input-password">
                <input 
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    required
                    minLength="8"
                    />

                    <input    
                        placeholder="Confirmar nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="8"
                    />

                    <button type="submit">Confirmar </button>
            </form>
           
            {message && <p>{message}</p>}
        </div>
    )
}