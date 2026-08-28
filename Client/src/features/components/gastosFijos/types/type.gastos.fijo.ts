
export interface IGastosFijo {
    _id?: string;
    nombre: string;
    monto: number;
    dia: number;        
    categoria: string;
    estado: 'activo';
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface GastoFijoItemProps {
    gasto: IGastosFijo;
    onEdit: (gasto: IGastosFijo) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

export interface GastosFijosModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: IGastosFijo;
    isEditing?: boolean;
}