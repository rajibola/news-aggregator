// src/components/SearchFilters.tsx (updated)
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
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const { preferences } = usePreferences();

  useEffect(() => {
    const params: NewsFetchParams = {
      q: searchTerm || undefined,
      fromDate: date?.toISOString(),
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      sources: selectedSources.length > 0 ? selectedSources : undefined,
    };

    const handler = setTimeout(() => onSubmit(params), 500);
    return () => clearTimeout(handler);
  }, [searchTerm, date, selectedCategories, selectedSources]);

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
        multiple
        className="p-2 border rounded-md"
        value={selectedSources}
        onChange={(e) => {
          setSelectedSources([...e.target.selectedOptions].map((o) => o.value));
          console.log(e.target.selectedOptions);
        }}
      >
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
