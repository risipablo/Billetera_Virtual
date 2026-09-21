import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UseAuth } from "../../features/hooks/useAuth";
import type { AuthenticatedProps } from "../../features/types/type.auth";
import { LogOut } from "lucide-react";

interface LogOutComponentProps extends AuthenticatedProps {
    onLogoutStart?: () => void;
}

export const LogOutComponent = ({
    setIsAuthenticated,
    onLogoutStart,
}: LogOutComponentProps) => {
    const navigate = useNavigate();
    const { logout } = UseAuth();

    const handleLogout = () => {
        window.dispatchEvent(new Event("app:logout-start"));
        onLogoutStart?.();

        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });

        logout().catch((error) => {
            console.error("Logout backend falló (ignorado):", error);
        });
    };

    return (
        <motion.button
            onClick={handleLogout}
            className="delete-account-btn"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <LogOut size={16} />
            <span> Cerrar Sesión</span>
        </motion.button>
    );
};