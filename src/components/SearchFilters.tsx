import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePreferences } from "../context/PreferencesContext";
import { NewsFetchParams } from "../types";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchFiltersProps {
  onSubmit: (params: NewsFetchParams) => void;
  selectedSource: string | null;
  setSelectedSource: (source: string | null) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSubmit,
  selectedSource,
  setSelectedSource,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { preferences } = usePreferences();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const term = params.get("q") || "";
    const fromDate = params.get("fromDate")
      ? new Date(params.get("fromDate")!)
      : null;
    const categories = params.getAll("categories");
    const source = params.get("source") || null;

    setSearchTerm(term);
    setDate(fromDate);
    setSelectedCategories(categories);
    setSelectedSource(source);
  }, [location.search, preferences]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (date) params.set("fromDate", date.toISOString());
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((category) =>
        params.append("categories", category)
      );
    }
    if (selectedSource) params.set("source", selectedSource);

    navigate({ search: params.toString() });
  }, [searchTerm, date, selectedCategories, selectedSource, navigate]);

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
  }, [searchTerm, date, selectedCategories, selectedSource, onSubmit]);

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
        onChange={(e) => setSelectedCategories([e.target.value])}
        value={selectedCategories[0] || ""}
        className="p-2 border rounded-md"
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
