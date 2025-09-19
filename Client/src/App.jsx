import  {  useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from "./component/loader/loader"
import Login from './pages/login/login'
import Register from "./pages/register/register"
import Convertidor from './pages/convertidor/convertidor'
import Charts from "./pages/chartPage/charts"
import Gastos from "./pages/gastos/gastos"
import {Navbar} from "./component/nav/navbar"
import { NotasPage } from './pages/notas/notasPage';
import { UserProvider } from './component/user/userContext';
import { ChangeUser } from './component/user/changeUser';
import { config } from './component/variables/config';
import { ForgotPassword } from './component/password/ForgotPassword/forgotPassword';
import { ChangePassword } from './component/password/changePassword/changePassword';
import { ResertPassword } from './component/password/reserPassword/resetPassword';
import { Consejo } from './component/consejos/consejo';
import { Listado } from './pages/listado/listado';
import axios from 'axios';
const serverFront = config.apiUrl;


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Cambiado a null inicial
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${serverFront}/api/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);
  
  if (isAuthenticated === null || loading) {
    return (
      <Loader 
        setLoading={setLoading}
        onComplete={() => Navigate('/gasto')} // Pasamos la navegación como callback
      />
    );
  }

  return (
    <UserProvider>
      <BrowserRouter>
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
  
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/gasto" replace /> : 
              <Login setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />
            }
          />

          <Route
            path="/register"
            element={<Register setLoading={setLoading} />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword setLoading={setLoading} />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResertPassword setLoading={setLoading} />}
          />

   
          <Route
            path="/gasto"
            element={isAuthenticated ? <Gastos /> : <Navigate to="/" replace />}
          />

          <Route
            path="/convertidor"
            element={isAuthenticated ? <Convertidor /> : <Navigate to="/" replace />}
          />

          <Route
            path="/charts"
            element={isAuthenticated ? <Charts /> : <Navigate to="/" replace />}
          />

          <Route
            path="/notas"
            element={isAuthenticated ? <NotasPage /> : <Navigate to="/" replace />}
          />

          <Route
            path="/listado"
            element={isAuthenticated ? <Listado /> : <Navigate to="/" replace />}
          />

          <Route
            path="/consejos"
            element={isAuthenticated ? <Consejo /> : <Navigate to="/" replace />}
          />

          <Route
            path="/change-user"
            element={isAuthenticated ? <ChangeUser setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} /> : <Navigate to="/" replace />}
          />

          <Route
            path="/change-password"
            element={isAuthenticated ? <ChangePassword setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} /> : <Navigate to="/" replace />}
          />

          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/gasto" : "/"} replace />} 
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;



// El principal problema del componente App era la autenticacion (isAuthenticated) donde si el usuario refrescaba la pagina se cerraba la sesion por completo
// Para solucionar eso isAuthenticated debe tener un valor nulo para idicar que aun no se sabe si el usuario esta autenticado
// Con el enpoint correspondiente nos sirve para verificar el token del backend, si es valido mantiene la sesion actica
