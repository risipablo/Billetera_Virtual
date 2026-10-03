import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UseAuth } from "../../features/hooks/useAuth";
import type { AuthenticatedProps } from "../../features/types/type.auth";
import { LogOut } from "lucide-react";

export const LogOutComponent = ({
    setIsAuthenticated,
}: AuthenticatedProps) => {
    const navigate = useNavigate();
    const { logout, loading } = UseAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout falló:", error);
        }

        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };

    return (
        <motion.button
            onClick={handleLogout}
            disabled={loading}
            className="delete-account-btn"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            <LogOut size={16} />
            <span>{loading ? " Cerrando sesión..." : " Cerrar Sesión"}</span>
        </motion.button>
    );
};