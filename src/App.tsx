import styles from "./App.module.scss";
import { Board } from "./Components/Board/Board";

function App() {
    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>Currency board</h1>
                <p className={styles.subtitle}>
                    Type an amount or a quick sum like <code>12*1.1</code> and the other side updates as you go.
                </p>
            </header>
            <main>
                <Board />
            </main>
        </>
    );
}

export default App;
