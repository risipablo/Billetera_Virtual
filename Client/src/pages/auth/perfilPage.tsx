import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, KeyRound, Target, MessageSquare, Info, ChevronRight, Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOutComponent } from "../../components/auth/logout";
import { useUser } from "../../features/hooks/useUser";
import { UseAuth } from "../../features/hooks/useAuth";
import type { AuthenticatedProps } from "../../features/types/type.auth";
import "../../style/perfil.css";

type SettingItem = {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
};

interface PerfilPageProps extends AuthenticatedProps {
    onLogoutStart?: () => void;
}

const PerfilPage = ({ setIsAuthenticated, onLogoutStart }: PerfilPageProps) => {
    const { user } = useUser();
    const { deleteAccount, loading } = UseAuth();
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

    const items: SettingItem[] = [
        {
            icon: <User size={18} />,
            title: "Nombre de usuario",
            description: "Editá el nombre que se muestra en la app",
            onClick: () => navigate('/change-user'),
        },
        {
            icon: <KeyRound size={18} />,
            title: "Contraseña",
            description: "Cambiá tu contraseña de acceso",
            onClick: () => navigate('/change-password'),
        },
        {
            icon: <Target size={18} />,
            title: "Metas",
            description: "Definí objetivos de ahorro o de gasto",
            onClick: () => navigate('/metas'),
        },
        {
            icon: <MessageSquare size={18} />,
            title: "Sugerencias",
            description: "Contanos qué te gustaría mejorar de la app",
            onClick: () => navigate('/send-email'),
        },
        {
            icon: <Info size={18} />,
            title: "Acerca de la app",
            description: "Conocé para qué sirve y cómo usarla",
            onClick: () => navigate('/about'),
        },
    ];

    const PALABRA_CONFIRMACION = "ELIMINAR";

    const handleDeleteAccount = async () => {
        if (confirmText.trim().toUpperCase() !== PALABRA_CONFIRMACION) return;

        setDeleting(true);
        try {
            await deleteAccount();
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Error al eliminar cuenta:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleCloseModal = () => {
        if (deleting) return;
        setShowDeleteModal(false);
        setConfirmText("");
    };

    const puedeConfirmar = confirmText.trim().toUpperCase() === PALABRA_CONFIRMACION;

    return (
        <div className="table-container">
            <title>Perfil de {user?.name?.charAt(0).toUpperCase() || '?'}</title>

            <div className="perfil-header">
                <div className="perfil-avatar">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                    <h2 className="perfil-title">Perfil de {user?.name}</h2>
                    <p className="perfil-subtitle">Gestioná tu perfil y seguridad</p>
                </div>
            </div>

            <div className="perfil-list">
                {items.map((item) => (
                    <button
                        key={item.title}
                        className="perfil-item"
                        onClick={item.onClick}
                    >
                        <span className="perfil-item-icon">{item.icon}</span>
                        <span className="perfil-item-text">
                            <span className="perfil-item-title">{item.title}</span>
                            <span className="perfil-item-desc">{item.description}</span>
                        </span>
                        <ChevronRight size={18} className="perfil-item-chevron" />
                    </button>
                ))}
            </div>

            <div className="perfil-danger-zone">
                <div className="perfil-danger-actions">
                    <div className="perfil-logout-wrapper">
                        <LogOutComponent
                            setIsAuthenticated={setIsAuthenticated}
                            onLogoutStart={onLogoutStart}
                        />
                    </div>

                    <button
                        className="delete-account-btn"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash2 size={16} />
                        Borrar cuenta
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="delete-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="delete-modal"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="delete-modal__header">
                                <div className="delete-modal__icon">
                                    <AlertTriangle size={22} />
                                </div>
                                <h3>¿Eliminar tu cuenta?</h3>
                                <button
                                    className="delete-modal__close"
                                    onClick={handleCloseModal}
                                    disabled={deleting}
                                    aria-label="Cerrar"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="delete-modal__body">
                                <p>
                                    Esta acción es <strong>permanente</strong> y no se puede deshacer.
                                    Se van a eliminar:
                                </p>
                                <ul>
                                    <li>Todos tus gastos registrados</li>
                                    <li>Todas tus cuotas y notas</li>
                                    <li>Todos tus gastos fijos</li>
                                    <li>Todas tus metas</li>
                                    <li>Tu usuario y perfil</li>
                                </ul>
                                <p className="delete-modal__warning">
                                    Si tenés dudas, mejor <strong>cerrá sesión</strong> y volvé cuando estés seguro.
                                </p>

                                <label className="delete-modal__label">
                                    Escribí <strong>{PALABRA_CONFIRMACION}</strong> para confirmar:
                                </label>
                                <input
                                    type="text"
                                    className="delete-modal__input"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder={PALABRA_CONFIRMACION}
                                    disabled={deleting}
                                    autoFocus
                                />
                            </div>

                            <div className="delete-modal__footer">
                                <button
                                    className="delete-modal__btn delete-modal__btn--secondary"
                                    onClick={handleCloseModal}
                                    disabled={deleting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="delete-modal__btn delete-modal__btn--danger"
                                    onClick={handleDeleteAccount}
                                    disabled={!puedeConfirmar || deleting}
                                >
                                    <Trash2 size={16} />
                                    {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PerfilPage;