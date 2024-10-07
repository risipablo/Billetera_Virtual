import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/user/login';
import Register from './component/user/register';
import Gastos from './component/gastos/gastos'
import { UserProvider } from './component/user/userContext';
import { Charts } from './component/charts/charts';
import { Navbar } from './component/nav/navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <BrowserRouter>

      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated}/>}
      
        <Routes>
          <Route
            path="/"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/gasto"
            element={isAuthenticated ? <Gastos/> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/charts" element={isAuthenticated ? <Charts /> : <Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
