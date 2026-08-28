
export interface IGastoEstadistica {
    _id?: string;
    fecha: string;
    mes: string;
    año: string;
    producto: string;
    monto: number;
    categoria: string;
    metodo: string;
    condicion: string;
    necesario: string;
    estado: string;
    userId?: string;
}

export interface ResumenFinancieroProps {
    resumen: ResumenFinanciero;
    loading?: boolean;
}

export interface ResumenFinanciero {
    totalGastos: number;
    totalInversion: number;
    promedioMensual: number;
    promedioDiario: number | null;
    topProductos: [string, number][];
    mesSeleccionado?: string;
}

export interface FiltrosEstadisticasProps {
    onFilterChange: (filters: {
        mes: string;
        año: string;
        producto: string;
        metodo: string;
        condicion: string;
    }) => void;
    onReset: () => void;
    onMesActual: () => void;
    loading?: boolean;
}


export interface GraficoBarrasProps {
    data: {
        labels: string[];
        values: number[];
        maxLabel?: string;
        maxValue?: number;
    };
    title: string;
    loading?: boolean;
    height?: number;
}

export interface GraficoDonutProps {
    data: {
        labels: string[];
        values: number[];
        maxLabel?: string;
        maxValue?: number;
    };
    title: string;
    loading?: boolean;
    size?: number;
}