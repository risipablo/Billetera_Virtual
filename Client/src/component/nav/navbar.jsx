import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import { UserContext } from "../user/userContext";
import { useContext, useState } from "react";
import { Tooltip } from "@mui/material";


export function Navbar() {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const [active,setActive] = useState(null)

    const open = (icon) => {
        setActive(icon)
    }

    const close = () => {
        setActive(null)
    }

    // Cerrar Sesión 
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false); // Actualizar el estado de autenticación para evitar que aparezca en el login
        navigate('/')
    }

    const handleUserClick = () => {
        navigate('/gasto');
    };


    return(

        <div className='icon-container'>
            <div className="icons">

            <NavLink onClick={handleLogout} onMouseEnter={() => open('logout')} onMouseLeave={close} >
                    <Tooltip title={active === 'logout' ? "Logout" : " "}>
                        <div className="icon logout-icon">
                            <LogoutIcon />
                        </div>
                    </Tooltip>
                </NavLink>
                    

                <NavLink to="/charts" onMouseEnter={() => open('estadisticas')} onMouseLeave={close}>
                    <Tooltip title={active === 'estadisticas' ? "Estadisticas" : " "}>
                        <div className="icon chart-icon">
                            <BarChartIcon />
                        </div>
                    </Tooltip>
                </NavLink>

    
            </div>
            <div className='user' onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                {user && <p>Hola, {user.email}</p>}
            </div>

        </div>

    )
}