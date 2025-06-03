import { NavLink } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditNoteIcon from '@mui/icons-material/EditNote';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {  useState } from "react";
import { Tooltip} from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import "./navbar.css"

import { SubMenu } from "./subMenu/subMenu";

export function Navbar({setIsAuthenticated}) {
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

    // const handleLogout = () => {
    //     setIsAuthenticated(false); 
    // };

    return(
        <div className='icon-container'>
            <div onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>             
                <span></span>
                <span></span>
                <span></span>          
            </div>

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

                    <NavLink to="/notas" onMouseEnter={() => open('notas')} onMouseLeave={close}>
                        <Tooltip title={active === 'notas' ? 'Notas' : ""}>
                            <div className="icon notas-icon">
                                <EditNoteIcon />
                                <span className="text">Notas</span> 
                            </div>
                        </Tooltip>
                    </NavLink>

                    <NavLink to="/listado" onMouseEnter={() => open('lista de compras')} onMouseLeave={close}>
                        <Tooltip title={active === 'lista de compras' ? 'Lista de compras' : ""}>
                            <div className="icon notas-icon">
                                <AddShoppingCartIcon />
                                <span className="text">Lista de compras </span> 
                            </div>
                        </Tooltip>
                    </NavLink>

                    {/* <NavLink to="/productos" onMouseEnter={() => open('precio productos')} onMouseLeave={close}>
                        <Tooltip title={active === 'precio productos' ? 'Precio Productos' : ""}>
                            <div className="icon notas-icon">
                                <StorefrontIcon />
                                <span className="text">Precio Productos</span> 
                            </div>
                        </Tooltip>
                    </NavLink> */}


                    <NavLink to="/consejos" onMouseEnter={() => open('consejos')} onMouseLeave={close}>
                        <Tooltip title={active === 'consejos' ? 'Consejos' : ""}>
                            <div className="icon notas-icon">
                                <TipsAndUpdatesIcon />
                                <span className="text">Consejos</span> 
                            </div>
                        </Tooltip>
                    </NavLink>


                </div>
            </div>

            <SubMenu setIsAuthenticated={setIsAuthenticated}/>
            <div className="span2">
                <span></span>
            </div>
        </div>
    )
}