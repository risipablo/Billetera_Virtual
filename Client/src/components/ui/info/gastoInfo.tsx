import {
    Wallet,
    Search,
    Filter,
    Bell,
    AlertCircle,
    Pencil,
    HelpCircleIcon,
    X,
    CheckCircle2,
    XCircle,
    Lightbulb,
    CircleCheckBig
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "../../../style/info.css";
import { useEffect, useState } from "react";

export const InfoGastos = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Cerrar con Escape, igual que el resto de los modales de la app
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
                                    <Wallet size={22} />
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
                                    Acá registrás todos tus gastos: del día, del mes o del año. Cada uno con
                                    su método de pago, estado y categoría, así después los podés encontrar fácil.
                                </p>

                                <div className="info-gastos__features">
                                    <div className="info-gastos__feature">
                                        <Search size={18} />
                                        <div>
                                            <strong>Buscador</strong>
                                            <p>Encontrá un gasto puntual por nombre, precio, fecha, estado o método de pago.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Filter size={18} />
                                        <div>
                                            <strong>Filtros</strong>
                                            <p>Mirá solo lo que te interesa: un mes, una categoría, un estado.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-gastos__section">
                                    <h3>Siempre vas a tener a mano</h3>
                                    <ul>
                                        <li>Tu <strong>último gasto registrado</strong></li>
                                        <li>Un <strong>contador total</strong> que se ajusta según los filtros</li>
                                        <li>Un <strong>input para tu límite mensual</strong></li>
                                    </ul>
                                    <p className="info-gastos__hint">
                                        Cuando te acercás al límite, el sistema te avisa. Si lo superás, se marca en rojo.
                                    </p>
                                </div>

                                <div className="info-gastos__note">
                                    <Bell size={18} />
                                    <p>
                                        La <strong>campanita</strong> de la izquierda te deja agregar notas
                                        para recordar gastos fijos o estimados.
                                    </p>
                                </div>

                                <div className="info-gastos__example">
                                    <h3>
                                        <Lightbulb size={16} />
                                        Ejemplo rápido
                                    </h3>
                                    <p>
                                        Gastaste <strong>$8.500 en la carneceria</strong> el 15/09/2026,
                                        pagaste con débito y ya lo pagaste.
                                    </p>
                                    <div className="info-gastos__example-grid">
                                        <span><strong>Producto:</strong> Bola de lomo</span>
                                        <span><strong>Monto:</strong> $8.500</span>
                                        <span><strong>Fecha:</strong> 15/09/2026</span>
                                        <span><strong>Método:</strong> Débito</span>
                                        <span><strong>Estado:</strong> Pagado</span>
                                        <span><strong>Condición:</strong> Necesario</span>
                                        <span><strong>Categoria:</strong> Comida</span>
                                    </div>
                                    <p className="info-gastos__example-result">
                                        Listo. Aparece en tu lista, se suma al total del mes, y si querés ver
                                        solo los gastos de septiembre, filtrás por mes y lo encontrás al instante.
                                    </p>
                                </div>

                                <div className="info-gastos__alert">
                                    <AlertCircle size={18} />
                                    <div>
                                        <h3>Ojo con los estados</h3>
                                        <p>No todos los estados suman al total:</p>
                                        <ul className="info-gastos__states">
                                            <li className="ok">
                                                <CheckCircle2 size={14} />
                                                <strong>Pagado</strong> — suma al total
                                            </li>
                                            <li className="ok">
                                                <CheckCircle2 size={14} />
                                                <strong>Impago</strong> — suma (es un pago futuro a considerar)
                                            </li>
                                            <li className="no">
                                                <XCircle size={14} />
                                                <strong>Deben</strong> — no suma
                                            </li>
                                            <li className="no">
                                                <XCircle size={14} />
                                                <strong>Cuotas</strong> — no suma
                                            </li>
                                            <li className="no">
                                                <XCircle size={14} />
                                                <strong>Inversión</strong> — no suma
                                            </li>
                                            <li className="no">
                                                <XCircle size={14} />
                                                <strong>Cajero</strong> — no suma
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="info-gastos__footer">
                                    <Pencil size={14} />
                                    Podés editar cualquier gasto cuando quieras.
                                </p>
                            </div>

                            <div className="info-modal-actions">
                                <button
                                    className="info-modal-btn"
                                    onClick={handleClose}
                                    type="button"
                                >
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