import { useState } from "react";
import FoodInput from "./foodInput";
import type { ResultData } from "../types/ResultDataType";
import ResultCard from "./ResultCard";
import SearchHistory from "./searchHistory";

function InputContainer({
  updateSetHistory,
}: {
  updateSetHistory: () => void;
}) {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>("");

  return (
    <div className="size-full bg-gray-50 overflow-auto">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-5xl mb-3 text-gray-900"
            data-fg-dag4="32.11:32.10224:/src/app/pages/Home.tsx:131:11:5442:97:e:h1:t"
          >
            Healthy Food Alternative
          </h1>
          <p
            className="text-gray-500 text-lg"
            data-fg-dag6="32.11:32.10224:/src/app/pages/Home.tsx:134:11:5550:110:e:p:t"
          >
            Enter any food to discover a healthier option
          </p>
          <FoodInput
            onResult={(data) => {
              setResultData(data);
              setError("");
            }}
            onError={(err) => setError(err)}
          />

          <SearchHistory updateSetHistory={updateSetHistory} />

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {resultData && <ResultCard data={resultData} />}
        </div>
      </div>
    </div>
  );
}

export default InputContainer;
