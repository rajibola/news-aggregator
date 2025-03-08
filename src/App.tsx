// src/App.tsx
import { useNews } from "./hooks/useNews";
import SearchFilters from "./components/SearchFilters";
import ArticleGrid from "./components/ArticleGrid";

import { useState } from "react";
import PreferencesModal from "./components/PreferencesModal";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ErrorMessage from "./components/ErrorMessage";
import { NewsFetchParams } from "./types";
import { usePreferences } from "./context/PreferencesContext";

export default function App() {
  const [searchParams, setSearchParams] = useState<NewsFetchParams>({});
  const { preferences } = usePreferences();
  const { data, isLoading, error } = useNews(searchParams, preferences.sources);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">News Aggregator</h1>
          <PreferencesModal />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters onSubmit={setSearchParams} />

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : (
          <ArticleGrid articles={data || []} />
        )}
      </main>
    </div>
  );
}
