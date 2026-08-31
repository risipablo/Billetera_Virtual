import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { UseAuth } from "../../features/hooks/useAuth"
import type { AuthenticatedProps } from "../../features/types/type.auth"

export const LogOutComponent = ({ setIsAuthenticated }:AuthenticatedProps ) => {
  const navigate = useNavigate()
  const { logout } = UseAuth()

  const handleLogout = async () => {
    try {
      setIsAuthenticated(false)
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error en logout:', error)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  return (
    <motion.button
      onClick={handleLogout}
      className="logout-btn"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >

      <span>Cerrar Sesión</span>
    </motion.button>
  )
}