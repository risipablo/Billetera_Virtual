
import { motion } from "framer-motion";
import type { GraficoBarrasProps } from "../types/type.estadisticas";
import { Skeleton } from "../../../../components/ui/skeleton/skeleton";


export const GraficoBarras = ({
    data,
    title,
    loading = false,
    height = 300,
}: GraficoBarrasProps) => {
    if (loading) {
        return (
            <div className="grafico-container">
                <h3 className="grafico-title">{title}</h3>
                <div className="grafico-placeholder">
                    <Skeleton rows={5} columns={6} />
                </div>
            </div>
        );
    }

    if (!data || !data.labels || data.labels.length === 0 || data.values.every(v => v === 0)) {
        return (
            <div className="grafico-container">
                <h3 className="grafico-title">{title}</h3>
                <div className="grafico-vacio">
                    <p>No hay datos disponibles</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.values, 1);

    return (
        <motion.div
            className="grafico-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="grafico-title">{title}</h3>
            <div className="grafico-barras" style={{ height }}>
                {data.labels.map((label, index) => {
                    const value = data.values[index] || 0;
                    const altura = (value / maxValue) * 100;
                    const isMax = label === data.maxLabel;

                    return (
                        <div key={label} className="grafico-barra-wrapper">
                            <div className="grafico-barra-container">
                                <div
                                    className={`grafico-barra ${isMax ? 'max' : ''}`}
                                    style={{ height: `${Math.max(altura, 5)}%` }}
                                />
                            </div>
                            <span className="grafico-barra-label">{label}</span>
                            <span className="grafico-barra-valor">
                                ${value.toLocaleString('es-AR')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};