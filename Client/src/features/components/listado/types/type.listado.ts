// types/type.listado.ts
export interface INota {
    text: string;
    completed: boolean;
}

export interface IListado {
    _id?: string;
    titulo: string;
    fecha: string;
    descripcion: (string | INota)[];
    completed?: boolean;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ListadoFormProps {
    formData: IListado;
    setFormData: React.Dispatch<React.SetStateAction<IListado>>;
    onSubmit: () => void;
    isLoading?: boolean;
}

export interface ListadoItemProps {
    item: string | INota;
    index: number;
    listId: string;
    isListCompleted?: boolean;
    onToggle: (listId: string, index: number) => void;
    onDelete: (listId: string, index: number) => void;
    onEdit: (listId: string, index: number, text: string) => void;
}

export interface ListadoCardProps {
    list: IListado;
    onToggleComplete: (id: string) => void;
    onDelete: (id: string) => void;
    onAddItem: (id: string, text: string) => void;
    onToggleItem: (listId: string, index: number) => void;
    onDeleteItem: (listId: string, index: number) => void;
    onEditItem: (listId: string, index: number, text: string) => void;
    onEditList: (id: string, data: { titulo: string; fecha: string }) => void;
}