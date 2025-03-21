import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { usePreferences } from "../hooks/usePreferences";
import { availableCategories, availableSources } from "../utils/constants";
interface SearchFiltersProps {
  onSubmit: (params: NewsFetchParams) => void;
  selectedSource: string | null;
  setSelectedSource: (source: string | null) => void;
}

const SearchFilters = ({
  onSubmit,
  selectedSource,
  setSelectedSource,
}: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = usePreferences();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
    setDate(params.get("fromDate") ? new Date(params.get("fromDate")!) : null);
    setSelectedCategories(params.getAll("categories"));
    setSelectedSource(params.get("source") || null);
  }, [location.search, setSelectedSource]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (date) params.set("fromDate", date.toISOString());
    selectedCategories.forEach((category) =>
      params.append("categories", category)
    );
    if (selectedSource) params.set("source", selectedSource);
    navigate({ search: params.toString() });
  }, [searchTerm, date, selectedCategories, selectedSource, navigate]);

  useEffect(() => {
    const params: NewsFetchParams = {
      q: searchTerm || undefined,
      fromDate: date?.toISOString(),
      categories:
        selectedCategories.length > 0
          ? selectedCategories
          : preferences.categories,
      sources: selectedSource ? [selectedSource] : undefined,
    };
    const handler = setTimeout(() => onSubmit(params), 500);
    return () => clearTimeout(handler);
  }, [
    searchTerm,
    date,
    selectedCategories,
    selectedSource,
    onSubmit,
    preferences,
  ]);

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
        enableTabLoop={false}
      />
      <select
        onChange={handleSourceChange}
        value={selectedSource || ""}
        className="p-2 border rounded-md"
      >
        <option value="">Select Source</option>
        {availableSources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>
      <select
        onChange={(e) =>
          setSelectedCategories(e.target.value ? [e.target.value] : [])
        }
        value={selectedCategories[0] || ""}
        className="p-2 border rounded-md"
      >
        <option value="">Select Category</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilters;
