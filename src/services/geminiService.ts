import { GoogleGenAI } from "@google/genai";
import { Exercise } from "../types";

// Fonction de validation stricte de la clé
const validateKey = (key: string | undefined | null): string | null => {
  if (!key || key === "undefined" || key.trim() === "") return null;
  return key.trim();
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

export const suggestExercises = async (apiKey: string, sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const validKey = validateKey(apiKey);
  if (!validKey) throw new Error("Clé API non configurée ou invalide");

  const genAI = new GoogleGenAI(validKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Tu es un expert en tennis de table. Suggère 3 exercices pour la séance "${sessionName}". 
  Déjà présents: ${existingExercises.join(', ')}.
  Réponds UNIQUEMENT en JSON: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || [];
  } catch (error: any) {
    console.error("[Gemini] Erreur suggestion:", error);
    throw new Error(error.message || "Erreur de communication avec l'IA");
  }
};

export const autoFillSessionFromLibrary = async (apiKey: string, description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const validKey = validateKey(apiKey);
  if (!validKey) throw new Error("Clé API non configurée");

  if (library.length === 0) return {};

  const genAI = new GoogleGenAI(validKey);
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
  } catch (error: any) {
    console.error("[Gemini] Erreur auto-fill:", error);
    throw new Error(error.message || "Erreur de communication avec l'IA");
  }
};

export const generateCyclePlan = async (apiKey: string, promptText: string, numWeeks: number): Promise<any> => {
  const validKey = validateKey(apiKey);
  if (!validKey) throw new Error("Clé API non configurée");

  const genAI = new GoogleGenAI(validKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Crée un plan de ${numWeeks} semaines pour: "${promptText}".
  Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || { weeks: [] };
  } catch (error: any) {
    console.error("[Gemini] Erreur cycle:", error);
    throw new Error(error.message || "Erreur de communication avec l'IA");
  }
};