
import { GoogleGenAI, Type } from "@google/genai";
import { AIConfig } from "../types";

// Default configuration values
// Fix: Updated default model to 'gemini-3-flash-preview' per guidelines for basic text tasks
const DEFAULT_GOOGLE_MODEL = 'gemini-3-flash-preview';
const DEFAULT_OPENROUTER_MODEL = 'mistralai/mistral-7b-instruct:free'; // Example free model

// Helper to get config from LocalStorage or Environment
const getAIConfig = (): AIConfig => {
  try {
    const stored = localStorage.getItem('pingmanager_ai_config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading AI config", e);
  }
  
  // Fallback to Env API Key (Gemini default)
  return {
    provider: 'google',
    apiKey: process.env.API_KEY || '',
    model: DEFAULT_GOOGLE_MODEL
  };
};

// Helper to clean Markdown code blocks from JSON response
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

// --- OPENROUTER API CALLER ---
const callOpenRouter = async (config: AIConfig, prompt: string, responseSchema?: any) => {
  if (!config.apiKey) throw new Error("Clé API OpenRouter manquante");

  let finalPrompt = prompt;
  // OpenRouter doesn't enforce strict schema via SDK, so we prompt-engineer it slightly for JSON
  if (responseSchema) {
    finalPrompt += "\n\nIMPORTANT: Réponds UNIQUEMENT avec un JSON valide correspondant à la structure demandée. Pas de texte avant ou après.";
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://pingmanager.app", // Optional
      "X-Title": "PingManager" // Optional
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_OPENROUTER_MODEL,
      messages: [
        { role: "user", content: finalPrompt }
      ],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur OpenRouter");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
};

// --- GOOGLE API CALLER ---
const callGoogle = async (config: AIConfig, prompt: string, schemaConfig?: any) => {
  // Fix: Always initialize GoogleGenAI with named apiKey parameter and use process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = config.model || DEFAULT_GOOGLE_MODEL;

  const generateConfig: any = {};
  if (schemaConfig) {
    generateConfig.responseMimeType = "application/json";
    generateConfig.responseSchema = schemaConfig;
  }

  // Fix: Use ai.models.generateContent and access result using .text property
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: generateConfig
  });

  return response.text || "";
};

// --- EXPORTED FUNCTIONS ---

export const refineExerciseDescription = async (currentDescription: string): Promise<string> => {
  const config = getAIConfig();
  const prompt = `Réécris et améliore cette description d'exercice de tennis de table pour un entraîneur. Rends-la plus claire, plus engageante et ajoute un ou deux points de coaching clés. Reste concis. Description : "${currentDescription}"`;

  try {
    let text = "";
    if (config.provider === 'openrouter') {
      text = await callOpenRouter(config, prompt);
    } else {
      text = await callGoogle(config, prompt);
    }
    return text.trim();
  } catch (error) {
    console.error("Error refining description:", error);
    return "Erreur lors de la génération (vérifiez vos paramètres IA).";
  }
};

export type SuggestedExercise = {
  name: string;
  duration: number;
  description: string;
  material: string;
  theme: string;
};

export const suggestExercises = async (sessionName: string, existingExercises: string[]): Promise<SuggestedExercise[]> => {
  const config = getAIConfig();
  const prompt = `
    En te basant sur le titre de la séance d'entraînement "${sessionName}" et les exercices déjà inclus (${existingExercises.join(', ')}), suggère 3 nouveaux exercices de tennis de table créatifs. 
    Retourne la réponse sous forme de tableau JSON. Chaque objet du tableau doit avoir : "name" (chaîne), "duration" (nombre en minutes), "description" (chaîne), "material" (chaîne), et "theme" (chaîne parmi : 'Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes').
    Ne suggère pas d'exercices déjà dans la liste.
    Exemple d'un objet : {"name": "Topspin enchaîné sur pivot", "duration": 15, "description": "L'entraîneur envoie une balle courte en RV, le joueur fait une poussette, puis une balle longue en CD que le joueur attaque en topspin après un pivot.", "material": "Panier de balles", "theme": "Topspin"}
    `;

  try {
    let text = "";
    if (config.provider === 'openrouter') {
      text = await callOpenRouter(config, prompt, true);
    } else {
      // Google Schema
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
          }
        }
      };
      text = await callGoogle(config, prompt, schema);
    }

    const jsonString = cleanJSON(text);
    return JSON.parse(jsonString) as SuggestedExercise[];
  } catch (error) {
    console.error("Error suggesting exercises:", error);
    return [];
  }
};

export type CyclePlan = { weeks: { weekNumber: number; theme: string; notes: string }[] };

export const generateCyclePlan = async (promptText: string, numWeeks: number): Promise<CyclePlan> => {
  const config = getAIConfig();
  const prompt = `
        En te basant sur l'objectif suivant pour un cycle d'entraînement de tennis de table : "${promptText}", crée un plan structuré pour ${numWeeks} semaines.
        Pour chaque semaine, fournis un "theme" principal (un focus technique ou tactique) et de brèves "notes" (points clés ou objectifs pour cette semaine).
        Retourne le résultat sous forme d'objet JSON avec une seule clé "weeks", qui est un tableau d'objects. Chaque objet doit avoir "weekNumber", "theme", et "notes".
    `;

  try {
    let text = "";
    if (config.provider === 'openrouter') {
        text = await callOpenRouter(config, prompt, true);
    } else {
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
                        }
                    }
                }
            }
        };
        text = await callGoogle(config, prompt, schema);
    }
    
    const jsonString = cleanJSON(text);
    return JSON.parse(jsonString) as CyclePlan;
  } catch (error) {
    console.error("Error generating cycle plan:", error);
    return { weeks: [] };
  }
};
