import { CurrencyPair } from "../CurrencyPair/CurrencyPair"

import styles from "./Board.module.scss"

export const Board = () => {
    return (
        <div className={styles.board}>
            <CurrencyPair />
            <button type="button" className={styles.addButton}>
                <span className={styles.plus} aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
                Add new currency
            </button>
        </div>
    )
}
