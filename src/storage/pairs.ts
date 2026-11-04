import type { Pair } from "../types";

const STORAGE_KEY = "currency-board:pairs";

const STRING_FIELDS = ["id", "baseCode", "quoteCode", "base", "baseSum", "quote", "quoteSum"] as const;

function isPair(value: unknown): value is Pair {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return (
        STRING_FIELDS.every((field) => typeof record[field] === "string") &&
        typeof record.rate === "number" &&
        Number.isFinite(record.rate) &&
        record.rate > 0
    );
}

export function loadPairs(fallback: Pair[]): Pair[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return fallback;
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.every(isPair) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

export function savePairs(pairs: Pair[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs));
    } catch {
        // storage unavailable or full; the board keeps working in memory
    }
}
