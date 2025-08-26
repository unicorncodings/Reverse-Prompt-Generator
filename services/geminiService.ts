import { GoogleGenAI } from "@google/genai";

const getAiClient = (): GoogleGenAI => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error("API Key not found. Please set it in the settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePromptFromImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };

    const textPart = {
      text: "Analyze this image and generate a highly detailed and descriptive prompt for an AI image generator. The prompt should capture the essence of the image, including the subject, setting, style, lighting, composition, colors, and mood. Be creative and evocative, as if you were trying to recreate this exact image from text alone. Start the prompt with the main subject. Do not use markdown."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating prompt from Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("The saved API key is invalid. Please update it in the settings.");
        }
        // Re-throw other errors, including the "API Key not found" one
        throw error;
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};