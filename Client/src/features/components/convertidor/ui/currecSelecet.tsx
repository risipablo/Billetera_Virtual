import type { CurrencySelectProps } from "../types/type.convertidor";



export const CurrencySelect = ({
    value,
    onChange,
    currencies,
    label
}: CurrencySelectProps) => {
    return (
        <div className="currency-select-wrapper">
            {label && <label className="currency-label">{label}</label>}
            <select
                className="currency-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    );
};