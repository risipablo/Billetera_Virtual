import { useState } from "react";
import {config} from '../../variables/config'
import axios from "axios";


const serverFront = config.apiUrl;


export function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    // const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post(`${serverFront}/api/auth/forgot-password`, {email})
            setMessage("Revisa tu bandeja de correo. Recibiras un enlace para restablecer la contraseña")
        } catch (err) {
            setMessage(err.response?.data?.message || "Error al procesar la solicitud")
        }
    }

    return(
        <div>
               <h3><strong>Ingrese su correo electronico </strong></h3>


            <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    placeholder="Coloque su correo" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                />
                <button type="submit">Enviar</button>
                {message && <p>{message}</p>}
            </form>
            
        </div>
    )
}