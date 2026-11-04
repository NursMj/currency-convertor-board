import { useEffect, useState } from "react";

import { fetchLocalCurrency } from "../api/location";
import { fetchRate } from "../api/rates";
import { loadLocalized, saveLocalized } from "../storage/location";
import { isSeedPairs } from "./seedPairs";

import type { Dispatch, Pair } from "../types";

const BASE_CANDIDATES = ["USD", "EUR", "GBP"];

async function fetchLocalPairs() {
    const quoteCode = await fetchLocalCurrency();
    const baseCodes = BASE_CANDIDATES.filter((code) => code !== quoteCode).slice(0, 2);
    return Promise.all(baseCodes.map(async (baseCode) => ({ baseCode, quoteCode, rate: await fetchRate(baseCode, quoteCode) })));
}

export function useLocalizedPairs(pairs: Pair[], dispatch: Dispatch) {
    const [shouldLocalize] = useState(() => !loadLocalized() && isSeedPairs(pairs));

    useEffect(() => {
        if (!shouldLocalize) {
            saveLocalized();
            return;
        }

        let isStale = false;
        fetchLocalPairs()
            .then((localPairs) => {
                if (isStale) return;
                dispatch({ type: "localized", pairs: localPairs });
                saveLocalized();
            })
            .catch(() => {});

        return () => {
            isStale = true;
        };
    }, [shouldLocalize, dispatch]);
}
