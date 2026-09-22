import {
    Target,
    TrendingUp,
    Plus,
    Calendar,
    HelpCircleIcon,
    X,
    CircleCheckBig,
    PlayCircle,
    PauseCircle,
    CheckCircle2,
    XCircle,
    Lightbulb
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";


export const InfoMetas = () => {
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
                                    <Target size={22} />
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
                                    Acá creás objetivos de ahorro: un viaje, una notebook, un fondo de emergencia.
                                    Le pones un monto y una fecha, y vas sumando aportes hasta cumplirla.
                                </p>

                                <div className="info-gastos__features">
                                    <div className="info-gastos__feature">
                                        <Plus size={18} />
                                        <div>
                                            <strong>Crear meta</strong>
                                            <p>Nombre, monto objetivo, fecha límite, ícono y color. Todo en un minuto.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <TrendingUp size={18} />
                                        <div>
                                            <strong>Aportar</strong>
                                            <p>Cada vez que guardás plata, sumás un aporte. La barra te muestra el avance.</p>
                                        </div>
                                    </div>

                                    <div className="info-gastos__feature">
                                        <Calendar size={18} />
                                        <div>
                                            <strong>Filtrar</strong>
                                            <p>Mirá solo las activas, las pausadas o las que ya completaste.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-gastos__section">
                                    <h3>Estados de una meta</h3>
                                    <ul className="info-gastos__states">
                                        <li className="ok">
                                            <PlayCircle size={14} />
                                            <strong>Activa</strong> — estás sumando aportes
                                        </li>
                                        <li className="warn">
                                            <PauseCircle size={14} />
                                            <strong>Pausada</strong> — la dejaste en pausa un tiempo
                                        </li>
                                        <li className="ok">
                                            <CheckCircle2 size={14} />
                                            <strong>Completada</strong> — llegaste al objetivo
                                        </li>
                                        <li className="no">
                                            <XCircle size={14} />
                                            <strong>Cancelada</strong> — la dejaste sin terminar
                                        </li>
                                    </ul>
                                    <p className="info-gastos__hint">
                                        Cuando los aportes igualan el monto objetivo, la meta pasa a <strong>Completada</strong> sola.
                                    </p>
                                </div>

                                <div className="info-gastos__example">
                                    <h3>
                                        <Lightbulb size={16} />
                                        Ejemplo rápido
                                    </h3>
                                    <p>
                                        Querés juntar <strong>$500.000 para un viaje a Europa</strong> en julio 2027.
                                    </p>
                                    <div className="info-gastos__example-grid">
                                        <span><strong>Nombre:</strong> Viaje Bariloche</span>
                                        <span><strong>Monto:</strong> $500.000</span>
                                        <span><strong>Fecha límite:</strong> 15/07/2027</span>
                                        <span><strong>Ícono:</strong> ✈️</span>
                                        <span><strong>Color:</strong> Azul</span>
                                    </div>
                                    <p className="info-gastos__example-result">
                                        Cada mes aportás $50.000. En 10 meses llegás. La barra te muestra el avance
                                        y cuando completás los $500.000, la meta se marca sola como <strong>Completada</strong>.
                                    </p>
                                </div>

                                <div className="info-gastos__note">
                                    <TrendingUp size={18} />
                                    <p>
                                        <strong>Tip:</strong> creá metas con montos realistas. Si te ponés $1.000.000
                                        en 2 meses y ganás menos, la vas a pausar. Mejor pasos chicos y constantes.
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