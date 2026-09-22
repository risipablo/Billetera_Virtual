import {
    CreditCard,
    Calendar,
    Bell,
    AlertCircle,
    HelpCircleIcon,
    X,
    CircleCheckBig,
    CheckCircle2,
    Clock,
    XCircle,
    CalendarClock,
    Lightbulb
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";


export const InfoCuotas = () => {
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
                                    <CreditCard size={22} />
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
                                    Acá cargás las compras en cuotas: la notebook, la heladera, el celular.
                                    El sistema te arma las cuotas automáticamente y te avisa cuando vence la próxima.
                                </p>

                                <div className="info-gastos__features">
                                    <div className="info-gastos__feature">
                                        <CreditCard size={18} />
                                        <div>
                                            <strong>Crear nota</strong>
                                            <p>Ponés el total, cuántas cuotas y cuándo vence la primera. El resto lo hace el sistema.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Calendar size={18} />
                                        <div>
                                            <strong>Marcar pagada</strong>
                                            <p>A medida que pagás cada cuota, la marcás. La barra se va llenando.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Bell size={18} />
                                        <div>
                                            <strong>Aviso de vencimiento</strong>
                                            <p>La card te avisa cuando la próxima cuota vence pronto, vence hoy o ya venció.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-gastos__section">
                                    <h3>Estados de vencimiento</h3>
                                    <ul className="info-gastos__states">
                                        <li className="ok">
                                            <CheckCircle2 size={14} />
                                            <strong>Completada</strong> — todas las cuotas pagadas
                                        </li>
                                        <li className="warn">
                                            <Clock size={14} />
                                            <strong>Por vencer</strong> — vence en menos de 7 días
                                        </li>
                                        <li className="no">
                                            <XCircle size={14} />
                                            <strong>Vencida</strong> — la fecha ya pasó y no la marcaste
                                        </li>
                                        <li className="info">
                                            <CalendarClock size={14} />
                                            <strong>Normal</strong> — falta más de una semana
                                        </li>
                                    </ul>
                                </div>

                                <div className="info-gastos__example">
                                    <h3>
                                        <Lightbulb size={16} />
                                        Ejemplo rápido
                                    </h3>
                                    <p>
                                        Compraste una <strong>notebook en 6 cuotas de $85.000</strong> el 18/09/2026.
                                    </p>
                                    <div className="info-gastos__example-grid">
                                        <span><strong>Total:</strong> $510.000</span>
                                        <span><strong>Cuotas:</strong> 6</span>
                                        <span><strong>Compra:</strong> 18/09/2026</span>
                                        <span><strong>Primera cuota:</strong> 18/10/2026</span>
                                    </div>
                                    <p className="info-gastos__example-result">
                                        El sistema crea las 6 cuotas: la 1° el 18/10, la 2° el 18/11, y así hasta el 18/03/2027.
                                        Cada mes marcás la que pagaste. Cuando llegás a las 6, la nota queda <strong>Completada</strong>.
                                    </p>
                                </div>

                                <div className="info-gastos__alert">
                                    <AlertCircle size={18} />
                                    <div>
                                        <h3>Atenti a los vencimientos</h3>
                                        <p>
                                            Si una cuota vence y no la marcás, la card se pone en rojo y te avisa:
                                            <strong> "Vencida hace 3 días"</strong>. Así no te olvidás de pagar.
                                        </p>
                                    </div>
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