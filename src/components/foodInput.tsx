import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import type { FoodInputProps } from "../types/FoodInputType";
import { analyzeFood } from "../utils/supabase";
import { fetchSearchHistory } from "../utils/supabase";



function FoodInput({ onResult, onError }: FoodInputProps) {
  const [food, setFood] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = async () => {
    if (!food.trim()) return;

    setIsProcessing(true);
    onError("");

    try {
      const modelResponse = await analyzeFood(food);
      if (modelResponse) {
        await fetchSearchHistory();
        onResult(modelResponse);
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsProcessing(false);
      setFood("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 mt-10"
    >
      <div className="flex items-center gap-4">
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
        <div className="flex justify-end sm:block mt-2 sm:mt-0">
          {isProcessing && (
            <Loader2 className="animate-spin text-green-600 w-6 h-6 sm:w-7 sm:h-7" />
          )}
        </div>
      </div>
    </form>
  );
}

export default FoodInput;
