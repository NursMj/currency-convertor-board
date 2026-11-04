const LOCALIZED_KEY = "currency-board:pairs-localized";

export function loadLocalized(): boolean {
    try {
        return localStorage.getItem(LOCALIZED_KEY) === "1";
    } catch {
        return false;
    }
}

export function saveLocalized(): void {
    try {
        localStorage.setItem(LOCALIZED_KEY, "1");
    } catch {
        // storage unavailable; the lookup repeats on the next visit
    }
}
