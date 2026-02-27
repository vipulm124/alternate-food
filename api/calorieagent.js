import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod"; // Optional: for strict schema validation
import "dotenv/config";

export default async function handler(req, res) {
  const { foodItem } = req.body;
  console.log("Received food item: ", foodItem)

  // 1. Initialize OpenAI Model
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini", // Use gpt-4o-mini for speed and cost-efficiency
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
    })
  );

  const chain = PromptTemplate.fromTemplate(
    `You are a nutrition assistant.
    For the given item, provide:
    - estimated calories
    - short health notes
    - healthier alternatives 
    
    Item: {food}
    
    {format_instructions}`
  ).pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({
      food: foodItem,
      format_instructions: parser.getFormatInstructions(),
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Error processing nutrition data", details: error.message }));
  }
}