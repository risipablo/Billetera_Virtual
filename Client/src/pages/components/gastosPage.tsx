import { useEffect } from "react";
import GastosMaster from "../../features/components/gastos/gastosMaster"
import { Seo } from "../../features/components/seo/seo"


 const GastosPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    return(
        <>  
                <title> Gastos </title>  
            <Seo
                title="Gastos"
                description="Registrá y clasificá todos tus gastos por categoría, método de pago y condición. Buscá y filtrá tus movimientos fácilmente."
                keywords="registro de gastos, control de gastos, historial de pagos, gastos mensuales"
                url="/gastos"
            />
            <GastosMaster/>
        </>
    )
}

export default GastosPage