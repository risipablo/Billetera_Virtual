import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/user/login';
import Register from './component/user/register';
import Gastos from './component/gastos/gastos'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
