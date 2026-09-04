import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ChangeUserName, IChangeUserName } from "../../features/types/type.user";
import { UseAuth } from "../../features/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, User } from "lucide-react";
import "../../style/auth-forms.css";

function ChangeUserNamePage({ setIsAuthenticated }: IChangeUserName) {
    const [formData, setFormData] = useState<ChangeUserName>({
        newName: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState<string>('');

    const { changeName, loading, error, succes } = UseAuth();
    const navigate = useNavigate();

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitChangeName = async (e: FormEvent<HTMLElement>): Promise<void> => {
        e.preventDefault();
        setShowError('');

        // Validación básica
        if (!formData.newName || formData.newName.trim().length < 3) {
            setShowError('El nombre debe tener al menos 3 caracteres');
            return;
        }

        try {
            await changeName({
                newName: formData.newName.trim()
            });

            setShowSuccess(true);
            setIsAuthenticated(true);

            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error cambiando nombre de usuario.';
            setShowError(errorMsg);
            console.error('Error cambiando nombre de usuario:', err);
        }
    };

    return (
        <div className="table-container">
            <div className="form-wrapper">
                <motion.div
                    className="form-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="form-icon user-icon-large">
                        <User size={32} />
                    </div>
                    <h2>Cambiar nombre de usuario</h2>
                    <p>Elegí un nuevo nombre para tu perfil</p>
                </motion.div>

                <form onSubmit={handleSubmitChangeName} className="auth-form">
                    <motion.div
                        className="form-group"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label htmlFor="newName">Nuevo nombre de usuario</label>
                        <input
                            id="newName"
                            type="text"
                            name="newName"
                            placeholder="Mi Nuevo Usuario"
                            value={formData.newName}
                            onChange={handleChangeName}
                            required
                            disabled={loading || showSuccess}
                            className="auth-input"
                            minLength={3}
                        />
                        <p className="form-hint">Mínimo 3 caracteres</p>
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={loading || showSuccess || !formData.newName.trim()}
                        className="submit-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {loading ? "Procesando..." : showSuccess ? "¡Listo!" : "Confirmar cambio"}
                    </motion.button>
                </form>

                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            className="message success-message"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <CheckCircle size={20} />
                            <div>
                                <p className="message-title">Nombre actualizado</p>
                                <p className="message-subtitle">Serás redirigido en unos segundos...</p>
                            </div>
                        </motion.div>
                    )}

                    {(showError || error) && !showSuccess && (
                        <motion.div
                            className="message error-message"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <AlertCircle size={20} />
                            <div>
                                <p className="message-title">Error</p>
                                <p className="message-subtitle">{showError || error}</p>
                            </div>
                        </motion.div>
                    )}

                    {succes && !showError && !showSuccess && (
                        <motion.p
                            className="message success-message"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            {succes}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default ChangeUserNamePage;