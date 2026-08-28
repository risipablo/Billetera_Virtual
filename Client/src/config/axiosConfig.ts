import axios from "axios";
import { config } from "../config/index";


const axiosInstance = axios.create({
    baseURL: config.Api,
    withCredentials:true
})

axiosInstance.interceptors.request.use((requestConfig) => {
    const token = localStorage.getItem('token')

    if(token){
        requestConfig.headers.Authorization = `Bearer ${token}`
    }

    return requestConfig
    }, (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if(error.response?.status === 401){
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance