import { useEffect, useMemo, useState } from 'react';
import type { ICuota, InfoVencimiento } from '../types/type.cuotas';
import { formatDate } from '../../gastos/utils/dateutils';

export const useVencimiento = (cuota: ICuota): InfoVencimiento => {
    const [, setTick] = useState(0);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                setTick(t => t + 1);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    return useMemo(() => {
        const cuotasPagadas = cuota.descripcion?.filter((_, idx) => cuota.completedItems?.[idx])?.length || 0;
        const totalCuotas = cuota.cuotas || 0;

        if (totalCuotas > 0 && cuotasPagadas >= totalCuotas) {
            return {
                estado: 'completada',
                fecha: null,
                diasRestantes: 0,
                texto: '✅ Todas las cuotas pagadas',
                color: '#10b981',
                icono: '✅'
            };
        }

        const proximaFechaStr = cuota.fecha?.find((_, idx) => !cuota.completedItems?.[idx]);

        if (!proximaFechaStr) {
            return {
                estado: 'normal',
                fecha: null,
                diasRestantes: 0,
                texto: 'Sin cuotas pendientes',
                color: '#94a3b8',
                icono: '📅'
            };
        }

        const proximaFecha = new Date(proximaFechaStr);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        proximaFecha.setHours(0, 0, 0, 0);

        const diffMs = proximaFecha.getTime() - hoy.getTime();
        const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const fechaFormateada = formatDate(proximaFechaStr);

        if (diasRestantes < 0) {
            const diasVencida = Math.abs(diasRestantes);
            return {
                estado: 'vencida',
                fecha: proximaFecha,
                diasRestantes,
                texto: `🔴 Vencida hace ${diasVencida} día${diasVencida !== 1 ? 's' : ''} · ${fechaFormateada}`,
                color: '#ef4444',
                icono: '🔴'
            };
        }

        if (diasRestantes === 0) {
            return {
                estado: 'vence-hoy',
                fecha: proximaFecha,
                diasRestantes: 0,
                texto: `⚠️ Vence hoy · ${fechaFormateada}`,
                color: '#ef4444',
                icono: '⚠️'
            };
        }

        if (diasRestantes <= 7) {
            return {
                estado: 'por-vencer',
                fecha: proximaFecha,
                diasRestantes,
                texto: `⏰ Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} · ${fechaFormateada}`,
                color: '#f59e0b',
                icono: '⏰'
            };
        }

        return {
            estado: 'normal',
            fecha: proximaFecha,
            diasRestantes,
            texto: `Próximo vencimiento: ${fechaFormateada}`,
            color: '#64748b',
            icono: '📅'
        };
    }, [cuota.descripcion, cuota.completedItems, cuota.cuotas, cuota.fecha]);
};