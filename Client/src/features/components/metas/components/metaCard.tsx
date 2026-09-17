import { motion } from 'framer-motion';
import type { IMeta } from '../types/type.meta';
import { ProgresoBar } from '../ui/progresoBar';
import { ModalConfirm } from '../../../../components/ui/modalConfirm';
import { useState } from 'react';


interface MetaCardProps {
    meta: IMeta;
    onAportar: (meta: IMeta) => void;
    onEliminar: (meta: IMeta) => void;
    onEditar: (meta: IMeta) => void;
}

const formatearMoneda = (valor: number): string =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(valor);

const formatearFecha = (fecha: string): string =>
    new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

export const MetaCard = ({ meta, onAportar, onEliminar, onEditar }: MetaCardProps) => {
    const completada = meta.estado === 'completada';
    const diasRestantes = Math.ceil(
        (new Date(meta.fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );


    // Delete modal
    const [showModal, setShowModal] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        confirmText: ""
    });
    
        
    const openDeleteModal = (
        action: () => void,
        title: string,
        message: string,
        confirmText: string
    ) => {
        setDeleteAction(() => action);
        setModalConfig({ title, message, confirmText });
        setShowModal(true);
    };

    const confirmModal = () => {
        if (deleteAction) {
            deleteAction();
            setShowModal(false);
            setDeleteAction(null);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`meta-card ${completada ? 'meta-card--completada' : ''}`}
        >
            <div className="meta-card__header">
                <div className="meta-card__title">
                    <div>
                        <h3>{meta.nombre}</h3>
                        {meta.descripcion && (
                            <p className="meta-card__desc">{meta.descripcion}</p>
                        )}
                    </div>
                </div>
 
                <span className={`meta-card__estado meta-card__estado--${meta.categoria}`}>
                    {meta.categoria}
                </span>

                <span className={`meta-card__estado meta-card__estado--${meta.estado}`}>
                    {meta.estado}
                </span>

            </div>

            <div className="meta-card__montos">
                <span className="meta-card__actual">{formatearMoneda(meta.montoActual)}</span>
                <span className="meta-card__objetivo">
                    de {formatearMoneda(meta.montoObjetivo)}
                </span>
            </div>

            <ProgresoBar progreso={meta.progreso} />

            <div className="meta-card__footer">
                <span className="meta-card__porcentaje">{meta.progreso.toFixed(0)}%</span>
                <span className="meta-card__fecha">
                    {completada
                        ? '🎉 ¡Completada!'
                        : diasRestantes > 0
                        ? `Fecha creada ${diasRestantes}`
                        : 'Fecha creada'}
                    {' · '}
                    {formatearFecha(meta.fecha)}
                </span>
            </div>

            <div className="meta-card__actions">
                {!completada && meta.estado !== 'cancelada' && (
                    <button
                        className="meta-card__btn meta-card__btn--primary"
                        onClick={() => onAportar(meta)}
                    >
                        + Aportar
                    </button>
                )}
                <button
                    className="meta-card__btn"
                    onClick={() => onEditar(meta)}
                >
                    Editar
                </button>
                <button
                    className="meta-card__btn meta-card__btn--danger"
                    onClick={() => openDeleteModal(
                        () => onEliminar(meta),
                        "Confirmar borrado",
                        "¿Estás seguro que deseas eliminar esta meta?",
                        "Eliminar"
                    )}
                >
                    Eliminar
                </button>
            </div>


            
            {showModal && ModalConfirm && (
                <ModalConfirm
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmModal}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    confirmText={modalConfig.confirmText}
                    cancelText="Cancelar"
                />
            )}
        </motion.div>
    );
};