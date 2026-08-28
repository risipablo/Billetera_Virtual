
import { useState, useEffect, useCallback } from "react";

import type { IListado } from "../types/type.listado";
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

export const useListado = () => {
    const [list, setList] = useState<IListado[]>([]);
    const [loading, setLoading] = useState(true);

    const loadList = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/list');
            setList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al cargar listados:', error);
            toast.error('Error al cargar listados', TOAST_CONFIG);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadList();
    }, [loadList]);

    const addList = useCallback(async (titulo: string, fecha: string) => {
        if (!titulo.trim() || !fecha) {
            toast.error('Título y fecha son requeridos', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/list', { titulo, fecha });
            setList(prev => [...prev, response.data]);
            toast.success('Listado creado exitosamente', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al crear listado:', error);
            toast.error('Error al crear listado', TOAST_CONFIG);
        }
    }, []);

    const editList = useCallback(async (id: string, data: { titulo: string; fecha: string }) => {
        if (!data.titulo.trim() || !data.fecha) {
            toast.error('Título y fecha son requeridos', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.patch(`/api/list/${id}`, data);
            setList(prev => prev.map(item => item._id === id ? response.data : item));
            toast.success('Listado actualizado', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al editar listado:', error);
            toast.error('Error al editar listado', TOAST_CONFIG);
        }
    }, []);

    const deleteList = useCallback(async (id: string) => {
        try {
            await axiosInstance.delete(`/api/list/${id}`);
            setList(prev => prev.filter(item => item._id !== id));
            toast.success('Listado eliminado', TOAST_CONFIG);
        } catch (error) {
            console.error('Error al eliminar listado:', error);
            toast.error('Error al eliminar listado', TOAST_CONFIG);
        }
    }, []);

    const deleteAllList = useCallback(async () => {
        try {
            await axiosInstance.delete('/api/list');
            setList([]);
            toast.success('Todos los listados eliminados', TOAST_CONFIG);
        } catch (error) {
            console.error('Error al eliminar todos:', error);
            toast.error('Error al eliminar todos', TOAST_CONFIG);
        }
    }, []);

    const addListNote = useCallback(async (listId: string, text: string) => {
        if (!text.trim()) {
            toast.error('El artículo no puede estar vacío', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/list/${listId}/item`, { text });
            setList(prev => prev.map(item => 
                item._id === listId ? response.data : item
            ));
            toast.success('Artículo agregado', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al agregar artículo:', error);
            toast.error('Error al agregar artículo', TOAST_CONFIG);
        }
    }, []);

    const deleteNoteItem = useCallback(async (listId: string, index: number) => {
        try {
            const response = await axiosInstance.delete(`/api/list/${listId}/item/${index}`);
            setList(prev => prev.map(item => 
                item._id === listId ? response.data : item
            ));
            toast.success('Artículo eliminado', TOAST_CONFIG);
        } catch (error) {
            console.error('Error al eliminar artículo:', error);
            toast.error('Error al eliminar artículo', TOAST_CONFIG);
        }
    }, []);

    const editNoteItem = useCallback(async (listId: string, index: number, text: string) => {
        if (!text.trim()) {
            toast.error('El artículo no puede estar vacío', TOAST_CONFIG);
            return;
        }

        try {
            const response = await axiosInstance.patch(`/api/list/${listId}/item/${index}`, { text });
            setList(prev => prev.map(item => 
                item._id === listId ? response.data : item
            ));
            toast.success('Artículo actualizado', TOAST_CONFIG);
            return response.data;
        } catch (error) {
            console.error('Error al editar artículo:', error);
            toast.error('Error al editar artículo', TOAST_CONFIG);
        }
    }, []);

    const toggleCompleteList = useCallback(async (listId: string) => {
        try {
            const response = await axiosInstance.patch(`/api/list/${listId}/toggle`);
            setList(prev => prev.map(item => 
                item._id === listId ? response.data : item
            ));
            return response.data;
        } catch (error) {
            console.error('Error al completar listado:', error);
            toast.error('Error al completar listado', TOAST_CONFIG);
        }
    }, []);

    const toggleCompleteItem = useCallback(async (listId: string, index: number) => {
        try {
            const response = await axiosInstance.patch(`/api/list/${listId}/item/${index}/toggle`);
            setList(prev => prev.map(item => 
                item._id === listId ? response.data : item
            ));
            return response.data;
        } catch (error) {
            console.error('Error al completar artículo:', error);
            toast.error('Error al completar artículo', TOAST_CONFIG);
        }
    }, []);

    return {
        list,
        loading,
        addList,
        editList,
        deleteList,
        deleteAllList,
        addListNote,
        deleteNoteItem,
        editNoteItem,
        toggleCompleteList,
        toggleCompleteItem,
    };
};