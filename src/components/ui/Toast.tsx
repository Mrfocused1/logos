import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto-close timer
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colorMap = {
    success: 'text-success border-success/40 bg-success/10',
    error: 'text-error border-error/40 bg-error/10',
    warning: 'text-warning border-warning/40 bg-warning/10',
    info: 'text-info border-info/40 bg-info/10',
  };

  const Icon = iconMap[type];

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm p-4 shadow-glass max-w-sm w-full
        transition-all duration-300 ease-out
        ${colorMap[type]}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className="mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold mb-1">{title}</p>
          )}
          <p className="text-sm opacity-90">{message}</p>
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <X size={16} />
          <span className="sr-only">Close notification</span>
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemove} />
      ))}
    </div>
  );
};

export default Toast;