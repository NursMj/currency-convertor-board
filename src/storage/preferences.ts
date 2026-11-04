import type { Language, Theme } from "../types";

const LANGUAGE_KEY = "currency-board:language";
const THEME_KEY = "currency-board:theme";

function read(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // storage unavailable; the choice lasts until the page closes
    }
}

export function loadLanguage(): Language {
    const saved = read(LANGUAGE_KEY);
    if (saved === "en" || saved === "ru") return saved;
    return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function saveLanguage(language: Language): void {
    write(LANGUAGE_KEY, language);
}

export function loadTheme(): Theme {
    const saved = read(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(theme: Theme): void {
    write(THEME_KEY, theme);
}
