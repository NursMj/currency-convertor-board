import { usePreferences } from "../../preferences/usePreferences";

import styles from "./CurrencyPair.module.scss";

import type { Pair, Dispatch } from "../../types";
import type { ChangeEvent, CSSProperties } from "react";

type AmountFieldProps = {
    id: string;
    label: string;
    value: string;
    sum: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AmountField = ({ id, label, value, sum, onChange }: AmountFieldProps) => {
    const showSum = value != sum;

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <span className={styles.amountField} style={{ "--sum-length": sum.length } as CSSProperties}>
                <input
                    type="text"
                    className={`${styles.input} ${styles.amountInput}`}
                    onChange={onChange}
                    value={value}
                    id={id}
                    autoComplete="off"
                    spellCheck={false}
                />
                {showSum && <span className={styles.sum}>= {sum}</span>}
            </span>
        </div>
    );
};

function cleanInput(raw: string): string | null {
    const cleaned = raw.replace(/[^0-9+\-*/().]/g, "");
    return /(^|[^\d.])\d*\.\d*\./.test(cleaned) ? null : cleaned;
}

type CurrencyPairProps = Pair & { dispatch: Dispatch };

export const CurrencyPair = ({
    id,
    baseCode,
    quoteCode,
    base,
    baseSum,
    quote,
    quoteSum,
    rate,
    dispatch,
}: CurrencyPairProps) => {
    const { t } = usePreferences();

    const handelBaseChange = (e: ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = cleanInput(e.target.value);
        if (cleanedValue === null) return;
        dispatch({ id, type: "baseChanged", value: cleanedValue });
    };

    const handelQuoteChange = (e: ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = cleanInput(e.target.value);
        if (cleanedValue === null) return;
        dispatch({ id, type: "quoteChanged", value: cleanedValue });
    };

    return (
        <section className={styles.pair}>
            <div className={styles.fields}>
                <AmountField
                    id={`${id}-base`}
                    label={baseCode}
                    value={base}
                    sum={baseSum}
                    onChange={handelBaseChange}
                />
                <span className={styles.arrow} aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4 4-4-4 4-4" />
                    </svg>
                </span>
                <AmountField
                    id={`${id}-quote`}
                    label={quoteCode}
                    value={quote}
                    sum={quoteSum}
                    onChange={handelQuoteChange}
                />
            </div>
            <div className={styles.bottom}>
                <p className={styles.rate}>
                    1 {baseCode} ={" "}
                    <span className={styles.rateValue}>
                        {rate} {quoteCode}
                    </span>
                </p>
                <button
                    type="button"
                    className={styles.delete}
                    aria-label={t("deletePairNamed", { pair: `${baseCode}/${quoteCode}` })}
                    title={t("deletePair")}
                    onClick={() => dispatch({ type: "remove", id })}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M4 7h16" />
                        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        <path d="M6 7l.8 11.2A2 2 0 0 0 8.8 20h6.4a2 2 0 0 0 2-1.8L18 7" />
                        <path d="M10 11v5M14 11v5" />
                    </svg>
                </button>
            </div>
        </section>
    );
};
