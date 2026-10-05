import { MetaMaster } from "../../features/components/metas/metaMaster"
import { Seo } from "../../features/components/seo/seo"


export const MetasPage = () => {
  return (
    <div>
        <title> Metas de ahorro</title>
        <Seo
            title="Metas de Ahorro"
            description="Creá objetivos de ahorro y seguí tu progreso. Juntá plata para un viaje, un auto o lo que quieras."
            keywords="metas de ahorro, objetivos financieros, ahorrar, fondo de emergencia"
            url="/metas"
        />
        <MetaMaster/>
    </div>
  )
}


