// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { lightColors, darkColors } from "@/constant/theme";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  activeColorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeType>("system");
  const deviceTheme = useColorScheme() || "light";
  const [isInitialized, setIsInitialized] = useState(false);

  // Aktif renk şeması, sistem ayarlarına bağlı olarak belirlenir
  const activeColorScheme = theme === "system" 
    ? deviceTheme as "light" | "dark"
    : theme as "light" | "dark";

  const colors = activeColorScheme === "light" ? lightColors : darkColors;

  // Tema tercihini yükle
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themePreference");
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
        setIsInitialized(true);
      } catch (error) {
        console.log("Tema yüklenirken hata oluştu:", error);
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  // Tema tercihini kaydet
  const setTheme = useCallback((newTheme: ThemeType) => {
    setThemeState(newTheme);
    AsyncStorage.setItem("themePreference", newTheme).catch(error => {
      console.log("Tema kaydedilirken hata oluştu:", error);
    });
  }, []);

  // Tema geçişini buton vb. yerlerden tetikleyebilirsin
  const toggleTheme = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }, [theme, setTheme]);

  if (!isInitialized) {
    return null; // Tema yüklenene kadar içerik gösterilmeyecek
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme, activeColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
