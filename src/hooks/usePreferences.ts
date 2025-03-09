import { useContext } from "react";
import { PreferencesContext } from "../context/PreferencesContext";

export const usePreferences = () => useContext(PreferencesContext);
