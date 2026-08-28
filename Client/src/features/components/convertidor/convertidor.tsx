
import { useState } from "react";
import { motion } from "framer-motion";
import { PublishedWithChanges } from "@mui/icons-material";
import "./style/convertidor.css";
import { useExchangeRate } from "./types/useExchangeRate";
import { Spinner } from "../../../components/ui/spinner/spinner";

const Convertidor = () => {
    const [valor, setValor] = useState<string>('');
    const [resultado, setResultado] = useState<string>('');
    const [monedaOrigen, setMonedaOrigen] = useState<string>('USD');
    const [monedaDestino, setMonedaDestino] = useState<string>('ARS');

    const { rates, lastUpdated, loading, error, getFlagUrl } = useExchangeRate(monedaOrigen);
    const currencies = rates ? Object.keys(rates) : [];

    const calcular = () => {
        const numero = parseFloat(valor);
        if (isNaN(numero) || !rates[monedaDestino] || !rates[monedaOrigen]) {
            setResultado('0');
            return;
        }
        const resultadoConver = (numero / rates[monedaOrigen]) * rates[monedaDestino];
        setResultado(resultadoConver.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
    };

    const limpiar = () => {
        setResultado('');
        setValor('');
    };

    const cambiarValores = () => {
        setMonedaOrigen(monedaDestino);
        setMonedaDestino(monedaOrigen);
    };

    if (loading) {
        return (
            <div className="convertidor-loading">
                <Spinner size="lg" label="Cargando tasas de cambio..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="convertidor-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="convertidor-container">
                
                <h1 className="convertidor-title">Convertidor de Moneda</h1>

                <motion.div
                    className="convertidor-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
                        hidden: { opacity: 0 }
                    }}
                >
                
                    <motion.div
                        className="convertidor-row"
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    >
                        <div className="convertidor-group">
                            <div className="convertidor-select-wrapper">
                                <img
                                    src={getFlagUrl(monedaOrigen)}
                                    alt={monedaOrigen}
                                    className="convertidor-flag"
                                />
                                <select
                                    className="convertidor-select"
                                    value={monedaOrigen}
                                    onChange={(e) => setMonedaOrigen(e.target.value)}
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="text"
                                className="convertidor-input"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                placeholder="Ingresar Monto"
                            />
                        </div>

                        {/* Botón intercambiar (entre filas) */}
                        <button
                            className="convertidor-swap"
                            onClick={cambiarValores}
                            aria-label="Intercambiar monedas"
                        >
                            <PublishedWithChanges />
                        </button>
                    </motion.div>

                    {/* Fila 2: Destino + Resultado */}
                    <motion.div
                        className="convertidor-row"
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    >
                        <div className="convertidor-group">
                            <div className="convertidor-select-wrapper">
                                <img
                                    src={getFlagUrl(monedaDestino)}
                                    alt={monedaDestino}
                                    className="convertidor-flag"
                                />
                                <select
                                    className="convertidor-select"
                                    value={monedaDestino}
                                    onChange={(e) => setMonedaDestino(e.target.value)}
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="text"
                                className="convertidor-input convertidor-resultado-input"
                                value={resultado}
                                readOnly
                                placeholder="Resultado"
                            />
                        </div>
                    </motion.div>

                    {/* Botones de acción */}
                    <motion.div
                        className="convertidor-actions"
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    >
                        <button className="convertidor-btn convertidor-btn-primary" onClick={calcular}>
                            Convertir
                        </button>
                        <button className="convertidor-btn convertidor-btn-secondary" onClick={limpiar}>
                            Limpiar
                        </button>
                    </motion.div>
                </motion.div>

                {/* Información de tasas */}
                <motion.div
                    className="convertidor-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                >
                    {rates[monedaDestino] && (
                        <p className="convertidor-tasa">
                            1 {monedaOrigen} = {rates[monedaDestino]} {monedaDestino}
                        </p>
                    )}
                    <p className="convertidor-fecha">Actualizado: {lastUpdated}</p>
                </motion.div>
            </div>
        </div>
        
    );
};

export default Convertidor;