import type { Pair } from "../types";

export const initialPairs: Pair[] = [
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

export function isSeedPairs(pairs: Pair[]): boolean {
    return (
        pairs.length === initialPairs.length &&
        pairs.every(
            (pair, i) =>
                pair.id === initialPairs[i].id &&
                pair.baseCode === initialPairs[i].baseCode &&
                pair.quoteCode === initialPairs[i].quoteCode &&
                pair.base === "1",
        )
    );
}
