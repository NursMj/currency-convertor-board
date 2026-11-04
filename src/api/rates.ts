const RATES_URL = "https://api.exchangerate-api.com/v4/latest";

const CODES_BASE_CODE = "USD";

export const RATES_REFRESH_INTERVAL_MINUTES = 30;
export const RATES_REFRESH_INTERVAL_MS = RATES_REFRESH_INTERVAL_MINUTES * 60 * 1000;

type RatesResponse = {
    rates?: Record<string, number>;
};

export type Rates = Record<string, number>;

type CacheEntry = { fetchedAt: number; request: Promise<Rates> };

const cache = new Map<string, CacheEntry>();

async function requestRates(baseCode: string): Promise<Rates> {
    const response = await fetch(`${RATES_URL}/${baseCode}`);
    if (!response.ok) throw new Error(`Rates request failed: ${response.status}`);
    const data = (await response.json()) as RatesResponse;
    if (!data.rates) throw new Error("Rates response has no rates");
    return data.rates;
}

function loadRates(baseCode: string): Promise<Rates> {
    const cached = cache.get(baseCode);
    if (cached && Date.now() - cached.fetchedAt < RATES_REFRESH_INTERVAL_MS) return cached.request;

    const request = requestRates(baseCode);
    cache.set(baseCode, { fetchedAt: Date.now(), request });
    request.catch(() => {
        if (cache.get(baseCode)?.request === request) cache.delete(baseCode);
    });
    return request;
}

export async function fetchRate(baseCode: string, quoteCode: string): Promise<number> {
    const rates = await loadRates(baseCode);
    const rate = rates[quoteCode];
    if (typeof rate !== "number") throw new Error(`No rate for ${baseCode}/${quoteCode}`);
    return rate;
}

export async function fetchCurrencyCodes(): Promise<string[]> {
    const rates = await loadRates(CODES_BASE_CODE);
    return Object.keys(rates).sort();
}

export type RefreshResult = {
    ratesByBase: Record<string, Rates>;
    hasFailures: boolean;
};

export async function refreshRates(baseCodes: string[]): Promise<RefreshResult> {
    const results = await Promise.allSettled(
        baseCodes.map(async (baseCode) => {
            const rates = await requestRates(baseCode);
            cache.set(baseCode, { fetchedAt: Date.now(), request: Promise.resolve(rates) });
            return [baseCode, rates] as const;
        }),
    );

    const ratesByBase: Record<string, Rates> = {};
    let hasFailures = false;
    for (const result of results) {
        if (result.status === "fulfilled") ratesByBase[result.value[0]] = result.value[1];
        else hasFailures = true;
    }
    return { ratesByBase, hasFailures };
}
