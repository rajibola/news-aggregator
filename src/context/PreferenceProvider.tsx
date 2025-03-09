import { useEffect, useState } from "react";
import { PreferencesContext } from "./PreferencesContext";
import { availableSources } from "../utils/constants";
import { Preferences } from "../types";

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const localData = localStorage.getItem("news-preferences");
    return localData
      ? JSON.parse(localData)
      : {
          sources: availableSources,
          categories: [],
          authors: [],
        };
  });

  useEffect(() => {
    localStorage.setItem("news-preferences", JSON.stringify(preferences));
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
