
export interface ICuota {
    _id?: string;
    titulo: string;
    cuotas: number;
    montoTotal: number;
    fechaCompra?: string; 
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
    onEdit: (id: string, data: { titulo: string; cuotas: number, montoTotal: number, fecha: string }) => void;
    onAddItem: (id: string, data: { descripcion: string; fecha: string; precio: number }) => void;
    onToggleItem: (id: string, index: number) => void;
    onDeleteItem: (id: string, index: number) => void;
    onEditItem: (id: string, index: number, data: { descripcion: string; fecha: string; precio: number }) => void;
}

export interface CuotaItemProps {
    descripcion: string;
    fecha: string;
    precio: number;
    index: number;
    notaId: string;
    isCompleted?: boolean;
    onToggle: (notaId: string, index: number) => void;
    onDelete: (notaId: string, index: number) => void;
    onEdit: (notaId: string, index: number, data: { descripcion: string; fecha: string; precio: number }) => void;
}