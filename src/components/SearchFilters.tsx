import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePreferences } from "../context/PreferencesContext";
import { NewsFetchParams } from "../types";

interface SearchFiltersProps {
  onSubmit: (params: NewsFetchParams) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const { preferences } = usePreferences();

  // Load selected source from sessionStorage on mount
  useEffect(() => {
    const storedSource = sessionStorage.getItem("selectedSource");
    if (storedSource) setSelectedSource(storedSource);
  }, []);

  useEffect(() => {
    const params: NewsFetchParams = {
      q: searchTerm || undefined,
      fromDate: date?.toISOString(),
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      sources: selectedSource ? [selectedSource] : undefined,
    };

    const handler = setTimeout(() => onSubmit(params), 500);
    return () => clearTimeout(handler);
  }, [searchTerm, date, selectedCategories, selectedSource]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value;
    setSelectedSource(newSource);
    sessionStorage.setItem("selectedSource", newSource);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-sm mb-8">
      <input
        type="text"
        placeholder="Search articles..."
        className="p-2 border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <DatePicker
        selected={date}
        onChange={setDate}
        className="p-2 border rounded-md w-full"
        placeholderText="Filter by date"
      />

      <select
        multiple
        className="p-2 border rounded-md"
        value={selectedCategories}
        onChange={(e) =>
          setSelectedCategories(
            [...e.target.selectedOptions].map((o) => o.value)
          )
        }
      >
        {preferences.categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        onChange={handleSourceChange}
        value={selectedSource || ""}
        className="p-2 border rounded-md"
      >
        <option value="">Select Source</option>
        {preferences.sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilters;
