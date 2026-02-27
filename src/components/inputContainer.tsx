import { useState } from "react";
import FoodInput from "./foodInput";
import ResultCard from "./ResultCard";
import type { ResultData } from "./ResultCard";

function InputContainer() {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>("");

  return (
    <div className="bg-white p-6 sm:p-10 md:p-15 rounded-3xl mt-6 sm:mt-10">
      <p className="font-normal text-4xl md:text-5xl tracking-tight">Healthy Food Alternative</p>
      <p className="text-lg md:text-xl pt-4 md:pt-6 text-[#6a7282]">
        Enter any food to discover a healthier option
      </p>
      <FoodInput
        onResult={(data) => {
          setResultData(data);
          setError("");
        }}
        onError={(err) => setError(err)}
      />

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {resultData && <ResultCard data={resultData} />}
    </div>
  );
}

export default InputContainer;
