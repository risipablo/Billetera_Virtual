import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CuotaFormProps } from "../types/type.cuotas";


const sumarMeses = (fecha: Date, meses: number): Date => {
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth() + meses;
    const dia = fecha.getUTCDate();
    const ultimoDiaMes = new Date(Date.UTC(año, mes + 1, 0)).getUTCDate();
    const diaFinal = Math.min(dia, ultimoDiaMes);
    return new Date(Date.UTC(año, mes, diaFinal));
};

const formatFecha = (fecha: Date): string =>
    fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC' 
    });

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
            fechaPrimeraCuota: '',
            categoria: ''
        });
    };

    const handleClose = () => {
        setAddModal(false);
        handleClean();
    };

    const handleSubmit = () => {
        if (!formData.titulo.trim() || !formData.cuotas || !formData.monto || !formData.fecha || !formData.fechaPrimeraCuota || !formData.categoria) {
            alert('Todos los campos son requeridos');
            return;
        }

        onSubmit();
        setAddModal(false);
        handleClean();
    };

    const preview = useMemo(() => {
        const totalCuotas = Number(formData.cuotas);
        const montoTotal = Number(formData.monto);

        if (!totalCuotas || !montoTotal || !formData.fechaPrimeraCuota) return [];

        const primeraFecha = new Date(formData.fechaPrimeraCuota);
        if (isNaN(primeraFecha.getTime())) return [];

        const montoPorCuota = Math.floor((montoTotal / totalCuotas) * 100) / 100;
        const diferencia = Math.round((montoTotal - montoPorCuota * totalCuotas) * 100) / 100;

        return Array.from({ length: totalCuotas }, (_, i) => ({
            numero: i + 1,
            total: totalCuotas,
            fecha: sumarMeses(primeraFecha, i),
            precio: i === totalCuotas - 1 ? montoPorCuota + diferencia : montoPorCuota
        }));
    }, [formData.cuotas, formData.monto, formData.fechaPrimeraCuota]);

    return (
        <>
            <button className="btn-add" onClick={() => setAddModal(true)}>
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

                                <div className="form-group">
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

                                <div className="form-group">
                                    <label>Monto total</label>
                                    <input
                                        type="number"
                                        className="nota-input"
                                        placeholder="0"
                                        value={formData.monto}
                                        onChange={(e) => handleChange('monto', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha de compra</label>
                                    <input
                                        type="date"
                                        className="nota-input"
                                        value={formData.fecha}
                                        onChange={(e) => handleChange('fecha', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Primera cuota vence</label>
                                    <input
                                        type="date"
                                        className="nota-input"
                                        value={formData.fechaPrimeraCuota}
                                        onChange={(e) => handleChange('fechaPrimeraCuota', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        className="nota-input"
                                        value={formData.categoria}
                                        onChange={(e) => handleChange('categoria', e.target.value)}
                                    >
                                        <option value="">Seleccionar Categoria</option>
                                        {["Comida", "Automovil", "Transporte", "Vivienda", 'Servicios',
                                          "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota","Regalo",
                                          'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro", "Supermercado", "Salidas", "Otro"
                                        ].map(cat =>
                                            <option key={cat} value={cat}>{cat}</option>
                                        )}
                                    </select>
                                </div>

                                {preview.length > 0 && (
                                    <div className="cuota-preview">
                                        <p className="cuota-preview-title">Vista previa</p>
                                        <ul className="cuota-preview-list">
                                            {preview.map(p => (
                                                <li key={p.numero} className="cuota-preview-item">
                                                    <span className="cuota-preview-num">Cuota {p.numero}/{p.total}</span>
                                                    <span className="cuota-preview-fecha">{formatFecha(p.fecha)}</span>
                                                    <span className="cuota-preview-precio">
                                                        ${p.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

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
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};