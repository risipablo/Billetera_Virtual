

import React, { type ReactNode } from 'react';

export interface IGastos{
    _id?: string;
    fecha: string;
    producto: string;
    monto: number;
    categoria: string;
    metodo: string;
    condicion: string;  
    estado: string;     
    userId?: string; 
}

export interface GastosFormProps{
    formData: IGastos
    setFormData: React.Dispatch<React.SetStateAction<IGastos>>
    onSubmit: () => void
    isLoading?:boolean
}

export interface GastosContainerProps{
    gastos:IGastos[]
    filterGastos: IGastos[]
    setFilterGastos:React.Dispatch<React.SetStateAction<IGastos[]>>
    activeFilter?:string
    loading?: boolean
    setGastos:React.Dispatch<React.SetStateAction<IGastos[]>>
    addGastos:(arg0: IGastos) => void
    deleteGastos:(id:string) => void
    editGastos:(id:string , editData:{
        fecha:string
        producto:string
        monto:number
        categoria:string
        metodo:string
        condicion:string
        estado:string
    }) => void
    onSubmitGastos?:() => void
    onOrderByDate?: () => void
    ordenAsc?: boolean
}

export interface GastosProviderProps{
    children: ReactNode
    isAuthenticated: boolean | null;
}


// Interface para limite de gastos en dashboard
export interface LimiteInfo{
    limite:number
    monto:number
    excede:boolean
    restante: number
    porcentaje:number
    color:string
    mensaje:string
}

export interface GastosContextType{
    gastos:IGastos[]
    filterGastos: IGastos[]
    setFilterGastos: React.Dispatch<React.SetStateAction<IGastos[]>>
    addGastos:(arg0: IGastos) => void
    deleteGastos:(id:string) => void
    editGastos:(id:string , editData:{
        fecha:string
        producto:string
        monto:number
        categoria:string
        metodo:string
        condicion:string
        estado:string
    }) => void
    onSubmitGastos?:() => void
    getGastos: () => IGastos[];
    totalMes: () => number;
    top3Gastos: () => { producto: string; monto: number }[];
    top3Categorias: () => { categoria: string; monto: number }[];
    promedioGastos: () => number;
    estadosDePago: () => {
        pagados: number;
        impagos: number;
        total: number;
        montoPendiente: number;
    };
    gastosImpagos: () => IGastos[];
    limiteGasto:Number
    setLimite:(valor:number) => void
    limiteInfo:() => LimiteInfo
    comparacionMes: () => ComparacionMes;
    totalMesAnterior: () => number;
    loading?: boolean
}


// Interface de comparacion de mes actual con el anterior
export interface ComparacionMes {
    totalActual: number;
    totalAnterior: number;
    diferencia: number;
    variacion: number;
    tendencia: 'up' | 'down' | 'equal';
    mesAnteriorNombre: string;
    hayComparacion: boolean;
}



