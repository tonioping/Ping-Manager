import { GoogleGenAI } from "@google/genai";
import { Exercise, AIConfig } from "../types";

const cleanJSONResponse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

const callOpenRouter = async (config: AIConfig, prompt: string) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "PingManager",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": config.model || "google/gemini-flash-1.5",
      "messages": [{ "role": "user", "content": prompt }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Erreur OpenRouter");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callGemini = async (config: AIConfig, prompt: string) => {
  const genAI = new GoogleGenAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.model || "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const suggestExercises = async (config: AIConfig, sessionName: string, existingExercises: string[]): Promise<any[]> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const prompt = `Tu es un expert en tennis de table. Suggère 3 exercices pour la séance "${sessionName}". 
  Déjà présents: ${existingExercises.join(', ')}.
  Réponds UNIQUEMENT en JSON: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text) || [];
};

export const autoFillSessionFromLibrary = async (config: AIConfig, description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const simplifiedLibrary = library.map(ex => ({ id: ex.id, name: ex.name, phase: ex.phase }));
  const prompt = `Voici ma bibliothèque d'exercices: ${JSON.stringify(simplifiedLibrary)}
  L'utilisateur veut: "${description}"
  Sélectionne les meilleurs exercices (IDs) pour chaque phase.
  Réponds UNIQUEMENT en JSON: {"technique": ["id1"], "matchs": ["id2"]}`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text) || {};
};

export const generateCyclePlan = async (config: AIConfig, promptText: string, numWeeks: number): Promise<any> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const prompt = `Crée un plan de ${numWeeks} semaines pour: "${promptText}".
  Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text) || { weeks: [] };
};