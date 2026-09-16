import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../../config/axiosConfig';
import type {
    CrearMetaPayload,
    EditarMetaPayload,
    AportePayload,
    EstadoMeta,
    UseMetasReturn,
    IMeta
} from '../types/type.meta';

const BASE = '/api/metas';

export const useMetas = (): UseMetasReturn => {
    const [metas, setMetas] = useState<IMeta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchMetas = useCallback(async (estado?: EstadoMeta) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axiosInstance.get<IMeta[]>(BASE, {
                params: estado ? { estado } : undefined
            });
            setMetas(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearMeta = async (payload: CrearMetaPayload): Promise<IMeta> => {
        setError('');
        try {
            const { data } = await axiosInstance.post<IMeta>(BASE, payload);
            setMetas(prev => [data, ...prev]);
            return data;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        }
    };

    const editarMeta = async (id: string, payload: EditarMetaPayload): Promise<IMeta> => {
        setError('');
        try {
            const { data } = await axiosInstance.patch<IMeta>(`${BASE}/${id}`, payload);
            setMetas(prev => prev.map(m => (m._id === id ? data : m)));
            return data;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        }
    };

    const eliminarMeta = async (id: string): Promise<void> => {
        setError('');
        try {
            await axiosInstance.delete(`${BASE}/${id}`);
            setMetas(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            setError((err as Error).message);
            throw err;
        }
    };

    const agregarAporte = async (metaId: string, payload: AportePayload): Promise<IMeta> => {
        setError('');
        try {
            const { data } = await axiosInstance.post<IMeta>(
                `${BASE}/${metaId}/aportes`,
                payload
            );
            setMetas(prev => prev.map(m => (m._id === metaId ? data : m)));
            return data;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        }
    };

    const eliminarAporte = async (metaId: string, aporteId: string): Promise<IMeta> => {
        setError('');
        try {
            const { data } = await axiosInstance.delete<IMeta>(
                `${BASE}/${metaId}/aportes/${aporteId}`
            );
            setMetas(prev => prev.map(m => (m._id === metaId ? data : m)));
            return data;
        } catch (err) {
            setError((err as Error).message);
            throw err;
        }
    };

    useEffect(() => {
        fetchMetas();
    }, [fetchMetas]);

    return {
        metas,
        loading,
        error,
        fetchMetas,
        crearMeta,
        editarMeta,
        eliminarMeta,
        agregarAporte,
        eliminarAporte,
        setError
    };
};