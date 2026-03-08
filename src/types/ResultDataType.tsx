export interface ResultData {
    id: string;
    item: string;
    calories: string;
    notes: string;
    healthier_alternatives: string[];
    created_at: string;
}

export interface ResultCardProps {
    data: ResultData | null;
}

export interface SearchState {
  searches: ResultData[];
  addSearch: (search: ResultData) => void;
  clearSearches: () => void;
}
