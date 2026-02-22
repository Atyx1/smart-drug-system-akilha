import React, { createContext, useContext, useState, useCallback } from "react";
import CustomToast from "./CustomToast";

interface ToastData {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, "id">) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };

    setToasts((current) => {
      // Maksimum 3 toast göster
      const filtered = current.slice(-2);
      return [...filtered, newToast];
    });
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts }}>
      {children}
      {toasts.map((toast, index) => (
        <CustomToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          visible={true}
          onHide={() => hideToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </ToastContext.Provider>
  );
};

// Global toast instance için
let globalToastFunction: ((toast: Omit<ToastData, "id">) => void) | null = null;

export const setGlobalToastFunction = (
  fn: (toast: Omit<ToastData, "id">) => void
) => {
  globalToastFunction = fn;
};

export const showGlobalToast = (toast: Omit<ToastData, "id">) => {
  if (globalToastFunction) {
    globalToastFunction(toast);
  } else {
    console.warn("Global toast function not initialized");
  }
};
