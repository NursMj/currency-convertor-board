import { useEffect, useRef, useState } from "react";

import styles from "./AddPairModal.module.scss";

import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { RATES_REFRESH_INTERVAL_MINUTES, fetchRate } from "../../api/rates";
import { formatMinutes } from "../../i18n/formatMinutes";
import { usePreferences } from "../../preferences/usePreferences";

import type { Dispatch } from "../../types";

const CURRENCY_CODES = ["USD", "EUR", "GBP", "CHF", "JPY", "CNY", "KGS", "KZT", "RUB", "TRY", "AED", "SGD"];

type CurrencySelectProps = {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const CurrencySelect = ({ id, label, value, onChange }: CurrencySelectProps) => (
    <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
            {label}
        </label>
        <span className={styles.selectWrap}>
            <select id={id} className={styles.select} value={value} onChange={onChange}>
                {CURRENCY_CODES.map((code) => (
                    <option key={code} value={code}>
                        {code}
                    </option>
                ))}
            </select>
            <svg
                className={styles.chevron}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </span>
    </div>
);

function formatRate(rate: number): string {
    return String(Number(rate.toPrecision(8)));
}

type FetchedRate = { key: string; value: number | null };

type AddPairModalProps = {
    dispatch: Dispatch;
    onClose: () => void;
};

export const AddPairModal = ({ dispatch, onClose }: AddPairModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { t, language } = usePreferences();
    const [baseCode, setBaseCode] = useState("USD");
    const [quoteCode, setQuoteCode] = useState("KGS");
    const [fetched, setFetched] = useState<FetchedRate | null>(null);

    const pairKey = `${baseCode}/${quoteCode}`;
    const sameCurrency = baseCode === quoteCode;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    useEffect(() => {
        if (baseCode === quoteCode) return;

        let isStale = false;
        fetchRate(baseCode, quoteCode)
            .then((value) => !isStale && setFetched({ key: pairKey, value }))
            .catch(() => !isStale && setFetched({ key: pairKey, value: null }));

        return () => {
            isStale = true;
        };
    }, [baseCode, quoteCode, pairKey]);

    const fetchedForPair = fetched?.key === pairKey ? fetched : null;
    const isLoading = !sameCurrency && fetchedForPair === null;
    const hasFailed = fetchedForPair !== null && fetchedForPair.value === null;

    const rateValue = fetchedForPair?.value ?? null;
    const isValid = !sameCurrency && rateValue !== null && rateValue > 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isValid || rateValue === null) return;
        dispatch({ type: "add", id: crypto.randomUUID(), baseCode, quoteCode, rate: rateValue });
        onClose();
    };

    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            className={styles.modal}
            aria-labelledby="add-pair-title"
            onClose={onClose}
            onClick={handleBackdropClick}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h2 id="add-pair-title" className={styles.title}>
                        {t("modalTitle")}
                    </h2>
                    <button type="button" className={styles.close} aria-label={t("close")} onClick={onClose}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.pickers}>
                    <CurrencySelect
                        id="add-pair-base"
                        label={t("from")}
                        value={baseCode}
                        onChange={(e) => setBaseCode(e.target.value)}
                    />
                    <CurrencySelect
                        id="add-pair-quote"
                        label={t("to")}
                        value={quoteCode}
                        onChange={(e) => setQuoteCode(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="add-pair-rate" className={styles.label}>
                        {t("rate")}
                    </label>
                    <span className={styles.rateBox}>
                        <span className={styles.affix}>1 {baseCode} =</span>
                        <output id="add-pair-rate" className={styles.rateValue}>
                            {rateValue !== null ? formatRate(rateValue) : isLoading ? t("loading") : "—"}
                        </output>
                        <span className={styles.affix}>{quoteCode}</span>
                    </span>
                    {sameCurrency && <p className={styles.hint}>{t("sameCurrency")}</p>}
                    {hasFailed && <p className={styles.hint}>{t("rateFailed")}</p>}
                    {!sameCurrency && !hasFailed && !isLoading && (
                        <p className={styles.note}>{t("rateLive", { interval: formatMinutes(RATES_REFRESH_INTERVAL_MINUTES, language) })}</p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancel} onClick={onClose}>
                        {t("cancel")}
                    </button>
                    <button type="submit" className={styles.submit} disabled={!isValid}>
                        {t("addPair")}
                    </button>
                </div>
            </form>
        </dialog>
    );
};
