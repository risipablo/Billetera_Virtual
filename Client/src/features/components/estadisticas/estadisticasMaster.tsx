import { Toaster } from "react-hot-toast";
import { ScrollTop } from "../../../components/ui/scrollTop";
import { Spinner } from "../../../components/ui/spinner/spinner";
import { useEstadisticas } from "./hooks/useEstadisticas";
import "./style/estadisticas.css";
import { FiltrosEstadisticas } from "./components/filtroEstadisticas";
import { ResumenFinanciero } from "./components/resumenFinanciero";
import { GraficoBarras } from "./components/graficoBarras";
import { GraficoDonut } from "./components/graficoDonut";

export const EstadisticasMaster = () => {
    const {
        loading,
        resumen,
        datosPorMes,
        datosPorProducto,
        datosPorMetodo,
        datosPorCondicion,
        datosPorAño,
        aplicarFiltros,
        resetFiltros,
        mesActual,
    } = useEstadisticas();

    if (loading && resumen.totalGastos === 0) {
        return (
            <div className="estadisticas-loading">
                <Spinner size="lg" label="Cargando estadísticas..." />
            </div>
        );
    }

    return (
        <div className="estadisticas-container">
            <h1 className="estadisticas-title">Estadísticas</h1>

            <FiltrosEstadisticas
                onFilterChange={aplicarFiltros}
                onReset={resetFiltros}
                onMesActual={mesActual}
                loading={loading}
            />

            <ResumenFinanciero resumen={resumen} loading={loading} />

            <div className="estadisticas-grid">
                <GraficoBarras
                    data={datosPorMes}
                    title="Gastos por Mes"
                    loading={loading}
                    height={350}
                />

                <GraficoDonut
                    data={{
                        ...datosPorProducto,
                        maxLabel: String(datosPorProducto.maxLabel),
                        maxValue: Number(datosPorProducto.maxValue),
                    }}
                    title="Distribución por Productos"
                    loading={loading}
                    size={280}
                />

                <GraficoDonut
                    data={{
                        ...datosPorProducto,
                        maxLabel: String(datosPorProducto.maxLabel),
                        maxValue: Number(datosPorProducto.maxValue),
                    }}
                    title="Métodos de Pago"
                    loading={loading}
                    size={280}
                />

                <GraficoDonut
                    data={{
                        ...datosPorProducto,
                        maxLabel: String(datosPorProducto.maxLabel),
                        maxValue: Number(datosPorProducto.maxValue),
                    }}
                    title="Condición de Gastos"
                    loading={loading}
                    size={280}
                />

                <GraficoBarras
                    data={datosPorAño}
                    title="Gastos Anuales"
                    loading={loading}
                    height={300}
                />
            </div>

            <ScrollTop />
            <Toaster />
        </div>
    );
};

