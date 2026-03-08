import type { ResultData } from "./ResultDataType";

export interface FoodInputProps {
  onResult: (data: ResultData) => void;
  onError: (error: string) => void;
}
