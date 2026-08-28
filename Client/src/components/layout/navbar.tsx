import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Tooltip} from "@mui/material";
import { ChartNoAxesColumn, CircleDollarSign, EllipsisVertical, Wallet } from 'lucide-react'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "../../style/navbar.css"
import { SubMenu } from "./subMenu";

const Navbar = () => {
    const [active,setActive] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    
    const toggleMenu = () => {
        setIsOpen(!isOpen)
        document.body.classList.toggle('open', !isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
        document.body.classList.remove('open')
    }

    const open = (icon:any) => {
        setActive(icon)
    }


    const close = () => {
        setActive(null)
    }

    return(
        <div className={`icon-container ${isOpen ? 'open' : ''}`}>
            <div onClick={toggleMenu} className={`menu-icon ${isOpen ? 'open' : ''}`}>             
                <span></span>
                <span></span>
                <span></span>          
            </div>
            
            <div className={`icons ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
                <div className={`menu ${isOpen ? 'open' : ''}`}> 
                    <NavLink to="/gastos" onMouseEnter={() => open('gastos')} onMouseLeave={close} onClick={closeMenu}>
                        <Tooltip title={active === 'gastos' ? "Gastos" : " "}>
                            <div className="icon gasto-icon">
                                <CircleDollarSign />
                                <span className="text">Gastos</span> 
                            </div>
                        </Tooltip>
                    </NavLink>
                        
                    <NavLink to="/estadisticas" onMouseEnter={() => open('estadisticas')} onMouseLeave={close} onClick={closeMenu}>
                        <Tooltip title={active === 'estadisticas' ? "Estadisticas" : " "}>
                            <div className="icon chart-icon">
                                <ChartNoAxesColumn  />
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

                    <NavLink to="/cuotas" onMouseEnter={() => open('notas')} onMouseLeave={close}>
                        <Tooltip title={active === 'notas' ? 'Notas' : ""}>
                            <div className="icon notas-icon">
                                <Wallet />
                                <span className="text">Cuotas</span> 
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

            <SubMenu/>

            <div className="span2">
                <span></span>
            </div>
        </div>
    )
}


export default Navbar;