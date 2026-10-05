import Consejo from "../../components/layout/consejos"
import { Seo } from "../../features/components/seo/seo"


export const ConsejosPage = () => {
  return (
    <div>
      <title> Consejos Financieros </title>
            <Seo
                title="Consejos Financieros"
                description="Tips simples de ahorro e inversión para mejorar tus finanzas personales. Aprendé a manejar mejor tu plata."
                keywords="consejos financieros, tips de ahorro, educación financiera, inversión"
                url="/consejos"
            />
      <Consejo/>
    </div>
  )
}


