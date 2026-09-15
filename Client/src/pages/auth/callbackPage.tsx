
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthenticatedProps } from '../../features/types/type.auth';
import { SplashLoader } from '../../components/ui/spinner/loader';



const CallbackPage = ({ setIsAuthenticated }: AuthenticatedProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        

        if (error) {
        
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/login', { state: { error: 'Error al iniciar sesión con Google' } });
            return;
        }

        if (token) {
        
            localStorage.setItem('token', token);
        
            setIsAuthenticated(true);
            console.log('setIsAuthenticated(true)');
            
             navigate('/gastos', { replace: true }); 
        } else {
        
             navigate('/login', { replace: true });
        }
    }, [location.search, navigate, setIsAuthenticated]);

    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh' 
        }}>
            <SplashLoader />
            <p style={{ marginTop: '20px', color: '#d4c9a6' }}>Procesando inicio de sesión...</p>
        </div>
    );
};

export default CallbackPage;