
import { useState, useMemo } from "react";
import type { CuotaCardProps } from "../types/type.cuotas";
import { Check, ChevronDown, ChevronUp, Delete, Edit, MoreVertical, Plus, Save, Undo, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CuotaItem } from "./cuotaItem";
import { formatDate } from "../../gastos/utils/dateutils";
import { Menu, MenuItem, Tooltip } from "@mui/material";

export const CuotaCard = ({
    cuota,
    onToggleComplete,
    onDelete,
    onEdit,
    onEditItem,
    onAddItem,
    onToggleItem,
    onDeleteItem,
}: CuotaCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        titulo: cuota.titulo,
        cuotas: cuota.cuotas,
        montoTotal: cuota.montoTotal,
        fecha: cuota.fechaCompra || '',
        categoria:cuota.categoria
    });
    const [newItem, setNewItem] = useState({
        descripcion: '',
        fecha: '',
        precio: '',
        categoria:''
    });
    const [showEditModal, setShowEditModal] = useState(false);

    
    const totalCuotas = cuota.cuotas || 0;
    const montoTotal = cuota.montoTotal || 0;

    const montoPorCuota = useMemo(() => {
        if (totalCuotas === 0 || montoTotal === 0) return 0;
        return montoTotal / totalCuotas;
    }, [totalCuotas, montoTotal]);


    const cuotasPagadas = cuota.descripcion?.filter((_, idx) => cuota.completedItems?.[idx])?.length || 0;


    const progresoPct = totalCuotas > 0 ? Math.min(100, Math.round((cuotasPagadas / totalCuotas) * 100)) : 0;

    const totalPagado = useMemo(() => {
        let sum = 0;
        cuota.precio?.forEach((precio, idx) => {
            if (cuota.completedItems?.[idx]) {
                sum += precio;
            }
        });
        return sum;
    }, [cuota.precio, cuota.completedItems]);


    const restantePorPagar = montoTotal - totalPagado;


    // const proximoVencimiento = cuota.fecha?.find((_, idx) => !cuota.completedItems?.[idx]) || cuota.fecha?.[0] || '';

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddItem = () => {
        if (newItem.descripcion.trim() && newItem.fecha && Number(newItem.precio) > 0) {
            
              console.log('Agregando item con fecha:', newItem.fecha);
            
            onAddItem(cuota._id!, {
                descripcion: newItem.descripcion.trim(),
                fecha: newItem.fecha,
                precio: Number(newItem.precio),
            });
            setNewItem({ descripcion: '', fecha: '', precio: '' , categoria:''});
            setIsExpanded(false);
        } else {
            alert('Todos los campos son requeridos');
        }
    };

    const handleSaveEdit = () => {
        if (editData.titulo.trim() && editData.cuotas > 0) {
            onEdit(cuota._id!,
                 { 
                    titulo: editData.titulo, 
                    cuotas: editData.cuotas,
                    montoTotal: editData.montoTotal,
                    fecha: editData.fecha || cuota.fechaCompra || new Date().toISOString().split('T')[0],
                    categoria:editData.categoria
                 });
            setIsEditing(false);
            setShowEditModal(false);
        }
    };

    const handleEditClick = () => {
        setEditData({ titulo: cuota.titulo, cuotas: cuota.cuotas, montoTotal: cuota.montoTotal, fecha: cuota.fecha?.[0] || '', categoria:cuota.categoria });
        setIsEditing(true);
        setShowEditModal(true);
        handleMenuClose();
    };


    const handleToggleCompleteCard = () => {
        onToggleComplete(cuota._id!);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
            >
                <div className={`nota-card ${cuota.completed ? 'completed' : 'active'}`}>
                    {/* Header */}
                    <div className="nota-card-header">
                        <div className="nota-card-title">
                            <h3 className={cuota.completed ? 'completed' : ''}>
                                {cuota.titulo}
                            </h3>
                            <p className="categoria-cuota"> {cuota.categoria} </p>
                            <div className="nota-card-meta">
                                <span className="nota-card-cuotas">
                                    {cuotasPagadas} de {totalCuotas} cuotas pagadas
                                </span>

                                <span className="nota-card-progreso">
                                    {progresoPct}% completado
                                </span>
                            </div>
                        </div>

                        <div className="nota-card-actions">
                            <Tooltip title={cuota.completed ? "Deshacer" : "Completar todo"} arrow>
                                <button
                                    className={`nota-btn-toggle ${cuota.completed ? 'done' : ''}`}
                                    onClick={handleToggleCompleteCard}
                                >
                                    {cuota.completed ? <Undo size={16} /> : <Check size={16} />}
                                </button>
                            </Tooltip>

                            <button className="nota-btn-more" onClick={handleMenuOpen}>
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleEditClick}>
                                <Edit size={16} /> Editar
                            </MenuItem>
                            <MenuItem onClick={() => { onDelete(cuota._id!); handleMenuClose(); }}>
                                <Delete size={16} color="red" /> Eliminar
                            </MenuItem>
                        </Menu>
                    </div>


                    <div className="nota-progress-track">
                        <div className="nota-progress-fill" style={{ width: `${progresoPct}%` }} />
                    </div>


                    <div className="nota-card-stats">
                        <div className="nota-stat-row">
                            <span className="nota-stat-label">Monto por cuota</span>
                            <span className="nota-stat-value">
                                ${montoPorCuota.toLocaleString('es-AR', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                })}
                            </span>
                        </div>
                        <div className="nota-stat-row">
                            <span className="nota-stat-label">Total a pagar</span>
                            <span className="nota-stat-value">
                                ${montoTotal.toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="nota-stat-row success">
                            <span className="nota-stat-label">Total pagado</span>
                            <span className="nota-stat-value">
                                ${totalPagado.toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="nota-stat-row danger">
                            <span className="nota-stat-label">Restante por pagar</span>
                            <span className="nota-stat-value">
                                ${restantePorPagar.toLocaleString('es-AR')}
                            </span>
                        </div>
                    </div>


                    <div className="nota-card-footer">
                        <span className="nota-footer-vencimiento">
                            {cuota.fechaCompra
                                ? `Comprado el ${formatDate(cuota.fechaCompra)}`
                                : 'Sin cuotas pendientes'}
                        </span>
                        <button
                            className="nota-btn-expand"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Ocultar cuotas' : 'Ver cuotas'}
                        >
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>


                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className="nota-card-body"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="nota-items">
                                    {cuota.descripcion?.map((_, index) => (
                                        <CuotaItem
                                            key={index}
                                            descripcion={cuota.descripcion[index] || ''}
                                            fecha={cuota.fecha?.[index] || ''}
                                            precio={cuota.precio?.[index] || 0}
                                            categoria={cuota.categoria[index] || ''}
                                            index={index}
                                            notaId={cuota._id!}
                                            isCompleted={cuota.completedItems?.[index] || false}
                                            onToggle={onToggleItem}
                                            onDelete={onDeleteItem}
                                            onEdit={onEditItem}
                                        />
                                    ))}
                                </div>

                                <div className="nota-add-item">
                                    <button
                                        className="nota-btn-add-item"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? <X size={16} /> : <Plus size={16} />}
                                        {isExpanded ? 'Cerrar' : 'Agregar cuota'}
                                    </button>

                                    {isExpanded && (
                                        <div className="nota-add-item-form" >
                                            <input
                                                type="text"
                                                className="nota-input-small"
                                                placeholder="Descripción"
                                                value={newItem.descripcion}
                                                onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                className="nota-input-small"
                                                value={newItem.fecha}
                                                onChange={(e) => {
                                                        console.log('Fecha seleccionada:', e.target.value)
                                                    setNewItem({ ...newItem, fecha: e.target.value })}}
                                            />
                                            <input
                                                type="number"
                                                className="nota-input-small"
                                                placeholder="Precio"
                                                value={newItem.precio}
                                                onChange={(e) => setNewItem({ ...newItem, precio: e.target.value })}
                                            />

                                            <button
                                                className="nota-btn-save-item"
                                                onClick={handleAddItem}
                                                disabled={!newItem.descripcion.trim() || !newItem.fecha || !newItem.precio}
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>


            {showEditModal && (
                <div className="form-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h3>Editar nota</h3>
                            <button className="form-modal-close" onClick={() => setShowEditModal(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        <div className="form-modal-body">
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    className="nota-input"
                                    value={editData.titulo}
                                    onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cuotas</label>
                                <select
                                    className="nota-input"
                                    value={editData.cuotas}
                                    onChange={(e) => setEditData({ ...editData, cuotas: Number(e.target.value) })}
                                >
                                    {[...Array(100)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Monto Total</label>
                                <input
                                    type="number"
                                    className="nota-input"
                                    value={editData.montoTotal || 0}
                                    onChange={(e) => setEditData({ ...editData, montoTotal: Number(e.target.value) })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha de compra </label>
                                <input
                                    type="date"
                                    className="nota-input"
                                    value={editData.fecha}
                                    onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                                />
                            </div>

            
                            <div className="form-group">
                                <label>Categoría</label>
                                <select 
                                    className="task-input"
                                    value={editData.categoria} 
                                    onChange={(e) => setEditData({ ...editData, categoria: e.target.value })}
                                >
                                    <option value="">Seleccionar Categoria</option>
                                    {["Comida", "Automovil", "Transporte", "Vivienda", 'Servicios',
                                    "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota",
                                    'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro","Supermercado","Salidas", "Otro"  
                                    ].map(categoria => 
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    )}
                                </select>
                            </div>

                        </div>

                        <div className="task-modal-actions">
                            <button className="task-btn task-btn-primary" onClick={handleSaveEdit}>
                                <Save size={18} />
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