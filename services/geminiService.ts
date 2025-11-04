
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateContentResponse } from '@google/genai';

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Suggestions will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getSuggestionsForInput = async (description: string): Promise<string[]> => {
  if (!API_KEY) return [];
  try {
    const prompt = `You are an expert in GitHub Actions. For a workflow input with the description "${description}", provide a JSON array of 3 common and realistic example values. For example, for "The environment to deploy to", you should return ["staging", "production", "development"]. Only return the JSON array of strings.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);

    if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
      return suggestions;
    }
    return [];
  } catch (error) {
    console.error('Error fetching suggestions from Gemini:', error);
    return [];
  }
};
