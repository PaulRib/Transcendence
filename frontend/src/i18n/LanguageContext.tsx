import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Language } from "./translations";

type Translations = typeof translations.fr;
type TranslationSection = keyof Translations;

type TranslationKey = {
  [Section in TranslationSection]: `${Section}.${keyof Translations[Section] & string}`;
}[TranslationSection];

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

type LanguageProviderProps = {
  children: ReactNode;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = "language";
const DEFAULT_LANGUAGE: Language = "fr";

function isLanguage(value: unknown): value is Language {
  return value === "fr" || value === "en" || value === "ru";
}

function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = (newLanguage: Language) => {
    if (!isLanguage(newLanguage)) {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    setLanguageState(newLanguage);
  };

  const value = useMemo(() => {
    const t = (key: TranslationKey): string => {
      const [section, item] = key.split(".") as [
        TranslationSection,
        keyof Translations[TranslationSection] & string
      ];

      const translatedValue = translations[language][section]?.[item];

      if (translatedValue === undefined) {
        throw new Error(`Missing translation: ${language}.${key}`);
      }

      return translatedValue;
    };

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}