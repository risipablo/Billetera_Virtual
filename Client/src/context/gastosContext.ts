import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ComparacionMes, GastosContextType, GastosProviderProps, IGastos, LimiteInfo } from "../features/components/gastos/types/type.gastos"
import { UseGastos } from "../features/components/gastos/hooks/useGastos"

const GastosContext = createContext<GastosContextType | undefined>(undefined)

export interface GetGastos {
    (): IGastos[]
}

interface TopProducto {
    producto: string;
    monto: number;
}

interface TopCategoria {
    categoria: string;
    monto: number;
}

interface EstadoPagos {
    pagados: number;
    impagos: number;
    total: number;
    montoPendiente: number;
}

export const useGastos = () => {
    const context = useContext(GastosContext)
    if (!context) {
        throw new Error('error')
    }
    return context
}

export const GastosProvider: React.FC<GastosProviderProps> = ({ children, isAuthenticated }) => {

    const gastoData = isAuthenticated ? UseGastos() : {
        gastos: [],
        filterGastos: [],
        setFilterGastos: () => {},
        addGastos: () => {},
        deleteGastos: () => {},
        deleteAll: () => {},
        editGastos: () => {},
        onSubmitGastos: () => {},
        loading: false
    }

    const [limiteGasto, setLimiteGasto] = useState<number>(0);

    useEffect(() => {
        const guardado = localStorage.getItem('limiteGasto')
        if(guardado){
            const parseado = Number(guardado)
            if(!isNaN(parseado) && parseado > 0){
                setLimiteGasto(parseado)
            }
        }
    },[])

    const setLimite = useCallback((valor:number) => {
        const limpio = valor > 0 ? valor : 0
        setLimiteGasto(limpio);
        localStorage.setItem('limiteGasto', String(limpio))
    },[])


    const getGastos = useCallback<GetGastos>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const añoActual = hoy.getFullYear();

        return gastoData.gastos.filter((gasto) => {
            if (!gasto.fecha) return false;

            const [año, mes] = gasto.fecha.split('T')[0].split('-');
            const year = Number(año);
            const month = Number(mes);

            return month === mesActual && year === añoActual;
        });
    }, [gastoData.gastos]);

    const totalMes = useCallback<() => number>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        const sumaMes = gastosDelMes.reduce((acc, g) => {
            if (!g.condicion || !g.producto) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return acc;

            return acc + (g.monto || 0);
        }, 0)

        return sumaMes;
    }, [gastoData.gastos])


    const totalMesAnterior = useCallback<() => number>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();
        const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
        const yearAnterior = mesActual === 1 ? yearActual - 1 : yearActual;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMesAnterior = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesAnterior && Number(yearStr) === yearAnterior;
        });

        return gastosDelMesAnterior.reduce((acc, g) => {
            if (!g.condicion) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return acc;
            return acc + (g.monto || 0);
        }, 0);
    }, [gastoData.gastos]);

    const top3Gastos = useCallback<() => TopProducto[]>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();

        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        const porProducto = gastosDelMes.reduce((acc, g) => {
            if (!g.condicion || !g.producto) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return acc;

            acc[g.producto] = (acc[g.producto] || 0) + (g.monto || 0);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(porProducto)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([producto, monto]) => ({ producto, monto }));
    }, [gastoData.gastos]);

    const top3Categorias = useCallback<() => TopCategoria[]>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();

        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        const porCategoria = gastosDelMes.reduce((acc, g) => {
            if (!g.condicion || !g.categoria) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return acc;

            acc[g.categoria] = (acc[g.categoria] || 0) + (g.monto || 0);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(porCategoria)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([categoria, monto]) => ({ categoria, monto }));
    }, [gastoData.gastos]);

    const promedioGastos = useCallback<() => number>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        const sumaPromedio = gastosDelMes.reduce((acc, g) => {
            if (!g.condicion || !g.producto) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return acc;
            return acc + (g.monto || 0);
        }, 0)

        const diasTranscurridos = hoy.getDate();
        return diasTranscurridos > 0 ? sumaPromedio / diasTranscurridos : 0;
    }, [gastoData.gastos])

    const estadosDePago = useCallback<() => EstadoPagos>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        const gastosReales = gastosDelMes.filter(g => {
            if (!g.condicion) return false
            return !condicionesExcluidas.includes(g.condicion.toLowerCase())
        })

        const pagadoStr = gastosReales.filter(g => g.estado === 'Pagado')
        const impagadoStr = gastosReales.filter(g => g.estado !== 'Pagado')

        const montoPendiente = impagadoStr.reduce((sum, g) => sum + (g.monto || 0), 0)
        return {
            pagados: pagadoStr.length,
            impagos: impagadoStr.length,
            total: gastosReales.length,
            montoPendiente
        }
    }, [gastoData.gastos])

    const gastosImpagos = useCallback<() => IGastos[]>(() => {
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const yearActual = hoy.getFullYear();
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const gastosDelMes = gastoData.gastos.filter(g => {
            if (!g.fecha) return false;
            const [yearStr, monthStr] = g.fecha.split('T')[0].split('-');
            return Number(monthStr) === mesActual && Number(yearStr) === yearActual;
        });

        return gastosDelMes
            .filter(g => {
                if (!g.condicion) return false;
                if (condicionesExcluidas.includes(g.condicion.toLowerCase())) return false;
                return g.estado !== 'Pagado';
            })
            .sort((a, b) => (b.monto || 0) - (a.monto || 0));
    }, [gastoData.gastos])

    const limiteInfo = useCallback<() => LimiteInfo>(() => {
        const monto = totalMes()
        const excede = limiteGasto > 0 && monto > limiteGasto
        const restante = limiteGasto - monto
        const porcentaje = limiteGasto > 0 ? (monto / limiteGasto) * 100 : 0

        
        let color = '#94a3b8';
        let mensaje = 'Definí un límite en Gastos'

        if(limiteGasto > 0){
            if (excede){
                color = '#ef4444'
                mensaje = `⚠️ Te pasaste $${Math.abs(restante).toLocaleString('es-AR')}` 
            } else if (porcentaje >= 80){
                color = '#f59e0b';
                mensaje = `Te quedan $${restante.toLocaleString('es-AR')}`;
            }  else {
                color = '#10b981';
                mensaje = `Te quedan $${restante.toLocaleString('es-AR')}`;
            }
        }

        return {
            limite: limiteGasto,
            monto,
            excede,
            restante,
            porcentaje,
            color,
            mensaje
        }
    },[limiteGasto, totalMes])


    // Comparacion de mes actual con el anterior
    const comparacionMes = useCallback<() => ComparacionMes>(() => {
        const hoy = new Date()
        const mesActual = hoy.getMonth() + 1
        const añoActual = hoy.getFullYear()
        const diaActual = hoy.getDate()

        const mesAnterior = mesActual === 1 ? 12 : mesActual - 1
        const añoAnterior = mesActual === 1 ? añoActual - 1 : añoActual

         const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
         const mesAnteriorNombre = meses[mesAnterior - 1]
         const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

         const filtrarSumar = (mes:number, año:number) => {
            const delMes = gastoData.gastos.filter(g => {
                if (!g.fecha) return false
                const [year,month] = g.fecha.split('T')[0].split('-')
                return Number(month) === mes && Number(year) === año
            })
            
            return delMes.reduce((acc,g) => {
                if(!g.condicion) return acc;
                if(condicionesExcluidas.includes(g.condicion.toLocaleLowerCase())) return acc
                return acc + (g.monto || 0) 
            }, 0)
         }

         const totalActual = filtrarSumar(mesActual,añoActual)
         const totalAnterior = filtrarSumar(mesAnterior,añoAnterior)

         if(totalAnterior === 0){
            return {
                totalActual,
                totalAnterior: 0,
                diferencia: 0,
                variacion: 0,
                tendencia: 'equal',
                mesAnteriorNombre,
                hayComparacion: false
            }
         }

        const diasAnterior = new Date(añoAnterior, mesAnterior,0).getDate()
        const totalAnteriorproyect = (totalAnterior * diaActual) / diasAnterior

        const diferencia = totalActual - totalAnterior
        const variacion = (diferencia / totalAnteriorproyect) * 100

        let tendencia: 'up' | 'down' | 'equal' = 'equal';
        if (variacion > 1) tendencia = 'up';
        else if (variacion < -1) tendencia = 'down';

        return {
            totalActual,
            totalAnterior:totalAnterior,
            diferencia,
            variacion,
            tendencia,
            mesAnteriorNombre,
            hayComparacion: true
        }
    },[gastoData.gastos])

    const value: GastosContextType = useMemo(
        () => ({
            gastos: gastoData.gastos,
            filterGastos: gastoData.filterGastos,
            setFilterGastos: gastoData.setFilterGastos,
            addGastos: gastoData.addGastos,
            deleteGastos: gastoData.deleteGastos,
            deleteAll: "allDeleteGastos" in gastoData
                ? gastoData.allDeleteGastos
                : gastoData.deleteAll,
            editGastos: gastoData.editGastos,
            onSubmitGastos: "onSubmitGastos" in gastoData
                ? gastoData.onSubmitGastos
                : () => {},
            getGastos,
            totalMes,
            totalMesAnterior,
            top3Gastos,
            top3Categorias,
            promedioGastos,
            estadosDePago,
            gastosImpagos,
            limiteGasto,
            setLimite,
            limiteInfo,
            comparacionMes,
            loading: "loading" in gastoData ? gastoData.loading : false
        }),
        [
            gastoData.gastos,
            gastoData.filterGastos,
            gastoData.setFilterGastos,
            gastoData.addGastos,
            gastoData.deleteGastos,
            gastoData.editGastos,
            getGastos,
            totalMes,
            totalMesAnterior,
            top3Gastos,
            top3Categorias,
            promedioGastos,
            estadosDePago,
            gastosImpagos,
            limiteGasto,
            setLimite,
            limiteInfo,
            comparacionMes,
            "loading" in gastoData ? gastoData.loading : false
        ]
    )

    return React.createElement(
        GastosContext.Provider,
        { value },
        children
    )
}