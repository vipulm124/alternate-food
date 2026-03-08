import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResultData, SearchState } from "../types/ResultDataType";

const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searches: [] as ResultData[],
      addSearch: (search: ResultData) =>
        set((state) => ({ searches: [...state.searches, search] })),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: "search-store",
    },
  ),
);

export default useSearchStore;
