import { useState } from "react";
import type { UseAuthReturn } from "../types/type.auth";
import { useUser } from "./useUser";
import { useNavigate } from "react-router-dom";
import authService from "../../service/authService";
import type { ChangeUserName, LoginData, RegisterData, ResetPasswordData, VerifyEmailData } from "../types/type.user";

export const UseAuth = (): UseAuthReturn => {
    const { fetchUserData, setUser } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const navigate = useNavigate();

    const register = async (userData: RegisterData): Promise<void> => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await authService.register(userData);
            setSuccess(data.message || 'Registro exitoso. Bienvenido ');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginData): Promise<void> => {
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(credentials);
            setSuccess(data.message || 'Login exitoso');
            await fetchUserData();
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changeName = async (credentials: ChangeUserName): Promise<void> => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {

            const token = localStorage.getItem('token');
            if (!token) {
            throw new Error('No estás autenticado. Inicia sesión primero.');
            }

            const data = await authService.changeName(credentials);
            setSuccess(data.message || 'Cambio de nombre del usuario exitoso');
            
            await fetchUserData();

            setTimeout(() => {
                navigate('/perfil');
            }, 500);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar el nombre';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async(credentials:ResetPasswordData) :Promise<void> => {
        setLoading(true)
        setError('')

        try{
            const data = await authService.changePassword(credentials)
            setSuccess(data.message || 'Cambio de nombre de contraseña exitoso')

            localStorage.removeItem('token')
            navigate('/login')
        } catch (err){
            setError((err as Error).message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const verifyEmail = async(credentials: VerifyEmailData): Promise<void> => {
        setLoading(true)
        setError('')

        try{
            const data = await authService.VerifyEmail(credentials)
            setSuccess(data.message || 'Cambio de nombre de contraseña exitoso')
            
        } catch (err){
            setError((err as Error).message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        setLoading(true);

        try {
            await authService.logout();
            setUser(null);
            navigate('/login');
        } catch (err) {
            console.error('error en logout', err);
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        login,
        loading,
        setLoading,
        error,
        changeName,
        changePassword,
        verifyEmail,
        logout,
        setError,
        setSuccess,
        succes: success,
    };
};