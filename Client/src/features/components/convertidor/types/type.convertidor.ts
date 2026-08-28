
export interface ExchangeRateResponse {
    conversion_rates: Record<string, number>;
    time_last_update_unix: number;
    base_code: string;
}

export interface CurrencySelectProps {
    value: string;
    onChange: (value: string) => void;
    currencies: string[];
    label?: string;
}

export interface CurrencyInputProps {
    value: string;
    onChange: (value: string) => void;
    currency: string;
    placeholder?: string;
    readOnly?: boolean;
}