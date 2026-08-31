import { Navigate, Route, Routes } from "react-router-dom";
import type { AuthenticatedProps } from "../features/types/type.auth";
import { LoginPage } from "./auth/loginPage";
import GastosPage from "./components/gastosPage";
import RegisterPage from "./auth/registerPage";
import { ConvertidorPage } from "./components/convetidorPage";
import { ConsejosPage } from './components/consejosPage';
import { ListadoPage } from "./components/listado";
import { CuotasPage } from "./components/cuotasPage";
import EstadisticasPage from "./components/estadisticas";
import PerfilPage from "./auth/perfilPage";
import ChangeUserNamePage from "./auth/changeName";



export const Home = ({isAuthenticated, setIsAuthenticated}:AuthenticatedProps) =>{
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    
    return(    
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/gastos" replace/> : <LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null}/>}/> 
                <Route path="/register" element={isAuthenticated ? <RegisterPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null}/> : <Navigate to="/" replace/>}/>
                <Route path="/gastos" element={isAuthenticated ? <GastosPage/> : <Navigate to="/" replace/>}/>
                <Route path="/listado" element={isAuthenticated ? <ListadoPage/> : <Navigate to="/" replace/>}/>
                <Route path="/estadisticas" element={isAuthenticated ? <EstadisticasPage/> : <Navigate to="/" replace/>}/>
                <Route path="/cuotas" element={isAuthenticated ? <CuotasPage/> : <Navigate to="/" replace/>}/>
                <Route path="/convertidor" element={isAuthenticated ? <ConvertidorPage/> : <Navigate to="/" replace/>}/>
                <Route path="/consejos" element={isAuthenticated ? <ConsejosPage/> : <Navigate to="/" replace/>}/>
                <Route path="/perfil" element={isAuthenticated ? <PerfilPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace/>}/>
                 <Route path="/change-user" element={isAuthenticated ? <ChangeUserNamePage setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace/>}/>
                <Route path="*" element={<Navigate to={isAuthenticated ? "/gastos" : "/"} replace/>}/>
            </Routes>
        
        
    )
}


