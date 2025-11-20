
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to clean Markdown code blocks from JSON response
const cleanJSON = (text: string) => {
  let cleaned = text.trim();
  // Remove markdown code blocks indicators
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
  
  // Find first { or [
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
      // Find last } or ]
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');
      const end = Math.max(lastBrace, lastBracket);
      if (end !== -1) {
          cleaned = cleaned.substring(0, end + 1);
      }
  }
  
  return cleaned;
};

export const refineExerciseDescription = async (currentDescription: string): Promise<string> => {
  try {
    const prompt = `Réécris et améliore cette description d'exercice de tennis de table pour un entraîneur. Rends-la plus claire, plus engageante et ajoute un ou deux points de coaching clés. Reste concis. Description : "${currentDescription}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error refining description:", error);
    return "Erreur lors de la génération de la description.";
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
  const prompt = `
    En te basant sur le titre de la séance d'entraînement "${sessionName}" et les exercices déjà inclus (${existingExercises.join(', ')}), suggère 3 nouveaux exercices de tennis de table créatifs. 
    Retourne la réponse sous forme de tableau JSON. Chaque objet du tableau doit avoir : "name" (chaîne), "duration" (nombre en minutes), "description" (chaîne), "material" (chaîne), et "theme" (chaîne parmi : 'Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes').
    Ne suggère pas d'exercices déjà dans la liste.
    Exemple d'un objet : {"name": "Topspin enchaîné sur pivot", "duration": 15, "description": "L'entraîneur envoie une balle courte en RV, le joueur fait une poussette, puis une balle longue en CD que le joueur attaque en topspin après un pivot.", "material": "Panier de balles", "theme": "Topspin"}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
                }
            }
        });

        const jsonString = cleanJSON(response.text);
        return JSON.parse(jsonString) as SuggestedExercise[];
    } catch (error) {
        console.error("Error suggesting exercises:", error);
        return [];
    }
};

export type CyclePlan = { weeks: { weekNumber: number; theme: string; notes: string }[] };

export const generateCyclePlan = async (prompt: string, numWeeks: number): Promise<CyclePlan> => {
    const generationPrompt = `
        En te basant sur l'objectif suivant pour un cycle d'entraînement de tennis de table : "${prompt}", crée un plan structuré pour ${numWeeks} semaines.
        Pour chaque semaine, fournis un "theme" principal (un focus technique ou tactique) et de brèves "notes" (points clés ou objectifs pour cette semaine).
        Retourne le résultat sous forme d'objet JSON avec une seule clé "weeks", qui est un tableau d'objets. Chaque objet doit avoir "weekNumber", "theme", et "notes".
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: generationPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
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
                }
            }
        });
        const jsonString = cleanJSON(response.text);
        return JSON.parse(jsonString) as CyclePlan;
    } catch (error) {
        console.error("Error generating cycle plan:", error);
        return { weeks: [] };
    }
};
