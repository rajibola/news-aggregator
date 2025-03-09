import axios, { AxiosResponse } from "axios";
import { Article, NewsFetchParams } from "../types";

// API keys
const API_KEYS = {
  NEWS_API: import.meta.env.VITE_NEWS_API_KEY,
  GUARDIAN: import.meta.env.VITE_GUARDIAN_KEY,
  NYTIMES: import.meta.env.VITE_NYTIMES_KEY,
};

// Utility function to hash strings
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Define interfaces for the expected article structures
export interface NewsAPIArticle {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  urlToImage: string;
  category?: string[];
  author?: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface GuardianArticle {
  id: string;
  webTitle: string;
  fields?: { trailText: string; thumbnail: string };
  webPublicationDate: string;
  webUrl: string;
  sectionName: string;
}

interface GuardianResponse {
  response: {
    status: string;
    results: GuardianArticle[];
  };
}

export interface NYTimesArticle {
  uri: string;
  headline: { main: string };
  abstract: string;
  pub_date: string;
  web_url: string;
  multimedia?: { url: string }[];
  section_name: string;
  byline?: { original: string };
}

interface NYTimesResponse {
  status: string;
  response: {
    docs: NYTimesArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

// Normalize functions with explicit types
const normalizeNewsAPI = (articles: NewsAPIArticle[]): Article[] =>
  articles.map((article) => ({
    id: `newsapi-${hashString(article.url)}`,
    title: article.title,
    excerpt: article.description,
    source: article.source?.name || "NewsAPI",
    date: article.publishedAt,
    url: article.url,
    image: article.urlToImage,
    category: article.category ? article.category.join(", ") : undefined,
    author: article.author,
  }));

const normalizeGuardian = (articles: GuardianArticle[]): Article[] =>
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

const normalizeNYTimes = (articles: NYTimesArticle[]): Article[] =>
  articles.map((article) => ({
    id: `nytimes-${article.uri}`,
    title: article.headline.main,
    excerpt: article.abstract,
    source: "New York Times",
    date: article.pub_date,
    url: article.web_url,
    image:
      article.multimedia && article.multimedia.length > 0
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : undefined,
    category: article.section_name,
    author: article.byline?.original,
  }));

// Union type for our possible API responses
type APIResponse = NewsAPIResponse | GuardianResponse | NYTimesResponse;

export const fetchNews = async (
  params: NewsFetchParams,
  selectedSources: string[]
): Promise<Article[]> => {
  const apiCalls: Promise<AxiosResponse<APIResponse>>[] = [];

  // Determine sources to use
  let sourcesToUse: string[];

  if (params.sources && params.sources.length) {
    sourcesToUse = params.sources;
  } else if (selectedSources.length) {
    sourcesToUse = selectedSources;
  } else {
    sourcesToUse = ["NewsAPI", "The Guardian", "New York Times"];
  }

  // Create a mapping of source names to their respective API call functions
  const sourceApiCalls: Record<
    string,
    () => Promise<AxiosResponse<APIResponse>>
  > = {
    NewsAPI: () =>
      axios.get<NewsAPIResponse>("https://newsapi.org/v2/top-headlines", {
        params: {
          apiKey: API_KEYS.NEWS_API,
          q: params.q || "news",
          from: params.fromDate,
          ...(params.categories && params.categories.length
            ? { category: params.categories.join(",") }
            : {}),
        },
      }),
    "The Guardian": () =>
      axios.get<GuardianResponse>("https://content.guardianapis.com/search", {
        params: {
          "api-key": API_KEYS.GUARDIAN,
          ...(params.q
            ? {
                q:
                  params.q +
                  (params.categories && params.categories.length
                    ? ` AND (${params.categories.join(" OR ")})`
                    : ""),
              }
            : {
                ...(params.categories && params.categories.length
                  ? { q: `(${params.categories.join(" OR ")})` }
                  : {}),
              }),
          "from-date": params.fromDate,
        },
      }),
    "New York Times": () =>
      axios.get<NYTimesResponse>(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        {
          params: {
            "api-key": API_KEYS.NYTIMES,
            q: params.q || undefined,
            begin_date: params.fromDate
              ? params.fromDate.replace(/-/g, "")
              : undefined,
            fq: params.categories
              ? `news_desk:(${params.categories
                  .map((cat) => `"${cat}"`)
                  .join(", ")})`
              : undefined,
          },
        }
      ),
  };

  // Create API calls for each source
  sourcesToUse.forEach((source) => {
    const apiCall = sourceApiCalls[source]();
    apiCalls.push(apiCall);
  });

  // Execute all API calls
  const results: PromiseSettledResult<AxiosResponse<APIResponse>>[] =
    await Promise.allSettled(apiCalls);

  // Normalize results based on the selected sources
  const normalizedResults: Article[] = [];

  sourcesToUse.forEach((source, index) => {
    if (results[index]?.status === "fulfilled") {
      const data = results[index].value.data;
      switch (source) {
        case "NewsAPI":
          normalizedResults.push(
            ...normalizeNewsAPI((data as NewsAPIResponse).articles || [])
          );
          break;
        case "The Guardian":
          normalizedResults.push(
            ...normalizeGuardian(
              (data as GuardianResponse).response.results || []
            )
          );
          break;
        case "New York Times":
          normalizedResults.push(
            ...normalizeNYTimes((data as NYTimesResponse).response.docs || [])
          );
          break;
      }
    }
  });

  // Sort articles by date (newest first)
  return normalizedResults.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
