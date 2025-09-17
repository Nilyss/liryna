import React, { useEffect } from 'react';
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import './alert.scss';

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface AlertProps {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  autoClose?: number; // Fermeture automatique en ms
  confirmText?: string;
  cancelText?: string;
}

const Alert: React.FC<AlertProps> = ({
  id,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  onClose,
  autoClose,
  confirmText = 'Confirmer',
  cancelText = 'Annuler'
}) => {
  
  useEffect(() => {
    if (autoClose && type !== 'confirm') {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, type]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="alert__icon alert__icon--success" />;
      case 'warning':
        return <FiAlertTriangle className="alert__icon alert__icon--warning" />;
      case 'error':
        return <FiAlertCircle className="alert__icon alert__icon--error" />;
      case 'confirm':
        return <FiAlertTriangle className="alert__icon alert__icon--confirm" />;
      default:
        return <FiInfo className="alert__icon alert__icon--info" />;
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleClose = () => {
    if (type !== 'confirm') {
      onClose?.();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && type === 'confirm') {
      handleConfirm();
    }
  };

  return (
    <div 
      className="alert-overlay" 
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`alert-title-${id}`}
      aria-describedby={`alert-message-${id}`}
    >
      <div className={`alert alert--${type}`}>
        <div className="alert__header">
          <div className="alert__header-content">
            {getIcon()}
            {title && (
              <h3 className="alert__title" id={`alert-title-${id}`}>
                {title}
              </h3>
            )}
          </div>
          {type !== 'confirm' && (
            <button 
              className="alert__close"
              onClick={handleClose}
              aria-label="Fermer l'alerte"
              type="button"
            >
              <FiX />
            </button>
          )}
        </div>
        
        <div className="alert__body">
          <p className="alert__message" id={`alert-message-${id}`}>
            {message}
          </p>
        </div>
        
        {type === 'confirm' && (
          <div className="alert__actions">
            <button 
              className="alert__button alert__button--cancel"
              onClick={handleCancel}
              type="button"
            >
              {cancelText}
            </button>
            <button 
              className="alert__button alert__button--confirm"
              onClick={handleConfirm}
              type="button"
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;