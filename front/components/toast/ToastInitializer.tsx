import React, { useEffect } from "react";
import { useToast, setGlobalToastFunction } from "./ToastManager";

const ToastInitializer: React.FC = () => {
  const { showToast } = useToast();

  useEffect(() => {
    // Global toast fonksiyonunu set et
    setGlobalToastFunction(showToast);

    return () => {
      setGlobalToastFunction(() => {});
    };
  }, [showToast]);

  return null; // Bu component render etmez
};

export default ToastInitializer;
