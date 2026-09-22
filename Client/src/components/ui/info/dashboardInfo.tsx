import {
    LayoutDashboard,
    TrendingUp,
    Target,
    AlertCircle,
    HelpCircleIcon,
    X,
    CircleCheckBig
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";


export const InfoDashboard = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    return (
        <div className="info-container">
            <button
                className="info-container__trigger"
                onClick={handleClick}
                type="button"
                aria-label="Ayuda sobre esta sección"
            >
                <HelpCircleIcon size={20} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="custom-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                    >
                        <motion.div
                            className="custom-modal info-gastos--compact"
                            initial={{ scale: 0.92, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 16 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header className="info-gastos__header">
                                <div className="info-gastos__header-title">
                                    <LayoutDashboard size={22} />
                                    <h2>Tu resumen del mes, en un vistazo</h2>
                                </div>
                                <button
                                    className="info-modal-close"
                                    onClick={handleClose}
                                    type="button"
                                    aria-label="Cerrar"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            <div className="info-gastos__body">
                                <p className="info-gastos__intro">
                                    Esto es lo que ves cuando entrás a Guita. Todo lo importante, resumido.
                                </p>

                                <div className="info-gastos__features">
                                    <div className="info-gastos__feature">
                                        <TrendingUp size={18} />
                                        <div>
                                            <strong>Total y comparación</strong>
                                            <p>Cuánto llevás gastado este mes y cómo se compara con el mes pasado.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <AlertCircle size={18} />
                                        <div>
                                            <strong>Estado de pagos</strong>
                                            <p>Qué pagaste y qué tenés pendiente. Los impagos aparecen listados abajo.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Target size={18} />
                                        <div>
                                            <strong>Top productos y categorías</strong>
                                            <p>En qué se fue tu plata este mes. Los 3 primeros de cada uno.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-gastos__note">
                                    <AlertCircle size={18} />
                                    <p>
                                        <strong>Tip:</strong> si ves un número en rojo, significa que estás por
                                        pasarte del límite o tenés algo vencido. Es tu señal para revisar.
                                    </p>
                                </div>
                            </div>

                            <div className="info-modal-actions">
                                <button className="info-modal-btn" onClick={handleClose} type="button">
                                    <CircleCheckBig size={18} />
                                    Entendido
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};