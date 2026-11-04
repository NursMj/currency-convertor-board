import { LANGUAGES } from "../../i18n/translations";
import { usePreferences } from "../../preferences/usePreferences";

import styles from "./Controls.module.scss";

export const Controls = () => {
    const { language, setLanguage, theme, toggleTheme, t } = usePreferences();
    const themeLabel = t(theme === "dark" ? "switchToLight" : "switchToDark");

    return (
        <div className={styles.controls}>
            <div className={styles.segmented} role="group" aria-label={t("language")}>
                {LANGUAGES.map((code) => (
                    <button
                        key={code}
                        type="button"
                        className={`${styles.segment} ${code === language ? styles.active : ""}`}
                        aria-pressed={code === language}
                        onClick={() => setLanguage(code)}>
                        {code.toUpperCase()}
                    </button>
                ))}
            </div>
            <button type="button" className={styles.themeButton} aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    {theme === "dark" ? (
                        <>
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                        </>
                    ) : (
                        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    )}
                </svg>
            </button>
        </div>
    );
};
