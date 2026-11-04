import { createContext } from "react";

import type { TranslationKey } from "../i18n/translations";
import type { Language, Theme } from "../types";

export type PreferencesValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    theme: Theme;
    toggleTheme: () => void;
    t: (key: TranslationKey, params?: Record<string, string>) => string;
};

export const PreferencesContext = createContext<PreferencesValue | null>(null);
