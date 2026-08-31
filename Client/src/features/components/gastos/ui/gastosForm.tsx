
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import "../../../../style/form.css"
import type { GastosFormProps, IGastos } from "../types/type.gastos";

export const GastosForm = ({
    formData,
    setFormData,
    onSubmit,
    isLoading = false 
}: GastosFormProps) => {

    const handleChange = (field: keyof IGastos, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const [addModal, setAddModal] = useState(false)

    const handleClean = () => {
        setFormData({
            fecha: '',
            producto: '',
            monto: 0,
            categoria: '',
            metodo: '',
            condicion:'',
            estado: ''
        })
    }

    const handleClose = () => {
        setAddModal(false)
        handleClean()
    }

    const handleSubmit = () => {
        onSubmit()
        setAddModal(false)
    }

    return (
        <>
            <button className="btn-add" onClick={() => setAddModal(true)}>
                <Plus size={18} />
                <span>Agregar gasto</span>
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
                                <h3>Nuevo gasto</h3>
                                <button 
                                    className="form-modal-close" 
                                    onClick={handleClose}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="form-modal-body">
                               
                                <div className="form-group">
                                    <label>Fecha</label>
                                    <input 
                                        type="date" 
                                        className="task-input"
                                        value={formData.fecha} 
                                        onChange={(e) => handleChange('fecha', e.target.value)} 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Producto</label>
                                    <input 
                                        type="text" 
                                        className="task-input"
                                        placeholder="Nombre del producto"
                                        value={formData.producto} 
                                        onChange={(e) => handleChange('producto', e.target.value)} 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Monto</label>
                                    <input 
                                        type="number" 
                                        className="task-input"
                                        placeholder="0.00"
                                        value={formData.monto} 
                                        onChange={(e) => handleChange('monto', parseFloat(e.target.value) || 0)} 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select 
                                        className="task-input"
                                        value={formData.categoria} 
                                        onChange={(e) => handleChange('categoria', e.target.value)}
                                    >
                                        <option value="">Seleccionar Categoria</option>
                                            {["Comida", "Automovil", "Transporte", "Vivienda",'Servicios',
                                              "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota",
                                              'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro", "Salidas","Otro"  
                                            ].map(categoria => 
                                                <option key={categoria} value={categoria}>{categoria}</option>
                                            )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Método de pago</label>
                                
                                    <select 
                                        className="task-input"
                                        value={formData.metodo} 
                                        onChange={(e) => handleChange('metodo', e.target.value)}
                                    >
                                        <option value="">Seleccionar método</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Crédito">Crédito</option>
                                        <option value="Débito">Débito</option>
                                        <option value="Transferencia">Transferencia</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Condicion</label>
                                    <select 
                                        className="task-input"
                                        value={formData.condicion} 
                                        onChange={(e) => handleChange('condicion', e.target.value)}
                                    >
                                        <option value="">Seleccionar Condición</option>
                                            {["Fijo", "Necesario", "Innecesario", "Sin Valor","Cuotas"].map(necesario => 
                                                <option key={necesario} value={necesario}>{necesario}</option>
                                            )}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Estado</label>
                                    <select 
                                        className="task-input"
                                        value={formData.estado} 
                                        onChange={(e) => handleChange('estado', e.target.value)}
                                    >
                                        <option value="">Seleccionar Estado</option>
                                        {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(estado => 
                                            <option key={estado} value={estado}>{estado}</option>
                                        )}
                                    </select>
                                </div>

                                <div className="task-modal-actions">
                                    <button 
                                        className="task-btn task-btn-primary"
                                        onClick={handleSubmit}
                                        disabled={isLoading || !formData}
                                    >
                                        {isLoading ? 'Agregando...' : 'Agregar'}
                                        {!isLoading && <Plus size={18} />}
                                    </button>

                                    <button 
                                        className="task-btn task-btn-secondary"
                                        onClick={handleClose}
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
    )
}