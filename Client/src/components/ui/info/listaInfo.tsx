import {
    ShoppingCart,
    Plus,
    Check,
    Trash2,
    HelpCircleIcon,
    X,
    CircleCheckBig,
    Lightbulb
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";


export const InfoLista = () => {
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
                            className="custom-modal"
                            initial={{ scale: 0.92, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 16 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <header className="info-gastos__header">
                                <div className="info-gastos__header-title">
                                    <ShoppingCart size={22} />
                                    <h2>¿Cómo funciona esta sección?</h2>
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
                                    Acá armás tu lista del súper o de lo que necesites comprar. La tildás mientras
                                    comprás y después la borrás. Simple y directo.
                                </p>

                                <div className="info-gastos__features">
                                    <div className="info-gastos__feature">
                                        <Plus size={18} />
                                        <div>
                                            <strong>Agregar producto</strong>
                                            <p>Ponés el nombre y la cantidad. Podés agruparlos por categoría.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Check size={18} />
                                        <div>
                                            <strong>Tildar</strong>
                                            <p>Cuando lo comprás, lo marcás. Queda tachado pero visible.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Trash2 size={18} />
                                        <div>
                                            <strong>Limpiar</strong>
                                            <p>Cuando terminás, borrás los tildados o toda la lista.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-gastos__example">
                                    <h3>
                                        <Lightbulb size={16} />
                                        Ejemplo rápido
                                    </h3>
                                    <p>Vas al súper el sábado. Armás la lista la noche anterior:</p>
                                    <div className="info-gastos__example-grid">
                                        <span>🥛 Leche x2</span>
                                        <span>🍞 Pan</span>
                                        <span>🧻 Papel higiénico</span>
                                        <span>🍗 Pollo 1kg</span>
                                        <span>🍎 Manzanas 2kg</span>
                                    </div>
                                    <p className="info-gastos__example-result">
                                        En el súper vas tildando lo que agarrás. Lo que no encontrás queda sin tildar.
                                        Al volver, borrás los tildados y te queda solo lo pendiente para la próxima.
                                    </p>
                                </div>

                                <div className="info-gastos__note">
                                    <ShoppingCart size={18} />
                                    <p>
                                        <strong>Tip:</strong> agrupá por pasillo (lácteos, carnes, limpieza) para no
                                        dar vueltas en el súper. Vas directo a lo que necesitás.
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