import { Menu, MenuItem, ListItemIcon, CircularProgress } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordIcon from '@mui/icons-material/Password';
import { useContext, useRef, useState } from "react";
import {UserContext} from "../../user/userContext"
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../variables/config";


const serverFront = config.apiUrl;


export const SubMenu = ({setIsAuthenticated}) => {
        const {user, setUser} = useContext(UserContext)
        const navigate = useNavigate()
        // Estados para los menús
        const [anchorEl, setAnchorEl] = useState(null);
        const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
        const userMenuOpen = Boolean(anchorEl);
        const subMenuOpen = Boolean(subMenuAnchorEl);
        const userButtonRef = useRef(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
       

    const handleUserMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    
    const handleSubMenuClick = (event) => {
        setSubMenuAnchorEl(event.currentTarget);
    };
    
            
    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null);
    };

        
    const handlePasswordClick = () => {
        handleSubMenuClose();
        handleUserMenuClose();
        navigate('/change-password');
    };


    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        
        try {
            await axios.post(`${serverFront}/api/auth/logout`, {}, { 
            withCredentials: true 
            });
            
            // Limpiar datos de usuario
            localStorage.removeItem('token');
            setUser(null);
            
        
            if (setIsAuthenticated) {
            setIsAuthenticated(false);
            }
            
            navigate('/login');
            
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        handleUserMenuClose();
        handleSubMenuClose();
        navigate('/change-user');
    }

    return (
        <>
          
          <div 
                className='user' 
                onClick={handleUserMenuClick} 
                style={{ cursor: 'pointer' }}
                ref={userButtonRef}
            >
                <NavLink to="/gasto">
                    <EmojiEmotionsIcon/>
                </NavLink>
               
                {user && <p>Hola, {user.name}</p>}
            </div>

            <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    Perfil
                </MenuItem> */}
                
            
                <MenuItem 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSubMenuClick(e);
                    }}
                    onMouseEnter={(e) => {
                        if (userMenuOpen) {
                            handleSubMenuClick(e);
                        }
                    }}
                >
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Configuraciones
                    <KeyboardArrowRightIcon style={{ marginLeft: 'auto' }} />
                </MenuItem>

                <MenuItem onClick={handleLogout} disabled={loading}>
                    <ListItemIcon>
                        {loading ? (
                        <CircularProgress size={20} />
                        ) : (
                        <LogoutIcon fontSize="small" />
                        )}
                    </ListItemIcon>
                    Cerrar Sesión
                </MenuItem>

            </Menu>
            

            <Menu
                anchorEl={subMenuAnchorEl}
                open={subMenuOpen}
                onClose={handleSubMenuClose}
                anchorOrigin={{ 
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{ 
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        ml: 1,
                    }
                }}
            >
                <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                        <BadgeIcon fontSize="small" />
                    </ListItemIcon>
                    Usuario
                </MenuItem>
                <MenuItem onClick={handlePasswordClick}>
                    <ListItemIcon>
                        <PasswordIcon fontSize="small" />
                    </ListItemIcon>
                    Contraseña
                </MenuItem>
            </Menu>
        </>
    )
}