// components/NavigationChangeListener.tsx
import React, { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";

interface NavigationChangeListenerProps {
  children: React.ReactNode;
}

export const NavigationChangeListener: React.FC<
  NavigationChangeListenerProps
> = ({ children }) => {
  const { checkUserUpdate, user } = useAuth();
  const lastCheckedRef = useRef<number>(Date.now());

  useFocusEffect(
    useCallback(() => {
      const CHECK_INTERVAL = 5 * 60 * 1000; // 5 dakika
      const now = Date.now();

      const checkUpdate = async () => {
        if (now - lastCheckedRef.current > CHECK_INTERVAL && user?.id) {
          try {
            await checkUserUpdate();
            lastCheckedRef.current = now;
          } catch (error) {
            console.error("Navigation check update error:", error);
          }
        }
      };

      checkUpdate();
    }, [user?.id])
  );

  return <>{children}</>;
};

export default NavigationChangeListener;
