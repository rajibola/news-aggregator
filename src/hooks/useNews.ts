// src/hooks/useNews.ts
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/newsApi";
import { NewsFetchParams } from "../types";

export const useNews = (params: NewsFetchParams, selectedSources: string[]) => {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => fetchNews(params, selectedSources),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 0,
  });
};
