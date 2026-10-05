import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { UseAuth } from '../../features/hooks/useAuth';
import { Seo } from '../../features/components/seo/seo';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const { forgotPassword, loading, error, succes } = UseAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="table-container">
            <Seo
                title="Recuperar Contraseña"
                description="Recuperá el acceso a tu cuenta de Guita. Te enviamos un link para restablecer tu contraseña."
                keywords="recuperar contraseña, olvidé mi contraseña, resetear"
                url="/forgot-password"
            />
            <div className="form-wrapper">
                <motion.div
                    className="form-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="form-icon lock-icon-large">
                        <Mail size={32} />
                    </div>
                    <h2>Recuperar Contraseña</h2>
                    <p>Te enviaremos un enlace para restablecerla</p>
                </motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="auth-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="form-group">
                        <label htmlFor="forgot-email">Correo Electrónico</label>
                        <input
                            id="forgot-email"
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="auth-input"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </motion.button>

                    <Link to="/login" className="back-link">
                        <ArrowLeft size={16} /> Volver al login
                    </Link>
                </motion.form>

                {succes && (
                    <motion.div
                        className="message success-message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <CheckCircle size={20} />
                        <div>
                            <p className="message-title">Correo enviado</p>
                            <p className="message-subtitle">{succes}</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        className="message error-message"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={20} />
                        <div>
                            <p className="message-title">Error</p>
                            <p className="message-subtitle">{error}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;