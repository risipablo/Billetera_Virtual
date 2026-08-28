import { useEffect, useState } from "react"
import axiosInstance from "./config/axiosConfig";
import { config } from "./config";
import { Spinner } from "./components/ui/spinner/spinner";
import { UserProvider } from "./context/userProvider";
import { Home } from "./pages/home";
import Navbar from "./components/layout/navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";


const serverFront = config.Api


function App(){
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const isCallbackPath = window.location.pathname === '/auth/callback';

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (window.location.pathname === '/auth/callback') {
            setLoading(false)
            return;
        }

        if(!token){
            setIsAuthenticated(false)
            setLoading(false)
            return
        }

        const validateToken = async() => {
            try{
                await axiosInstance.get(`${serverFront}/api/auth/validate-token`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    },
                    withCredentials: true
                })
                setIsAuthenticated(true)
            } catch (error){
                localStorage.removeItem('token')
                setIsAuthenticated(false)
            } finally{
                setLoading(false)
            }
        }
        validateToken()
    },[isCallbackPath])

    if ((isAuthenticated === null || loading) && !isCallbackPath) {
        return <Spinner />
    }

    return(
        <BrowserRouter>
            <UserProvider isAuthenticated={isAuthenticated}>
                {
                    isAuthenticated ? (
                        <>
                        <Navbar/>
                        <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
                        </>
                        
                    ) : (
                            <Routes>
                            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null} />} />
                            <Route path="/register" element={<RegisterPage setIsAuthenticated={setIsAuthenticated} isAuthenticated={null}/>} />            
                            {/* <Route path="/auth/callback" element={<CallbackPage setIsAuthenticated={setIsAuthenticated} />}/> */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                    )
                }

            </UserProvider>
        </BrowserRouter>
    )

}

export default App