import { createContext, useContext } from 'react';
import type { AlertType } from '../../components/alert/Alert';

export interface ShowAlertOptions {
  type: AlertType;
  title?: string;
  message: string;
  autoClose?: number;
  confirmText?: string;
  cancelText?: string;
}

export interface AlertContextType {
  showAlert: (options: ShowAlertOptions) => Promise<boolean>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  showInfo: (message: string, title?: string, autoClose?: number) => Promise<boolean>;
  showSuccess: (message: string, title?: string, autoClose?: number) => Promise<boolean>;
  showWarning: (message: string, title?: string, autoClose?: number) => Promise<boolean>;
  showError: (message: string, title?: string, autoClose?: number) => Promise<boolean>;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};