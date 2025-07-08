import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600',
          background: 'from-red-50 to-red-100'
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600',
          background: 'from-yellow-50 to-yellow-100'
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          confirmButton: 'bg-blue-500 hover:bg-blue-600',
          background: 'from-blue-50 to-blue-100'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-modal-in">
        <div className={`bg-gradient-to-r ${styles.background} p-6 rounded-t-2xl`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${styles.icon}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <X className="w-4 h-4" />
              <span>{cancelText}</span>
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 flex items-center justify-center space-x-2 ${styles.confirmButton} text-white py-3 rounded-xl font-semibold transition-all`}
            >
              <Check className="w-4 h-4" />
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;