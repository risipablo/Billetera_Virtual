import { useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

export function ChangePassword() {
    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const [userId, setUserId] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [show, setShow] = useState(false)
    const switchButton = () => setShow(!show)

    const token = localStorage.getItem('token')

    const handleVerifyEmail = async (e) => {
        e.preventDefault()

        try{
            const response = await axios.post(`${serverFront}/api/auth/verify-email`,{email}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserId(response.data.userId)
            setMessage(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.message || "Error en la solicitud");
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        // Verificamos que la contraseña actual y la nueva coincidan

        if(newPassword !== confirmPassword){
            setMessage("Las contraseñas no coinciden")
            return;
        }


        try{
            const response = await axios.post(`${serverFront}/api/auth/change-password`, {
                userId,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage(response.data.message)

            setTimeout(() => {
                navigate('/gasto')
            },2000)
        } catch (error) {
            setMessage(error.response.data.message)
        }
    }


    const clickNavigate = () => {
        navigate('/gasto')
    }
 

    return(
        <div>
            {!userId ? (
                <form onSubmit={handleVerifyEmail}>
                    <div>
                        <label> Correo electronico </label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit'>Verificar Correo </button>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                    <div>
                        <label> Nueva Contraseña: </label>
                        <input 
                            placeholder="Ingrese Contraseña Nueva"
                            type={show ? 'text' : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                         />
                         <span onClick={switchButton}>{show ? <FaEyeSlash/> : <FaEye/> }</span>
                    </div>

                    <div>
                        <label> Confirmar Nueva Contraseña:</label>
                        <input type="password" value={confirmPassword}  onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    </div>
                    <button type='submit'> Cambiar Contraseña </button>
                    
                </form>
            )}
            {message && (
                <p>
                    {message}
                    {message === "Contraseña Cambiada Correctamente" && (<button onClick={clickNavigate}> Volver </button>)}
                </p>
            )}
            
        </div>
    )
}