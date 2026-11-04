import type { Language } from "../types";

const LOCALES: Record<Language, string> = { en: "en-US", ru: "ru-RU" };

const displayNames = new Map<Language, Intl.DisplayNames>();

function getDisplayNames(language: Language): Intl.DisplayNames {
    let names = displayNames.get(language);
    if (!names) {
        names = new Intl.DisplayNames(LOCALES[language], { type: "currency", fallback: "none" });
        displayNames.set(language, names);
    }
    return names;
}

export function currencyName(code: string, language: Language): string {
    try {
        return getDisplayNames(language).of(code) ?? "";
    } catch {
        return "";
    }
}

export function currencyLabel(code: string, language: Language): string {
    const name = currencyName(code, language);
    return name ? `${code} — ${name}` : code;
}
