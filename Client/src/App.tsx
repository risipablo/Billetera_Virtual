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

const serverFront = config.Api;
const MIN_SPLASH = 1200; 

type SplashMode = "welcome" | "loading" | "logout";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [splashMode, setSplashMode] = useState<SplashMode>("loading");

    const isCallbackPath = window.location.pathname === "/auth/callback";

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("token");

        
        if (!token) {
            setSplashMode("welcome");
        } else {
            setSplashMode("loading");
        }

        const validationPromise = (async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                await axiosInstance.get(`${serverFront}/api/auth/validate-token`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
            }
        })();

        const minDelayPromise = new Promise<void>((resolve) =>
            setTimeout(resolve, MIN_SPLASH)
        );

        await Promise.all([validationPromise, minDelayPromise]);
        setLoading(false);
    }, []);

    useEffect(() => {
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

    if ((isAuthenticated === null || loading) && !isCallbackPath) {
        return <SplashLoader mode={splashMode} />;
    }

    return (
        <BrowserRouter>
            <UserProvider isAuthenticated={isAuthenticated}>
                {isAuthenticated ? (
                    <>
                        <Navbar setIsAuthenticated={setIsAuthenticated}/>
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
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;