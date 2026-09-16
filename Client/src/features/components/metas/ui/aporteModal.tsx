import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IMeta, AportePayload } from '../types/type.meta';

interface AporteModalProps {
    meta: IMeta | null;
    onClose: () => void;
    onSubmit: (metaId: string, payload: AportePayload) => Promise<void>;
    loading?: boolean;
}

export const AporteModal = ({ meta, onClose, onSubmit, loading }: AporteModalProps) => {
    const [monto, setMonto] = useState<number>(0);
    const [nota, setNota] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!meta || monto <= 0) return;
        await onSubmit(meta._id, { monto, nota: nota.trim() || undefined });
        setMonto(0);
        setNota('');
        onClose();
    };

    const restante = meta ? Math.max(0, meta.montoObjetivo - meta.montoActual) : 0;

    return (
        <AnimatePresence>
            {meta && (
                <motion.div
                    className="aporte-modal__overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.form
                        className="aporte-modal"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <h3>Agregar aporte a {meta.nombre}</h3>
                        <p className="aporte-modal__hint">
                            Falta {restante.toLocaleString('es-AR')} para completarla
                        </p>

                        <label>
                            Monto
                            <input
                                type="number"
                                value={monto || ''}
                                onChange={e => setMonto(Number(e.target.value))}
                                min={1}
                                required
                                autoFocus
                            />
                        </label>

                        <label>
                            Nota (opcional)
                            <input
                                type="text"
                                value={nota}
                                onChange={e => setNota(e.target.value)}
                                maxLength={200}
                            />
                        </label>

                        <div className="aporte-modal__actions">
                            <button type="button" onClick={onClose} disabled={loading}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading || monto <= 0}>
                                {loading ? 'Guardando...' : 'Aportar'}
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};