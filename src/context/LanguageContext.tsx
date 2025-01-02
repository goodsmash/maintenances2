import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'es' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string, namespace?: string) => any;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: () => ''
});

// Import all translations
import enContractorServices from '../locales/en/contractorServices';
import esContractorServices from '../locales/es/contractorServices';
import zhContractorServices from '../locales/zh/contractorServices';
import enApplianceServices from '../locales/en/applianceServices';
import esApplianceServices from '../locales/es/applianceServices';
import zhApplianceServices from '../locales/zh/applianceServices';

const translations = {
  en: {
    contractorServices: enContractorServices,
    applianceServices: enApplianceServices
  },
  es: {
    contractorServices: esContractorServices,
    applianceServices: esApplianceServices
  },
  zh: {
    contractorServices: zhContractorServices,
    applianceServices: zhApplianceServices
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const translate = (key: string, namespace: string = 'common') => {
    try {
      const translationSet = translations[language][namespace];
      if (!translationSet) {
        console.error(`Translation namespace not found: ${namespace}`);
        return key;
      }

      // Split the key to handle nested translations
      const keys = key.split('.');
      let result = keys.reduce((obj, k) => obj?.[k], translationSet);

      // If the result is undefined, return the key
      if (result === undefined) {
        console.error(`Translation not found for key: ${key} in ${language}/${namespace}`);
        return key;
      }

      return result;
    } catch (error) {
      console.error(`Translation error for key: ${key} in ${language}/${namespace}`, error);
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
