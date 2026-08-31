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
        datosPorInversion,
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
        <div className="table-container">

            <div className="table-header">
                <h2 className="table-title">Estadisticas</h2>
            </div>
            
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
                    height={280}
                />


                <GraficoDonut
                    data={{
                        ...datosPorProducto,
                        maxLabel: String(datosPorProducto.maxLabel),
                        maxValue: Number(datosPorProducto.maxValue),
                    }}
                    title="Distribución por Productos"
                    loading={loading}
                    size={220}
                    maxSlices={10}
                />

                
                <GraficoDonut
                    data={{
                        ...datosPorMetodo,
                        maxLabel: String(datosPorMetodo.maxLabel),
                        maxValue: Number(datosPorMetodo.maxValue),
                    }}
                    title="Métodos de Pago"
                    loading={loading}
                    size={220}
                />

                <GraficoDonut
                    data={{
                        ...datosPorCondicion,
                        maxLabel: String(datosPorCondicion.maxLabel),
                        maxValue: Number(datosPorCondicion.maxValue),
                    }}
                    title="Condición de Gastos"
                    loading={loading}
                    size={220}
                />

                <GraficoBarras
                    data={datosPorAño}
                    title="Gastos Anuales"
                    loading={loading}
                    height={280}
                />

                <GraficoBarras
                    data={datosPorInversion}
                    title="Inversiones"
                    loading={loading}
                    height={280}
                />

          

            </div>

            <ScrollTop />
            <Toaster />
        </div>
    );
};