import { useState } from "react";
import type { KeyboardEvent } from "react";
import { CircleArrowRight, Search, Loader2 } from "lucide-react";
import type { ResultData } from "./ResultCard";

interface FoodInputProps {
  onResult: (data: ResultData) => void;
  onError: (error: string) => void;
}

function FoodInput({ onResult, onError }: FoodInputProps) {
  const [food, setFood] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async () => {
    if (!food.trim()) return;

    setIsProcessing(true);
    onError(""); // Clear previous errors

    try {
      const response = await fetch("/api/calorieagent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodItem: food }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      onResult(data);
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 rounded-2xl transition-all hover:bg-gray-100 mt-6 sm:mt-10 min-w-full sm:min-w-3xl border border-transparent focus-within:border-green-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-50">
      <div className="flex items-center flex-1 gap-3 sm:gap-4">
        <Search className="text-gray-400 shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
        <input
          type="text"
          placeholder="Type a food item..."
          className="flex-1 bg-transparent outline-none text-lg sm:text-xl text-gray-800 placeholder:text-gray-400 w-full"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
      </div>
      <div className="flex justify-end sm:block mt-2 sm:mt-0">
        {isProcessing ? (
          <Loader2 className="animate-spin text-green-600 w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <button
            onClick={handleSearch}
            disabled={!food.trim()}
            className="text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50 disabled:hover:text-gray-400 cursor-pointer flex items-center justify-center p-2 sm:p-0 rounded-full hover:bg-gray-200 sm:hover:bg-transparent"
          >
            <CircleArrowRight className="w-7 h-7 sm:w-[28px] sm:h-[28px]" />
          </button>
        )}
      </div>
    </div>
  );
}

export default FoodInput;
