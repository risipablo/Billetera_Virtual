import type { CurrencyInputProps } from "../types/type.convertidor";


export const CurrencyInput = ({
    value,
    onChange,
    currency,
    placeholder = '',
    readOnly = false
}: CurrencyInputProps) => {
    return (
        <div className="currency-input-wrapper">
            <span className="currency-flag">{currency}</span>
            <input
                type="text"
                className="currency-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
            />
        </div>
    );
};