// hooks/useFijo.ts
import { useCallback, useEffect, useState } from "react";
import type { IGastosFijo } from "../types/type.gastos.fijo";
import axiosInstance from "../../../../config/axiosConfig";
import toast from "react-hot-toast";

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500,
    style: {
        background: "#0C447C",
        color: "#fff",
    }
};

export const UseFijo = () => {
    const [fijo, setFijo] = useState<IGastosFijo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFijo = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/api/fijo');
            setFijo(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error al cargar gastos fijos:', err);
            setFijo([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFijo();
    }, [loadFijo]);

    const addFijo = useCallback(async (fijoData: {
        dia: number;
        nombre: string;
        monto: number;
        categoria: string;
        estado: string;
    }) => {
        const { dia, nombre, monto, categoria, estado } = fijoData;

        if (!dia || !nombre || !monto || !categoria || !estado) {
            toast.error('Todos los campos son requeridos', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/fijo', {
                dia,
                nombre,
                monto,
                categoria,
                estado
            });

            setFijo(prev => [...prev, response.data]);
            toast.success('Gasto fijo agregado exitosamente', TOAST_CONFIG);
            return response.data;
        } catch (err: any) {
            console.error('Error al agregar:', err);
            toast.error(err.response?.data?.error || 'Error al agregar el gasto fijo', TOAST_CONFIG);
            throw err;
        }
    }, []);

    const editFijo = useCallback((id: string, editData: any) => {
        axiosInstance.patch(`/api/fijo/${id}`, editData)
            .then(response => {
                setFijo(prev => prev.map(item => item._id === id ? response.data : item));
                toast.success('Gasto fijo modificado', TOAST_CONFIG);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al guardar el gasto fijo', TOAST_CONFIG);
            });
    }, []);

    const deleteFijo = useCallback((id: string) => {
        axiosInstance.delete(`/api/fijo/${id}`)
            .then(() => {
                setFijo(prev => prev.filter(item => item._id !== id));
                toast.success('Gasto fijo eliminado', TOAST_CONFIG);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al eliminar el gasto fijo', TOAST_CONFIG);
            });
    }, []);

    const allDeleteFijos = useCallback(() => {
        axiosInstance.delete('/api/fijo')
            .then(response => {
                setFijo([]);
                toast.success('Todos los gastos fijos han sido eliminados', TOAST_CONFIG);
            })
            .catch(err => {
                console.error(err);
                toast.error('Error al eliminar los gastos fijos', TOAST_CONFIG);
            });
    }, []);

    return {
        fijo,
        setFijo,
        loading,
        addFijo,
        editFijo,
        deleteFijo,
        allDeleteFijos
    };
};