import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import "../changePassword/changePassword.css";
import { config } from "../../variables/config";


const serverFront = config.apiUrl;

export function ChangePassword({ setIsAuthenticated }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false); 
    const navigate = useNavigate();
    const navigate2 = useNavigate();

    const toggleShow = (field) => {
        setShow(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serverFront}/api/auth/verify-email`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsEmailVerified(true); 
            setMessage(response.data.message || "Correo verificado exitosamente");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al verificar el correo");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!isEmailVerified) {
            setMessage("Por favor, verifica tu correo electrónico antes de cambiar la contraseña");
            return;
        }

        setLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setMessage("La nueva contraseña debe tener al menos 8 caracteres");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${serverFront}/api/auth/change-password`,
                { currentPassword, newPassword },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true 
                }
            );

            setMessage(response.data.message || "Contraseña cambiada exitosamente");
            setTimeout(() => {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                navigate('/login');
            }, 2000);

        } catch (error) {
            setMessage(error.response?.data?.error || "Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    const backToLogin = () => {
        navigate2('/gasto');
    }

    return (
        <div className="container-setting">
            <Helmet>
                <title> Cambio de Contraseña </title>
            </Helmet>
                    
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >

                {!isEmailVerified ? (
                    
                    <motion.form
                        onSubmit={handleVerifyEmail}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >

                        <h3> <strong>Primero debe confirmar su correo electronico</strong></h3>
                        
                        <motion.div    
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                        >
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.button 
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? "Verificando..." : "Verificar Correo"}

                        </motion.button>
                    </motion.form>
                ) : (
                    <motion.form
                    className="change-container"
                        onSubmit={handleChangePassword}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="volver" onClick={backToLogin}>Volver </span>

                        <div className="input-password">
                            <motion.div 
                                
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                            >
                                <input
                                    type={show.current ? 'text' : 'password'}
                                    placeholder="Contraseña actual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <span className="password-icon" onClick={() => toggleShow('current')}>
                                    {show.current ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </motion.div>

                            <motion.div 
                                
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <input
                                    type={show.new ? 'text' : 'password'}
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="8"
                                />
                                <span className="password-icon" onClick={() => toggleShow('new')}>
                                    {show.new ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </motion.div>

                            <motion.div 
                            
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <input
                                    type={show.confirm ? 'text' : 'password'}
                                    placeholder="Confirmar nueva contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="8"
                                />
                                <span className="password-icon" onClick={() => toggleShow('confirm')}>
                                    {show.confirm ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </motion.div>
                        </div>


                        <ul className="p2">
                            <p> Requisitos: </p>
                            {[
                                "La contraseña debe tener al menos 8 caracteres.",
                                "Incluir al menos una mayúscula.",
                                "Incluir al menos un número.",
                                "Incluir al menos un carácter especial (opcional).",
                                "No incluir espacios en blanco."
                            ].map((text, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                >
                                    {text}
                                </motion.li>
                            ))}
                        </ul>

                        
                        <motion.button 
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {loading ? "Procesando..." : "Confirmar"}
                        </motion.button>
                    </motion.form>
                )}

                {message && (
                    <motion.p 
                        className={`message ${message.includes('éxito') ? 'success' : 'error'}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {message}
                    </motion.p>
                )}

            </motion.div>

        </div>

       
    );
}