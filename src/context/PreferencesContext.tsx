import React, { createContext, useContext, useState, useEffect } from "react";

interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
}

const PreferencesContext = createContext<PreferencesContextType>(
  {} as PreferencesContextType
);

const availableSources = ["NewsAPI", "The Guardian", "New York Times"];

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const localData = localStorage.getItem("news-preferences");
    return localData
      ? JSON.parse(localData)
      : { sources: availableSources, categories: [], authors: [] };
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

export const usePreferences = () => useContext(PreferencesContext);
