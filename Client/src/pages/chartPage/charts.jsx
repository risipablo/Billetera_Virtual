import { useEffect, useState } from "react";
import GastoChart from "../../component/charts/gastoChart";
import axios from "axios";
import { FiltrosChart } from "../../component/charts/filtrosChart/filtrosChart";
import  { Helmet } from 'react-helmet';

function Charts(){
    // const serverFront = "http://localhost:3001";
    const serverFront = "https://billetera-virtual-1.onrender.com";
    
    const [gastos,setGastos] = useState([])
    const [gastosFiltrados, setGastosFiltrados] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token') // se guarda el token de cada usuario

        const fechtGastos = async() => {
            try{
                const response = await axios.get(`${serverFront}/api/gasto`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setGastos(response.data)
                setGastosFiltrados(response.data) 
            }
            catch (err){
                console.log(err)
            }
        }

        fechtGastos();
    },{})
    

    return(
        <div className="gastos-container">
             <Helmet>
                <title>Estadisticas Mensuales</title>
            </Helmet>

            <h1> Estadisticas </h1>
            <FiltrosChart gastos={gastos} setGastosFiltrados={setGastosFiltrados}/>
            <GastoChart gastos={gastosFiltrados}/>

        </div>
    )
}

export default Charts;