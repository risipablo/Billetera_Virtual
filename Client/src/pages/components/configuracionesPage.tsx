
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    UserCog, 
    KeyRound, 
    Lightbulb, 
    LogOut, 
    Trash2,
    ChevronLeft,
    ArrowRight
} from "lucide-react";
import axios from "axios";
import { config } from "../../config";
import { useUser } from "../../features/hooks/useUser";


const serverFront = config.Api;

export const Configuraciones = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleChangeUser = () => {
        navigate('/change-user');
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleSuggestions = () => {
        navigate('/sugerencias');
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await axios.post(`${serverFront}/api/auth/logout`, {}, { 
                withCredentials: true 
            });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        setShowConfirm(true);
    };

    const confirmDeleteAccount = async () => {
        setLoading(true);
        try {
            await axios.delete(`${serverFront}/api/auth/delete-account`, {
                withCredentials: true
            });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al eliminar cuenta:', err);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const cancelDeleteAccount = () => {
        setShowConfirm(false);
    };

    return (
        <div className="configuraciones-container">
            {/* Header */}
            <div className="config-header">
                <button className="back-button" onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="config-title">Configuraciones</h1>
                <div className="header-spacer"></div>
            </div>

            {/* User info */}
            <div className="user-info-section">
                <div className="user-avatar">
                    <UserCog size={32} />
                </div>
                <div className="user-details">
                    <p className="user-name">{user?.name || 'Usuario'}</p>
                    <p className="user-email">{user?.email || 'usuario@email.com'}</p>
                </div>
            </div>

            {/* Opciones */}
            <div className="options-list">
                <button className="option-item" onClick={handleChangeUser}>
                    <div className="option-left">
                        <UserCog size={22} className="option-icon" />
                        <span className="option-label">Cambiar usuario</span>
                    </div>
                    <ArrowRight size={20} className="option-arrow" />
                </button>

                <button className="option-item" onClick={handleChangePassword}>
                    <div className="option-left">
                        <KeyRound size={22} className="option-icon" />
                        <span className="option-label">Cambiar contraseña</span>
                    </div>
                    <ArrowRight size={20} className="option-arrow" />
                </button>

                <button className="option-item" onClick={handleSuggestions}>
                    <div className="option-left">
                        <Lightbulb size={22} className="option-icon" />
                        <span className="option-label">Sugerencias</span>
                    </div>
                    <ArrowRight size={20} className="option-arrow" />
                </button>

                <button className="option-item" onClick={handleLogout} disabled={loading}>
                    <div className="option-left">
                        <LogOut size={22} className="option-icon option-icon-danger" />
                        <span className="option-label option-label-danger">Cerrar sesión</span>
                    </div>
                    {loading ? (
                        <span className="loading-spinner">...</span>
                    ) : (
                        <ArrowRight size={20} className="option-arrow" />
                    )}
                </button>

                <button className="option-item option-item-danger" onClick={handleDeleteAccount}>
                    <div className="option-left">
                        <Trash2 size={22} className="option-icon option-icon-danger" />
                        <span className="option-label option-label-danger">Eliminar cuenta</span>
                    </div>
                    <ArrowRight size={20} className="option-arrow option-arrow-danger" />
                </button>
            </div>

            {/* Modal de confirmación para eliminar cuenta */}
            {showConfirm && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <div className="confirm-modal-icon">
                            <Trash2 size={48} className="icon-danger" />
                        </div>
                        <h2 className="confirm-modal-title">¿Eliminar cuenta?</h2>
                        <p className="confirm-modal-text">
                            Esta acción es irreversible. Se eliminarán todos tus datos 
                            y configuraciones.
                        </p>
                        <div className="confirm-modal-buttons">
                            <button 
                                className="btn btn-cancel" 
                                onClick={cancelDeleteAccount}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-danger" 
                                onClick={confirmDeleteAccount}
                                disabled={loading}
                            >
                                {loading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};