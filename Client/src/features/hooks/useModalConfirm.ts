// src/hooks/useConfirmModal.ts
import React, { useState } from "react";
import { ModalConfirm } from '../../components/ui/modalConfirm';


interface ModalConfig {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

export const useConfirmModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<ModalConfig>({
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
    });
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

    const openModal = (
        action: () => void,
        title: string,
        message: string,
        confirmText: string = 'Confirmar',
        cancelText: string = 'Cancelar'
    ) => {
        setOnConfirmAction(() => action);
        setConfig({ title, message, confirmText, cancelText });
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setOnConfirmAction(null);
    };

    const confirm = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
        closeModal();
    };

    const ModalComponent = () =>
        React.createElement(ModalConfirm, {
            isOpen,
            onClose: closeModal,
            onConfirm: confirm,
            title: config.title,
            message: config.message,
            confirmText: config.confirmText,
            cancelText: config.cancelText,
        });

    return {
        openModal,
        closeModal,
        confirm,
        ModalComponent,
        isOpen
    };
};