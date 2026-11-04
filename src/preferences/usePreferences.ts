import { useContext } from "react";

import { PreferencesContext } from "./PreferencesContext";

export function usePreferences() {
    const value = useContext(PreferencesContext);
    if (value === null) throw new Error("usePreferences must be used inside PreferencesProvider");
    return value;
}
