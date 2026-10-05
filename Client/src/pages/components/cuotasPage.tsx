import { CuotasMaster } from "../../features/components/cuotas/cuotaMaster"
import { Seo } from "../../features/components/seo/seo"


export const CuotasPage = () => {
  return (
    <div>
      <title> Progreso de cuotas </title>
        <Seo
          title="Cuotas"
          description="Seguí el pago de tus compras en cuotas. Te avisamos cuándo vence la próxima y cuánto te falta pagar."
          keywords="cuotas, seguimiento de cuotas, pagos en cuotas, vencimientos"
          url="/cuotas"
        />
        <CuotasMaster/>
    </div>
  )
}


