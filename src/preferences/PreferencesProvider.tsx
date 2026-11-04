import { useCallback, useEffect, useMemo, useState } from "react";

import { translations } from "../i18n/translations";
import { loadLanguage, loadTheme, saveLanguage, saveTheme } from "../storage/preferences";
import { PreferencesContext } from "./PreferencesContext";

import type { ReactNode } from "react";
import type { PreferencesValue } from "./PreferencesContext";
import type { Language, Theme } from "../types";

const THEME_COLORS: Record<Theme, string> = { light: "#f6f5fa", dark: "#0e0f14" };

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(loadLanguage);
    const [theme, setThemeState] = useState<Theme>(loadTheme);

    useEffect(() => {
        document.documentElement.lang = language;
        document.title = translations[language].title;
    }, [language]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
    }, [theme]);

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next);
        saveLanguage(next);
    }, []);

    const toggleTheme = useCallback(() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setThemeState(next);
        saveTheme(next);
    }, [theme]);

    const t = useCallback<PreferencesValue["t"]>(
        (key, params) => {
            const text = translations[language][key];
            if (!params) return text;
            return text.replace(/\{(\w+)\}/g, (match, name: string) => params[name] ?? match);
        },
        [language],
    );

    const value = useMemo(
        () => ({ language, setLanguage, theme, toggleTheme, t }),
        [language, setLanguage, theme, toggleTheme, t],
    );

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
