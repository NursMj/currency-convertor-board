import { useState } from "react";
import { create, all } from "mathjs";

import styles from "./CurrencyPair.module.scss";

import type { ChangeEvent, CSSProperties } from "react";
import type { BigNumber } from "mathjs";

const math = create(all, { number: "BigNumber", precision: 64 });
const DECIMAL_PLACES = 4;

type Convert = (value: BigNumber) => BigNumber;

function safeEvaluate(expression: string, convert: Convert): string {
    try {
        const result = math.evaluate(expression);
        if (!math.isBigNumber(result)) return "";
        return math.format(convert(result).toDecimalPlaces(DECIMAL_PLACES), { notation: "fixed" });
    } catch {
        return "";
    }
}

function trimTrailingOperators(expression: string): string {
    return expression.replace(/[\s+\-*/.]+$/, "");
}

function evaluateLive(expression: string, convert: Convert = (value) => value): string {
    return safeEvaluate(trimTrailingOperators(expression), convert);
}

function isExpression(value: string): boolean {
    return /[+\-*/()]/.test(trimTrailingOperators(value).replace(/^-/, ""));
}

function cleanInput(raw: string): string | null {
    const cleaned = raw.replace(/[^0-9+\-*/().]/g, "");
    return /(^|[^\d.])\d*\.\d*\./.test(cleaned) ? null : cleaned;
}

type AmountFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const AmountField = ({ id, label, value, onChange }: AmountFieldProps) => {
    const sum = isExpression(value) ? evaluateLive(value) : "";

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>{label}</label>
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
                {sum && <span className={styles.sum}>= {sum}</span>}
            </span>
        </div>
    );
};

export const CurrencyPair = () => {
    const rate = 88;
    const toQuote: Convert = (value) => value.times(rate);
    const toBase: Convert = (value) => value.div(rate);

    const [base, setBase] = useState("12*1.1*4");
    const [quote, setQuote] = useState(() => evaluateLive(base, toQuote));

    const handelBaseChange = (e: ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = cleanInput(e.target.value);
        if (cleanedValue === null) return;

        setBase(cleanedValue);
        setQuote(evaluateLive(cleanedValue, toQuote));
    };

    const handelQuoteChange = (e: ChangeEvent<HTMLInputElement>) => {
        const cleanedValue = cleanInput(e.target.value);
        if (cleanedValue === null) return;

        setQuote(cleanedValue);
        setBase(evaluateLive(cleanedValue, toBase));
    };

    return (
        <section className={styles.pair}>
            <div className={styles.fields}>
                <AmountField id="base" label="USD" value={base} onChange={handelBaseChange} />
                <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4 4-4-4 4-4" />
                    </svg>
                </span>
                <AmountField id="quote" label="KGS" value={quote} onChange={handelQuoteChange} />
            </div>
            <p className={styles.rate}>
                1 USD = <span className={styles.rateValue}>{rate} KGS</span>
            </p>
        </section>
    );
};
