import { Calendar, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { FiltrosEstadisticasProps } from "../types/type.estadisticas";

const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const FiltrosEstadisticas = ({
    filtros,
    onFilterChange,
    onReset,
    onMesActual,
    loading = false,
}: FiltrosEstadisticasProps) => {
    const mesActualNombre = meses[new Date().getMonth()];

    const handleChange = (field: keyof typeof filtros, value: string) => {
        const nuevos = { ...filtros, [field]: value };
        onFilterChange(nuevos);
    };

    const handleReset = () => {
        onReset();
    };

    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4 },
        }),
    };

    return (
        <div className="filtros-container">
            <div className="filtros-actions">
                <button
                    className="filtros-btn filtros-btn-mes"
                    onClick={onMesActual}
                    disabled={loading}
                >
                    <Calendar size={18} />
                    <span>{filtros.mes === '' ? 'Mes actual' : mesActualNombre}</span>
                </button>

                <button
                    className="filtros-btn filtros-btn-reset"
                    onClick={handleReset}
                    disabled={loading}
                >
                    <RotateCcw size={18} />
                    <span>Limpiar</span>
                </button>
            </div>

            <p className="filtros-section-label">Período</p>
            <div className="filtros-grid">
                <motion.div
                    custom={0}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Mes</label>
                    <select
                        className="filtros-select"
                        value={filtros.mes}
                        onChange={(e) => handleChange('mes', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todos</option>
                        {meses.map((mes) => (
                            <option key={mes} value={mes}>{mes}</option>
                        ))}
                    </select>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Año</label>
                    <select
                        className="filtros-select"
                        value={filtros.año}
                        onChange={(e) => handleChange('año', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todos</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                </motion.div>
            </div>

            <p className="filtros-section-label">Clasificación</p>
            <div className="filtros-grid">
                <motion.div
                    custom={2}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Producto</label>
                    <input
                        type="text"
                        className="filtros-input"
                        placeholder="Buscar producto..."
                        value={filtros.producto}
                        onChange={(e) => handleChange('producto', e.target.value)}
                        disabled={loading}
                    />
                </motion.div>

                <motion.div
                    custom={3}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Categoría</label>
                    <select
                        className="filtros-select"
                        value={filtros.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todas</option>
                        {["Comida", "Automovil", "Transporte", "Vivienda", 'Servicios',
                          "Salud", "Deporte", "Educacion", 'Accesorios', "Mascota",
                          'Tecnologia', "Donacion", "Ocio", "Viajes", "Ahorro", "Supermercado", "Salidas", "Otro"
                        ].map(cat =>
                            <option key={cat} value={cat}>{cat}</option>
                        )}
                    </select>
                </motion.div>

                <motion.div
                    custom={4}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Método</label>
                    <select
                        className="filtros-select"
                        value={filtros.metodo}
                        onChange={(e) => handleChange('metodo', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todos</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </motion.div>

                <motion.div
                    custom={5}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="filtros-group"
                >
                    <label className="filtros-label">Condición</label>
                    <select
                        className="filtros-select"
                        value={filtros.condicion}
                        onChange={(e) => handleChange('condicion', e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Todas</option>
                        <option value="Fijo">Fijo</option>
                        <option value="Necesario">Necesario</option>
                        <option value="Innecesario">Innecesario</option>
                    </select>
                </motion.div>
            </div>
        </div>
    );
};