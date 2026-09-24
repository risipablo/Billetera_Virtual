import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    Wallet,
    BarChart3,
    Target,
    CreditCard,
    ShoppingCart,
    ArrowRightLeft,
    Lightbulb,
    LayoutDashboard,
    Check
} from "lucide-react";
import "../../style//welcomeModal.css";

interface WelcomeModalProps {
    userName: string;
    userId: string;
}

const SECCIONES = [
    {
        icon: LayoutDashboard,
        titulo: "Dashboard",
        descripcion: "Tu resumen del mes: total gastado, cuotas por vencer y estado de pagos.",
        color: "#1e3a8a"
    },
    {
        icon: Wallet,
        titulo: "Gastos",
        descripcion: "Registrá cada pago y clasificalo por categoría, método y condición.",
        color: "#3b82f6"
    },
    {
        icon: BarChart3,
        titulo: "Estadísticas",
        descripcion: "Mirá tus gastos por mes, año, categoría o producto. Descubrí patrones.",
        color: "#8b5cf6"
    },
    {
        icon: CreditCard,
        titulo: "Cuotas",
        descripcion: "Cargá tus compras en cuotas y el sistema te avisa cuándo vence la próxima.",
        color: "#10b981"
    },
    {
        icon: Target,
        titulo: "Metas",
        descripcion: "Creá objetivos de ahorro y seguí tu progreso mes a mes.",
        color: "#f59e0b"
    },
    {
        icon: ShoppingCart,
        titulo: "Lista de compras",
        descripcion: "Armá tu lista del súper y tildá lo que ya compraste.",
        color: "#ec4899"
    },
    {
        icon: ArrowRightLeft,
        titulo: "Convertidor",
        descripcion: "Pasá montos entre monedas con el valor actualizado.",
        color: "#06b6d4"
    },
    {
        icon: Lightbulb,
        titulo: "Consejos",
        descripcion: "Tips simples de ahorro e inversión para mejorar tus finanzas.",
        color: "#eab308"
    }
];

export const WelcomeModal = ({ userName, userId }: WelcomeModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const storageKey = `welcomeShown_${userId}`;

    useEffect(() => {
       

        if (!userId) {
       
            return;
        }

        const yaMostrado = localStorage.getItem(storageKey);
       

        if (!yaMostrado) {
       
            const timer = setTimeout(() => setIsOpen(true), 600);
            return () => clearTimeout(timer);
        } else {
       
        }
    }, [userId, storageKey]);

    const handleClose = () => {
        if (userId) {
            localStorage.setItem(storageKey, "true");
        }
        setIsOpen(false);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="welcome-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        className="welcome-modal"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="welcome-modal__close"
                            onClick={handleClose}
                            aria-label="Cerrar"
                        >
                            <X size={20} />
                        </button>

                        <motion.header
                            className="welcome-modal__header"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                        >
                            
                            <h2>¡Bienvenido, {userName || 'che'}!</h2>
                            <p>
                                Guita es tu billetera virtual para saber <strong>en qué se va tu plata</strong> y
                                tomar mejores decisiones. Te mostramos lo que podés hacer:
                            </p>
                        </motion.header>

                        <div className="welcome-modal__grid">
                            {SECCIONES.map((sec, idx) => {
                                const Icon = sec.icon;
                                return (
                                    <motion.div
                                        key={sec.titulo}
                                        className="welcome-modal__card"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.2 + idx * 0.05,
                                            duration: 0.3
                                        }}
                                    >
                                        <div
                                            className="welcome-modal__card-icon"
                                            style={{
                                                background: `${sec.color}18`,
                                                color: sec.color
                                            }}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <div className="welcome-modal__card-body">
                                            <h3>{sec.titulo}</h3>
                                            <p>{sec.descripcion}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            className="welcome-modal__tip"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            <Lightbulb size={16} />
                            <p>
                                <strong>Tip:</strong> empezá cargando tus gastos del mes.
                                Cuanto más cargues, mejores van a ser tus estadísticas.
                            </p>
                        </motion.div>

                        <motion.footer
                            className="welcome-modal__footer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                        >
                            <button
                                className="welcome-modal__btn"
                                onClick={handleClose}
                            >
                                <Check size={18} />
                                <span>Entendido, no volver a mostrar</span>
                            </button>
                        </motion.footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};