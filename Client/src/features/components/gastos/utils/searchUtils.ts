import type { IGastos } from "../types/type.gastos";
import { buscarPorFecha, formatDate } from "./dateutils";



export const filterGastosBySearch = (
    gastos: IGastos[], 
    palabraClave: string
): IGastos[] => {
    

    if (!palabraClave.trim()) {
        
        return gastos;
    }

    const palabras = palabraClave.toLowerCase().trim().split(/\s+/);
    

    const resultados = gastos.filter(gasto => {
        const fecha = formatDate(gasto.fecha);
        const coincide = palabras.every(palabra => {
            const match = (
                fecha.includes(palabra) ||
                gasto.producto.toLowerCase().includes(palabra) ||
                gasto.categoria.toLowerCase().includes(palabra) ||
                gasto.metodo.toLowerCase().includes(palabra) ||
                gasto.condicion.toLowerCase().includes(palabra) ||
                gasto.estado.toLowerCase().includes(palabra) ||
                gasto.monto.toString().includes(palabra) ||
                buscarPorFecha(gasto.fecha, palabra)
            );
            return match;
        });
        return coincide;
    });

    
    return resultados;
};