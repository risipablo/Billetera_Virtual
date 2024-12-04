import React, {  useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './component/user/userContext';
import Loader from "./component/loader/loader"
import Login from './pages/login/login'
import Register from "./pages/register/register"
import Convertidor from './pages/convertidor/convertidor'
import Charts from "./pages/chartPage/charts"
import Gastos from "./pages/gastos/gastos"
import {Navbar} from "./component/nav/navbar"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState (false)


  return (
    <UserProvider>
      <BrowserRouter>

      {loading && <Loader/>}
    

      { !loading && isAuthenticated && < Navbar setIsAuthenticated={setIsAuthenticated}/>}
      
     

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

          <Route path="/convertidor" element={isAuthenticated ? <Convertidor/>  : <Navigate to="/" />} />

          <Route path="/charts" element={isAuthenticated ? <Charts /> : <Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;