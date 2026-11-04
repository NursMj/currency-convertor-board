import styles from "./App.module.scss";
import { Board } from "./Components/Board/Board";
import { Controls } from "./Components/Controls/Controls";
import { usePreferences } from "./preferences/usePreferences";

function App() {
    const { t } = usePreferences();

    return (
        <>
            <header className={styles.header}>
                <div className={styles.top}>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <Controls />
                </div>
                <p className={styles.subtitle}>
                    {t("subtitleBefore")}
                    <code>{t("subtitleExample")}</code>
                    {t("subtitleAfter")}
                </p>
            </header>
            <main>
                <Board />
            </main>
        </>
    );
}

export default App;
