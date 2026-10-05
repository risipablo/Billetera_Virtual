import Convertidor from "../../features/components/convertidor/convertidor"
import { Seo } from "../../features/components/seo/seo"




export const ConvertidorPage = () => {
  return (
    <div>
      <title> Convertidor </title>  
            <Seo
                title="Convertidor de Monedas"
                description="Convertí montos entre distintas monedas con el valor actualizado. Ideal para viajes o compras en el exterior."
                keywords="convertidor de monedas, tipo de cambio, dólar, cotización"
                url="/convertidor"
            />
            <Convertidor/>
    </div>
  )
}


