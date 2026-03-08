import {
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
  Leaf,
  CircleCheck,
} from "lucide-react";
import useSearchStore from "../store/searchStore";
import { useState } from "react";
import { deleteSearch, deleteAllSearch } from "../utils/supabase";
import { fetchSearchHistory } from "../utils/supabase";

function RecentSearches() {
  const searches = useSearchStore((state: any) => state.searches);
  const { clearSearches } = useSearchStore.getState();

  const [selectedSearchId, setSelectedSearchId] = useState("");

  function changeSelectedSearch(selectedId: string) {
    setSelectedSearchId(selectedId);
  }

  function resetSelectedSearch() {
    setSelectedSearchId("");
  }

  const deleteASearch = async (search_id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (isConfirmed) {
      await deleteSearch(search_id);
      await fetchSearchHistory();
    }
  };

  const deleteAllSearches = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all searches?",
    );

    if (isConfirmed) {
      await deleteAllSearch();
      clearSearches();
      await fetchSearchHistory();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-8 text-left">
        <a
          className="inline-flex gap-2 text-left text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          href="/"
          data-discover="true"
        >
          <ArrowLeft />
          <span>Back to Search</span>
        </a>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-gray-900 mb-2">Search History</h1>
            <p className="text-gray-500">{searches.length} searches saved</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:cursor-pointer"
            onClick={() => deleteAllSearches()}
          >
            <Trash2 />
            <span>Clear All</span>
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {searches.map((search, index) => (
          
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            key={index}
          >
            <button className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
              <div className="flex-1">
                <h3 className="text-2xl text-gray-900 capitalize mb-1">
                  {search.item}
                </h3>
                <p className="text-sm text-gray-500">{search.created_at}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-orange-700 mb-1">Calories</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {search.calories}
                  </p>
                </div>
                {selectedSearchId && selectedSearchId === search.id ? (
                  <ChevronDown
                    onClick={() => resetSelectedSearch()}
                    className="hover:cursor-pointer"
                  />
                ) : (
                  <ChevronUp
                    onClick={() => changeSelectedSearch(search.id)}
                    className="hover:cursor-pointer"
                  />
                )}
                <Trash2
                  onClick={() => deleteASearch(search.id)}
                  className="hover:cursor-pointer"
                />
              </div>
            </button>
            {selectedSearchId && selectedSearchId === search.id && (
              <div className="border-t border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-orange-50 rounded-xl p-6 mb-4">
                      <div className="flex items-center gap-3">
                        <Flame className="text-orange-500" />
                        <div>
                          <p className="text-xs text-orange-700 mb-1">
                            Estimated Calories
                          </p>
                          <p className="text-2xl font-semibold text-orange-600">
                            {search.calories}
                          </p>

                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex gap-3">
                        <Info className="text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {search.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="text-emerald-600" />

                      <h4 className="text-lg font-semibold text-emerald-900">
                        Healthier Alternatives
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {search.healthier_alternatives.map((alt: string) => (
                        <div
                          key={alt}
                          className="bg-white rounded-lg p-3 shadow-sm border border-emerald-100"
                        >
                          <div className="flex items-center gap-2">
                            <CircleCheck className="text-emerald-500 w-5 h-5" />
                            <p className="text-sm text-gray-800">{alt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
