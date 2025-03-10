import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">No Articles Found</h2>
      <p className="text-gray-500">
        Try adjusting your filters or check back later.
      </p>
    </div>
  );
};

export default EmptyState;
