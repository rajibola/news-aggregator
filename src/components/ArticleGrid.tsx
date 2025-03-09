// src/components/ArticleGrid.tsx
import React from "react";
import { Article } from "../types";
interface ArticleGridProps {
  articles: Article[];
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 columns-[300px]">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-600">
                {article.source}
              </span>
              <time className="text-sm text-gray-500">
                {new Date(article.date).toLocaleDateString()}
              </time>
            </div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-3">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <a
              href={article.url}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read article →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ArticleGrid;
