
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    User, 
    UserCog, 
    KeyRound, 
    MessageSquare, 
    Trash2, 
    LogOut,
    Camera,
    Check,
    X,
    Loader2,
    ArrowLeft
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ModalConfirm } from "../../../components/ui/modalConfirm";
import "./style/configuracion.css";
import { useUser } from "../../hooks/useUser";

type SectionType = 'perfil' | 'password' | 'sugerencias';

export const Configuracion = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [activeSection, setActiveSection] = useState<SectionType>('perfil');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'logout' | 'delete'>('logout');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        if (path === 'perfil' || path === 'password' || path === 'sugerencias') {
            setActiveSection(path);
        }
    }, [location]);




    const handleLogout = async () => {
        setShowModal(false);
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        setShowModal(false);
        
    };

    const sections: { id: SectionType; label: string; icon: any }[] = [
        { id: 'perfil', label: 'Perfil', icon: UserCog },
        { id: 'password', label: 'Contraseña', icon: KeyRound },
        { id: 'sugerencias', label: 'Sugerencias', icon: MessageSquare },
    ];

    return (
        <div className="configuracion-container">
            {/* <Helmet>
                <title>Configuración de Cuenta</title>
            </Helmet> */}

            <div className="configuracion-header">
                <button 
                    className="configuracion-back"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <h1 className="configuracion-title">Configuración de Cuenta</h1>
                <p className="configuracion-subtitle">Gestiona tu perfil y seguridad</p>
            </div>

            <div className="configuracion-grid">
                <aside className="configuracion-sidebar">
                    <div className="configuracion-user">
                        <div className="configuracion-avatar">
                            <User size={40} />
                            <button className="configuracion-avatar-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="configuracion-user-info">
                            <h3>{user?.name || 'Usuario'}</h3>
                            <p>{user?.email || 'usuario@email.com'}</p>
                        </div>
                    </div>

                    <nav className="configuracion-nav">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    className={`configuracion-nav-item ${activeSection === section.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveSection(section.id);
                                        navigate(`/configuracion/${section.id}`);
                                    }}
                                >
                                    <Icon size={18} />
                                    <span>{section.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="configuracion-actions">
                        <button 
                            className="configuracion-action-btn configuracion-action-logout"
                            onClick={() => {
                                setModalType('logout');
                                setShowModal(true);
                            }}
                        >
                            <LogOut size={18} />
                            Cerrar Sesión
                        </button>
                        <button 
                            className="configuracion-action-btn configuracion-action-delete"
                            onClick={() => {
                                setModalType('delete');
                                setShowModal(true);
                            }}
                        >
                            <Trash2 size={18} />
                            Eliminar mi cuenta
                        </button>
                    </div>
                </aside>

                <main className="configuracion-content">
                    {activeSection === 'perfil' && (
                        <div className="configuracion-section">
                            <h2>Cambiar Nombre de Usuario</h2>
                            <p className="configuracion-section-desc">
                                Actualiza tu nombre de perfil
                            </p>
                            <div className="configuracion-form">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        className="configuracion-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="configuracion-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <button 
                                    className="configuracion-btn-save"
                                    // onClick={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 size={18} className="spin" /> : <Check size={18} />}
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSection === 'password' && (
                        <div className="configuracion-section">
                            <h2>Cambiar Contraseña</h2>
                            <p className="configuracion-section-desc">
                                Actualiza tu contraseña de acceso
                            </p>
                            <div className="configuracion-form">
                                <div className="form-group">
                                    <label>Contraseña actual</label>
                                    <input
                                        type="password"
                                        className="configuracion-input"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nueva contraseña</label>
                                    <input
                                        type="password"
                                        className="configuracion-input"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmar nueva contraseña</label>
                                    <input
                                        type="password"
                                        className="configuracion-input"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button 
                                    className="configuracion-btn-save"
                                    // onClick={handleUpdatePassword}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 size={18} className="spin" /> : <Check size={18} />}
                                    Actualizar contraseña
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSection === 'sugerencias' && (
                        <div className="configuracion-section">
                            <h2>Sugerencias</h2>
                            <p className="configuracion-section-desc">
                                Puedes mandar un mensaje de sugerencia, queja o consulta
                            </p>
                            <div className="configuracion-form">
                                <div className="form-group">
                                    <label>Mensaje</label>
                                    <textarea
                                        className="configuracion-textarea"
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="Escribe tu sugerencia, queja o consulta..."
                                        rows={6}
                                    />
                                </div>
                                <button 
                                    className="configuracion-btn-save"
                                    onClick={() => {
                                        alert('Mensaje enviado');
                                        setSuggestion('');
                                    }}
                                >
                                    <MessageSquare size={18} />
                                    Enviar mensaje
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <ModalConfirm
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={modalType === 'logout' ? handleLogout : handleDeleteAccount}
                title={modalType === 'logout' ? 'Cerrar Sesión' : 'Eliminar Cuenta'}
                message={modalType === 'logout' 
                    ? '¿Estás seguro que deseas cerrar sesión?' 
                    : '¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'}
                confirmText={modalType === 'logout' ? 'Cerrar Sesión' : 'Eliminar Cuenta'}
                cancelText="Cancelar"
            />

            <Toaster />
        </div>
    );
};

export default Configuracion;