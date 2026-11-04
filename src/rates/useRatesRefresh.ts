import { useEffect, useState } from "react";

import { RATES_REFRESH_INTERVAL_MS, refreshRates } from "../api/rates";
import { loadFetchedAt, saveFetchedAt } from "../storage/rates";

import type { Dispatch, Pair } from "../types";

export type RatesStatus = "loading" | "ok" | "error";

export function useRatesRefresh(pairs: Pair[], dispatch: Dispatch) {
    const [fetchedAt, setFetchedAt] = useState<number | null>(loadFetchedAt);
    const [status, setStatus] = useState<RatesStatus>("loading");

    const basesKey = [...new Set(pairs.map((pair) => pair.baseCode))].sort().join(",");

    useEffect(() => {
        if (basesKey === "") return;

        const baseCodes = basesKey.split(",");
        let isStale = false;

        const refresh = async () => {
            const { ratesByBase, hasFailures } = await refreshRates(baseCodes);
            if (isStale) return;

            dispatch({ type: "ratesUpdated", rates: ratesByBase });
            if (!hasFailures) {
                const now = Date.now();
                setFetchedAt(now);
                saveFetchedAt(now);
            }
            setStatus(hasFailures ? "error" : "ok");
        };

        void refresh();
        const timer = setInterval(() => void refresh(), RATES_REFRESH_INTERVAL_MS);

        return () => {
            isStale = true;
            clearInterval(timer);
        };
    }, [basesKey, dispatch]);

    return { fetchedAt, status };
}
