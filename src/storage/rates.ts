const FETCHED_AT_KEY = "currency-board:rates-fetched-at";

export function loadFetchedAt(): number | null {
    try {
        const value = Number(localStorage.getItem(FETCHED_AT_KEY));
        return Number.isFinite(value) && value > 0 ? value : null;
    } catch {
        return null;
    }
}

export function saveFetchedAt(timestamp: number): void {
    try {
        localStorage.setItem(FETCHED_AT_KEY, String(timestamp));
    } catch {
        // storage unavailable; the time lasts until the page closes
    }
}
