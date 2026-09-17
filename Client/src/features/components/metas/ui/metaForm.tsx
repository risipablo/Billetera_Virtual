import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import type { IMeta, MetasFormProps } from '../types/type.meta';
import { CATEGORIAS } from '../types/type.meta';

export const MetaForm = ({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    Isloading = false,
    isOpen,
    onOpen,
    isEdit = false
}: MetasFormProps) => {
    
    const handleChange = (field: keyof IMeta, value: unknown) => {
        setFormData(prev => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleClose = () => {
        onCancel();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit();
    };

    return (
        <>
            {!isEdit && (
                <button className="btn-add" onClick={onOpen}>
                    <Plus size={18} />
                    <span>Agregar meta</span>
                </button>
            )}

            <AnimatePresence>
                {isOpen && formData && (
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
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="form-modal-header">
                                <h3>{isEdit ? 'Editar meta' : 'Agregar nueva meta'}</h3>
                                <button
                                    type="button"
                                    className="form-modal-close"
                                    onClick={handleClose}
                                    aria-label="Cerrar"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            
                                <div className="form-modal-body">
                                    <div className="form-group">
                                        <label>
                                            Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nombre}
                                                onChange={(e) => handleChange('nombre', e.target.value)}
                                                placeholder="Ej: Viaje a ...."
                                                required
                                                maxLength={80}
                                                autoFocus
                                            />
                                        
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Descripción
                                        </label>
                                            <textarea
                                            className="task-input"
                                                value={formData.descripcion ?? ''}
                                                onChange={(e) => handleChange('descripcion', e.target.value)}
                                                placeholder="Opcional: para qué es esta meta"
                                                maxLength={300}
                                                rows={2}
                                            />
                                        
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Monto objetivo
                                            </label>
                                            <input
                                                type="number"
                                                className="task-input"
                                                value={formData.montoObjetivo || ''}
                                                onChange={(e) => handleChange('montoObjetivo', Number(e.target.value))}
                                                min={1}
                                                step="0.01"
                                                placeholder="0"
                                                required
                                            />
                                        
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Fecha  
                                            </label>
                                            <input
                                                type="date"
                                                className="task-input"
                                                value={formData.fecha}
                                                onChange={(e) => handleChange('fecha', e.target.value)}
                                                required
                                            />
                                        
                                    </div>

                                    <div className="form-group">
                                        <label>Categoría</label>
                                        <select
                                            className="task-input"
                                            value={formData.categoria}
                                            onChange={(e) => handleChange('categoria', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar Categoría</option>
                                            {CATEGORIAS.map(categoria => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {isEdit && (
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select
                                                className="task-input"
                                                value={formData.estado}
                                                onChange={(e) => handleChange('estado', e.target.value)}
                                            >
                                                <option value="activa">Activa</option>
                                                <option value="pausada">Pausada</option>
                                                <option value="completada">Completada</option>
                                                <option value="cancelada">Cancelada</option>
                                            </select>
                                        </div>
                                    )}

                                    
                                    <div className="task-modal-actions">
                                        <button
                                            
                                            className="task-btn task-btn-primary"
                                            onClick={onSubmit}
                                            disabled={Isloading}
                                        >
                                            {Isloading ? 'Guardando...' : isEdit ? 'Guardar' : 'Agregar'}
                                            {!Isloading && <Plus size={18} />}
                                        </button>

                                        <button
                                            type="button"
                                            className="task-btn task-btn-secondary"
                                            onClick={handleClose}
                                            disabled={Isloading}
                                        >
                                            <X size={18} />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>

                            
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};