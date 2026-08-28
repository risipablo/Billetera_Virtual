import { useEffect, useState } from "react";
import type { ExchangeRateResponse } from "./type.convertidor";
import axios from "axios";

const API_KEY = '8d54b9e42cae5652dec59f50';

export const useExchangeRate = (baseCurrency:string) => {
    const [rates,setRates] = useState<Record<string,number>>({})
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const feactRates = async () => {
            setLoading(true)
            setError(null)

        try{
            const response = await axios.get<ExchangeRateResponse>(
                `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
            )
            setRates(response.data.conversion_rates)

            const date = new Date(response.data.time_last_update_unix * 1000)
            setLastUpdated(date.toLocaleDateString('es-AR'))
        } catch (err){
            setError('Error al obtener las tasas de cambio');
            console.error(err);
        } finally {
            setLoading(false);
        }

    }
        feactRates()
    },[baseCurrency])

    const getFlagUrl = (currencyCode: string): string => {
        const countryCode = currencyCode.slice(0, 2).toLowerCase();
        return `https://flagcdn.com/${countryCode}.svg`;
    };

    return{
        rates,
        lastUpdated,
        loading,
        error,
        getFlagUrl
    }
}