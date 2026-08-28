import { Collapse } from "@mui/material";

import { ChevronDown } from "lucide-react";
import { TransitionGroup } from 'react-transition-group';
import "../../style/auth.css"
import type { PasswordRequirementsProps } from "../../features/types/type.user";


export const PasswordRequirements = ({
    onToggle,
    show
}:PasswordRequirementsProps) => {

    const requirements: string[] = [
        "Al menos 8 caracteres",
        "Una letra mayúscula",
        "Un número",
        "Un carácter especial",
        "Sin espacios"
    ];

    return (
        <>
            <div 
                onClick={onToggle} 
                className="password-requirements-toggle"
                role="button"
                tabIndex={0}
                aria-expanded={!show}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onToggle();
                    }
                }}
            >
                <ChevronDown size={18} style={{ 
                    transform: !show ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 0.2s ease'
                }} />
                <span>Requisitos</span>
            </div>

            <TransitionGroup>
                {!show && 
                    <Collapse>
                        <ul className='p3'>
                            {requirements.map((req, id) => (
                                <li key={id}>{req}</li>
                            ))}
                        </ul>
                    </Collapse>
                }
            </TransitionGroup>
        </>
    );
}