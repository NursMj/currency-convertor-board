import type { Language } from "../types";

export const LANGUAGES: Language[] = ["en", "ru"];

const en = {
    title: "Currency board",
    subtitleBefore: "Type an amount or a quick sum like ",
    subtitleExample: "12*1.1",
    subtitleAfter: " and the other side updates as you go.",
    addNewCurrency: "Add new currency",
    deletePair: "Delete pair",
    deletePairNamed: "Delete {pair} pair",
    modalTitle: "Add new currency",
    close: "Close",
    from: "From",
    to: "To",
    rate: "Rate",
    loading: "Loading…",
    sameCurrency: "Choose two different currencies.",
    rateFailed: "Couldn't load the rate. Try again later.",
    rateLive: "Live rate, updated every {interval}.",
    ratesUpdating: "Updating rates…",
    ratesUpdated: "Rates updated {time} (updates every {interval})",
    ratesFailed: "Couldn't update rates.",
    ratesFailedLast: "Couldn't update rates. Last update: {time}",
    cancel: "Cancel",
    addPair: "Add pair",
    language: "Language",
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
};

export type TranslationKey = keyof typeof en;

const ru: Record<TranslationKey, string> = {
    title: "Курсы валют",
    subtitleBefore: "Введите сумму или простое выражение, например ",
    subtitleExample: "12*1.1",
    subtitleAfter: ", и вторая сторона обновится сразу.",
    addNewCurrency: "Добавить валюту",
    deletePair: "Удалить пару",
    deletePairNamed: "Удалить пару {pair}",
    modalTitle: "Добавить валюту",
    close: "Закрыть",
    from: "Из",
    to: "В",
    rate: "Курс",
    loading: "Загрузка…",
    sameCurrency: "Выберите две разные валюты.",
    rateFailed: "Не удалось загрузить курс. Попробуйте позже.",
    rateLive: "Актуальный курс, обновляется каждые {interval}.",
    ratesUpdating: "Обновление курсов…",
    ratesUpdated: "Курсы обновлены {time} (обновляются каждые {interval})",
    ratesFailed: "Не удалось обновить курсы.",
    ratesFailedLast: "Не удалось обновить курсы. Последнее обновление: {time}",
    cancel: "Отмена",
    addPair: "Добавить пару",
    language: "Язык",
    switchToDark: "Включить тёмную тему",
    switchToLight: "Включить светлую тему",
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, ru };
