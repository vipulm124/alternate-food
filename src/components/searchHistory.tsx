import { History } from "lucide-react";
import useSearchStore from "../store/searchStore";

function SearchHistory({ updateSetHistory }: { updateSetHistory: () => void }) {
  const searches = useSearchStore((state: any) => state.searches);

  return (
    <div className="flex justify-center mb-8">
      <div
        className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shaddow-md transition-shadow text-gray-700 hover:text-gray-900 hover:cursor-pointer"
        onClick={updateSetHistory}
      >
        <History /> View Search History ({searches.length})
      </div>
    </div>
  );
}

export default SearchHistory;
