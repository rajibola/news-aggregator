import EmptyState from "./EmptyState";

interface ArticleGridProps {
  articles: Article[];
}

const ArticleGrid = ({ articles }: ArticleGridProps) => {
  if (articles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow mb-4"
        >
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover min-h-48"
              loading="lazy"
            />
          ) : (
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
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
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
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
