import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User, UserContextType, UserProviderProps } from "../features/types/type.auth";
import axiosInstance from "../config/axiosConfig";
import React from "react";


export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<UserProviderProps> = ({children, isAuthenticated}) => {

    const [user,setUser] = useState<User | null>(null)
    const [error,setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem('token')
        
           if (!token) {
            setUser(null)
            return
        }


        try{
            const response = await axiosInstance.get('/api/auth/name')
            setUser(response.data.user)
        } catch(err){
            console.error(err)
            setError(' Error con los datos del usuario')
        }  finally {
            setLoading(false)
        }
    },[])

    useEffect(() => {
        if(isAuthenticated){
            fetchUserData()
        }
    },[isAuthenticated, fetchUserData])

    const value = useMemo<UserContextType>(() => ({
        fetchUserData,
        error,
        user,
        setUser,
        loading 
    }), [fetchUserData, error, user, setUser, loading])

    return React.createElement(
        UserContext.Provider,
        {value},
        children
        
    )

}