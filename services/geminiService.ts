import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY) as string;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const client = new GoogleGenerativeAI(API_KEY);

// Helper to clean Markdown code blocks from JSON response
const cleanJSON = (text: string) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json\n/g, "").replace(/```\n/g, "").replace(/```/g, "");

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

export interface SuggestedExercise {
  name: string;
  description: string;
  duration: number;
  theme?: string;
  phase?: string;
}

export const refineExerciseDescription = async (description: string): Promise<string> => {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Tu es un coach d'entraînement expert. Améliore cette description d'exercice en la rendant plus claire, précise et motivante. Garde-la concise (2-3 phrases max).

Description actuelle: "${description}"

Réponds UNIQUEMENT avec la description améliorée, sans guillemets ni explications.`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  return text.trim();
};

export const suggestExercises = async (sessionName: string, existingExerciseNames: string[]): Promise<SuggestedExercise[]> => {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Tu es un coach d'entraînement expert. Suggère 3 exercices complémentaires pour cette séance.

Nom de la séance: "${sessionName}"
Exercices déjà présents: ${existingExerciseNames.join(", ") || "aucun"}

Réponds avec UNIQUEMENT un JSON valide (pas de markdown, pas d'explications) avec cette structure:
[
  {
    "name": "Nom de l'exercice",
    "description": "Description courte",
    "duration": 15,
    "theme": "Catégorie"
  }
]
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const cleaned = cleanJSON(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse suggestions:", cleaned);
    return [];
  }
};

export const generateCyclePlan = async (cycleObjective: string, numberOfWeeks: number): Promise<{ weeks: any[] }> => {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Tu es un coach d'entraînement expert. Crée un plan d'entraînement structuré avec une progression logique.

Objectif: "${cycleObjective}"
Nombre de semaines: ${numberOfWeeks}

Réponds avec UNIQUEMENT un JSON valide (pas de markdown, pas d'explications) avec cette structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Focus technique ou capacité (ex: Endurance, Force, Technique)",
      "notes": "Conseils d'entraînement pour cette semaine"
    }
  ]
}

Génère exactement ${numberOfWeeks} semaines avec une progression cohérente.`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const cleaned = cleanJSON(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse cycle plan:", cleaned);
    return { weeks: [] };
  }
};
