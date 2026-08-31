
import { useEffect, useState } from "react";
import { config } from "../../config";

import { 
    User, 

    LogOut, 

    UserCog,
    KeyRound,
    MessageSquare,

} from "lucide-react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { useUser } from "../../features/hooks/useUser";
import { useNavigate } from "react-router-dom";

const serverFront = config.Api;

export const SubMenu = () => {
    const { user, fetchUserData } = useUser();
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(anchorEl);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    await axios.post(`${serverFront}/api/auth/logout`, {}, { 
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } catch (logoutError) {
                    console.log('Error en logout backend:', logoutError);
                }
            }
            
            localStorage.removeItem('token');
            handleUserMenuClose();
            window.location.href = '/login';
            
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            setError('Error al cerrar sesión');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (path: string) => {
        handleUserMenuClose();
        navigate(path);
    };

    return (
        <>
            <div 
                className='user' 
                onClick={handleUserMenuClick} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <User size={20} />
                <p>Hola, {user?.name || 'Cargando...'}</p>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 240,
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            mt: 1,
                            py: 1,
                        }
                    }
                }}
            >
                <MenuItem 
                    onClick={() => handleNavigate('/perfil')}
                    sx={{ 
                        mx: 1,
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                        }
                    }}
                >
                    <ListItemIcon>
                        <UserCog size={20} />
                    </ListItemIcon>
                    Perfil
                </MenuItem>

                <MenuItem 
                    onClick={() => handleNavigate('/configuracion/password')}
                    sx={{ 
                        mx: 1,
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                        }
                    }}
                >
                    <ListItemIcon>
                        <KeyRound size={20} />
                    </ListItemIcon>
                    Contraseña
                </MenuItem>

                <MenuItem 
                    onClick={() => handleNavigate('/configuracion/sugerencias')}
                    sx={{ 
                        mx: 1,
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                        }
                    }}
                >
                    <ListItemIcon>
                        <MessageSquare size={20} />
                    </ListItemIcon>
                    Sugerencias
                </MenuItem>

                <div style={{ 
                    borderTop: '1px solid #e2e8f0', 
                    margin: '6px 12px',
                }} />

                <MenuItem 
                    onClick={handleLogout} 
                    disabled={loading}
                    sx={{ 
                        mx: 1,
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#fef2f2',
                        }
                    }}
                >
                    <ListItemIcon>
                        {loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <LogOut size={20} style={{ color: '#dc2626' }} />
                        )}
                    </ListItemIcon>
                    <span style={{ color: loading ? '#94a3b8' : '#dc2626' }}>
                        Cerrar Sesión
                    </span>
                </MenuItem>
            </Menu>
        </>
    );
};