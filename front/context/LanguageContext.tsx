import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { setI18nConfig } from "@/localization/i18n";

export type LanguageType = "tr" | "en";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<LanguageType>("tr");
  const [isInitialized, setIsInitialized] = useState(false);

  // Dil tercihini yükle
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("languagePreference");
        
        if (savedLanguage) {
          setLanguageState(savedLanguage as LanguageType);
        } else {
          // Kullanıcı daha önce dil seçimi yapmamışsa, cihaz dilini kontrol et
          const deviceLocale = Localization.locale.split("-")[0]; // "tr-TR" -> "tr"
          // Şimdilik sadece Türkçe ve İngilizce destekliyoruz
          setLanguageState(deviceLocale === "en" ? "en" : "tr");
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.log("Dil yüklenirken hata oluştu:", error);
        setIsInitialized(true);
      }
    };

    loadLanguagePreference();
  }, []);

  // Dil değiştiğinde i18n config'i güncelle
  useEffect(() => {
    if (isInitialized) {
      setI18nConfig(language);
    }
  }, [language, isInitialized]);

  // Dil tercihini kaydet
  const setLanguage = useCallback((newLang: LanguageType) => {
    setLanguageState(newLang);
    AsyncStorage.setItem("languagePreference", newLang).catch(error => {
      console.log("Dil kaydedilirken hata oluştu:", error);
    });
  }, []);

  // Dil geçişini toggle et
  const toggleLanguage = useCallback(() => {
    const newLang = language === "tr" ? "en" : "tr";
    setLanguage(newLang);
  }, [language, setLanguage]);

  if (!isInitialized) {
    return null; // Dil yüklenene kadar içerik gösterilmeyecek
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}; 