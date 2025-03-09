import { createContext } from "react";

interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
}

export const PreferencesContext = createContext<PreferencesContextType>(
  {} as PreferencesContextType
);
