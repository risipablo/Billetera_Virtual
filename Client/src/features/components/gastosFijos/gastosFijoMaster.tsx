
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Wallet } from "lucide-react";
import "./style/fijo.css";
import { UseFijo } from "./hooks/useFijo";
import { GastoFijoItem } from "./ui/itemFijo";
import { GastosFijosModal } from "./ui/fijoModal";

export const GastosFijosMaster = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingGasto, setEditingGasto] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    const { fijo, addFijo, editFijo, deleteFijo } = UseFijo();

    const gastosFijos = Array.isArray(fijo) ? fijo : [];

    const totalFijos = gastosFijos
        .filter(g => g?.estado === 'activo')
        .reduce((acc, g) => acc + (g?.monto || 0), 0);

    const handleAdd = (data: any) => {
        addFijo(data);
        setShowModal(false);
    };

    const handleEdit = (data: any) => {
        if (editingGasto?._id) {
            editFijo(editingGasto._id, data);
            setEditingGasto(null);
            setIsEditing(false);
            setShowModal(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este gasto fijo?')) {
            deleteFijo(id);
        }
    };

    const handleToggle = (id: string) => {
        const gasto = gastosFijos.find(g => g._id === id);
        if (gasto) {
            const nuevoEstado = gasto.estado === 'activo' ? 'pagado' : 'activo';
            // ✅ CORREGIDO: Eliminar la línea de fecha
            editFijo(id, {
                ...gasto,
                estado: nuevoEstado,
            });
        }
    };

    const handleEditClick = (gasto: any) => {
        setEditingGasto(gasto);
        setIsEditing(true);
        setShowModal(true);
    };

    return (
        <div className="gastos-fijos-container">
            <div
                className="gastos-fijos-toggle"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="gastos-fijos-header">
                    <Wallet size={20} />
                    <span>Gastos Fijos</span>
                    <span className="gastos-fijos-total">
                        ${totalFijos.toLocaleString('es-AR')}
                    </span>
                </div>
                <div className="gastos-fijos-actions">
                    <button
                        className="btn-add-fijo"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingGasto(null);
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        title="Agregar gasto fijo"
                        type="button"
                    >
                        <Plus size={18} />
                    </button>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="gastos-fijos-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {gastosFijos.length === 0 ? (
                            <div className="gastos-fijos-empty">
                                <p>No tienes gastos fijos registrados</p>
                                <button
                                    onClick={() => {
                                        setEditingGasto(null);
                                        setIsEditing(false);
                                        setShowModal(true);
                                    }}
                                    type="button"
                                >
                                    + Agregar gasto fijo
                                </button>
                            </div>
                        ) : (
                            gastosFijos.map((gasto) => (
                                <GastoFijoItem
                                    key={gasto._id || Math.random().toString()}
                                    gasto={gasto}
                                    onEdit={handleEditClick}
                                    onDelete={handleDelete}
                                    onToggle={handleToggle}
                                />
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <GastosFijosModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingGasto(null);
                    setIsEditing(false);
                }}
                onSave={isEditing ? handleEdit : handleAdd}
                initialData={editingGasto || undefined}
                isEditing={isEditing}
            />
        </div>
    );
};

export default GastosFijosMaster;