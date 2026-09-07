import { Eye, EyeClosed } from "lucide-react"
import { useMemo, useState } from "react"
import type { PasswordInputProps } from "../../features/types/type.user"

type Strength = {
    score: number; 
    label: 'Débil' | 'Media' | 'Fuerte';
};

const getStrength = (password: string): Strength | null => {
    if (!password) return null;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label: Strength['label'] = 'Débil';
    if (score >= 5) label = 'Fuerte';
    else if (score >= 3) label = 'Media';

    return { score, label };
};

export const PasswordInput = ({
    onChange,
    value,
    placeholder,
    name = 'password',
    required = true,
    showStrength = false,
    }:PasswordInputProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const strength = useMemo(() => (showStrength ? getStrength(value) : null), [value, showStrength]);

  return (
    <div className="password-input-group">
        <div className="password-container">
            <input
                type={showPassword ? 'text' : 'password'}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
             />

             <span
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
             >
                {showPassword ? <Eye/> : <EyeClosed />}
             </span>
        </div>

        {strength && (
            <div className={`password-strength strength-${strength.label.toLowerCase()}`}>
                <div className="password-strength-bar">
                    <span className="password-strength-segment" />
                    <span className="password-strength-segment" />
                    <span className="password-strength-segment" />
                </div>
                <span className="password-strength-label">{strength.label}</span>
            </div>
        )}
    </div>
  )
}