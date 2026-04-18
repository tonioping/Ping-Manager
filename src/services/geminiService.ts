import { GoogleGenAI } from "@google/genai";
import { Exercise } from "../types";

const getApiKey = () => process.env.API_KEY || "";

// Fonction utilitaire pour extraire proprement le JSON d'une réponse texte
const cleanJSONResponse = (text: string) => {
  try {
    // Supprime les blocs de code markdown si présents
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("[Gemini] Erreur de parsing JSON. Texte reçu:", text);
    throw new Error("Format de réponse IA invalide");
  }
};

export const suggestExercises = async (sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Suggère 3 exercices de tennis de table pour la séance "${sessionName}". 
  Exercices déjà présents: ${existingExercises.join(', ')}.
  Réponds UNIQUEMENT avec un tableau JSON d'objets: [{"name": "...", "duration": 15, "description": "...", "material": "...", "theme": "..."}]`;

  try {
    const result = await model.generateContent(prompt);
    return cleanJSONResponse(result.response.text());
  } catch (error) {
    console.error("[Gemini] Error:", error);
    return [];
  }
};

export const autoFillSessionFromLibrary = async (description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const apiKey = getApiKey();
  if (!apiKey) return {};

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const simplifiedLibrary = library.map(ex => ({ id: ex.id, name: ex.name, phase: ex.phase }));

  const prompt = `Voici ma bibliothèque d'exercices: ${JSON.stringify(simplifiedLibrary)}
  L'utilisateur veut: "${description}"
  Sélectionne les meilleurs exercices (IDs) pour chaque phase.
  Réponds UNIQUEMENT avec un objet JSON où les clés sont les phases (echauffement, regularite, technique, panier, deplacement, schema, matchs, cognitif, retour-au-calme) et les valeurs sont des tableaux d'IDs.
  Exemple: {"technique": ["id1", "id2"], "matchs": ["id3"]}`;

  try {
    const result = await model.generateContent(prompt);
    const data = cleanJSONResponse(result.response.text());
    console.log("[Gemini] Plan de séance généré:", data);
    return data;
  } catch (error) {
    console.error("[Gemini] Error auto-fill:", error);
    return {};
  }
};

export const generateCyclePlan = async (promptText: string, numWeeks: number): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) return { weeks: [] };

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Crée un plan de ${numWeeks} semaines pour l'objectif: "${promptText}".
  Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

  try {
    const result = await model.generateContent(prompt);
    return cleanJSONResponse(result.response.text());
  } catch (error) {
    console.error("[Gemini] Error cycle:", error);
    return { weeks: [] };
  }
};