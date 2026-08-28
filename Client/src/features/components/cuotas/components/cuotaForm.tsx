
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CuotaFormProps } from "../types/type.cuotas";

export const CuotaForm = ({
    formData,
    setFormData,
    onSubmit,
    isLoading = false,
}: CuotaFormProps) => {
    const [addModal, setAddModal] = useState(false);

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClean = () => {
        setFormData({
            titulo: '',
            cuotas: '',
            monto: '',
            fecha: '',
        });
    };

    const handleClose = () => {
        setAddModal(false);
        handleClean();
    };

    const handleSubmit = () => {
        if (!formData.titulo.trim() || !formData.cuotas || !formData.monto || !formData.fecha) {
            alert('Todos los campos son requeridos');
            return;
        }

           console.log('Enviando formulario:', {
        titulo: formData.titulo.trim(),
        cuotas: Number(formData.cuotas),
        monto: Number(formData.monto),
        fecha: formData.fecha,
    });
        onSubmit();
        setAddModal(false);
        handleClean();
    };

    return (
        <>
            <button className="btn-add-nota" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Nueva nota</span>
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
                                <h3>Nueva nota</h3>
                                <button className="form-modal-close" onClick={handleClose}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="form-modal-body">
                                <div className="form-group">
                                    <label>Título</label>
                                    <input
                                        type="text"
                                        className="nota-input"
                                        placeholder="Ej: Auto, Casa, Estudio..."
                                        value={formData.titulo}
                                        onChange={(e) => handleChange('titulo', e.target.value)}
                                    />
                                </div>

                                <div className="form-group-row">
                                    <div className="form-group half">
                                        <label>Cuotas</label>
                                        <select
                                            className="nota-input"
                                            value={formData.cuotas}
                                            onChange={(e) => handleChange('cuotas', e.target.value)}
                                        >
                                            <option value="">Cuotas</option>
                                            {[...Array(100)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group half">
                                        <label>Monto total</label>
                                        <input
                                            type="number"
                                            className="nota-input"
                                            placeholder="0"
                                            value={formData.monto}
                                            onChange={(e) => handleChange('monto', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Fecha límite</label>
                                    <input
                                        type="date"
                                        className="nota-input"
                                        value={formData.fecha}
                                        onChange={(e) => handleChange('fecha', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="task-modal-actions">
                                <button
                                    className="task-btn task-btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creando...' : 'Crear nota'}
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