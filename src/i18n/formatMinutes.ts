import type { Language } from "../types";

const LOCALES: Record<Language, string> = { en: "en-US", ru: "ru-RU" };

export function formatMinutes(minutes: number, language: Language): string {
    return new Intl.NumberFormat(LOCALES[language], {
        style: "unit",
        unit: "minute",
        unitDisplay: "short",
    }).format(minutes);
}
