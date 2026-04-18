import { GoogleGenAI, SchemaType } from "@google/genai";
import { AIConfig, Exercise, PhaseId } from "../types";

const DEFAULT_GOOGLE_MODEL = 'gemini-1.5-flash';
const COMPLEX_GOOGLE_MODEL = 'gemini-1.5-pro';

const getApiKey = () => {
  // Priorité à la clé en variable d'environnement injectée par Vite
  return (process.env.API_KEY) || "";
};

export const suggestExercises = async (sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: COMPLEX_GOOGLE_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    En te basant sur le titre de la séance d'entraînement "${sessionName}" et les exercices déjà inclus (${existingExercises.join(', ')}), suggère 3 nouveaux exercices de tennis de table créatifs. 
    Retourne un tableau JSON d'objets avec: "name", "duration" (nombre), "description", "material", "theme".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("[Gemini] Error suggesting exercises:", error);
    return [];
  }
};

export const autoFillSessionFromLibrary = async (description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  const apiKey = getApiKey();
  if (!apiKey) return {};

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: DEFAULT_GOOGLE_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });
  
  const simplifiedLibrary = library.map(ex => ({
    id: ex.id,
    name: ex.name,
    phase: ex.phase,
    theme: ex.theme
  }));

  const prompt = `
    Tu es un expert entraîneur de tennis de table. 
    Voici ma bibliothèque d'exercices : ${JSON.stringify(simplifiedLibrary)}
    
    L'utilisateur veut créer une séance : "${description}"
    
    Sélectionne les exercices les plus pertinents de la bibliothèque pour remplir les phases.
    Retourne un objet JSON où les clés sont les phases (echauffement, regularite, technique, panier, deplacement, schema, matchs, cognitif, retour-au-calme) et les valeurs sont des tableaux d'IDs d'exercices.
    
    IMPORTANT: N'utilise QUE les IDs de la liste fournie.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("[Gemini] Error auto-filling session:", error);
    return {};
  }
};

export const generateCyclePlan = async (promptText: string, numWeeks: number): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) return { weeks: [] };

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: COMPLEX_GOOGLE_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
    Objectif cycle : "${promptText}". Crée un plan pour ${numWeeks} semaines.
    Retourne un objet JSON avec une clé "weeks" (tableau d'objets avec weekNumber, theme, notes).
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("[Gemini] Error generating cycle plan:", error);
    return { weeks: [] };
  }
};