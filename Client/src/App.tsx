import { useEffect, useState, useCallback } from "react";
import axiosInstance from "./config/axiosConfig";
import { config } from "./config";
import { UserProvider } from "./context/userProvider";
import { Home } from "./pages/home";
import Navbar from "./components/layout/navbar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import { SplashLoader } from "./components/ui/spinner/loader";
import CallbackPage from "./pages/auth/callbackPage";

const serverFront = config.Api;
const MIN_SPLASH = 1200;

type SplashMode = "welcome" | "loading" | "logout";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [splashMode, setSplashMode] = useState<SplashMode>("loading");

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("token");
        setSplashMode(token ? "loading" : "welcome");

        const validationPromise = (async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            try {
                await axiosInstance.get(`${serverFront}/api/auth/validate-token`);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        })();

        await Promise.all([
            validationPromise,
            new Promise<void>((r) => setTimeout(r, MIN_SPLASH)),
        ]);
        setLoading(false);
    }, []);

    useEffect(() => {
        
        if (window.location.pathname === '/auth/callback') {
            setLoading(false);
            return;
        }

        checkAuth();

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") checkAuth();
        };
        const handleLogoutStart = () => {
            setSplashMode("logout");
            setLoading(true);
        };

        window.addEventListener("popstate", checkAuth);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("app:logout-start", handleLogoutStart);

        return () => {
            window.removeEventListener("popstate", checkAuth);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("app:logout-start", handleLogoutStart);
        };
    }, [checkAuth]);

    
    return (
        <BrowserRouter>
            <UserProvider isAuthenticated={isAuthenticated}>
                {isAuthenticated === null || loading ? (
                    <SplashLoader mode={splashMode} />
                ) : isAuthenticated ? (
                    <>
                        <Navbar setIsAuthenticated={setIsAuthenticated} />
                        <Home
                            isAuthenticated={isAuthenticated}
                            setIsAuthenticated={setIsAuthenticated}
                        />
                    </>
                ) : (
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <LoginPage
                                    setIsAuthenticated={setIsAuthenticated}
                                    isAuthenticated={null}
                                />
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <RegisterPage
                                    setIsAuthenticated={setIsAuthenticated}
                                    isAuthenticated={null}
                                />
                            }
                        />
                        <Route
                            path="/auth/callback"
                            element={<CallbackPage setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;