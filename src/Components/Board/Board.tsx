import { useReducer } from "react";
import { CurrencyPair } from "../CurrencyPair/CurrencyPair";
import { usePreferences } from "../../preferences/usePreferences";
import { create, all } from "mathjs";

import type { Pair, Action } from "../../types";
import type { BigNumber } from "mathjs";

import styles from "./Board.module.scss";

const math = create(all, { number: "BigNumber", precision: 64 });
const DECIMAL_PLACES = 4;

type Convert = (value: BigNumber, rate: number) => BigNumber;

function safeEvaluate(expression: string, convert: Convert, rate: number): string {
    try {
        const result = math.evaluate(expression);
        if (!math.isBigNumber(result)) return "";
        return math.format(convert(result, rate).toDecimalPlaces(DECIMAL_PLACES), { notation: "fixed" });
    } catch {
        return "";
    }
}

function trimTrailingOperators(expression: string): string {
    return expression.replace(/[\s+\-*/.]+$/, "");
}

function evaluateLive(expression: string, convert: Convert = (value) => value, rate: number = 1): string {
    return safeEvaluate(trimTrailingOperators(expression), convert, rate);
}

const toQuote: Convert = (value, rate) => value.times(rate);
const toBase: Convert = (value, rate) => value.div(rate);

const initialPairs: Pair[] = [
    {
        id: "1",
        baseCode: "USD",
        quoteCode: "KGS",
        base: "1",
        baseSum: "1",
        quote: "87.5",
        quoteSum: "87.5",
        rate: 87.5,
    },
    {
        id: "2",
        baseCode: "USD",
        quoteCode: "SGD",
        base: "1",
        baseSum: "1",
        quote: "1.28",
        quoteSum: "1.28",
        rate: 1.28,
    },
];

const pairsReducer: (state: Pair[], action: Action) => Pair[] = (state: Pair[], action: Action) => {
    if (action.type === "baseChanged") {
        const updatedState = [...state];
        const pairIndex = updatedState.findIndex((p) => p.id === action.id);
        if (pairIndex != -1) {
            const rate = updatedState[pairIndex].rate;
            const updatedPair: Pair = {
                ...updatedState[pairIndex],
                base: action.value,
                baseSum: evaluateLive(action.value),
                quote: evaluateLive(action.value, toQuote, rate),
                quoteSum: evaluateLive(action.value, toQuote, rate),
            };

            updatedState[pairIndex] = updatedPair;
            return updatedState;
        } else {
            return state;
        }
    }
    if (action.type === "quoteChanged") {
        const updatedState = [...state];
        const pairIndex = updatedState.findIndex((p) => p.id === action.id);
        if (pairIndex != -1) {
            const rate = updatedState[pairIndex].rate;
            const updatedPair: Pair = {
                ...updatedState[pairIndex],
                quote: action.value,
                quoteSum: evaluateLive(action.value),
                base: evaluateLive(action.value, toBase, rate),
                baseSum: evaluateLive(action.value, toBase, rate),
            };

            updatedState[pairIndex] = updatedPair;
            return updatedState;
        } else {
            return state;
        }
    }
    if (action.type === "remove") {
        return [...state].filter((p) => p.id !== action.id);
    }
    return state;
};

export const Board = () => {
    const [currencyPairList, dispatchCurrencyPairList] = useReducer(pairsReducer, initialPairs);
    const { t } = usePreferences();

    return (
        <div className={styles.board}>
            {currencyPairList.map((pair: Pair) => {
                return <CurrencyPair key={pair.id} {...pair} dispatch={dispatchCurrencyPairList} />;
            })}

            <button type="button" className={styles.addButton}>
                <span className={styles.plus} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
                {t("addNewCurrency")}
            </button>
        </div>
    );
};
