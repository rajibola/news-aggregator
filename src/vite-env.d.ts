/// <reference types="vite/client" />
interface Article {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  url: string;
  image?: string;
  category?: string;
  author?: string;
}

interface NewsFetchParams {
  q?: string;
  fromDate?: string;
  categories?: string[];
  sources?: string[];
  authors?: string[];
}

interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

interface LoadingSkeletonProps {
  items?: number;
}

interface SearchFiltersState {
  searchTerm: string;
  date: Date | null;
  selectedCategories: string[];
  selectedSource: string | null;
}

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: (prefs: Preferences) => void;
}

interface NewsAPIArticle {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  urlToImage: string;
  category?: string[];
  author?: string;
}
