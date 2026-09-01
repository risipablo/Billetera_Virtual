
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../style/fijo.css";
import type { GastosFijosModalProps } from "../types/type.gastos.fijo";

export const GastosFijosModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isEditing = false
}: GastosFijosModalProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        monto: '',
        dia: '',
        categoria: '',
        estado: 'activo'
    });

    useEffect(() => {
        if (initialData && isEditing) {
            setFormData({
                nombre: initialData.nombre,
                monto: String(initialData.monto),
                dia: String(initialData.dia),
                categoria: initialData.categoria,
                estado: initialData.estado
            });
        } else {
            setFormData({
                nombre: '',
                monto: '',
                dia: '',
                categoria: '',
                estado: 'activo'
            });
        }
    }, [initialData, isEditing, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nombre || !formData.monto || !formData.dia || !formData.categoria) {
            alert('Todos los campos son requeridos');
            return;
        }

        const montoNum = Number(formData.monto);
        const diaNum = Number(formData.dia);

        if (montoNum <= 0) {
            alert('El monto debe ser mayor a 0');
            return;
        }

        if (diaNum < 1 || diaNum > 31) {
            alert('El día debe estar entre 1 y 31');
            return;
        }

        onSave({
            nombre: formData.nombre,
            monto: montoNum,
            dia: diaNum,
            categoria: formData.categoria,
            estado: formData.estado
        });
    };

    return (
        <div className="gastos-fijos-modal-overlay" onClick={onClose}>
            <div className="gastos-fijos-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{isEditing ? 'Editar Gasto Fijo' : 'Agregar Gasto Fijo'}</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Nombre del gasto</label>
                        <input
                            type="text"
                            placeholder="Ej: Alquiler, Netflix, Seguro"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                        />
                    </div>

                    
                    <div className="form-group">
                        <label>Monto</label>
                        <input
                            type="number"
                            
                            value={formData.monto}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    monto: e.target.value
                                })
                            }
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    
                    <div className="form-group-row">
                        <div className="form-group half">
                            <label>Día del mes</label>
                            <input
                                type="number"
                                placeholder="1-31"
                                value={formData.dia}
                                onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                                required
                                min="1"
                                max="31"
                            />
                        </div>

                    </div>

                    
                    <div className="form-group">
                        <label>Categoría</label>
                        <select
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            required
                        >
                            <option value="">Seleccionar Categoria</option>
                                {["Comida", "Automovil", "Transporte", "Vivienda",'Servicios',
                                    "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota",
                                    'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro", 'Supermercado',"Salidas","Otro"  
                                ].map(categoria => 
                                    <option key={categoria} value={categoria}>{categoria}</option>
                                )}
                        </select>
                    </div>

                    {/* Estado */}
                    <div className="form-group">
                        <label>Estado</label>
                        <select
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        >
                            <option value="activo">Activo</option>
                            <option value="pagado">Pagado</option>
                            <option value="vencido">Vencido</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save">
                            {isEditing ? 'Guardar cambios' : 'Agregar gasto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};