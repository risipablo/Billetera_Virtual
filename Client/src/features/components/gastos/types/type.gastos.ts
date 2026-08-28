

import React from 'react';

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
}