
import { useEffect, useState } from "react";
import "./convertidor.css";
import axios from "axios"
import { motion } from 'framer-motion';
import  { Helmet } from 'react-helmet';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';



 function Convertidor() {

    const [valor,setValor] = useState('')
    const [resultado,setResultado] = useState('')
    const [tasaCambio,setTasaCambio] = useState({})
    const [monedaOrigen,setMonedaOrigen] = useState('USD')
    const [monedaDestino,setMonedaDestino] = useState('ARS')
    const [fechaActualizada, setFechaActualizada] = useState('');
    
   
    const API_URL = `https://v6.exchangerate-api.com/v6/8d54b9e42cae5652dec59f50/latest/${monedaOrigen}`; //{monedaOrigen} = obtencion de las tasas relativas a ese tipo de moneda


    useEffect(() => {

        axios.get(API_URL)
        .then(response => {
            setTasaCambio(response.data.conversion_rates); // conversion_rates tiene el valor de cambio de cada moneda

            const actualizacion = response.data.time_last_update_unix; // conversion de tiempo para saber la ultima actualizacion de cada moneda
            const formatoFecha = new Date(actualizacion * 1000).toLocaleDateString(); //Conversion de formato 
            setFechaActualizada(formatoFecha)
            
        })
        .catch((error) =>{
            console.error(error)
        })
    }, [monedaOrigen])

    const getFlagUrl = (currencyCode) => {
        // Convertir código de moneda a código de país (primeras dos letras)
        const countryCode = currencyCode.slice(0, 2).toLowerCase(); 
        return `https://flagcdn.com/${countryCode}.svg`;
    };


    const calcular = () => {
        const numero = parseFloat(valor)

        
        // Si le valor no es un numero o no existen ciertas tasas la funcion devuelve con 0
        if(!isNaN || !tasaCambio[monedaDestino] || !tasaCambio[monedaOrigen]){
            return setResultado(0)
        }
        
        // Si el valor es un numero o existe la tasas 
        const resultadoConver = (numero / tasaCambio[monedaOrigen]) * tasaCambio[monedaDestino]
        setResultado(resultadoConver.toLocaleString('en-US'))
   
    }

    const limpiar = () => {
        setResultado('')
        setValor('')
    }

    const cambiarValores = () => {
        setMonedaOrigen(monedaDestino)
        setMonedaDestino(monedaOrigen)
    }


    // En este array dispone de todas las monedas disponible de la API
    // con Object.keys extrae las diferentes moneda de "tasaCambio"
    // la clave es el código de la moneda y el valor es la tasa de cambio
    const monedasValor = tasaCambio ? Object.keys(tasaCambio) : [];

    return (

 
        <div className="convertidor-container">
            <Helmet>
                <title>Conversión de moneda</title>
            </Helmet>

        <h1>Convertidor de Moneda</h1>

        <motion.div
            className="container-grid"
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: 0.2,
                        staggerChildren: 0.3,
                    }
                },
                hidden: { opacity: 0 }
            }}
        >

        <div className="input-container">
            <img src={getFlagUrl(monedaOrigen)} alt={`Bandera de ${monedaOrigen}`} />
                <select
                    id="monedaOrigen"
                    value={monedaOrigen}
                    onChange={(event) => setMonedaOrigen(event.target.value)}
                >
                    {monedasValor.map((moneda) => (
                        <option key={moneda} value={moneda}>
                            {moneda}
                        </option>
                    ))}
                </select>
            </div>
        
            <motion.div className="input-container" variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
                <img src={getFlagUrl(monedaDestino)} alt={`Bandera de ${monedaDestino}`} />
                <select value={monedaDestino} onChange={(event) => setMonedaDestino(event.target.value)}>
                    {monedasValor.map((moneda) => (
                        <option key={moneda} value={moneda}>
                            {moneda}
                        </option>
                    ))}
                </select>
            </motion.div>

            
            <motion.div className="input-container" variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
                <img src={getFlagUrl(monedaOrigen)} alt={`Bandera de ${monedaOrigen}`} />
                <input
                    type="text"
                    value={valor}
                    placeholder="Ingresar Monto"
                    onChange={(event) => setValor(event.target.value)}
                />
            </motion.div>

            <motion.div className="input-container resultado" variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
                <img src={getFlagUrl(monedaDestino)} alt={`Bandera de ${monedaDestino}`} />
                <input
                    type="text"
                    value={resultado}
                    readOnly
                    placeholder="Resultado"
                />
            </motion.div>



            <motion.div
                    className="botones-conver"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    >
                    <motion.button
                        onClick={calcular}
                        className="convertir"
                        initial={{ opacity: 0, y: -50 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                    >
                        Convertir
                    </motion.button>

                    <motion.button
                        onClick={cambiarValores}
                        className="cambiar"
                        initial={{ opacity: 0, y: -50 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                       
                    >
                        <PublishedWithChangesIcon/>
                    </motion.button>

                    <motion.button
                        onClick={limpiar}
                        className="limpiar"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                    >
                        Limpiar
                    </motion.button>
                    
                </motion.div>

            </motion.div>

        <motion.div
                className="update-container"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
            >
                {tasaCambio[monedaDestino] && (
                    <p className="moneda">$ 1 {monedaOrigen} = $ {tasaCambio[monedaDestino]} {monedaDestino}</p>
                )}
                <p className="fecha">Última fecha de actualización del tipo de cambio en el mercado: {fechaActualizada}</p>
            </motion.div>
        </div>
    );
}

export default Convertidor
