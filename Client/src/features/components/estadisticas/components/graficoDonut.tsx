import { motion } from "framer-motion";
import type { GraficoDonutProps } from "../types/type.estadisticas";
import { Skeleton } from "../../../../components/ui/skeleton/skeleton";



const colores = [
    '#0C447C', '#1E5FA8', '#5B9BD5', '#9A5B0B', '#2E7D32',
    '#A22E2E', '#6B2FA8', '#147A69', '#414C82', '#A32360',
];

export const GraficoDonut = ({
    data,
    title,
    loading = false,
    size = 200,
}: GraficoDonutProps) => {
    if (loading) {
        return (
            <div className="grafico-container">
                <h3 className="grafico-title">{title}</h3>
                <div className="grafico-placeholder">
                    <Skeleton type="circular" width={size} height={size} />
                </div>
            </div>
        );
    }

    const total = data.values.reduce((sum, v) => sum + v, 0) || 1;
    const maxIndex = data.labels.indexOf(data.maxLabel || '');

    return (
        <motion.div
            className="grafico-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="grafico-title">{title}</h3>
            <div className="grafico-donut-container">
                <svg
                    viewBox="0 0 200 200"
                    className="grafico-donut"
                    style={{ width: size, height: size }}
                >
                    {data.labels.map((label, index) => {
                        const value = data.values[index] || 0;
                        const percentage = (value / total) * 100;
                        const startAngle = data.labels
                            .slice(0, index)
                            .reduce((sum, _, i) => sum + (data.values[i] / total) * 360, 0);
                        const endAngle = startAngle + (percentage / 100) * 360;
                        const radius = 80;
                        const innerRadius = 55;
                        const isMax = index === maxIndex;

                        return (
                            <g key={label}>
                                <circle
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="none"
                                    stroke={colores[index % colores.length]}
                                    strokeWidth={20}
                                    strokeDasharray={`${(percentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                                    strokeDashoffset={`-${(startAngle / 360) * 2 * Math.PI * radius}`}
                                    transform="rotate(-90 100 100)"
                                    opacity={isMax ? 1 : 0.7}
                                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                />
                                {isMax && (
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r={innerRadius}
                                        fill="none"
                                        stroke={colores[index % colores.length]}
                                        strokeWidth={4}
                                        strokeDasharray={`${(percentage / 100) * 2 * Math.PI * innerRadius} ${2 * Math.PI * innerRadius}`}
                                        strokeDashoffset={`-${(startAngle / 360) * 2 * Math.PI * innerRadius}`}
                                        transform="rotate(-90 100 100)"
                                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                    />
                                )}
                            </g>
                        );
                    })}
                    <circle cx="100" cy="100" r="45" fill="white" />
                    <text
                        x="100"
                        y="95"
                        textAnchor="middle"
                        className="grafico-donut-total"
                        fontSize="16"
                        fontWeight="600"
                        fill="#26262A"
                    >
                        ${total.toLocaleString('es-AR')}
                    </text>
                    <text
                        x="100"
                        y="115"
                        textAnchor="middle"
                        className="grafico-donut-total"
                        fontSize="10"
                        fill="#8A8A90"
                    >
                        Total
                    </text>
                </svg>

                <div className="grafico-leyenda">
                    {data.labels.map((label, index) => {
                        const value = data.values[index] || 0;
                        const isMax = label === data.maxLabel;
                        return (
                            <div key={label} className="grafico-leyenda-item">
                                <span
                                    className="grafico-leyenda-color"
                                    style={{ backgroundColor: colores[index % colores.length] }}
                                />
                                <span className={`grafico-leyenda-label ${isMax ? 'max' : ''}`}>
                                    {label}
                                </span>
                                <span className="grafico-leyenda-valor">
                                    ${value.toLocaleString('es-AR')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};