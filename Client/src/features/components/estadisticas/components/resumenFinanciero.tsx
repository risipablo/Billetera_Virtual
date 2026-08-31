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
            <div className="resumen-divider" />

            <div className="resumen-grid">
                <div className="resumen-cell">
                    <span className="resumen-label">Total de gastos</span>
                    <span className="resumen-value">
                        $ {resumen.totalGastos.toLocaleString('es-AR')}
                    </span>
                </div>

                <div className="resumen-cell">
                    <span className="resumen-label">Dinero Invertido</span>
                    <span className="resumen-value">
                        $ {resumen.totalInversion.toLocaleString('es-AR')}
                    </span>
                </div>

                <div className="resumen-cell">
                    <span className="resumen-label">Promedio de gasto por mes</span>
                    <span className="resumen-value">
                        $ {(resumen.promedioMensual || 0).toLocaleString('es-AR')}
                    </span>
                </div>

                {resumen.promedioDiario !== null && (
                    <div className="resumen-cell">
                        <span className="resumen-label">Promedio de gasto por día</span>
                        <span className="resumen-value">
                            $ {resumen.promedioDiario.toLocaleString('es-AR')}
                        </span>
                    </div>
                )}

                <div className="resumen-cell resumen-cell-productos">
                    <span className="resumen-label">Productos con más gastos</span>
                    <div className="resumen-productos-grid">
                        {resumen.topProductos.map(([producto, monto]: [string, number]) => (
                            <span key={producto} className="resumen-producto-item">
                                <strong>{producto}</strong> : $ {monto.toLocaleString('es-AR')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};