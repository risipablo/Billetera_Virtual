
import { useState } from "react";
import { Check, Delete, Edit, Save, Cancel } from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import type { ListadoItemProps } from "../types/type.listado";

export const ListadoItem = ({
    item,
    index,
    listId,
    isListCompleted = false,
    onToggle,
    onDelete,
    onEdit,
}: ListadoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');

    const isCompleted = typeof item === 'object' ? item.completed : false;
    const text = typeof item === 'object' ? item.text : item;

    const handleEdit = () => {
        setEditText(text);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editText.trim()) {
            onEdit(listId, index, editText.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditText('');
    };

    if (isEditing) {
        return (
            <div className="listado-item-editing">
                <TextField
                    fullWidth
                    size="small"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                />
                <div className="listado-item-actions">
                    <Tooltip title="Guardar" arrow>
                        <IconButton onClick={handleSave} size="small" color="success">
                            <Save fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar" arrow>
                        <IconButton onClick={handleCancel} size="small" color="error">
                            <Cancel fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div className={`listado-item ${isCompleted ? 'completed' : ''} ${isListCompleted ? 'parent-completed' : ''}`}>
            <button
                className={`listado-item-toggle ${isCompleted ? 'checked' : ''}`}
                onClick={() => onToggle(listId, index)}
                disabled={isListCompleted}
                aria-label={isCompleted ? 'Desmarcar' : 'Marcar completado'}
            >
                {isCompleted && <Check fontSize="small" />}
            </button>

            <span className={`listado-item-text ${isCompleted || isListCompleted ? 'text-completed' : ''}`}>
                {text}
            </span>

            {!isListCompleted && (
                <div className="listado-item-actions">
                    <Tooltip title="Editar" arrow>
                        <IconButton onClick={handleEdit} size="small" color="primary">
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar" arrow>
                        <IconButton onClick={() => onDelete(listId, index)} size="small" color="error">
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};