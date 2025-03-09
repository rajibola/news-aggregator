// src/components/PreferencesModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { usePreferences } from "../context/PreferencesContext";
import { Preferences } from "../types";
import {
  availableCategories,
  availableSources,
} from "../context/PreferencesContext";

const PreferencesModal: React.FC<{
  updatePreferences: (newPreferences: Preferences) => void;
  resetSelectedSource: () => void;
  selectedSource: string | null;
  setSelectedSource: (source: string | null) => void;
}> = ({ updatePreferences }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, setPreferences } = usePreferences();

  // Persist preferences to localStorage
  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);

    // Save preferences to localStorage
    localStorage.setItem("preferences", JSON.stringify(preferences));

    updatePreferences(preferences);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Preferences
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">News Preferences</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Sources
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSources.map((source) => (
                      <label
                        key={source}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={preferences.sources.includes(source)}
                          onChange={(e) => {
                            const newSources = e.target.checked
                              ? [...preferences.sources, source]
                              : preferences.sources.filter((s) => s !== source);
                            setPreferences({
                              ...preferences,
                              sources: newSources,
                            });
                          }}
                          className="rounded text-blue-600"
                        />
                        <span>{source}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Categories
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={preferences.categories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...preferences.categories, category]
                              : preferences.categories.filter(
                                  (c) => c !== category
                                );
                            setPreferences({
                              ...preferences,
                              categories: newCategories,
                            });
                          }}
                          className="rounded text-blue-600"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
