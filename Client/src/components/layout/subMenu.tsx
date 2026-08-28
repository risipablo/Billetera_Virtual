// SubMenu.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../config";

import { 
    User, 
    Settings, 
    LogOut, 
    ChevronRight,
} from "lucide-react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { useUser } from "../../features/hooks/useUser";

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
            await axios.post(`${serverFront}/api/auth/logout`, {}, { 
                withCredentials: true 
            });
            
            localStorage.removeItem('token');
            navigate('/login');
            
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            setError('Error al cerrar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToConfig = () => {
        handleUserMenuClose();
        navigate('/configuracion');
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
                            width: 220,
                            borderRadius: 2,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            mt: 1,
                        }
                    }
                }}
            >
                <MenuItem 
                    onClick={handleNavigateToConfig}
                    sx={{ 
                        margin: '4px 8px',
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: '#f1f5f9',
                        }
                    }}
                >
                    <ListItemIcon>
                        <Settings size={20} />
                    </ListItemIcon>
                    Configuraciones
                    <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </MenuItem>

                <MenuItem 
                    onClick={handleLogout} 
                    disabled={loading}
                    sx={{ 
                        margin: '4px 8px',
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