import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import type { PasswordInputProps } from "../../features/types/type.user"

export const PasswordInput = ({
    onChange,
    value,
    placeholder,
    name = 'password',
    required = true
    }:PasswordInputProps) => {
    
    const [showPassword, setShowPassword] = useState<boolean>(false)


  return (
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
  )
}