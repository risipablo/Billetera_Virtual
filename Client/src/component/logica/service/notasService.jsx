import axios from "axios";


// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";


export const getNotas = async (token) => {
    try{
        const response = await axios.get(`${serverFront}/api/note`,
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
        return response.data;
    } catch (error) {
        console.error('Error de Axios:', error);
        return [];
    }
}

export const addNotas = async (nota,token) => {
    try{
        const response = await axios.post(`${serverFront}/api/note`, nota,
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
        return response.data;
    } catch (error) {
        console.error('Error de Axios:', error);
        return [];
    }
}