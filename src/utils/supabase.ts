// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import useSearchStore from "../store/searchStore";
/**
 * Ask OpenAI about a food item and persist the result.
 * KEY IS EMBEDDED IN THE BUNDLE – DO NOT DO THIS IF YOU NEED A SECRET.
 */
export async function analyzeFood(foodItem: string) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("VITE_OPENAI_API_KEY not set");

  // 1. Initialize OpenAI Model
  const model = new ChatOpenAI({
    apiKey: apiKey,
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  // 2. Define exactly what the React app expects
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      item: z.string().describe("food or drink item"),
      calories: z.string().describe("estimated calories"),
      notes: z.string().describe("short health notes"),
      healthier_alternatives: z
        .array(z.string())
        .describe("list of healthier alternatives"),
    }),
  );

  const chain = PromptTemplate.fromTemplate(
    `You are a nutrition assistant.
        For the given item, provide:
        - estimated calories
        - short health notes
        - healthier alternatives 
        
        Item: {food}
        
        {format_instructions}`,
  )
    .pipe(model)
    .pipe(parser);

  const {
    data: { user },
    error, 
  } = await supabase.auth.getUser();

  const result = await chain.invoke({
    food: foodItem,
    format_instructions: parser.getFormatInstructions(),
  });

  // Supabase insert (RLS will ensure the row belongs to the current user)
  await supabase.from("searches").insert({
    id: crypto.randomUUID(),
    user_id: user?.id ?? null,
    food_item: result.item,
    calories: result.calories,
    notes: result.notes,
    healthier_alternatives: result.healthier_alternatives,
    created_at: new Date().toISOString(),
  });

  return result;
}

export async function fetchSearchHistory() {
  const {
    data: { user },
    err,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("searches")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  if (data && data.length) {
    const { addSearch, clearSearches } = useSearchStore.getState();
    console.log("All Data", data)

    clearSearches();
    data.forEach((search: any) =>
      addSearch({
        id: search.id,
        item: search.food_item,
        calories: search.calories,
        notes: search.notes,
        healthier_alternatives: search.healthier_alternatives,
        created_at: new Date(search.created_at).toLocaleString('en-US')
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
    error,
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("searches").delete().eq("user_id", user.id);
  }
}

export default supabase;
