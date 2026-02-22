import { I18n } from "i18n-js";
import { translations } from "./translations";
import { LanguageType } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

// i18n konfigürasyonu
const i18n = new I18n(translations);

// Varsayılan dil
i18n.defaultLocale = "tr";
i18n.locale = "tr";
i18n.enableFallback = true;

// Mevcut dil değişimini içeren bir event emitter 
let languageChangeListeners: Function[] = [];

export const setI18nConfig = (language: LanguageType) => {
  i18n.locale = language;
  // Tüm dinleyicileri bilgilendir
  languageChangeListeners.forEach(listener => listener(language));
};

// Statik çeviri fonksiyonu (eski kod için geriye dönük uyumluluk)
export const t = (key: string, options?: Record<string, any>) => {
  return i18n.t(key, options);
};

// Hook tabanlı çeviri fonksiyonu
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  
  useEffect(() => {
    // Dil değişikliğini dinle
    const listener = (language: string) => {
      setCurrentLanguage(language);
    };
    
    // Listener'ı kaydet
    languageChangeListeners.push(listener);
    
    // Component unmount edildiğinde listener'ı kaldır
    return () => {
      languageChangeListeners = languageChangeListeners.filter(l => l !== listener);
    };
  }, []);
  
  // t fonksiyonunu hook'un içinden geri döndür
  return {
    t: (key: string, options?: Record<string, any>) => i18n.t(key, options),
    i18n,
    currentLanguage
  };
};

export default i18n; 