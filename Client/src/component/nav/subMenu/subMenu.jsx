import { Menu, MenuItem, ListItemIcon, CircularProgress } from "@mui/material";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordIcon from '@mui/icons-material/Password';
import { useContext, useEffect, useRef, useState } from "react";
import {UserContext} from "../../user/userContext"
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";



export const SubMenu = ({ setIsAuthenticated }) => {
        const { user, fetchUserData  } = useContext(UserContext);
        const navigate = useNavigate()
        // Estados para los menús
        const [anchorEl, setAnchorEl] = useState(null); 
        const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
        const userMenuOpen = Boolean(anchorEl);
        const subMenuOpen = Boolean(subMenuAnchorEl);
        const userButtonRef = useRef(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

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
               
                <p style={{ display: 'flex' }}>{user?.name || 'Cargando...'}</p>
                {/* {user?.name && <p>Hola, {user.name}</p>} */}
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
                        mt: 1.8,
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
                            right: 12,
                            width: 12,
                            height: 12,
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
                    sx={{ margin: '10px  0 '}}
                >
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Configuraciones
                    <KeyboardArrowRightIcon style={{ marginLeft: 'auto' }} />
                </MenuItem>

                <MenuItem onClick={handleLogout} disabled={loading}  sx={{ margin: '10px  0 '}}>
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
                // sx={{ margin: '20px  0 '} }
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.8,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            mr: -0.5,
                            ml: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 12,
                            width: 12,
                            height: 12,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                
            >
                <MenuItem onClick={handleProfileClick} sx={{ margin: '12px  0 '}}>
                    <ListItemIcon>
                        <BadgeIcon fontSize="small" />
                    </ListItemIcon>
                    Usuario
                </MenuItem>
                <MenuItem onClick={handlePasswordClick} sx={{ margin: '12px  0 '}}>
                    <ListItemIcon>
                        <PasswordIcon fontSize="small" />
                    </ListItemIcon>
                    Contraseña
                </MenuItem>
            </Menu>
        </>
    )
}