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
    hash = hash & hash; // Convert to 32-bit integer
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
  params: NewsFetchParams
): Promise<Article[]> => {
  const [newsAPI, guardian, nyTimes] = await Promise.allSettled([
    axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        apiKey: API_KEYS.NEWS_API,
        q: params.q || "news",
        from: params.fromDate,
        ...(params.categories && !params.sources
          ? { category: params.categories.join(",") }
          : {}),
        ...(params.sources && !params.categories
          ? { sources: params.sources.join(",") }
          : {}),
      },
    }),
    axios.get("https://content.guardianapis.com/search", {
      params: {
        "api-key": API_KEYS.GUARDIAN,
        q: params.q,
        "from-date": params.fromDate,
        section: params.categories?.join("|"),
      },
    }),
    axios.get("https://api.nytimes.com/svc/search/v2/articlesearch.json", {
      params: {
        "api-key": API_KEYS.NYTIMES,
        q: params.q,
        begin_date: params.fromDate?.replace(/-/g, ""),
        fq: params.sources?.join(" OR "),
      },
    }),
  ]);

  return [
    ...(newsAPI.status === "fulfilled"
      ? normalizeNewsAPI(newsAPI.value.data.articles)
      : []),
    ...(guardian.status === "fulfilled"
      ? normalizeGuardian(guardian.value.data.response.results)
      : []),
    ...(nyTimes.status === "fulfilled"
      ? normalizeNYTimes(nyTimes.value.data.response.docs)
      : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
