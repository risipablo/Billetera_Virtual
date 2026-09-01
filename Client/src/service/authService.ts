import axios, { AxiosError } from "axios";
import { config } from "../config";
import type { ApiError, AuthResponse, ChangeUserName, LoginData, RegisterData } from "../features/types/type.user";

const serverFront = config.Api;

class AuthService {
    async register(userData: RegisterData): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/register`, userData);
            return response.data;
        } catch (err) {
            throw this.handleError(err as AxiosError<ApiError>);
        }
    }

    async login(credentials: LoginData): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/login`, credentials);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError<ApiError>);
        }
    }

    async changeName(credentials: ChangeUserName): Promise<AuthResponse> {
        try {
            
            const token = this.getToken();
            console.log('Token:', token);
    
            const response = await axios.post<AuthResponse>(
                `${serverFront}/api/auth/change-user`,
                { 
                    newName: credentials.newName.trim() 
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError<ApiError>);
        }
    }

    async logout(): Promise<void> {
        try {
            const token = this.getToken();

            if (token) {
                await axios.post(`${serverFront}/api/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
            }
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Error en cerrar la sesion', error);
            localStorage.removeItem('token');
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private handleError(error: AxiosError<ApiError>): Error {
        if (error.response) {
            const errorMessage = error.response.data?.error || 'Error en la solicitud';
            const statusCode = error.response.status;
            
            if (statusCode === 401) {
                return new Error('Email incorrecto o no autorizado');
            } else if (statusCode === 403) {
                return new Error('No tienes permiso para realizar esta acción');
            } else if (statusCode === 404) {
                return new Error('Usuario no encontrado');
            } else if (statusCode === 400) {
                return new Error(errorMessage || 'Datos inválidos');
            }
            
            return new Error(errorMessage);
        } else if (error.request) {
            return new Error('El servidor no respondió. Intenta más tarde');
        } else {
            return new Error('Error al enviar la solicitud');
        }
    }
}

export default new AuthService();