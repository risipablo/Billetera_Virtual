import { useEffect, useState } from "react";
import GastoChart from "../../component/charts/gastoChart";
import axios from "axios";
import { FiltrosChart } from "../../component/charts/filtrosChart/filtrosChart";
import  { Helmet } from 'react-helmet';
import { config } from "../../component/variables/config";
import { ScrollTop } from "../../component/common/scrollTop";



function Charts(){

    const serverFront = config.apiUrl;

    
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
            <FiltrosChart 
                gastos={gastos} 
                setGastosFiltrados={setGastosFiltrados}
            />

            <GastoChart 
                gastos={gastosFiltrados}
            />

            <ScrollTop/>

        </div>
    )
}

export default Charts;