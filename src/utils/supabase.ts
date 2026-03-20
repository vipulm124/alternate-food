// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { ResultData } from "../types/ResultDataType";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storageKey: "af-auth-token",
  },
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;

import useSearchStore from "../store/searchStore";
import { get } from "./restCalls";

export async function analyzeFood(foodItem: string): Promise<ResultData | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    interface AnalyzeResponse {
      is_error?: boolean;
      calories: string;
      notes: string;
      healthier_alternatives: string[];
    }
    const result = await get<AnalyzeResponse>(
      `${backendUrl}/analyze?food_item=${encodeURIComponent(foodItem)}`,
    );
    if (result.is_error == true) {
      alert("Not a valid food item.");
      return null;
    }

    const { data, error: insertError } = await supabase
      .from("searches")
      .insert({
        id: crypto.randomUUID(),
        user_id: user?.id ?? null,
        food_item: foodItem,
        calories: result.calories,
        notes: result.notes,
        healthier_alternatives: result.healthier_alternatives,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      id: data.id,
      item: data.food_item,
      calories: data.calories,
      notes: data.notes,
      healthier_alternatives: data.healthier_alternatives,
      created_at: data.created_at,
    };
  } catch (e) {
    console.error(e);
    alert("some error");
  }

  return null;
}

export async function fetchSearchHistory() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("searches")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  if (data && data.length) {
    const { addSearch, clearSearches } = useSearchStore.getState();

    clearSearches();
    data.forEach((search: any) =>
      addSearch({
        id: search.id,
        item: search.food_item,
        calories: search.calories,
        notes: search.notes,
        healthier_alternatives: search.healthier_alternatives,
        created_at: new Date(search.created_at).toLocaleString("en-US"),
      }),
    );
  }

  return data;
}

export async function deleteSearch(search_id: string) {
  await supabase.from("searches").delete().eq("id", search_id);
}

export async function deleteAllSearch() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("searches").delete().eq("user_id", user.id);
  }
}

export default supabase;
