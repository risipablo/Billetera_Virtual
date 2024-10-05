import { useEffect, useState } from "react";
import { Navbar } from "../nav/navbar";
import GastoChart from "./gastoChart";
import axios from "axios";
import { FiltrosChart } from "./filtros/filtrosChart";

export function Charts(){
    // const serverFront = "http://localhost:3001";
    const serverFront = "https://billetera-virtual-1.onrender.com";
    
    const [gastos,setGastos] = useState([])
    const [gastosFiltrados, setGastosFiltrados] = useState([])

  

    useEffect(() => {
        axios.get(`${serverFront}/api/gasto`)
        .then(response => {
            setGastos(response.data)
            setGastosFiltrados(response.data)
        })
        .catch(err => console.log(err))
    },[])
    
    

    return(
        <div className="gastos-container">
            <Navbar/>
            <h1> Estadisticas </h1>
            <FiltrosChart gastos={gastos} setGastosFiltrados={setGastosFiltrados}/>
            <GastoChart gastos={gastosFiltrados}/>

        </div>
    )
}

