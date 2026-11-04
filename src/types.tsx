export type Pair = {
    id: string;
    baseCode: string;
    quoteCode: string;
    base: string;
    baseSum: string;
    quote: string;
    quoteSum: string;
    rate: number;
};

export type Action =
    | { type: "add"; id: string; baseCode: string; quoteCode: string; rate: number }
    | { type: "remove"; id: string }
    | { type: "reorder"; activeId: string; overId: string }
    | { type: "localized"; pairs: { baseCode: string; quoteCode: string; rate: number }[] }
    | { type: "ratesUpdated"; rates: Record<string, Record<string, number>> }
    | { type: "baseChanged"; id: string; value: string }
    | { type: "quoteChanged"; id: string; value: string }
    | { type: "currencyChanged"; id: string; side: "base" | "quote"; rate: number; currency: string }
    | { type: "rateChanged"; id: string; rate: number; currency: string };

export type Language = "en" | "ru";

export type Theme = "light" | "dark";

export type Dispatch = (action: Action) => void;
