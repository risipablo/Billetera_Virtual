
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ListadoFormProps } from "../types/type.listado";

export const ListadoForm = ({
    formData,
    setFormData,
    onSubmit,
    isLoading = false,
}: ListadoFormProps) => {
    const [addModal, setAddModal] = useState(false);

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClean = () => {
        setFormData({
            fecha: '',
            titulo: '',
            descripcion: [],
        });
    };

    const handleClose = () => {
        setAddModal(false);
        handleClean();
    };

    const handleSubmit = () => {
        if (!formData.titulo?.trim() || !formData.fecha) {
            alert('Todos los campos son requeridos');
            return;
        }
        onSubmit();
        setAddModal(false);
        handleClean();
    };

    return (
        <>
            <button className="btn-add-listado" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Crear listado</span>
            </button>

            <AnimatePresence>
                {addModal && (
                    <motion.div
                        className="form-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                    >
                        <motion.div
                            className="form-modal-content"
                            initial={{ scale: 0.7, opacity: 0, rotateX: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.7, opacity: 0, rotateX: 90 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h3>Nuevo listado de compras</h3>
                                <button className="form-modal-close" onClick={handleClose}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="form-modal-body">
                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        className="listado-input"
                                        placeholder="Ej: Supermercado, Farmacia..."
                                        value={formData.titulo || ''}
                                        onChange={(e) => handleChange('titulo', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        className="listado-input"
                                        value={formData.fecha || ''}
                                        onChange={(e) => handleChange('fecha', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="task-modal-actions">
                                <button
                                    className="task-btn task-btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !formData.titulo?.trim() || !formData.fecha}
                                >
                                    {isLoading ? 'Creando...' : 'Crear listado'}
                                    {!isLoading && <Plus size={18} />}
                                </button>

                                <button className="task-btn task-btn-secondary" onClick={handleClose}>
                                    <X size={18} />
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};