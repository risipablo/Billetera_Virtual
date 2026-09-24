


export interface ICuota {
    _id?: string;
    titulo: string;
    cuotas: number;
    montoTotal: number;
    fechaCompra: string;
    categoria:string; 
    descripcion: string[];
    precio: number[];
    fecha: string[];
    completedItems: boolean[];
    completed?: boolean;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CuotaFormData {
    titulo: string;
    cuotas: string;
    monto: string;
    fecha: string;
    fechaPrimeraCuota: string;
    categoria:string
}

export interface CuotaFormProps {
    formData: CuotaFormData;
    setFormData: React.Dispatch<React.SetStateAction<CuotaFormData>>;
    onSubmit: () => void;
    isLoading?: boolean;
}

export interface CuotaCardProps {
    cuota: ICuota;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, data: {
        titulo: string;
        cuotas: number;
        montoTotal: number;
        fecha: string;
        fechaPrimeraCuota: string;
        categoria: string;
    }) => void;
    onAddItem: (id: string, data: { descripcion: string; fecha: string; precio: number }) => void;
    onToggleItem: (id: string, index: number) => void;
    onDeleteItem: (id: string, index: number) => void;
    onEditItem: (id: string, index: number, data: { descripcion: string; fecha: string; precio: number,  fechaPrimeraCuota: string;}) => void;
}

export interface CuotaItemProps {
    descripcion: string;
    fecha: string;
    precio: number;
    categoria:string;
    index: number;
    notaId: string;
    isCompleted?: boolean;
    onToggle: (notaId: string, index: number) => void;
    onDelete: (notaId: string, index: number) => void;
    onEdit: (notaId: string, index: number, data: { descripcion: string; fecha: string; precio: number, fechaPrimeraCuota: string; }) => void;
}

export type EstadoVencimiento = 'completada' | 'vencida' | 'vence-hoy' | 'por-vencer' | 'normal';

export interface InfoVencimiento {
    estado: EstadoVencimiento;
    fecha: Date | null;
    diasRestantes: number;
    texto: string;
    color: string;
    icono: string;
}


export interface CuotaPendiente {
    cuotaId?: string;
    titulo: string;
    categoria?: string;
    numeroCuota: number;
    totalCuotas: number;
    fecha: string;
    precio: number;
    isCompleted: boolean;
}

export interface CuotaPagadaMes {
    cuotaId?: string;
    titulo: string;
    categoria?: string;
    numeroCuota: number;
    totalCuotas: number;
    fecha: string;
    precio: number;
    isCompleted: boolean;
}

export interface CuotaVencida {
    cuotaId?: string;
    titulo: string;
    categoria?: string;
    numeroCuota: number;
    totalCuotas: number;
    fecha: string;
    precio: number;
    diasVencida: number;
}

export interface CuotasProviderProps {
    children: React.ReactNode
    isAuthenticated: boolean | null;
}

export interface CuotasContextType {
    cuotas: ICuota[];
    filteredCuotas: ICuota[];
    setCuotas: React.Dispatch<React.SetStateAction<ICuota[]>>;
    setFilteredCuotas: React.Dispatch<React.SetStateAction<ICuota[]>>;
    loading: boolean;
    addCuotas: (data: { titulo: string; cuotas: number; monto: number; fecha: string; fechaPrimeraCuota: string; categoria: string }) => Promise<ICuota>;
    editCuota: (id: string, data: { titulo: string; cuotas: number; montoTotal: number; fecha: string; fechaPrimeraCuota: string; categoria: string }) => Promise<ICuota | void>;
    deleteCuota: (id: string) => Promise<void>;
    toggleCompleteCuota: (id: string) => Promise<ICuota | void>;
    addCuotaItem: (id: string, data: { descripcion: string; fecha: string; precio: number }) => Promise<ICuota | void>;
    deleteCuotaItem: (id: string, index: number) => Promise<void>;
    deleteFilteredCuotas: (ids: string[]) => Promise<unknown>;
    allDeleteCuotas: () => void;
    editCuotaItem: (id: string, index: number, data: { descripcion: string; fecha: string; precio: number }) => Promise<ICuota | void>;
    toggleCompleteItem: (id: string, index: number) => Promise<ICuota | void>;
    proximaCuota: () => CuotaPendiente | null;
    cuotasPorVencer: (dias?: number) => CuotaPendiente[];
    cuotasVencidas: () => CuotaVencida[];
    cuotasPagadasDelMes: () => CuotaPagadaMes[];
}