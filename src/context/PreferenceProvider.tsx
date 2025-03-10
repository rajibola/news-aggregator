import { PropsWithChildren, useEffect, useState } from "react";
import { availableSources } from "../utils/constants";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/storage";
import { PreferencesContext } from "./PreferencesContext";

export const PreferencesProvider = ({ children }: PropsWithChildren) => {
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
