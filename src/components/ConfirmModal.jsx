import React from 'react';
import '../styles/ConfirmModal.css';

/**
 * ConfirmModal: Un modal estético para confirmaciones críticas.
 * @param {boolean} isOpen - Controla la visibilidad.
 * @param {string} title - Título del modal.
 * @param {string} message - Mensaje descriptivo.
 * @param {string} confirmText - Texto del botón de acción.
 * @param {string} cancelText - Texto del botón de cancelar.
 * @param {function} onConfirm - Callback al confirmar.
 * @param {function} onCancel - Callback al cancelar/cerrar.
 * @param {string} type - 'danger' | 'info' (cambia colores/iconos)
 */
const ConfirmModal = ({ 
    isOpen, 
    title, 
    message, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar", 
    onConfirm, 
    onCancel,
    type = 'info'
}) => {
    if (!isOpen) return null;

    const icon = type === 'danger' ? '⚠️' : 'ℹ️';

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-modal-icon ${type}`}>
                    {icon}
                </div>
                <h2 className="confirm-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>
                
                <div className="confirm-modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`btn-confirm ${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
