
import axios from 'axios';
import { config } from '../../component/variables/config';
const serverFront = config.apiUrl;

// Otra manera de exportar los métodos dentro de un objeto


const gastoService = {
    getGastos: async (token) => {
        const response = await axios.get(`${serverFront}/api/gasto`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    },

    addGasto: async (gasto, token) => {
        const response = await axios.post(`${serverFront}/api/gasto`, gasto, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    },

    deleteGasto: async (id, token) => {
        const response = await axios.delete(`${serverFront}/api/gasto/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    },

    editGasto: async (id, gasto, token) => {
        const response = await axios.patch(`${serverFront}/api/gasto/${id}`, gasto, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    }
}

export default gastoService;
