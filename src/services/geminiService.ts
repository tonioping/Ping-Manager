import { GoogleGenAI, Type } from "@google/genai";
import { AIConfig } from "../types";

const DEFAULT_GOOGLE_MODEL = 'gemini-3-flash-preview';
const COMPLEX_GOOGLE_MODEL = 'gemini-3-pro-preview';

const getAIConfig = (): AIConfig => {
  try {
    const stored = localStorage.getItem('pingmanager_ai_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading AI config", e);
  }
  
  return {
    provider: 'google',
    apiKey: process.env.API_KEY || '',
    model: DEFAULT_GOOGLE_MODEL
  };
};

const cleanJSON = (text: string) => {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
  
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
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
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');
      const end = Math.max(lastBrace, lastBracket);
      if (end !== -1) {
          cleaned = cleaned.substring(0, end + 1);
      }
  }
  
  return cleaned;
};

const callGoogle = async (config: AIConfig, prompt: string, schemaConfig?: any, modelName?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = modelName || config.model || DEFAULT_GOOGLE_MODEL;

  const generateConfig: any = {};
  if (schemaConfig) {
    generateConfig.responseMimeType = "application/json";
    generateConfig.responseSchema = schemaConfig;
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: generateConfig
  });

  return response.text || "";
};

export const suggestExercises = async (sessionName: string, existingExercises: string[]): Promise<any[]> => {
  const config = getAIConfig();
  const prompt = `
    En te basant sur le titre de la séance d'entraînement "${sessionName}" et les exercices déjà inclus (${existingExercises.join(', ')}), suggère 3 nouveaux exercices de tennis de table créatifs. 
    Retourne la réponse sous forme de tableau JSON. Chaque objet du tableau doit avoir : "name" (chaîne), "duration" (nombre en minutes), "description" (chaîne), "material" (chaîne), et "theme" (chaîne).
    `;

  try {
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          duration: { type: Type.INTEGER },
          description: { type: Type.STRING },
          material: { type: Type.STRING },
          theme: { type: Type.STRING },
        },
        required: ["name", "duration", "description", "material", "theme"]
      }
    };
    const text = await callGoogle(config, prompt, schema, COMPLEX_GOOGLE_MODEL);
    const jsonString = cleanJSON(text);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error suggesting exercises:", error);
    return [];
  }
};

export const generateCyclePlan = async (promptText: string, numWeeks: number): Promise<any> => {
  const config = getAIConfig();
  const prompt = `
        En te basant sur l'objectif suivant pour un cycle d'entraînement de tennis de table : "${promptText}", crée un plan structuré pour ${numWeeks} semaines.
        Retourne le résultat sous forme d'objet JSON avec une seule clé "weeks", qui est un tableau d'objects. Chaque objet doit avoir "weekNumber", "theme", et "notes".
    `;

  try {
    const schema = {
        type: Type.OBJECT,
        properties: {
            weeks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        weekNumber: { type: Type.INTEGER },
                        theme: { type: Type.STRING },
                        notes: { type: Type.STRING }
                    },
                    required: ["weekNumber", "theme", "notes"]
                }
            }
        },
        required: ["weeks"]
    };
    const text = await callGoogle(config, prompt, schema, COMPLEX_GOOGLE_MODEL);
    const jsonString = cleanJSON(text);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating cycle plan:", error);
    return { weeks: [] };
  }
};