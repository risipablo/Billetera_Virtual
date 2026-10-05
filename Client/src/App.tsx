import { useEffect, useState, useCallback } from "react";
import { createHead, UnheadProvider } from '@unhead/react/client';
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
import { GastosProvider } from "./context/gastosContext";
import { CuotasProvider } from "./context/useCuotasContext";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/changePassword";

const serverFront = config.Api;
const MIN_SPLASH = 1200;
const head = createHead()

type SplashMode = "welcome" | "loading";

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

        window.addEventListener("popstate", checkAuth);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("popstate", checkAuth);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [checkAuth]);

    const isCallbackPath = window.location.pathname === "/auth/callback";

    return (
        <UnheadProvider head={head}>
            <BrowserRouter>
            {isCallbackPath ? (
                <Routes>
                    <Route
                        path="/auth/callback"
                        element={<CallbackPage setIsAuthenticated={setIsAuthenticated} />}
                    />
                </Routes>
            ) : (
                <UserProvider isAuthenticated={isAuthenticated}>
                    {isAuthenticated === null || loading ? (
                        <SplashLoader mode={splashMode} />
                    ) : isAuthenticated ? (
                        <GastosProvider isAuthenticated={isAuthenticated}>
                            <CuotasProvider isAuthenticated={isAuthenticated}>
                                <Navbar  setIsAuthenticated={setIsAuthenticated} />
                                <Home
                                    isAuthenticated={isAuthenticated}
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                            </CuotasProvider>
                        </GastosProvider>
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
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route
                                path="/reset-password"
                                element={<ResetPasswordPage setIsAuthenticated={setIsAuthenticated} />}
                            />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    )}
                </UserProvider>
            )}
            </BrowserRouter>
        </UnheadProvider>
        
    );
}

export default App;