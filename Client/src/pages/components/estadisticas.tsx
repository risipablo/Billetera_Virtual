import { EstadisticasMaster } from "../../features/components/estadisticas/estadisticasMaster"
import { Seo } from "../../features/components/seo/seo"


const EstadisticasPage = () => {
  return (
    <>
      <title> Estadisticas </title>
       <Seo
          title="Estadísticas"
          description="Analizá tus gastos por mes, año, categoría o método de pago. Descubrí en qué se va tu plata con gráficos interactivos."
          keywords="estadísticas de gastos, análisis financiero, gráficos de gastos, reportes"
          url="/estadisticas"
      />
      <EstadisticasMaster/>
    </>
  )
}

export default EstadisticasPage
