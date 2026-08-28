
import { motion } from "framer-motion";
import { Spinner } from "../../../../components/ui/spinner/spinner";
import type { ResumenFinancieroProps } from "../types/type.estadisticas";

export const ResumenFinanciero = ({ resumen, loading = false }: ResumenFinancieroProps) => {
    if (loading) {
        return (
            <div className="resumen-loading">
                <Spinner size="md" label="Cargando datos..." />
            </div>
        );
    }

    return (
        <motion.div
            className="resumen-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="resumen-title">Resumen Financiero</h2>
            <ul className="resumen-list">
                <li>
                    <span className="resumen-label">Total de gastos</span>
                    <span className="resumen-value">
                        ${resumen.totalGastos.toLocaleString('es-AR')}
                    </span>
                </li>
                <li>
                    <span className="resumen-label">Dinero Invertido</span>
                    <span className="resumen-value">
                        ${resumen.totalInversion.toLocaleString('es-AR')}
                    </span>
                </li>
                <li>
                    <span className="resumen-label">Promedio de gasto por mes</span>
                    <span className="resumen-value">
                        ${(resumen.promedioMensual || 0).toLocaleString('es-AR')}
                    </span>
                </li>
                {resumen.promedioDiario !== null && (
                    <li>
                        <span className="resumen-label">Promedio de gasto por día</span>
                        <span className="resumen-value">
                            ${resumen.promedioDiario.toLocaleString('es-AR')}
                        </span>
                    </li>
                )}
                <li className="resumen-top">
                    <span className="resumen-label">Productos con más gastos</span>
                    <div className="resumen-top-list">
                        {resumen.topProductos.map(([producto, monto]: [string, number]) => (
                            <span key={producto} className="resumen-top-item">
                                {producto}: ${monto.toLocaleString('es-AR')}
                            </span>
                        ))}
                    </div>
                </li>
            </ul>
        </motion.div>
    );
};