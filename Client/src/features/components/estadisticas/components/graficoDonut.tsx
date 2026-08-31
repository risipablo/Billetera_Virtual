import { motion } from "framer-motion";
import type { GraficoDonutProps } from "../types/type.estadisticas";
import { Skeleton } from "../../../../components/ui/skeleton/skeleton";
import { useState } from "react";

const colores = [
    '#0C447C', '#1E5FA8', '#5B9BD5', '#9A5B0B', '#2E7D32',
    '#A22E2E', '#6B2FA8', '#147A69', '#414C82', '#A32360',
];

// const COLOR_BARRA = '#A855F7';
// const COLOR_MAX = '#DC5C4B';

const colorOtros = '#B8B8B2';

export const GraficoDonut = ({
    data,
    title,
    loading = false,
    size = 200,
    maxSlices,
}: GraficoDonutProps) => {
    const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

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

    const pares = data.labels.map((label, i) => ({
        label,
        value: data.values[i] || 0,
    })).sort((a, b) => b.value - a.value);

    let labels: string[];
    let values: number[];
    let colorMap: string[];

    if (maxSlices && pares.length > maxSlices) {
        const top = pares.slice(0, maxSlices);
        const resto = pares.slice(maxSlices);
        const sumaResto = resto.reduce((sum, p) => sum + p.value, 0);

        labels = [...top.map(p => p.label), 'Otros'];
        values = [...top.map(p => p.value), sumaResto];
        colorMap = [...top.map((_, i) => colores[i % colores.length]), colorOtros];
    } else {
        labels = pares.map(p => p.label);
        values = pares.map(p => p.value);
        colorMap = pares.map((_, i) => colores[i % colores.length]);
    }

    const total = values.reduce((sum, v) => sum + v, 0) || 1;
    const maxLabelReal = labels[0];
    const maxIndex = 0;

    return (
        <motion.div
            className="grafico-container donut-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                borderColor: "var(--header-bg)",
                transition: { duration: 0.2 }
            }}
        >
            <h3 className="grafico-title donut-title">{title}</h3>
            <div className="grafico-donut-container">
                <div className="grafico-donut-wrapper">
                    <svg
                        viewBox="0 0 200 200"
                        className="grafico-donut"
                        style={{ width: size, height: size }}
                    >
                        {labels.map((label, index) => {
                            const value = values[index] || 0;
                            const percentage = (value / total) * 100;
                            const startAngle = labels
                                .slice(0, index)
                                .reduce((sum, _, i) => sum + (values[i] / total) * 360, 0);
                            const radius = 80;
                            const innerRadius = 55;
                            const isMax = index === maxIndex;
                            const isHovered = hoveredSlice === index;

                            return (
                                <g 
                                    key={label}
                                    onMouseEnter={() => setHoveredSlice(index)}
                                    onMouseLeave={() => setHoveredSlice(null)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r={radius}
                                        fill="none"
                                        stroke={colorMap[index]}
                                        strokeWidth={isHovered ? 24 : 20}
                                        strokeDasharray={`${(percentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                                        strokeDashoffset={`-${(startAngle / 360) * 2 * Math.PI * radius}`}
                                        transform="rotate(-90 100 100)"
                                        opacity={isMax ? 1 : isHovered ? 1 : 0.7}
                                        style={{ 
                                            transition: 'stroke-width 0.3s ease, opacity 0.3s ease',
                                            filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' : 'none'
                                        }}
                                    />
                                    {isMax && (
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r={innerRadius}
                                            fill="none"
                                            stroke={colorMap[index]}
                                            strokeWidth={isHovered ? 6 : 4}
                                            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * innerRadius} ${2 * Math.PI * innerRadius}`}
                                            strokeDashoffset={`-${(startAngle / 360) * 2 * Math.PI * innerRadius}`}
                                            transform="rotate(-90 100 100)"
                                            style={{ 
                                                transition: 'stroke-width 0.3s ease',
                                                filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' : 'none'
                                            }}
                                        />
                                    )}
                                    {isHovered && (
                                        <text
                                            x="100"
                                            y="85"
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill={colorMap[index]}
                                        >
                                            {label}
                                        </text>
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
                </div>

                <div className="grafico-leyenda donut-leyenda">
                    {labels.map((label, index) => {
                        const value = values[index] || 0;
                        const isMax = label === maxLabelReal;
                        const isHovered = hoveredSlice === index;
                        return (
                            <div 
                                key={label} 
                                className={`grafico-leyenda-item ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredSlice(index)}
                                onMouseLeave={() => setHoveredSlice(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span
                                    className="grafico-leyenda-color"
                                    style={{ 
                                        backgroundColor: colorMap[index],
                                        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                                        transition: 'transform 0.3s ease'
                                    }}
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