import axios, { AxiosError } from "axios";
import { config } from "../config";
import type { ApiError, AuthResponse, LoginData, RegisterData } from "../features/types/type.user";

const serverFront = config.Api

class AuthService{

    async register(userData: RegisterData):Promise<AuthResponse>{
        try{
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/register`, userData)
            return response.data
        
        } catch (err){
            this.handleError(err as AxiosError<ApiError>)
        }
    }

    async login(credentials: LoginData): Promise<AuthResponse>{
        try{
            const response = await axios.post<AuthResponse>(`${serverFront}/api/auth/login`, credentials)

            if(response.data.token){
                localStorage.setItem('token', response.data.token)
            }
            return response.data
        
        }catch(error){
            this.handleError(error as AxiosError<ApiError>)
        }
    }

    async logout():Promise<void>{
        try{
            const token = this.getToken()

            await axios.post(`${serverFront}/api/auth/logout`,{},{
                headers:{
                    Authorization: `Bearer ${token}`
                },
                withCredentials:true
            })
            localStorage.removeItem('token')
        } catch(error){
            console.error('Error en cerrar la sesion',error)
            localStorage.removeItem('token')
        }
    }

    getToken():string | null{
        return localStorage.getItem('token')
    }

    private handleError(error: AxiosError<ApiError>):never{
        if (error.response){
            throw new Error(error.response.data?.error || 'Error en la solicitud')
        } else if (error.request){
            throw new Error('El servidor no respondio. Intenta más tarde.')
        } else {
            throw new Error('Error al enviar la solicitud')
        }
    }
}

    
export default new AuthService()