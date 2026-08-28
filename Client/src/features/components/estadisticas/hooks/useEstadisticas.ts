import { useState, useEffect, useCallback, useMemo } from "react";
import type { IGastoEstadistica, ResumenFinanciero } from "../types/type.estadisticas";
import toast from "react-hot-toast";
import axiosInstance from "../../../../config/axiosConfig";

export const useEstadisticas = () => {
    const [gastos, setGastos] = useState<IGastoEstadistica[]>([]);
    const [gastosFiltrados, setGastosFiltrados] = useState<IGastoEstadistica[]>([]);
    const [loading, setLoading] = useState(true);
    const [mesSeleccionado, setMesSeleccionado] = useState<string>('');
    const [filtros, setFiltros] = useState({
        mes: '',
        año: '',
        producto: '',
        metodo: '',
        condicion: '',
    });

    const loadGastos = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/api/bills');
            const data = Array.isArray(response.data) ? response.data : [];
            setGastos(data);
            setGastosFiltrados(data);
        } catch (error) {
            console.error('Error al cargar gastos:', error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGastos();
    }, [loadGastos]);

    const resumen = useMemo((): ResumenFinanciero => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];

        const totalGastos = data.reduce((acc, gasto) => {
            if (!gasto || !gasto.condicion) return acc;
            if (condicionesExcluidas.includes(gasto.condicion.toLowerCase())) {
                return acc;
            }
            return acc + (gasto.monto || 0);
        }, 0);

        const totalInversion = data.reduce((acc, gasto) => {
            if (!gasto || !gasto.condicion) return acc;
            if (gasto.condicion.toLowerCase() === 'inversion') {
                return acc + (gasto.monto || 0);
            }
            return acc;
        }, 0);

        const promedioMensual = data.length > 0 ? totalGastos / 12 : 0;

        let promedioDiario = null;
        if (mesSeleccionado) {
            const gastosMes = data.filter(g => {
                if (!g || !g.mes) return false;
                return g.mes.toLowerCase() === mesSeleccionado.toLowerCase();
            });
            const totalMes = gastosMes.reduce((acc, g) => {
                if (!g || !g.condicion) return acc;
                if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                    return acc;
                }
                return acc + (g.monto || 0);
            }, 0);
            promedioDiario = totalMes / 30;
        }

        const productos = data.reduce((acc, gasto) => {
            if (!gasto || !gasto.condicion || !gasto.producto) return acc;
            if (condicionesExcluidas.includes(gasto.condicion.toLowerCase())) {
                return acc;
            }
            if (!acc[gasto.producto]) acc[gasto.producto] = 0;
            acc[gasto.producto] += gasto.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const topProductos = Object.entries(productos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            totalGastos,
            totalInversion,
            promedioMensual,
            promedioDiario,
            topProductos: topProductos as [string, number][],
            mesSeleccionado,
        };
    }, [gastos, gastosFiltrados, mesSeleccionado]);

    const datosPorMes = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        const porMes = meses.map(mes => {
            const total = data.reduce((acc, g) => {
                if (!g || !g.condicion || !g.mes) return acc;
                if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                    return acc;
                }
                if (g.mes.toLowerCase() === mes) {
                    return acc + (g.monto || 0);
                }
                return acc;
            }, 0);
            return { mes, total };
        });

        const max = porMes.reduce((max, item) => item.total > max.total ? item : max, { mes: '', total: 0 });

        return {
            labels: porMes.map(item => item.mes),
            values: porMes.map(item => item.total),
            maxLabel: max.total > 0 ? String(max.mes) : '',
            maxValue: max.total > 0 ? Number(max.total) : 0,
        };
    }, [gastos, gastosFiltrados]);

    const datosPorProducto = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];
        
        const porProducto = data.reduce((acc, g) => {
            if (!g || !g.condicion || !g.producto) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                return acc;
            }
            if (!acc[g.producto]) acc[g.producto] = 0;
            acc[g.producto] += g.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const entries = Object.entries(porProducto).sort((a, b) => b[1] - a[1]);
        const max = entries.length > 0 ? entries[0] : ['', 0];

        return {
            labels: entries.map(item => item[0]),
            values: entries.map(item => item[1]),
            maxLabel: max[0] ? String(max[0]) : '',
            maxValue: max[1] ? Number(max[1]) : 0,
        };
    }, [gastos, gastosFiltrados]);

    const datosPorMetodo = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];
        
        const porMetodo = data.reduce((acc, g) => {
            if (!g || !g.condicion || !g.metodo) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                return acc;
            }
            if (!acc[g.metodo]) acc[g.metodo] = 0;
            acc[g.metodo] += g.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const entries = Object.entries(porMetodo);
        const max = entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ['', 0];

        return {
            labels: entries.map(item => item[0]),
            values: entries.map(item => item[1]),
            maxLabel: max[0] ? String(max[0]) : '',
            maxValue: max[1] ? Number(max[1]) : 0,
        };
    }, [gastos, gastosFiltrados]);

    const datosPorCondicion = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];
        
        const porCondicion = data.reduce((acc, g) => {
            if (!g || !g.condicion || !g.necesario) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                return acc;
            }
            if (!acc[g.necesario]) acc[g.necesario] = 0;
            acc[g.necesario] += g.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const entries = Object.entries(porCondicion);
        const max = entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ['', 0];

        return {
            labels: entries.map(item => item[0]),
            values: entries.map(item => item[1]),
            maxLabel: max[0] ? String(max[0]) : '',
            maxValue: max[1] ? Number(max[1]) : 0,
        };
    }, [gastos, gastosFiltrados]);

    const datosPorAño = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        const condicionesExcluidas = ['cajero', 'inversion', 'deben', 'cuotas'];
        
        const porAño = data.reduce((acc, g) => {
            if (!g || !g.condicion || !g.año) return acc;
            if (condicionesExcluidas.includes(g.condicion.toLowerCase())) {
                return acc;
            }
            if (!acc[g.año]) acc[g.año] = 0;
            acc[g.año] += g.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const entries = Object.entries(porAño).sort((a, b) => Number(a[0]) - Number(b[0]));

        return {
            labels: entries.map(item => item[0]),
            values: entries.map(item => item[1]),
            maxLabel: '',
            maxValue: 0,
        };
    }, [gastos, gastosFiltrados]);

    const datosPorInversion = useMemo(() => {
        const data = gastosFiltrados.length > 0 ? gastosFiltrados : gastos;
        
        const porInversion = data.reduce((acc, g) => {
            if (!g || !g.condicion || !g.mes) return acc;
            if (g.condicion.toLowerCase() !== 'inversion') {
                return acc;
            }
            if (!acc[g.mes]) acc[g.mes] = 0;
            acc[g.mes] += g.monto || 0;
            return acc;
        }, {} as Record<string, number>);

        const entries = Object.entries(porInversion).sort((a, b) => {
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                           'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            return meses.indexOf(a[0]) - meses.indexOf(b[0]);
        });

        const max = entries.length > 0 ? entries.reduce((a, b) => a[1] > b[1] ? a : b) : ['', 0];

        return {
            labels: entries.map(item => item[0]),
            values: entries.map(item => item[1]),
            maxLabel: max[0] ? String(max[0]) : '',
            maxValue: max[1] ? Number(max[1]) : 0,
        };
    }, [gastos, gastosFiltrados]);

    const aplicarFiltros = useCallback((nuevosFiltros: typeof filtros) => {
        setFiltros(nuevosFiltros);
        
        let filtrados = [...gastos];
        
        if (nuevosFiltros.mes) {
            filtrados = filtrados.filter(g => g && g.mes && g.mes.toLowerCase() === nuevosFiltros.mes.toLowerCase());
        }
        if (nuevosFiltros.año) {
            filtrados = filtrados.filter(g => g && g.año && g.año === nuevosFiltros.año);
        }
        if (nuevosFiltros.producto) {
            filtrados = filtrados.filter(g => g && g.producto && g.producto.toLowerCase() === nuevosFiltros.producto.toLowerCase());
        }
        if (nuevosFiltros.metodo) {
            filtrados = filtrados.filter(g => g && g.metodo && g.metodo === nuevosFiltros.metodo);
        }
        if (nuevosFiltros.condicion) {
            filtrados = filtrados.filter(g => g && g.necesario && g.necesario === nuevosFiltros.condicion);
        }
        
        setGastosFiltrados(filtrados);
        setMesSeleccionado(nuevosFiltros.mes);
    }, [gastos]);

    const resetFiltros = useCallback(() => {
        setFiltros({ mes: '', año: '', producto: '', metodo: '', condicion: '' });
        setGastosFiltrados(gastos);
        setMesSeleccionado('');
    }, [gastos]);

    const mesActual = useCallback(() => {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const fecha = new Date();
        const mes = meses[fecha.getMonth()];
        const año = String(fecha.getFullYear());
        
        const nuevosFiltros = { ...filtros, mes, año };
        setFiltros(nuevosFiltros);
        aplicarFiltros(nuevosFiltros);
    }, [filtros, aplicarFiltros]);

    return {
        loading,
        resumen,
        datosPorMes,
        datosPorProducto,
        datosPorMetodo,
        datosPorCondicion,
        datosPorAño,
        datosPorInversion,
        filtros,
        aplicarFiltros,
        resetFiltros,
        mesActual,
        mesSeleccionado,
    };
};