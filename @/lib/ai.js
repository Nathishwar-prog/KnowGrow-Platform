import {
  GoogleGenAI,
} from '@google/genai';


export const ai = new GoogleGenAI({ // ✅ fixed class name
      apiKey: process.env.GEMINI_API_KEY,
    });