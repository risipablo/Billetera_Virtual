import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./loader.css";
import image1 from "../../../../public/logo.png"

type SplashMode = "welcome" | "loading" | "logout";

interface SplashLoaderProps {
    mode?: SplashMode;
}

const FRASES_WELCOME = [
    "Bienvenido a Guita ",
    "Tu guita, bajo control",
    "Ordená tus gastos en segundos",
    "Empezá a controlar tu plata",
    "Todo en un solo lugar",
];

const FRASES_LOADING = [
    "Cargando tus datos...",
    "Preparando todo",
    "Casi listo...",
    "Un segundo más...",
];

const FRASES_LOGOUT = [
    "Cerrando sesión...",
    "Nos vemos pronto ",
    "Cuidá tu guita",
    "Volvé cuando quieras",
];

const FRASE_INTERVAL = 1200;

export const SplashLoader = ({ mode = "loading" }: SplashLoaderProps) => {
    const frases =
        mode === "welcome" ? FRASES_WELCOME :
        mode === "logout"  ? FRASES_LOGOUT  :
                             FRASES_LOADING;

    const [fraseIndex, setFraseIndex] = useState(0);

    useEffect(() => {
        setFraseIndex(0);

        const id = setInterval(() => {
            setFraseIndex((prev) => (prev + 1) % frases.length);
        }, FRASE_INTERVAL);

        return () => clearInterval(id);
    }, [mode, frases.length]);

    return (
        <div className={`splash-loader splash-${mode}`}>
            <motion.img
                src={image1}
                alt={mode === "logout" ? "Cerrando sesión..." : "Guita"}
                className="splash-logo"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                    opacity: 1,
                    scale:
                        mode === "logout"
                            ? [1, 0.96, 1]
                            : [1, 1.04, 1],
                }}
                transition={{
                    opacity: { duration: 0.5, ease: "easeOut" },
                    scale: {
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
            />

            <div className="splash-frase-container">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={`${mode}-${fraseIndex}`}
                        className="splash-frase"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                        {frases[fraseIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="splash-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
            </div>
        </div>
    );
};