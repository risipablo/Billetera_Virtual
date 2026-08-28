// components/ListadoCard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Undo, Delete, Plus, Pencil, X } from "lucide-react";
import { Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import type {  ListadoCardProps } from "../types/type.listado";
import { ListadoItem } from "./listadoItem";
import { MoreVert } from "@mui/icons-material";

export const ListadoCard = ({
    list,
    onToggleComplete,
    onDelete,
    onAddItem,
    onToggleItem,
    onDeleteItem,
    onEditItem,
    onEditList,
}: ListadoCardProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [newItemText, setNewItemText] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        titulo: list.titulo,
        fecha: list.fecha,
        descripcion: list.descripcion,
    });

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddItem = () => {
        if (newItemText.trim()) {
            onAddItem(list._id!, newItemText.trim());
            setNewItemText('');
        }
    };

    const handleEditList = () => {
        onEditList(list._id!, { titulo: editFormData.titulo, fecha: editFormData.fecha });
        setShowEditModal(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', { timeZone: 'UTC' });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: list.completed ? 1 : 1.01 }}
            >
                <Card
                    className={`listado-card ${list.completed ? 'completed' : 'active'}`}
                    sx={{
                        borderRadius: 2,
                        border: '2px solid rgba(105, 104, 104, 0.3)',
                        boxShadow: "0 4px 8px 0 rgba(56, 56, 56, 0.3)",
                        opacity: list.completed ? 0.85 : 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    className={`listado-title ${list.completed ? 'completed' : ''}`}
                                    sx={{
                                        fontWeight: 'bold',
                                        textDecoration: list.completed ? 'line-through' : 'none',
                                        color: list.completed ? '#757575' : 'inherit',
                                    }}
                                >
                                    {list.titulo}
                                </Typography>
                                <Typography variant="body2" sx={{ color: list.completed ? '#757575' : 'inherit' }}>
                                    {formatDate(list.fecha)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title={list.completed ? "Deshacer" : "Completar"} arrow>
                                    <IconButton
                                        color={list.completed ? "success" : "primary"}
                                        onClick={() => onToggleComplete(list._id!)}
                                        size="small"
                                    >
                                        {list.completed ? <Undo size={18} /> : <Check size={18} />}
                                    </IconButton>
                                </Tooltip>

                                <IconButton onClick={handleMenuOpen} size="small">
                                    <MoreVert fontSize="small" />
                                </IconButton>

                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            setEditFormData({
                                                titulo: list.titulo,
                                                fecha: list.fecha,
                                                descripcion: list.descripcion,
                                            });
                                            setShowEditModal(true);
                                        }}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <Pencil size={16} /> Editar
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            onDelete(list._id!);
                                        }}
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <Delete size={16} color="red" /> Eliminar
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        
                        <div className="listado-items">
                            {Array.isArray(list.descripcion) && list.descripcion.map((item, index) => (
                                <ListadoItem
                                    key={index}
                                    item={item}
                                    index={index}
                                    listId={list._id!}
                                    isListCompleted={list.completed || false}
                                    onToggle={onToggleItem}
                                    onDelete={onDeleteItem}
                                    onEdit={onEditItem}
                                />
                            ))}
                        </div>

                        
                        {!list.completed && (
                            <Box className="listado-add-item" sx={{ mt: 'auto', pt: 2 }}>
                                <div className="listado-add-item-row">
                                    <input
                                        type="text"
                                        className="listado-input-small"
                                        placeholder="Nuevo artículo..."
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                    />
                                    <button
                                        className="listado-btn-add-item"
                                        onClick={handleAddItem}
                                        disabled={!newItemText.trim()}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </motion.div>


            {showEditModal && (
                <div className="form-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h3>Editar listado</h3>
                            <button className="form-modal-close" onClick={() => setShowEditModal(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        <div className="form-modal-body">
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    className="listado-input"
                                    value={editFormData.titulo}
                                    onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    className="listado-input"
                                    value={editFormData.fecha}
                                    onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="task-modal-actions">
                            <button className="task-btn task-btn-primary" onClick={handleEditList}>
                                <Plus size={18} />
                                Guardar cambios
                            </button>
                            <button className="task-btn task-btn-secondary" onClick={() => setShowEditModal(false)}>
                                <X size={18} />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};