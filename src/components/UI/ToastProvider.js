/**
 * Toast Context and Provider
 * Global toast notification system
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
    action: null,
    actionLabel: '',
    duration: 3000,
  });

  const showToast = useCallback(({
    message,
    type = 'info',
    duration = 3000,
    action = null,
    actionLabel = '',
  }) => {
    setToast({
      visible: true,
      message,
      type,
      duration,
      action,
      actionLabel,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    showToast({ message, type: 'success', ...options });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    showToast({ message, type: 'error', ...options });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    showToast({ message, type: 'warning', ...options });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    showToast({ message, type: 'info', ...options });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, warning, info }}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        action={toast.action}
        actionLabel={toast.actionLabel}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
