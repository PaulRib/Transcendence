import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Language } from "./translations";

type TranslationSection = keyof typeof translations.fr;
type TranslationKey = {
    [Section in TranslationSection]: `${Section}.${keyof typeof translations.fr[Section] & string}`;
}[TranslationSection];

type LanguageContextValue = {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: TranslationKey) => string;
};

type LanguageProviderProps = {
    children: ReactNode;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = "language";

function getStoredLanguage(): Language {
	const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

	if (storedLanguage === "fr" || storedLanguage === "en" || storedLanguage === "ru") {
		return storedLanguage;
	}
	return "fr";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
	const [language, setLanguageState] = useState<Language>(getStoredLanguage);

	const setLanguage = (newLanguage: Language) => {
		localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
		setLanguageState(newLanguage);
	}

	const value = useMemo(() => {
		return {
			language,
			setLanguage,
			t: (key: TranslationKey) => {
				const [section, item] = key.split(".") as [TranslationSection, string];

				return translations[language][section][item as keyof typeof translations.fr[typeof section]];
			},
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