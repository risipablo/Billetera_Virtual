// Hook para las funciones de ultimos gastos, limite y monto total del componente gastosMaster

import { useMemo } from "react";
import type { IGastos } from "../types/type.gastos";
import { formatDate } from "../utils/dateutils";


export const useGastosStats = (
    gastos:IGastos[],
    filterGastos: IGastos[],
    limite:string,
    
) => {

       const lastSpend = useMemo(() => {
        const data = filterGastos.length > 0 ? filterGastos : gastos
        
        if (data.length === 0) {
            return 'No hay gastos registrados'
        }

        const lastGasto = data[data.length - 1]
        return `${formatDate(lastGasto.fecha)}
        ${lastGasto.producto}
        $${lastGasto.monto.toLocaleString('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
        }`
    }, [gastos, filterGastos])

    const totalMonto = useMemo(() => {
        let total = 0

        const data = filterGastos.length > 0 ? filterGastos : gastos
        
        if (data.length === 0) {
            return 0
        }

        data.forEach(producto => {
            if ([ 'cajero', 'cuotas', 'deben', 'inversion'].includes(producto.estado.toLowerCase())) {

            } else {
                total += producto.monto;
            }
        })

        return total
    },[gastos,filterGastos])

    const limiteSpend = useMemo(() => {
        const limiteNumero = Number(limite) || 0;
        const excede = limiteNumero > 0 && totalMonto > limiteNumero;
        
        return {
            monto: totalMonto,  
            color: excede ? "#dc2626" : "rgb(12, 192, 12,0.9)",
            excede: excede
        };
    }, [totalMonto, limite]);

    return{
        lastSpend,
        totalMonto,
        limiteSpend
    }
}