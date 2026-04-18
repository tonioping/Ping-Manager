import { GoogleGenAI } from "@google/genai";
import { Exercise } from "../types";

// Récupération de la clé API injectée par Vite
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined") {
    console.warn("[Gemini] Clé API manquante dans l'environnement.");
    return null;
  }
  return key;
};

const cleanJSONResponse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("[Gemini] Erreur de parsing JSON. Texte brut:", text);
    return null;
  }
};

export const suggestExercises = async (sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante");

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Tu es un expert en tennis de table. Suggère 3 exercices pour la séance "${sessionName}". 
  Déjà présents: ${existingExercises.join(', ')}.
  Réponds UNIQUEMENT en JSON: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || [];
  } catch (error) {
    console.error("[Gemini] Erreur suggestion:", error);
    throw error;
  }
};

export const autoFillSessionFromLibrary = async (description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante");

  if (library.length === 0) {
    console.warn("[Gemini] La bibliothèque est vide.");
    return {};
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const simplifiedLibrary = library.map(ex => ({ id: ex.id, name: ex.name, phase: ex.phase }));

  const prompt = `Voici ma bibliothèque d'exercices: ${JSON.stringify(simplifiedLibrary)}
  L'utilisateur veut: "${description}"
  Sélectionne les meilleurs exercices (IDs) pour chaque phase.
  Réponds UNIQUEMENT en JSON: {"technique": ["id1"], "matchs": ["id2"]}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = cleanJSONResponse(response.text());
    return data || {};
  } catch (error) {
    console.error("[Gemini] Erreur auto-fill:", error);
    throw error;
  }
};

export const generateCyclePlan = async (promptText: string, numWeeks: number): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante");

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Crée un plan de ${numWeeks} semaines pour: "${promptText}".
  Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || { weeks: [] };
  } catch (error) {
    console.error("[Gemini] Erreur cycle:", error);
    throw error;
  }
};