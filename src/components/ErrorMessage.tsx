const ErrorMessage = ({
  message = "Failed to load articles",
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="p-8 text-center bg-red-50 rounded-lg">
      <div className="text-red-600 font-medium mb-4">⚠️ {message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
