import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Wallet, X } from "lucide-react";
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

    const handleAbrirAgregar = () => {
        setEditingGasto(null);
        setIsEditing(false);
        setShowModal(true);
    };

    return (
        <>
            
            <button
                className="gastos-fijos-trigger"
                onClick={() => setIsOpen(true)}
                type="button"
            >
                <Bell size={18} />
                <span>Gastos Fijos</span>
                <span className="gastos-fijos-total">
                    ${totalFijos.toLocaleString('es-AR')}
                </span>
            </button>

            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="gastos-fijos-list-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="gastos-fijos-list-modal"
                            initial={{ scale: 0.9, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 16 }}
                            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>
                                    <Wallet size={18} />
                                    <span>Gastos Fijos</span>
                                    <span className="gastos-fijos-total">
                                        ${totalFijos.toLocaleString('es-AR')}
                                    </span>
                                </h3>
                                <button
                                    className="modal-close"
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                    aria-label="Cerrar"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <button
                                className="btn-add-fijo-full"
                                onClick={handleAbrirAgregar}
                                type="button"
                            >
                                <Plus size={16} />
                                <span>Agregar gasto fijo</span>
                            </button>

                            <div className="gastos-fijos-list-body">
                                {gastosFijos.length === 0 ? (
                                    <div className="gastos-fijos-empty">
                                        <p>No tenés gastos fijos registrados</p>
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
                            </div>
                        </motion.div>
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
        </>
    );
};

export default GastosFijosMaster;