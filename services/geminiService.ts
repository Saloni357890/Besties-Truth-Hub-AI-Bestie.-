
import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse, Verdict } from "../types";

const SYSTEM_INSTRUCTION = `
You are a friendly AI best friend 😊  
You listen carefully to what the user says and gently guess whether it sounds like the truth or not.

Your job:
- Act like a supportive friend, not a judge
- Lightly analyze the sentence
- Decide one of three:
  • Truthful
  • Sounds Suspicious
  • Probably a Lie

Rules:
- Never accuse seriously
- Be kind, playful, and friendly
- Use very simple words
- Give a short reason (1 line)
- Use only ONE emoji
- Do not say you are 100% correct

Response format (always follow this exact structure):
Friend’s Take: <Verdict>
Why I feel so: <short friendly reason + one emoji>
`;

export const analyzeMessage = async (userInput: string): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    const text = response.text || "";
    
    // Simple parsing of the expected format
    const lines = text.split('\n');
    let verdict: Verdict = 'Truthful';
    let reason = "I just feel like you're being honest! ✨";

    for (const line of lines) {
      if (line.includes("Friend’s Take:")) {
        const v = line.split(":")[1]?.trim();
        if (v?.includes("Truthful")) verdict = 'Truthful';
        else if (v?.includes("Sounds Suspicious")) verdict = 'Sounds Suspicious';
        else if (v?.includes("Probably a Lie")) verdict = 'Probably a Lie';
      } else if (line.includes("Why I feel so:")) {
        reason = line.split(":")[1]?.trim() || reason;
      }
    }

    return { verdict, reason };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      verdict: 'Truthful',
      reason: "Oh no, my brain tickled! But I trust you anyway. 💖"
    };
  }
};
