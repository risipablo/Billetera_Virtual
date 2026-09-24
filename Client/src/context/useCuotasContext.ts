import { createContext, useCallback, useContext, useMemo } from "react";
import type { CuotasContextType, CuotasProviderProps, ICuota } from "../features/components/cuotas/types/type.cuotas";
import React from "react";
import { useCuotas } from "../features/components/cuotas/hooks/useCuota";

const CuotasContext = createContext<CuotasContextType | undefined>(undefined)

export const UseCuota = () => {
    const context = useContext(CuotasContext)
     if (!context) {
        throw new Error('error')
    }
    return context
}

export const CuotasProvider: React.FC<CuotasProviderProps> = ({
    children,
    isAuthenticated
}) => {
    const authenticatedCuotaData = useCuotas()
    const cuotaData = isAuthenticated ? authenticatedCuotaData : {
        cuotas:[],
        filteredCuotas: [],
        setCuotas: () => {},
        setFilteredCuotas: () => {},
        loading: false,
        addCuotas: async () => ({} as ICuota),
        editCuota: async () => {},
        deleteCuota: async () => {},
        toggleCompleteCuota: async () => {},
        addCuotaItem: async () => {},
        deleteCuotaItem: async () => {},
        deleteFilteredCuotas: async () => {},
        allDeleteCuotas: () => {},
        editCuotaItem: async () => {},
        toggleCompleteItem: async () => {}
    }

    const proximaCuota = useCallback(() => {
        const hoy = new Date()
        hoy.setHours(0,0,0,0)

        const pendientes = cuotaData.cuotas.flatMap(c =>{
            const cuotasPendientes = c.fecha?.map((fecha,idx) =>({
                cuotaId: c._id,
                titulo:c.titulo,
                categoria:c.categoria,
                numeroCuota: idx + 1,
                totalCuotas: c.cuotas,
                fecha,
                precio: c.precio?.[idx] || 0,
                isCompleted: c.completedItems?.[idx] || false
            }))
            .filter(item => !item.isCompleted) || []
            return cuotasPendientes
        })
        .sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        return pendientes[0] ||  null
    },[cuotaData.cuotas])

    const cuotasPorVencer = useCallback((dias:number = 7) => {
        const hoy = new Date()
        hoy.setHours(0,0,0,0)

        const limite = new Date(hoy)
        limite.setDate(limite.getDate() + dias)

        return cuotaData.cuotas.flatMap(c => {
            const cuotasPendientes = c.fecha ?.map((fecha,idx) =>({
                cuotaId: c._id,
                titulo: c.titulo,
                numeroCuota: idx + 1,
                totalCuotas: c.cuotas,
                fecha,
                precio: c.precio?.[idx] || 0,
                isCompleted: c.completedItems?.[idx] || false
            }))
            .filter(item => {
                if(item.isCompleted) return false 
                const fechaCuotas = new Date(item.fecha)
                fechaCuotas.setHours(0,0,0,0)
                return fechaCuotas >= hoy && fechaCuotas <= limite
            }) || []
            return cuotasPendientes
        })
         .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    },[cuotaData.cuotas])

    const cuotasVencidas = useCallback(() => {
    const hoy = new Date();
    const hoyISO = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    return cuotaData.cuotas
        .flatMap(c => {
            const vencidas = c.fecha
                ?.map((fecha, idx) => {
                    const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
                    const fechaCuota = new Date(year, month - 1, day);

                    const diffMs = hoyISO.getTime() - fechaCuota.getTime();
                    const diasVencida = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                    return {
                        cuotaId: c._id,
                        titulo: c.titulo,
                        categoria: c.categoria,
                        numeroCuota: idx + 1,
                        totalCuotas: c.cuotas,
                        fecha,
                        precio: c.precio?.[idx] || 0,
                        isCompleted: c.completedItems?.[idx] || false,
                        diasVencida
                    };
                })
                .filter(item => {
                    if (item.isCompleted) return false;
                    return item.diasVencida > 0;
                }) || [];
            return vencidas;
        })
        .sort((a, b) => b.diasVencida - a.diasVencida);
}, [cuotaData.cuotas]);

    const cuotasPagadasDelMes = useCallback(() => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const mesActual = hoy.getMonth();
        const yearActual = hoy.getFullYear();

        return cuotaData.cuotas
            .flatMap(c => {
                const pagadas = c.fecha
                    ?.map((fecha, idx) => ({
                        cuotaId: c._id,
                        titulo: c.titulo,
                        categoria: c.categoria,
                        numeroCuota: idx + 1,
                        totalCuotas: c.cuotas,
                        fecha,
                        precio: c.precio?.[idx] || 0,
                        isCompleted: c.completedItems?.[idx] || false
                    }))
                    .filter(item => {
                        if (!item.isCompleted) return false;
                        const fechaCuota = new Date(item.fecha);
                        return (
                            fechaCuota.getMonth() === mesActual &&
                            fechaCuota.getFullYear() === yearActual
                        );
                    }) || [];
                return pagadas;
            })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }, [cuotaData.cuotas]);


    const value:CuotasContextType = useMemo(() =>({
        cuotas: cuotaData.cuotas,
        filteredCuotas: cuotaData.filteredCuotas,
        setCuotas: cuotaData.setCuotas,
        setFilteredCuotas: cuotaData.setFilteredCuotas,
        loading: cuotaData.loading,
        addCuotas: cuotaData.addCuotas,
        editCuota: cuotaData.editCuota,
        deleteCuota: cuotaData.deleteCuota,
        toggleCompleteCuota: cuotaData.toggleCompleteCuota,
        addCuotaItem: cuotaData.addCuotaItem,
        deleteCuotaItem: cuotaData.deleteCuotaItem,
        deleteFilteredCuotas: cuotaData.deleteFilteredCuotas,
        allDeleteCuotas: cuotaData.allDeleteCuotas,
        editCuotaItem: async (id: string, index: number, data: { descripcion: string; fecha: string; precio: number }) =>
            cuotaData.editCuotaItem(id, index, {
                ...data,
                fechaPrimeraCuota: data.fecha,
            }),
        toggleCompleteItem: cuotaData.toggleCompleteItem,
        proximaCuota,
        cuotasPorVencer,
        cuotasVencidas,
        cuotasPagadasDelMes
    }),[
         cuotaData.cuotas,
        cuotaData.filteredCuotas,
        cuotaData.loading,
        cuotaData.addCuotas,
        cuotaData.editCuota,
        cuotaData.deleteCuota,
        cuotaData.toggleCompleteCuota,
        cuotaData.addCuotaItem,
        cuotaData.deleteCuotaItem,
        cuotaData.deleteFilteredCuotas,
        cuotaData.allDeleteCuotas,
        cuotaData.editCuotaItem,
        cuotaData.toggleCompleteItem,
        proximaCuota,
        cuotasPorVencer,
        cuotasVencidas,
        cuotasPagadasDelMes
    ])
    return React.createElement(
        CuotasContext.Provider,
        { value },
        children
    );
}

