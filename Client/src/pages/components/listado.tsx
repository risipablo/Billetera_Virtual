import Listado from "../../features/components/listado/listadoMaster"
import { Seo } from "../../features/components/seo/seo"

export const ListadoPage = () => {
  return (
    <div>
      <title> Listado de compras </title>
        <Seo
          title="Lista de Compras"
          description="Armá tu lista de compras del súper y tildá lo que ya compraste. No te olvides de nada."
          keywords="lista de compras, súper, lista del supermercado, organizador de compras"
          url="/listado"
        />
      <Listado/>
    </div>
  )
}


