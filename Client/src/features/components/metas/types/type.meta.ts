import type { Dispatch, SetStateAction } from 'react';

export type EstadoMeta = 'activa' | 'completada' | 'pausada' | 'cancelada';

export interface IAporte {
    _id: string;
    monto: number;
    fecha: string;
    nota?: string;
}

export interface IMeta {
    _id: string;
    userId: string;
    nombre: string;
    descripcion?: string;
    montoObjetivo: number;
    fecha: string;
    categoria: string;
    estado: EstadoMeta;
    aportes: IAporte[];
    montoActual: number;
    progreso: number;
    createdAt: string;
    updatedAt: string;
}

export interface CrearMetaPayload {
    nombre: string;
    descripcion?: string;
    montoObjetivo: number;
    fecha: string;
    categoria: string;
}

export interface EditarMetaPayload {
    nombre?: string;
    descripcion?: string;
    montoObjetivo?: number;
    fecha?: string;
    categoria?: string;
    estado?: EstadoMeta;
}

export interface AportePayload {
    monto: number;
    nota?: string;
}

export interface MetasFormProps {
    formData: IMeta | null;
    setFormData: Dispatch<SetStateAction<IMeta | null>>;
    onSubmit: () => void | Promise<void>;
    onCancel: () => void;
    Isloading?: boolean;
    isOpen: boolean;
    onOpen: () => void;
    isEdit?: boolean;
}

export interface UseMetasReturn {
    metas: IMeta[];
    loading: boolean;
    error: string;
    fetchMetas: (estado?: EstadoMeta) => Promise<void>;
    crearMeta: (payload: CrearMetaPayload) => Promise<IMeta>;
    editarMeta: (id: string, payload: EditarMetaPayload) => Promise<IMeta>;
    eliminarMeta: (id: string) => Promise<void>;
    agregarAporte: (metaId: string, payload: AportePayload) => Promise<IMeta>;
    eliminarAporte: (metaId: string, aporteId: string) => Promise<IMeta>;
    deleteFilteredMetas: (ids: string[]) => Promise<void>;
    allDeleteMetas: () => void;
    setError: (error: string) => void;
}

export const CATEGORIAS = [
    'Comida', 'Automovil', 'Transporte', 'Vivienda', 'Servicios',
    'Salud', 'Deporte', 'Educacion', 'Accesorios', 'Mascota',
    'Indumentaria', 'Regalo', 'Cosmetica', 'Recital', 'Peluqueria',
    'Tecnologia', 'Donacion', 'Ocio', 'Viajes', 'Ahorro',
    'Supermercado', 'Salidas', 'Otro'
] as const;

export type Categoria = typeof CATEGORIAS[number];