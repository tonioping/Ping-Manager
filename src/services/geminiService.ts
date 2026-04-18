import { GoogleGenAI } from "@google/genai";
import { Exercise } from "../types";

/**
 * Nettoyage ultra-strict de la clé API
 */
const getValidKey = (key: string | undefined | null): string | null => {
  if (!key) return null;
  // Supprime les espaces, les retours à la ligne et les guillemets accidentels
  const cleaned = key.toString().trim().replace(/["']/g, "");
  if (cleaned === "" || cleaned === "undefined" || cleaned === "null") return null;
  return cleaned;
};

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

export const suggestExercises = async (apiKey: string, sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const validKey = getValidKey(apiKey);
  if (!validKey) throw new Error("Clé API vide ou invalide.");

  try {
    const genAI = new GoogleGenAI(validKey);
    // Utilisation du modèle le plus stable
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tu es un expert en tennis de table. Suggère 3 exercices pour la séance "${sessionName}". 
    Déjà présents: ${existingExercises.join(', ')}.
    Réponds UNIQUEMENT en JSON: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || [];
  } catch (error: any) {
    // On renvoie l'erreur brute de Google pour comprendre le vrai problème
    const msg = error.message || "Erreur inconnue";
    console.error("[Gemini Error]", error);
    throw new Error(`Google dit : ${msg}`);
  }
};

export const autoFillSessionFromLibrary = async (apiKey: string, description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const validKey = getValidKey(apiKey);
  if (!validKey) throw new Error("Clé API manquante");

  try {
    const genAI = new GoogleGenAI(validKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const simplifiedLibrary = library.map(ex => ({ id: ex.id, name: ex.name, phase: ex.phase }));

    const prompt = `Voici ma bibliothèque d'exercices: ${JSON.stringify(simplifiedLibrary)}
    L'utilisateur veut: "${description}"
    Sélectionne les meilleurs exercices (IDs) pour chaque phase.
    Réponds UNIQUEMENT en JSON: {"technique": ["id1"], "matchs": ["id2"]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || {};
  } catch (error: any) {
    throw new Error(`Google dit : ${error.message}`);
  }
};

export const generateCyclePlan = async (apiKey: string, promptText: string, numWeeks: number): Promise<any> => {
  const validKey = getValidKey(apiKey);
  if (!validKey) throw new Error("Clé API manquante");

  try {
    const genAI = new GoogleGenAI(validKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Crée un plan de ${numWeeks} semaines pour: "${promptText}".
    Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || { weeks: [] };
  } catch (error: any) {
    throw new Error(`Google dit : ${error.message}`);
  }
};