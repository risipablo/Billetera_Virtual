
import { useState } from 'react';
import type { CuotaItemProps } from '../types/type.cuotas';
import Tooltip from '@mui/material/Tooltip';
import { Check, X, Delete, Edit, Save } from 'lucide-react';
import { formatDate } from '../../gastos/utils/dateutils';

export const CuotaItem = ({
    descripcion,
    fecha,
    precio,
    index,
    notaId,
    isCompleted = false,
    onToggle,
    onDelete,
    onEdit,
}: CuotaItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        descripcion,
        fecha,
        precio
    });

    const handleEdit = () => {
        setEditData({ descripcion, fecha, precio });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editData.descripcion.trim() && editData.fecha && editData.precio > 0) {
            onEdit(notaId, index, editData);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="nota-item-editing">
                <input
                    type="text"
                    className="nota-input-small"
                    value={editData.descripcion}
                    onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                    placeholder="Descripción"
                />
                <input
                    type="date"
                    className="nota-input-small"
                    value={editData.fecha}
                    onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                />
                <input
                    type="number"
                    className="nota-input-small"
                    value={editData.precio}
                    onChange={(e) => setEditData({ ...editData, precio: Number(e.target.value) })}
                    placeholder="Precio"
                />
                <div className="nota-item-actions">
                    <Tooltip title="Guardar" arrow>
                        <button className="nota-btn-save" onClick={handleSave}>
                            <Save size={16} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Cancelar" arrow>
                        <button className="nota-btn-cancel" onClick={handleCancel}>
                            <X size={16} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div className={`nota-item ${isCompleted ? 'completed' : ''}`}>
            <button
                className={`nota-item-toggle ${isCompleted ? 'checked' : ''}`}
                onClick={() => onToggle(notaId, index)}
                aria-label={isCompleted ? 'Desmarcar' : 'Marcar completado'}
            >
                {isCompleted && <Check size={14} />}
            </button>

            <div className="nota-item-content">
                <span className={`nota-item-text ${isCompleted ? 'text-completed' : ''}`}>
                    {descripcion}
                </span>
                <span className="nota-item-precio">${precio.toLocaleString('es-AR')}</span>
                {fecha && (
                    <span className="nota-item-fecha">{formatDate(fecha)}</span>
                )}
            </div>

            <div className="nota-item-actions">
                <Tooltip title="Editar" arrow>
                    <button className="nota-btn-edit" onClick={handleEdit}>
                        <Edit size={14} />
                    </button>
                </Tooltip>
                <Tooltip title="Eliminar" arrow>
                    <button className="nota-btn-delete" onClick={() => onDelete(notaId, index)}>
                        <Delete size={14} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};