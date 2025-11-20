import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const client = new GoogleGenerativeAI({ apiKey: API_KEY });

// Helper to clean Markdown code blocks from JSON response
const cleanJSON = (text: string) => {
  let cleaned = text.trim();
  // Remove markdown code blocks indicators
  cleaned = cleaned.replace(/```json\n/g, "").replace(/```\n/g, "").replace(/```/g, "");

  // Find first { or [
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let start = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    start = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    start = firstBrace;
  } else if (firstBracket !== -1) {
    start = firstBracket;
  }

  if (start !== -1) {
    cleaned = cleaned.substring(start);
  }

  return cleaned;
};

export const generatePingAnalysis = async (
  hostnames: string[],
  requirements: string
): Promise<any> => {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a networking expert. Analyze these ping results and requirements, then respond with a JSON object.

Ping Results:
${hostnames.join(", ")}

Requirements:
${requirements}

Respond with ONLY a valid JSON object (no markdown, no extra text) with this structure:
{
  "summary": "Brief analysis summary",
  "performanceRating": "excellent|good|fair|poor",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "requirementsMet": true|false
}`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const cleaned = cleanJSON(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse response:", cleaned);
    return {
      summary: text,
      performanceRating: "unknown",
      recommendations: [],
      requirementsMet: false,
    };
  }
};
