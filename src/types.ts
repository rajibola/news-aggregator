// src/types.ts
export interface Article {
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

export interface NewsFetchParams {
  q?: string;
  fromDate?: string;
  categories?: string[];
  sources?: string[];
  authors?: string[];
}

export interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

export interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export interface LoadingSkeletonProps {
  items?: number;
}
