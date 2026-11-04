import { useEffect, useReducer, useState } from "react";
import { CurrencyPair } from "../CurrencyPair/CurrencyPair";
import { AddPairModal } from "../AddPairModal/AddPairModal";
import { loadPairs, savePairs } from "../../storage/pairs";
import { usePreferences } from "../../preferences/usePreferences";
import { useRatesRefresh } from "../../rates/useRatesRefresh";
import { RATES_REFRESH_INTERVAL_MINUTES } from "../../api/rates";
import { formatMinutes } from "../../i18n/formatMinutes";
import { create, all } from "mathjs";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

import type { DragEndEvent } from "@dnd-kit/core";
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
    if (action.type === "add") {
        const { id, baseCode, quoteCode, rate } = action;
        const quote = evaluateLive("1", toQuote, rate);
        return [...state, { id, baseCode, quoteCode, base: "1", baseSum: "1", quote, quoteSum: quote, rate }];
    }
    if (action.type === "remove") {
        return [...state].filter((p) => p.id !== action.id);
    }
    if (action.type === "reorder") {
        const from = state.findIndex((p) => p.id === action.activeId);
        const to = state.findIndex((p) => p.id === action.overId);
        return from === -1 || to === -1 || from === to ? state : arrayMove(state, from, to);
    }
    if (action.type === "ratesUpdated") {
        let changed = false;
        const updatedState = state.map((pair) => {
            const rate = action.rates[pair.baseCode]?.[pair.quoteCode];
            if (typeof rate !== "number" || !(rate > 0) || rate === pair.rate) return pair;

            changed = true;
            const quote = evaluateLive(pair.base, toQuote, rate);
            return { ...pair, rate, quote, quoteSum: quote };
        });
        return changed ? updatedState : state;
    }
    return state;
};

export const Board = () => {
    const [currencyPairList, dispatchCurrencyPairList] = useReducer(pairsReducer, initialPairs, loadPairs);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { t, language } = usePreferences();
    const { fetchedAt, status } = useRatesRefresh(currencyPairList, dispatchCurrencyPairList);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return;
        dispatchCurrencyPairList({ type: "reorder", activeId: String(active.id), overId: String(over.id) });
    };

    const fetchedAtText =
        fetchedAt === null
            ? null
            : new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : "en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
              }).format(fetchedAt);

    let ratesMessage = t("ratesUpdating");
    if (status === "error") {
        ratesMessage = fetchedAtText ? t("ratesFailedLast", { time: fetchedAtText }) : t("ratesFailed");
    } else if (fetchedAtText) {
        ratesMessage = t("ratesUpdated", {
            time: fetchedAtText,
            interval: formatMinutes(RATES_REFRESH_INTERVAL_MINUTES, language),
        });
    }

    useEffect(() => {
        savePairs(currencyPairList);
    }, [currencyPairList]);

    return (
        <div className={styles.board}>
            {currencyPairList.length > 0 && (
                <p className={`${styles.ratesInfo} ${status === "error" ? styles.ratesError : ""}`} role="status">
                    {ratesMessage}
                </p>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragEnd={handleDragEnd}>
                <SortableContext items={currencyPairList} strategy={verticalListSortingStrategy}>
                    <div className={styles.pairs}>
                        {currencyPairList.map((pair: Pair) => (
                            <CurrencyPair key={pair.id} {...pair} dispatch={dispatchCurrencyPairList} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button type="button" className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
                <span className={styles.plus} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
                {t("addNewCurrency")}
            </button>

            {isAddModalOpen && (
                <AddPairModal dispatch={dispatchCurrencyPairList} onClose={() => setIsAddModalOpen(false)} />
            )}
        </div>
    );
};
