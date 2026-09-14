// Provider credentials must stay on a server. `VITE_*` values are embedded in
// a browser build, so a direct Gemini key is allowed only while developing
// locally. Deployed builds call a gateway that owns the provider credential.
const AI_GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL?.trim() || '';
const DEVELOPMENT_GEMINI_KEY = import.meta.env.DEV
  ? import.meta.env.VITE_GEMINI_API_KEY?.trim() || ''
  : '';

const isConfiguredDevelopmentKey = DEVELOPMENT_GEMINI_KEY
  && DEVELOPMENT_GEMINI_KEY !== 'Buraya_Kendi_API_Anahtarinizi_Ekleyin';

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

const requestDevelopmentGeminiResponse = async (prompt, systemInstruction) => {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const client = new GoogleGenerativeAI(DEVELOPMENT_GEMINI_KEY);
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    ...(systemInstruction && { systemInstruction }),
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateAIResponse = async (prompt, systemInstruction = null) => {
  try {
    const safePrompt = typeof prompt === 'string' ? prompt.slice(0, 4000) : String(prompt || '').slice(0, 4000);
    const safeSystemInstruction = systemInstruction && typeof systemInstruction === 'string'
      ? systemInstruction.slice(0, 4000)
      : systemInstruction;

    if (AI_GATEWAY_URL) {
      return await requestGatewayResponse(safePrompt, safeSystemInstruction);
    }

    if (isConfiguredDevelopmentKey) {
      return await requestDevelopmentGeminiResponse(safePrompt, safeSystemInstruction);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('AI response request failed:', error);
    }
    return "Yapay Zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
  }

  return import.meta.env.DEV
    ? "Yapay zeka geliştirme anahtarı yapılandırılmadı. Yerel .env.local dosyanızı kontrol edin."
    : "Yapay Zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
};
