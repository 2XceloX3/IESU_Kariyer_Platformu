import { GoogleGenAI } from '@google/genai';
import { generateAutonomousCareerResponse } from './autonomousCareerAI';

const AI_GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL?.trim() || '';

const getActiveApiKey = () => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY && process.env.API_KEY !== 'Buraya_Kendi_API_Anahtarinizi_Ekleyin') {
      return process.env.API_KEY.trim();
    }
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'Buraya_Kendi_API_Anahtarinizi_Ekleyin') {
      return process.env.GEMINI_API_KEY.trim();
    }
  }
  const viteKey = import.meta.env?.VITE_GEMINI_API_KEY?.trim() || '';
  if (viteKey && viteKey !== 'Buraya_Kendi_API_Anahtarinizi_Ekleyin') {
    return viteKey;
  }
  return '';
};

const requestGatewayResponse = async (prompt, systemInstruction) => {
  const response = await fetch(AI_GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction }),
  });

  if (!response.ok) {
    throw new Error(`AI gateway status: ${response.status}`);
  }

  const payload = await response.json();
  const text = payload?.text || payload?.response || payload?.content;

  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('AI gateway returned no response text');
  }

  return text;
};

const requestGenAISDKResponse = async (prompt, systemInstruction, modelName = 'gemini-3.8-flash') => {
  const apiKey = getActiveApiKey();
  if (!apiKey) {
    throw new Error('No Gemini API key configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: systemInstruction
      ? { systemInstruction }
      : undefined,
  });

  if (response?.text) {
    return response.text;
  }
  throw new Error('Empty response from Gemini SDK');
};

export const generateAIResponse = async (prompt, systemInstruction = null, options = {}) => {
  const safePrompt = typeof prompt === 'string' ? prompt.slice(0, 4000) : String(prompt || '').slice(0, 4000);
  const safeSystemInstruction = systemInstruction && typeof systemInstruction === 'string'
    ? systemInstruction.slice(0, 4000)
    : systemInstruction;
  const preferredModel = options?.model || import.meta.env?.VITE_GEMINI_MODEL || 'gemini-3.8-flash';

  try {
    if (AI_GATEWAY_URL) {
      return await requestGatewayResponse(safePrompt, safeSystemInstruction);
    }

    const apiKey = getActiveApiKey();
    if (apiKey) {
      try {
        return await requestGenAISDKResponse(safePrompt, safeSystemInstruction, preferredModel);
      } catch (sdkErr) {
        if (preferredModel !== 'gemini-3.8-flash') {
          return await requestGenAISDKResponse(safePrompt, safeSystemInstruction, 'gemini-3.8-flash');
        }
        throw sdkErr;
      }
    }
  } catch (error) {
    if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
      console.warn('Live AI response request failed:', error?.message);
    }
    if (AI_GATEWAY_URL) {
      return "Yapay Zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
    }
    return generateAutonomousCareerResponse(safePrompt, safeSystemInstruction);
  }

  // If no external gateway configured, engage İESÜ autonomous career intelligence engine
  return generateAutonomousCareerResponse(safePrompt, safeSystemInstruction);
};

/**
 * Generates or edits career/event/club visuals using free-tier gemini-3.8-flash copy enrichment + KGM SVG Poster Studio
 */
export const generateOrEditCareerImage = async ({
  prompt,
  base64Image = null,
  aspectRatio = '16:9',
}) => {
  const safePrompt = String(prompt || 'İstanbul Esenyurt Üniversitesi Kariyer ve Sanayi Zirvesi Afişi').slice(0, 1000);
  const apiKey = getActiveApiKey();

  let headline = safePrompt.slice(0, 58);
  let subtitle = 'Üniversite-Sanayi İşbirliği • Mavi & Beyaz Yaka Kariyer Ekosistemi';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const copyRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü afiş stüdyosu için şu komuttan kısa bir başlık (maksimum 48 karakter) ve alt başlık (maksimum 75 karakter) üret. Sadece iki satır döndür:\nKomut: ${safePrompt}`,
      });
      const lines = (copyRes?.text || '')
        .split('\n')
        .map((l) => l.replace(/^[-*#0-9.)\s]+/, '').trim())
        .filter(Boolean);
      if (lines[0]) headline = lines[0].slice(0, 58);
      if (lines[1]) subtitle = lines[1].slice(0, 82);
    } catch (err) {
      if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
        console.warn('[Gemini Visual Studio] Copy enrichment fallback:', err?.message);
      }
    }
  }

  const dims = aspectRatio === '1:1'
    ? { w: 1080, h: 1080 }
    : aspectRatio === '4:3'
      ? { w: 1200, h: 900 }
      : { w: 1200, h: 675 };

  const escapeXml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const safeHeadline = escapeXml(headline);
  const safeSubtitle = escapeXml(subtitle);
  const bgOverlay = base64Image
    ? `<image href="${escapeXml(base64Image)}" x="0" y="0" width="${dims.w}" height="${dims.h}" preserveAspectRatio="xMidYMid slice" opacity="0.28" />`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.w}" height="${dims.h}" viewBox="0 0 ${dims.w} ${dims.h}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="55%" stop-color="#7f1d1d"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
    </defs>
    <rect width="${dims.w}" height="${dims.h}" fill="url(#bg)"/>
    ${bgOverlay}
    <circle cx="${dims.w - 180}" cy="140" r="220" fill="#dc2626" opacity="0.18"/>
    <circle cx="180" cy="${dims.h - 115}" r="260" fill="#2563eb" opacity="0.14"/>
    <rect x="70" y="70" width="${dims.w - 140}" height="${dims.h - 140}" rx="32" fill="rgba(15,23,42,0.52)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <text x="120" y="160" fill="#fca5a5" font-family="sans-serif" font-size="20" font-weight="800" letter-spacing="4">İSTANBUL ESENYURT ÜNİVERSİTESİ • KGM AI STÜDYO</text>
    <text x="120" y="${Math.round(dims.h * 0.44)}" fill="#ffffff" font-family="sans-serif" font-size="40" font-weight="900">${safeHeadline}</text>
    <text x="120" y="${Math.round(dims.h * 0.54)}" fill="#cbd5e1" font-family="sans-serif" font-size="22" font-weight="600">${safeSubtitle}</text>
    <rect x="120" y="${dims.h - 190}" width="380" height="58" rx="16" fill="#990000"/>
    <text x="155" y="${dims.h - 153}" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="800">esenyurt.edu.tr • KGM Stüdyo</text>
  </svg>`;

  return {
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    model: 'gemini-3.8-flash • KGM Stüdyo',
    isLive: Boolean(apiKey),
  };
};

