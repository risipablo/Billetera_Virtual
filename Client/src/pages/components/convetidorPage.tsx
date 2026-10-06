import { useEffect } from "react";
import Convertidor from "../../features/components/convertidor/convertidor"
import { Seo } from "../../features/components/seo/seo"




export const ConvertidorPage = () => {
  useEffect(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
      }, [location.pathname]);
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


