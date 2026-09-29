import { useState, type FormEvent, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeClosed, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { UseAuth } from '../../features/hooks/useAuth';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const { resetPassword, loading, error, succes } = UseAuth();

    useEffect(() => {
        if (!token) setLocalError('Token inválido o ausente. Solicita un nuevo enlace.');
    }, [token]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError('');

        if (newPassword !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            return;
        }
        if (newPassword.length < 8) {
            setLocalError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        try {
            await resetPassword(token, newPassword);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="table-container">
            <div className="form-wrapper">
                <motion.div
                    className="form-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="form-icon lock-icon-large">
                        <Lock size={32} />
                    </div>
                    <h2>Nueva Contraseña</h2>
                    <p>Ingresa tu nueva contraseña para continuar</p>
                </motion.div>

                {!succes && (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="auth-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="form-group">
                            <label htmlFor="new-password">Nueva Contraseña</label>
                            <div className="password-field">
                                <input
                                    id="new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    disabled={loading || !token}
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirmar Contraseña</label>
                            <input
                                id="confirm-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={loading || !token}
                                className="auth-input"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading || !token}
                            className="submit-button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </motion.button>

                        <Link to="/login" className="back-link">
                            <ArrowLeft size={16} /> Volver al login
                        </Link>
                    </motion.form>
                )}

                {succes && (
                    <motion.div
                        className="message success-message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircle size={20} />
                        <div>
                            <p className="message-title">¡Contraseña actualizada!</p>
                            <p className="message-subtitle">Serás redirigido al login...</p>
                        </div>
                    </motion.div>
                )}

                {(localError || error) && !succes && (
                    <motion.div
                        className="message error-message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={20} />
                        <div>
                            <p className="message-title">Error</p>
                            <p className="message-subtitle">{localError || error}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;