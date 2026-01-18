
import { GoogleGenAI } from "@google/genai";

export const getArtInsight = async (topic: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API key not configured.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert art historian. Provide a concise, engaging, and professional 100-word insight about the following art history topic in Chinese: ${topic}. Focus on style, significance, and a fun fact.`,
    });
    return response.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，AI 鉴赏助手暂时休息了。";
  }
};
