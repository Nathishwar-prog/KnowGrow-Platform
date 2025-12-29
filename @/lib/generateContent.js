import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

const FALLBACK_TRIGGERS = [429, 401, 403, 500, 502, 503, 504];

const GEMINI_COOLDOWN_MS = 10 * 60 * 1000;

const providerState = {
  geminiUnavailableUntil: 0,
  geminiFailureCount: 0,
  lastGeminiError: null,
};

function isGeminiAvailable() {
  const now = Date.now();
  if (providerState.geminiUnavailableUntil > now) {
    const remainingMs = providerState.geminiUnavailableUntil - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    console.log(`[AI] Gemini in cooldown, ${remainingMin} min remaining. Using OpenRouter.`);
    return false;
  }
  return true;
}

function markGeminiUnavailable(error) {
  providerState.geminiFailureCount += 1;
  providerState.lastGeminiError = error?.message || 'Unknown error';
  
  const backoffMultiplier = Math.min(providerState.geminiFailureCount, 3);
  const cooldownMs = GEMINI_COOLDOWN_MS * backoffMultiplier;
  
  providerState.geminiUnavailableUntil = Date.now() + cooldownMs;
  
  console.log(`[AI] Gemini marked unavailable for ${cooldownMs / 60000} minutes (failure #${providerState.geminiFailureCount})`);
}

function resetGeminiState() {
  providerState.geminiUnavailableUntil = 0;
  providerState.geminiFailureCount = 0;
  providerState.lastGeminiError = null;
  console.log('[AI] Gemini state reset - provider available');
}

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

  if (isGeminiAvailable()) {
    let geminiError = null;

    for (let attempt = 0; attempt <= maxGeminiRetries; attempt++) {
      try {
        const text = await callGemini(prompt, {
          model: geminiModel,
          tools,
        });

        resetGeminiState();

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

    if (shouldFallback(geminiError)) {
      markGeminiUnavailable(geminiError);
    }
  }

  console.log('[AI] Using OpenRouter fallback...');

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
      error: 'AI service temporarily unavailable. Please try again in a few minutes.',
    };
  }
}

export function parseJsonResponse(rawText) {
  try {
    if (!rawText || typeof rawText !== 'string') {
      return { success: false, error: 'Empty or invalid response' };
    }

    let cleanJson = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    cleanJson = cleanJson
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/[\x00-\x1F\x7F]/g, ' ');
    
    const parsed = JSON.parse(cleanJson);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('[AI] JSON parse error:', error.message, 'Raw text preview:', rawText?.substring(0, 200));
    return { success: false, error: 'Failed to parse AI response' };
  }
}

export function getProviderStatus() {
  const now = Date.now();
  const geminiAvailable = providerState.geminiUnavailableUntil <= now;
  const cooldownRemaining = geminiAvailable 
    ? 0 
    : Math.ceil((providerState.geminiUnavailableUntil - now) / 1000);

  return {
    geminiAvailable,
    cooldownRemainingSeconds: cooldownRemaining,
    geminiFailureCount: providerState.geminiFailureCount,
    lastGeminiError: providerState.lastGeminiError,
  };
}
