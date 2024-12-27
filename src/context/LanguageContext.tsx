import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string, namespace?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: () => ''
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const translate = (key: string, namespace: string = 'common') => {
    try {
      // Dynamically import translation files
      const translations = require(`../locales/${language}/${namespace}.json`);
      
      // Split the key to handle nested translations
      const keys = key.split('.');
      return keys.reduce((obj, k) => obj[k], translations);
    } catch (error) {
      console.error(`Translation not found for key: ${key} in ${language}/${namespace}`);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
