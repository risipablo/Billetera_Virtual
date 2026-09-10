import { motion } from "framer-motion";
import type { GraficoBarrasProps } from "../types/type.estadisticas";
import { Skeleton } from "../../../../components/ui/skeleton/skeleton";
import { useState } from "react";

const COLOR_BARRA = '#A855F7';
const COLOR_MAX = '#DC5C4B';

const niceMax = (value: number): number => {
    if (value <= 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const residual = value / magnitude;
    let niceResidual: number;
    if (residual <= 1) niceResidual = 1;
    else if (residual <= 2) niceResidual = 2;
    else if (residual <= 5) niceResidual = 5;
    else niceResidual = 10;
    return niceResidual * magnitude;
};

export const GraficoBarras = ({
    data,
    title,
    loading = false,
    height = 200,
    legendLabel = 'Total de Gastos',
}: GraficoBarrasProps) => {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="grafico-container">
                <h3 className="grafico-title">{title}</h3>
                <div className="grafico-placeholder">
                    <Skeleton rows={3} columns={6} />
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
    const ejeMax = niceMax(maxValue);
    const pasos = 4;
    const gridValues = Array.from({ length: pasos + 1 }, (_, i) => Math.round((ejeMax / pasos) * i)).reverse();

    const maxIndex = data.values.indexOf(maxValue);
    const maxLabelReal = data.labels[maxIndex];

    const marginLeft = 50;
    const marginRight = 10;
    const marginTop = 10;
    const marginBottom = 44;
    const barWidth = 28;
    const barGap = 10;
    const chartHeight = height - marginTop - marginBottom;
    const chartWidth = data.labels.length * (barWidth + barGap);
    const svgWidth = marginLeft + chartWidth + marginRight;
    const svgHeight = height;

    return (
        <motion.div
            className="grafico-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h3 className="grafico-title">{title}</h3>

            <div className="grafico-leyenda-bar">
                <span className="grafico-leyenda-color" style={{ backgroundColor: COLOR_BARRA }} />
                <span>{legendLabel}</span>
            </div>

            <div className="grafico-svg-wrapper">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    width={svgWidth}
                    height={svgHeight}
                    style={{ minWidth: svgWidth, display: 'block' }}
                >
                    {gridValues.map((val, i) => {
                        const y = marginTop + (chartHeight / pasos) * i;
                        return (
                            <g key={val + '-' + i}>
                                <line
                                    x1={marginLeft}
                                    y1={y}
                                    x2={marginLeft + chartWidth}
                                    y2={y}
                                    stroke="#EEEEEC"
                                    strokeWidth={1}
                                />
                                <text
                                    x={marginLeft - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="11"
                                    fill="#8A8A90"
                                >
                                    {val.toLocaleString('es-AR')}
                                </text>
                            </g>
                        );
                    })}

                    <text
                        x={14}
                        y={marginTop + chartHeight / 2}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#8A8A90"
                        transform={`rotate(-90 14 ${marginTop + chartHeight / 2})`}
                    >
                        $
                    </text>

                    {data.labels.map((label, index) => {
                        const value = data.values[index] || 0;
                        const barHeight = ejeMax > 0 ? (value / ejeMax) * chartHeight : 0;
                        const x = marginLeft + index * (barWidth + barGap) + barGap / 2;
                        const y = marginTop + chartHeight - barHeight;
                        const isMax = index === maxIndex;
                        const isHovered = hoveredBar === index;

                        return (
                            <g key={label}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={Math.max(barHeight, 2)}
                                    rx={2}
                                    fill={isMax ? COLOR_MAX : COLOR_BARRA}
                                    opacity={hoveredBar !== null && hoveredBar !== index ? 0.4 : 1}
                                    style={{
                                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                                        transform: isHovered ? 'scaleY(1.08) scaleX(1.05)' : 'scale(1)',
                                        transformOrigin: 'bottom',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                />
                                {isHovered && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 8}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill={isMax ? COLOR_MAX : COLOR_BARRA}
                                        fontWeight="700"
                                    >
                                        {value.toLocaleString('es-AR')}
                                    </text>
                                )}
                                {isMax && !isHovered && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 6}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill={COLOR_MAX}
                                        fontWeight="700"
                                    >
                                        {value.toLocaleString('es-AR')}
                                    </text>
                                )}
                                <text
                                    x={x + barWidth / 2}
                                    y={marginTop + chartHeight + 16}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill={isHovered ? '#26262A' : '#6B6B6B'}
                                    fontWeight={isHovered ? '700' : '400'}
                                    style={{
                                        transition: 'fill 0.3s ease, font-weight 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    transform={`rotate(-30 ${x + barWidth / 2} ${marginTop + chartHeight + 16})`}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    {label.substring(0, 3)}
                                </text>
                            </g>
                        );
                    })}

                    <line
                        x1={marginLeft}
                        y1={marginTop + chartHeight}
                        x2={marginLeft + chartWidth}
                        y2={marginTop + chartHeight}
                        stroke="#D9D9D6"
                        strokeWidth={1}
                    />
                </svg>
            </div>

            {maxValue > 0 && (
                <div className="grafico-resumen-maximo">
                    <p className="grafico-resumen-label">
                        {title.toLowerCase().includes('mes') ? 'Mes con mayor inversión' : 'Mes con mayor inversión'}
                    </p>
                    <p className="grafico-resumen-nombre">{maxLabelReal}</p>
                    <p className="grafico-resumen-valor">$ {maxValue.toLocaleString('es-AR')}</p>
                </div>
            )}
        </motion.div>
    );
};