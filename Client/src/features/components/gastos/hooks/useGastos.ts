import { useCallback, useEffect, useState } from "react"

import toast from "react-hot-toast"

import axiosInstance from "../../../../config/axiosConfig"
import type { IGastos } from "../types/type.gastos"

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500,
    style:{
    background: "#0C447C",
    color: "#fff",
    }
    
}

export const UseGastos = () => {

    const [gastos,setGastos] = useState<IGastos[]>([])
    const [filterGastos, setFilterGastos] = useState<IGastos[]>([])
    const [loading,setLoading] = useState(true)


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
            setFilterGastos(data);
        } catch (error) {
            console.error('Error al cargar gastos:', error);
            toast.error('Error al cargar gastos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGastos()
    },[loadGastos])

    const addGastos = useCallback(async(gastosData:{
        fecha:string
        producto:string
        monto:number
        categoria:string
        metodo:string
        condicion:string
        estado:string
    }) => {
        const {fecha,producto,monto,categoria,metodo,condicion,estado} = gastosData

        if(!gastosData){
            console.log('Completas todos los campos')
            return
        }

        try{
            const response = await axiosInstance.post('/api/bills',{
                fecha,
                producto,
                monto,
                categoria,
                metodo,
                condicion,
                estado
            })    

            setGastos(prev => [...prev,response.data])
            toast.success('Gasto agregado exitosamente', TOAST_CONFIG)
            return response.data
        
        } catch (err){
            toast.error('Error al agregar el gasto', TOAST_CONFIG)    
            console.log(err)
        }
    },[setFilterGastos,setGastos])
    
    const deleteGastos = useCallback((id:string) => {
        axiosInstance.delete(`api/bills/${id}`)
        .then(() => {
            setGastos(prev => prev.filter(prod => prod._id !== id))
            toast.success('Producto eliminado', TOAST_CONFIG)
        })
    },[setFilterGastos,setGastos])

    const editGastos = useCallback((id:string, editData:{
        fecha:string
        producto:string
        monto:number
        categoria:string
        metodo:string
        condicion:string
        estado:string
    }) => {
        axiosInstance.patch(`/api/bills/${id}`, editData)
        .then(response => {
            setGastos(prev => prev.map(bills => bills._id === id ? response.data : bills))
            setFilterGastos(prev => prev.map(bills => bills._id === id ? response.data : bills))
            toast.success('Producto modificado', TOAST_CONFIG)
        })
        .catch(err => {
            console.error(err)
            toast.error('Error al guardar el producto', TOAST_CONFIG)
        })
    },[])

    const deleteFilteredGastos = useCallback(async (ids: string[]) => {
        try {
            const response = await axiosInstance.delete('/api/bills/bulk', { data: { ids } })
            setGastos(prev => prev.filter(g => !g._id || !ids.includes(g._id)))
            setFilterGastos(prev => prev.filter(g => !g._id || !ids.includes(g._id)))
            toast.success(response.data.message, TOAST_CONFIG)
            return response.data
        } catch (err) {
            console.error(err)
            toast.error('Error al eliminar gastos filtrados', TOAST_CONFIG)
            throw err
        }
    }, [setGastos, setFilterGastos])
   
    const allDeleteGastos = useCallback(() => {
        axiosInstance.delete('/api/bills')
        .then(response => {
            setGastos([])
            toast.success('Todos lo gastos han sido eliminados', TOAST_CONFIG)
            console.debug(response.data)   
        }) 
         .catch(err => {
            console.error(err)
            toast.error('Error al eliminar los gastos', TOAST_CONFIG)
        })
    },[setGastos,setFilterGastos])

   
    return{
            gastos,
            setGastos,
            filterGastos,
            setFilterGastos,
            loading,
            addGastos,
            deleteGastos,
            editGastos,
            deleteFilteredGastos,
            allDeleteGastos
        }
}