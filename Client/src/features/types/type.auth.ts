import type { ReactNode } from "react"
import type {  LoginData, RegisterData } from "./type.user"

export interface User{
    id:string
    name:string
    email:string
}

export interface UseAuthReturn{
    loading:boolean
    setLoading:(loading:boolean) => void
    error:string
    succes:string
    register:(useData: RegisterData) => Promise<void>
    login:(credentials: LoginData) => Promise<void>
    logout: () => Promise<void>
    setError: (error: string) => void;
    setSuccess: (success: string) => void;

}

export interface UserContextType{
    user: User | null
    setUser:(user:User | null) => void
    fetchUserData:() => Promise<void>
    error:string
}

export interface UserProviderProps{
    children:ReactNode
    isAuthenticated: boolean | null
}

export interface AuthenticatedProps{
  isAuthenticated?: boolean | null  
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>  
}