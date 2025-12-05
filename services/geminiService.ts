import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const explainSql = async (query: string, context: string): Promise<string> => {
  if (!ai) return "API Key not configured. Please check environment variables.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Senior Database Engineer. Explain the following SQL or Database concept clearly to a student.
      Context: ${context}
      
      Query/Concept:
      ${query}
      
      Keep it concise and educational.`,
    });
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating explanation. Please try again.";
  }
};
