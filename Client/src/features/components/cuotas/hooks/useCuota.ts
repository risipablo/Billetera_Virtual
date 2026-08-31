
import { useState, useEffect, useCallback } from "react";
import type { ICuota } from "../types/type.cuotas";
import toast from "react-hot-toast";
import axiosInstance from "../../../../config/axiosConfig";

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500,
    style: {
        background: "#0C447C",
        color: "#fff",
    }
};

export const useCuotas = () => {
    const [cuotas, setCuotas] = useState<ICuota[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCuotas = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/note');
            setCuotas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar cuotas:', error);
            toast.error('Error al cargar cuotas', TOAST_CONFIG);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCuotas();
    }, [loadCuotas]);

    
// hooks/useCuotas.ts - CON LOGS COMPLETOS

const addCuotas = useCallback(async (data: {
    titulo: string;
    cuotas: number;
    monto: number;
    fecha: string;
}) => {
    console.log('📤 ===== INICIO addCuotas =====');
    console.log('📤 Datos a enviar:', data);
    console.log('📤 Token:', localStorage.getItem('token') ? '✅ Presente' : '❌ Ausente');

    if (!data.titulo.trim() || !data.cuotas || !data.monto || !data.fecha) {
        console.log('❌ Faltan campos en frontend:', {
            titulo: !data.titulo.trim(),
            cuotas: !data.cuotas,
            monto: !data.monto,
            fecha: !data.fecha,
        });
        toast.error('Todos los campos son requeridos', TOAST_CONFIG);
        return;
    }

    try {
        console.log('📤 Enviando a:', '/api/note');
        console.log('📤 Payload:', {
            titulo: data.titulo.trim(),
            cuotas: data.cuotas,
            monto: data.monto,
            fecha: data.fecha,
        });

        const response = await axiosInstance.post('/api/note', {
            titulo: data.titulo.trim(),
            cuotas: data.cuotas,
            monto: data.monto,
            fecha: data.fecha,
        });

        setCuotas(prev => [...prev, response.data]);
        toast.success('Nota creada exitosamente', TOAST_CONFIG);
        return response.data;

    } catch (error: any) {
        
        toast.error(error.response?.data?.error || 'Error al crear nota', TOAST_CONFIG);
        throw error;
    }
}, []);

    
    const editCuota = useCallback(async (id: string, data: { titulo: string; cuotas: number }) => {
        try {
            const response = await axiosInstance.patch(`/api/note/${id}`, data);
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            toast.success('Nota actualizada', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al editar nota:', error);
            toast.error('Error al editar nota', TOAST_CONFIG);
        }
    }, []);

    
    const deleteCuota = useCallback(async (id: string) => {
        try {
            await axiosInstance.delete(`/api/note/${id}`);
            setCuotas(prev => prev.filter(n => n._id !== id));
            toast.success('Nota eliminada', TOAST_CONFIG);
        } catch (error) {
            console.error('Error al eliminar nota:', error);
            toast.error('Error al eliminar nota', TOAST_CONFIG);
        }
    }, []);

    
    const toggleCompleteCuota = useCallback(async (id: string) => {
        try {
            const response = await axiosInstance.patch(`/api/note/${id}/toggle`);
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            return response.data;
        } catch (error) {
            console.error('Error al completar nota:', error);
            toast.error('Error al completar nota', TOAST_CONFIG);
        }
    }, []);

    
    const addCuotaItem = useCallback(async (id: string, data: {
        descripcion: string;
        fecha: string;
        precio: number;
    }) => {
        if (!data.descripcion.trim() || !data.fecha || !data.precio) {
            toast.error('Todos los campos son requeridos', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/note/${id}/item`, {
                descripcion: data.descripcion.trim(),
                fecha: data.fecha,
                precio: data.precio,
            });
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            toast.success('Cuota agregada', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al agregar cuota:', error);
            toast.error('Error al agregar cuota', TOAST_CONFIG);
        }
    }, []);

    
    const deleteCuotaItem = useCallback(async (id: string, index: number) => {
        try {
            const response = await axiosInstance.delete(`/api/note/${id}/item/${index}`);
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            toast.success('Cuota eliminada', TOAST_CONFIG);
        } catch (error) {
            console.error('Error al eliminar cuota:', error);
            toast.error('Error al eliminar cuota', TOAST_CONFIG);
        }
    }, []);

    const allDeleteCuotas = useCallback(() => {
        axiosInstance.delete('/api/note')
        .then(response => {
            setCuotas([])
            toast.success('Todos las cuotas han sido eliminados', TOAST_CONFIG)
            console.debug(response.data)   
        }) 
         .catch(err => {
            console.error(err)
            toast.error('Error al eliminar las cuotas', TOAST_CONFIG)
        })
    },[setCuotas])


    
    const editCuotaItem = useCallback(async (id: string, index: number, data: {
        descripcion: string;
        fecha: string;
        precio: number;
    }) => {
        try {
            const response = await axiosInstance.patch(`/api/note/${id}/item/${index}`, data);
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            toast.success('Cuota actualizada', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al editar cuota:', error);
            toast.error('Error al editar cuota', TOAST_CONFIG);
        }
    }, []);

    
    const toggleCompleteItem = useCallback(async (id: string, index: number) => {
        try {
            const response = await axiosInstance.patch(`/api/note/${id}/item/${index}/toggle`);
            setCuotas(prev => prev.map(n => n._id === id ? response.data : n));
            return response.data;
        } catch (error) {
            console.error('Error al completar cuota:', error);
            toast.error('Error al completar cuota', TOAST_CONFIG);
        }
    }, []);

    return {
        cuotas,
        loading,
        addCuotas,
        editCuota,
        deleteCuota,
        toggleCompleteCuota,
        addCuotaItem,
        deleteCuotaItem,
        allDeleteCuotas,
        editCuotaItem,
        toggleCompleteItem,
    };
};