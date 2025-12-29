import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free';

const FALLBACK_TRIGGERS = [429, 401, 403, 500, 502, 503, 504];

async function callGemini(prompt, options = {}) {
  const {
    model = 'gemini-2.0-flash',
    tools = null,
    responseMimeType = 'text/plain',
  } = options;

  const config = { responseMimeType };
  if (tools) config.tools = tools;

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await gemini.models.generateContent({
    model,
    config,
    contents,
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  if (!text) {
    throw new Error('EMPTY_RESPONSE');
  }

  return text;
}

async function callOpenRouter(prompt, options = {}) {
  const { model = OPENROUTER_MODEL } = options;

  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'AI Tutor',
      },
      timeout: 60000,
    }
  );

  const text = response?.data?.choices?.[0]?.message?.content || '';
  
  if (!text) {
    throw new Error('EMPTY_RESPONSE');
  }

  return text;
}

function shouldFallback(error) {
  const status = error?.status || error?.response?.status;
  
  if (status && FALLBACK_TRIGGERS.includes(status)) {
    return true;
  }
  
  const message = error?.message?.toLowerCase() || '';
  if (
    message.includes('429') ||
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('timeout') ||
    message.includes('network') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('empty_response')
  ) {
    return true;
  }

  return false;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateContent(prompt, options = {}) {
  const {
    geminiModel = 'gemini-2.0-flash',
    openRouterModel = OPENROUTER_MODEL,
    tools = null,
    maxGeminiRetries = 1,
    geminiBackoffMs = 2000,
  } = options;

  let geminiError = null;

  for (let attempt = 0; attempt <= maxGeminiRetries; attempt++) {
    try {
      const text = await callGemini(prompt, {
        model: geminiModel,
        tools,
      });

      return {
        success: true,
        provider: 'gemini',
        content: text,
      };
    } catch (error) {
      geminiError = error;
      console.error(`[AI] Gemini attempt ${attempt + 1} failed:`, error?.message || error);

      if (!shouldFallback(error)) {
        break;
      }

      if (attempt < maxGeminiRetries) {
        const backoff = geminiBackoffMs * Math.pow(2, attempt);
        console.log(`[AI] Retrying Gemini in ${backoff}ms...`);
        await sleep(backoff);
      }
    }
  }

  console.log('[AI] Gemini failed, falling back to OpenRouter...');

  try {
    const text = await callOpenRouter(prompt, {
      model: openRouterModel,
    });

    return {
      success: true,
      provider: 'openrouter',
      content: text,
    };
  } catch (openRouterError) {
    console.error('[AI] OpenRouter fallback failed:', openRouterError?.message || openRouterError);

    return {
      success: false,
      error: 'AI service temporarily unavailable',
      geminiError: geminiError?.message,
      openRouterError: openRouterError?.message,
    };
  }
}

export function parseJsonResponse(rawText) {
  try {
    const cleanJson = rawText
      .replace(/```json|```/g, '')
      .trim()
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');
    
    return { success: true, data: JSON.parse(cleanJson) };
  } catch (error) {
    return { success: false, error: 'Failed to parse AI response' };
  }
}
