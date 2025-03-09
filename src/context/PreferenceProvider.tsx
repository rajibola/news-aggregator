import { useEffect, useState } from "react";
import { PreferencesContext } from "./PreferencesContext";
import { availableSources } from "../utils/constants";
import { Preferences } from "../types";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/storage";

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    return (
      getFromLocalStorage("news-preferences") || {
        sources: availableSources,
        categories: [],
        authors: [],
      }
    );
  });

  useEffect(() => {
    saveToLocalStorage("news-preferences", preferences);
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
