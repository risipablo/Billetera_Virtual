import { useNavigate } from "react-router-dom";
import { User, KeyRound, Target, MessageSquare, Info, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { LogOutComponent } from "../../components/auth/logout"
import { useUser } from "../../features/hooks/useUser"
import type { AuthenticatedProps } from "../../features/types/type.auth"
import "../../style/perfil.css"

type SettingItem = {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
};

const PerfilPage = ({ setIsAuthenticated }: AuthenticatedProps) => {
    const { user } = useUser()
    const navigate = useNavigate()

    
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
            onClick: () => navigate('/sugerencias'),
        },
        {
            icon: <Info size={18} />,
            title: "Acerca de la app",
            description: "Conocé para qué sirve y cómo usarla",
            onClick: () => navigate('/acerca'),
        },
    ];

    const handleDeleteAccount = () => {
        if (confirm('¿Estás seguro que querés borrar tu cuenta? Esta acción no se puede deshacer.')) {
        
        }
    };

    return (
        <div className="table-container">
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
                        <LogOut size={16} />
                        <LogOutComponent setIsAuthenticated={setIsAuthenticated} />
                    </div>

                    <button className="delete-account-btn" onClick={handleDeleteAccount}>
                        <Trash2 size={16} />
                        Borrar cuenta
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PerfilPage