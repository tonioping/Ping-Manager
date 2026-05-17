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

/**
 * Fonction générique pour tester la clé ou suggérer des exercices isolés
 */
export const suggestExercises = async (config: AIConfig, promptText: string, library: Exercise[]): Promise<any> => {
  if (!config.apiKey) throw new Error("Clé API manquante");
  
  const prompt = `Expert Tennis de Table. Basé sur : "${promptText}". 
  Réponds en JSON : {"exercises": [{"name": "...", "description": "..."}]}`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text);
};

export const generateFullSession = async (config: AIConfig, sessionName: string): Promise<Record<string, any[]>> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const prompt = `Tu es un expert en tennis de table. Crée une séance d'entraînement COMPLÈTE de 60 minutes environ intitulée "${sessionName}".
  La séance doit être équilibrée et structurée.
  
  Répartis les exercices dans ces phases (PhaseId): echauffement, regularite, technique, deplacement, schema, matchs, retour-au-calme.
  
  Contraintes:
  - Durée totale = 60 minutes.
  - Pour chaque exercice, fournis: name, duration (en min), description, material, theme.
  - Sois précis techniquement.
  
  Réponds UNIQUEMENT en JSON avec cette structure:
  {
    "echauffement": [{"name": "...", "duration": 10, "description": "...", "material": "...", "theme": "..."}],
    "regularite": [...],
    "technique": [...],
    "deplacement": [...],
    "schema": [...],
    "matchs": [...],
    "retour-au-calme": [...]
  }`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text) || {};
};

export const autoFillSessionFromLibrary = async (config: AIConfig, description: string, library: Exercise[]): Promise<Record<string, string[]>> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const simplifiedLibrary = library.map(ex => ({ id: ex.id, name: ex.name, phase: ex.phase, duration: ex.duration }));
  const prompt = `Voici ma bibliothèque d'exercices: ${JSON.stringify(simplifiedLibrary)}
  L'utilisateur veut une séance de 60 minutes sur le thème: "${description}"
  
  Sélectionne les meilleurs exercices (IDs) pour remplir environ 60 minutes au total, répartis logiquement par phase.
  Réponds UNIQUEMENT en JSON: {"echauffement": ["id1"], "technique": ["id2", "id3"], "matchs": ["id4"]}`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text) || {};
};

export const generateCyclePlan = async (config: AIConfig, cycleName: string, numWeeks: number): Promise<any> => {
  if (!config.apiKey) throw new Error("Clé API manquante");

  const prompt = `Crée un plan de progression de tennis de table pour un cycle nommé "${cycleName}" sur ${numWeeks} semaines.
  Réponds UNIQUEMENT en JSON: {"weeks": [{"weekNumber": 1, "theme": "...", "notes": "..."}]}`;

  const text = config.provider === 'openrouter' 
    ? await callOpenRouter(config, prompt)
    : await callGemini(config, prompt);

  return cleanJSONResponse(text);
};