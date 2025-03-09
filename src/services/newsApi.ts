import axios from "axios";
import { Article, NewsFetchParams } from "../types";

const API_KEYS = {
  NEWS_API: import.meta.env.VITE_NEWS_API_KEY,
  GUARDIAN: import.meta.env.VITE_GUARDIAN_KEY,
  NYTIMES: import.meta.env.VITE_NYTIMES_KEY,
};

const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const normalizeNewsAPI = (articles: any[]): Article[] =>
  articles.map((article) => ({
    id: `newsapi-${hashString(article.url)}`,
    title: article.title,
    excerpt: article.description,
    source: article.source?.name || "NewsAPI",
    date: article.publishedAt,
    url: article.url,
    image: article.urlToImage,
    category: article.category,
    author: article.author,
  }));

const normalizeGuardian = (articles: any[]): Article[] =>
  articles.map((article) => ({
    id: `guardian-${article.id}`,
    title: article.webTitle,
    excerpt: article.fields?.trailText || "",
    source: "The Guardian",
    date: article.webPublicationDate,
    url: article.webUrl,
    image: article.fields?.thumbnail,
    category: article.sectionName,
  }));

const normalizeNYTimes = (articles: any[]): Article[] =>
  articles.map((article) => ({
    id: `nytimes-${article.uri}`,
    title: article.headline.main,
    excerpt: article.abstract,
    source: "New York Times",
    date: article.pub_date,
    url: article.web_url,
    image: `https://www.nytimes.com/${article.multimedia?.[0]?.url}`,
    category: article.section_name,
    author: article.byline?.original,
  }));

export const fetchNews = async (
  params: NewsFetchParams,
  selectedSources: string[]
): Promise<Article[]> => {
  const apiCalls = [];

  // Ensure selectedSources is used correctly
  if (params.sources?.length) {
    selectedSources = params.sources;
  }

  if (selectedSources.includes("NewsAPI")) {
    apiCalls.push(
      axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          apiKey: API_KEYS.NEWS_API,
          q: params.q || "news",
          from: params.fromDate,
          ...(params.categories
            ? { category: params.categories.join(",") }
            : {}),
        },
      })
    );
  }

  if (selectedSources.includes("The Guardian")) {
    apiCalls.push(
      axios.get("https://content.guardianapis.com/search", {
        params: {
          "api-key": API_KEYS.GUARDIAN,
          q: params.q,
          "from-date": params.fromDate,
          section: params.categories?.join("|"),
        },
      })
    );
  }

  if (selectedSources.includes("New York Times")) {
    apiCalls.push(
      axios.get("https://api.nytimes.com/svc/search/v2/articlesearch.json", {
        params: {
          "api-key": API_KEYS.NYTIMES,
          q: params.q,
          begin_date: params.fromDate?.replace(/-/g, ""),
        },
      })
    );
  }

  // Execute all API calls
  const results = await Promise.allSettled(apiCalls);

  // Normalize results based on the selected sources
  const normalizedResults: Article[] = [];

  selectedSources.forEach((source, index) => {
    if (results[index]?.status === "fulfilled") {
      switch (source) {
        case "NewsAPI":
          normalizedResults.push(
            ...normalizeNewsAPI(results[index].value.data.articles || [])
          );
          console.log("Normalized NewsAPI results:", normalizedResults);
          break;
        case "The Guardian":
          normalizedResults.push(
            ...normalizeGuardian(
              results[index].value.data.response.results || []
            )
          );
          console.log("Normalized Guardian results:", normalizedResults);
          break;
        case "New York Times":
          normalizedResults.push(
            ...normalizeNYTimes(results[index].value.data.response.docs || [])
          );
          console.log("Normalized NYTimes results:", normalizedResults);
          break;
      }
    }
  });

  // Sort articles by date
  return normalizedResults.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
