import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/user/login';
import Register from './component/user/register';
import Gastos from './component/gastos/gastos'
import { UserProvider } from './component/user/userContext';
import { Charts } from './component/charts/charts';
import { Navbar } from './component/nav/navbar';
import Loader from './component/loader/loader';
import { Convertidor } from './component/convertidor/convertidor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState (false)


  return (
    <UserProvider>
      <BrowserRouter>

      {loading &&  <Loader />}
    

      { !loading && isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated}/>}
      
     

        <Routes>
       
          <Route
            path="/"
            element={<Login setIsAuthenticated={setIsAuthenticated}  setLoading={setLoading} />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} setLoading={setLoading} />}
          />
          <Route
            path="/gasto"
            element={isAuthenticated ? <Gastos/> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/convertidor" element={isAuthenticated ? <Convertidor/> : <Navigate to="/" />} />

          <Route path="/charts" element={isAuthenticated ? <Charts /> : <Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;