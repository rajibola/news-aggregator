// src/hooks/useNews.ts
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/newsApi";
import { NewsFetchParams } from "../types";

export const useNews = (params: NewsFetchParams) => {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => fetchNews(params),
    staleTime: 1000 * 60 * 5,
    // keepPreviousData: true,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
