const LOCATION_URL = "https://free.freeipapi.com/api/v1/json";

type LocationResponse = {
    currencies?: unknown;
};

export async function fetchLocalCurrency(): Promise<string> {
    const response = await fetch(LOCATION_URL);
    if (!response.ok) throw new Error(`Location request failed: ${response.status}`);
    const data = (await response.json()) as LocationResponse;
    const currency = Array.isArray(data.currencies) ? data.currencies[0] : undefined;
    if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
        throw new Error("Location response has no currency");
    }
    return currency;
}
