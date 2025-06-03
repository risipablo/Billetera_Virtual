import React, {  useEffect, useState } from 'react';
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
// import { config } from './component/variables/config';
// import axios from 'axios';
import { ForgotPassword } from './component/password/ForgotPassword/forgotPassword';
import { ChangePassword } from './component/password/changePassword/changePassword';
import { ResertPassword } from './component/password/reserPassword/resetPassword';
import { Consejo } from './component/consejos/consejo';
import { Listado } from './pages/listado/listado';


// const serverFront = config.apiUrl;


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState (false)

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     axios
  //       .get(`${serverFront}/api/auth/validate-token`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then(() => {
  //         setIsAuthenticated(true);
  //       })
  //       .catch(() => {
  //         localStorage.removeItem('token');
  //         setIsAuthenticated(false);
  //       });
  //   }
  // }, []);


  return (
    <UserProvider>
      <BrowserRouter>
        {loading && <Loader />}
  
        {!loading && isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
  
        <Routes>

          <Route
            path="/"
            element={<Login setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />}
          />

          <Route
            path="/loader"
            element={<Loader setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />}
          />

          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />}
          />

          <Route path='/forgot-password' element={<ForgotPassword setIsAuthenticated={setIsAuthenticated} setLoading={setLoading}/>}/>
          <Route path="/reset-password/:token" element={<ResertPassword setIsAuthenticated={setIsAuthenticated} setLoading={setLoading}/>} />

          <Route
            path="/gasto"
            element={isAuthenticated ? <Gastos /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />

          <Route
            path="/convertidor"
            element={isAuthenticated ? <Convertidor /> : <Navigate to="/" />}
          />
          <Route
            path="/charts"
            element={isAuthenticated ? <Charts /> : <Navigate to="/" />}
          />
          <Route
            path="/notas"
            element={isAuthenticated ? <NotasPage /> : <Navigate to="/" />}
          />

          <Route
            path="/listado"
            element={isAuthenticated ? <Listado /> : <Navigate to="/" />}
          />

          
          <Route
            path="/consejos"
            element={isAuthenticated ? <Consejo /> : <Navigate to="/" />}
          />

          <Route 
            path="change-user" 
            element={isAuthenticated ? ( 
              <ChangeUser setisAuthenticated={setIsAuthenticated} setLoading={setLoading} /> 
              ) :( 
              <Navigate to="/" />)
              } />

          <Route
            path="/change-password"
            element={
              isAuthenticated ? (
                <ChangePassword setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

        </Routes>
        
      </BrowserRouter>
      
    </UserProvider>
  );
}

export default App;