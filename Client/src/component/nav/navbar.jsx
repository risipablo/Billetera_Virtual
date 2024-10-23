import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { UserContext } from "../user/userContext";
import { useContext, useState } from "react";
import { Tooltip } from "@mui/material";
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import "./navbar.css"

export function Navbar() {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const [active,setActive] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        document.body.classList.toggle('open', !setIsOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
        document.body.classList.remove('open')
    }


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
            <div className={`icons ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
                <div className={`menu ${isOpen ? 'open' : ''}`}> 


                <NavLink to="/gasto" onMouseEnter={() => open('gastos')} onMouseLeave={close} onClick={closeMenu}>
                        <Tooltip title={active === 'gastos' ? "Gastos" : " "}>
                            <div className="icon gasto-icon">
                                <MonetizationOnIcon />
                                <span className="text">Gastos</span> 
                            </div>
                        </Tooltip>
                    </NavLink>
                        

                    <NavLink to="/charts" onMouseEnter={() => open('estadisticas')} onMouseLeave={close} onClick={closeMenu}>
                        <Tooltip title={active === 'estadisticas' ? "Estadisticas" : " "}>
                            <div className="icon chart-icon">
                                <BarChartIcon />
                                <span className="text">Estadisticas</span> 
                            </div>
                        </Tooltip>
                    </NavLink>

                    <NavLink to="/convertidor" onMouseEnter={() => open('convertidor')} onMouseLeave={close}>
                        <Tooltip title={active === 'convertidor' ? 'Convertidor' : ""}>
                            <div className="icon change-icon">
                                <CurrencyExchangeOutlinedIcon/>
                                <span className="text"> Convertidor </span>
                            </div>
                        </Tooltip>
                    </NavLink>

                    <NavLink onClick={handleLogout} onMouseEnter={() => open('cerrar sesión')} onMouseLeave={close} >
                        <Tooltip title={active === 'cerrar sesión' ? "Cerrar Sesión" : " "}>
                            <div className="icon logout-icon">
                                <LogoutIcon />
                                <span className="text">Cerrar Sesión</span> 
                            </div>
                        </Tooltip>
                    </NavLink>

                </div>
            </div>

            <div onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>             
                        <span></span>
                        <span></span>
                        <span></span>          
            </div>
            
            <div className='user' onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                {user && <p>Hola, {user.email}</p>}
            </div>

            <div className="span2">
                <span></span>
            </div>

        </div>

    )
}