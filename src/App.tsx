// src/App.tsx
import { useNews } from "./hooks/useNews";
import SearchFilters from "./components/SearchFilters";
import ArticleGrid from "./components/ArticleGrid";

import { useState, useEffect } from "react";
import PreferencesModal from "./components/PreferencesModal";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorMessage from "./components/ErrorMessage";
import { NewsFetchParams, Preferences } from "./types";
import { usePreferences } from "./context/PreferencesContext";
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  const [searchParams, setSearchParams] = useState<NewsFetchParams>({});
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const { preferences, setPreferences } = usePreferences();
  const { data, isLoading, error } = useNews(searchParams, preferences.sources);

  const resetSelectedSource = () => {
    setSearchParams((prev) => ({ ...prev, sources: undefined }));
    setSelectedSource(null);
  };

  const updatePreferences = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem("preferences");
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, [setPreferences]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              News Aggregator
            </h1>
            <PreferencesModal
              updatePreferences={updatePreferences}
              resetSelectedSource={resetSelectedSource}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <SearchFilters
            onSubmit={setSearchParams}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
          />

          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <ArticleGrid articles={data || []} />
          )}
        </main>
      </div>
    </Router>
  );
}
