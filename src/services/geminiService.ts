import { GoogleGenAI } from "@google/genai";
import { Exercise } from "../types";

/**
 * Valide strictement la clé API.
 * Retourne la clé nettoyée ou null si elle est invalide/manquante.
 */
const getValidKey = (key: string | undefined | null): string | null => {
  if (!key) return null;
  const trimmed = key.trim();
  // On ignore les valeurs par défaut ou corrompues
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null") return null;
  return trimmed;
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
  const validKey = getValidKey(apiKey);
  if (!validKey) {
    throw new Error("Clé API manquante. Allez dans 'Paramètres' pour la configurer.");
  }

  try {
    const genAI = new GoogleGenAI(validKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tu es un expert en tennis de table. Suggère 3 exercices pour la séance "${sessionName}". 
    Déjà présents: ${existingExercises.join(', ')}.
    Réponds UNIQUEMENT en JSON: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || [];
  } catch (error: any) {
    console.error("[Gemini] Erreur suggestion:", error);
    // On attrape l'erreur spécifique du SDK pour la rendre plus lisible
    if (error.message?.includes("API Key")) {
      throw new Error("La clé API fournie est rejetée par Google. Vérifiez-la dans les Paramètres.");
    }
    throw new Error(error.message || "Erreur de communication avec l'IA");
  }
};

export const autoFillSessionFromLibrary = async (apiKey: string, description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const validKey = getValidKey(apiKey);
  if (!validKey) throw new Error("Clé API manquante");

  if (library.length === 0) return {};

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
    const data = cleanJSONResponse(response.text());
    return data || {};
  } catch (error: any) {
    console.error("[Gemini] Erreur auto-fill:", error);
    throw new Error("Impossible d'analyser la bibliothèque avec cette clé API.");
  }
};

export const generateCyclePlan = async (apiKey: string, promptText: string, numWeeks: number): Promise<any> => {
  const validKey = getValidKey(apiKey);
  if (!validKey) throw new Error("Clé API manquante");

  try {
    const genAI = new GoogleGenAI(validKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Crée un plan de ${numWeeks} semaines pour: "${promptText}".
    Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return cleanJSONResponse(response.text()) || { weeks: [] };
  } catch (error: any) {
    console.error("[Gemini] Erreur cycle:", error);
    throw new Error("Erreur lors de la génération du cycle. Vérifiez votre clé API.");
  }
};