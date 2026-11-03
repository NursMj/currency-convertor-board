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
            <p className={styles.rate}>
                1 {baseCode} ={" "}
                <span className={styles.rateValue}>
                    {rate} {quoteCode}
                </span>
            </p>
        </section>
    );
};
