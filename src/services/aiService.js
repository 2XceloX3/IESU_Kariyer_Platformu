// src/services/aiService.js

/**
 * Anka AI API Integration Service
 * This service connects to an external LLM (e.g. Google Gemini or OpenAI)
 * 
 * Flow:
 * 1. In development, an explicitly configured local gateway may be used.
 * 2. In production, the client uses the local simulator until a server-side
 *    AI gateway is connected. Browser bundles must not contain API secrets.
 */

const getDevelopmentGateway = () => {
  if (!import.meta.env.DEV) return null;

  const url = import.meta.env.VITE_OMNIROUTE_API_URL?.trim();
  const apiKey = import.meta.env.VITE_OMNIROUTE_API_KEY?.trim();

  return url && apiKey ? { url, apiKey } : null;
};

export const generateAIResponse = async (prompt, systemInstruction = "Sen İESÜ Kariyer Geliştirme Koordinatörlüğü'nin dijital asistanı Anka'sın. Arkadaş canlısı ve profesyonelsin.") => {
  const safePrompt = typeof prompt === 'string' ? prompt.slice(0, 4000) : String(prompt || '').slice(0, 4000);
  const safeInstruction = typeof systemInstruction === 'string' ? systemInstruction.slice(0, 4000) : String(systemInstruction || '');

  const developmentGateway = getDevelopmentGateway();

  if (!developmentGateway) {
    return simulateLocalResponse(safePrompt);
  }

  try {
    const response = await fetch(developmentGateway.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${developmentGateway.apiKey}`
      },
      body: JSON.stringify({
        model: "auto/best-coding",
        messages: [
          { role: "system", content: safeInstruction },
          { role: "user", content: safePrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }
    }
    throw new Error(`OmniRoute API Status: ${response.status}`);
  } catch (error) {
    console.warn("OmniRoute canlı servisine ulaşılamadı. Yerel akıllı simülatöre geçiliyor:", error);
    return await simulateLocalResponse(safePrompt);
  }
};

// Fallback logic for when API key is not provided
const simulateLocalResponse = (prompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const p = prompt.toLowerCase();
      let response = "Anlıyorum. Size nasıl daha fazla yardımcı olabilirim?";
      
      if (p.includes("selam") || p.includes("merhaba")) {
        response = "Merhaba! Ben Anka. Kariyer hedeflerine ulaşman için buradayım. Bugün ne üzerinde çalışalım?";
      } else if (p.includes("cv") || p.includes("özgeçmiş")) {
        response = "CV'ni güçlendirmek için buradayım! Lütfen yeteneklerinden ve dahil olduğun kulüplerden bahset, böylece sana en uygun şablonu önerebilirim.";
      } else if (p.includes("staj") || p.includes("iş")) {
        response = "Staj arayışında sana yardımcı olabilirim. Kariyer Radarı üzerinden senin için %90 üzeri eşleşen firmalara göz atabilirsin.";
      } else if (p.includes("üzgün") || p.includes("ret") || p.includes("kötü")) {
        response = "Moralini bozma! En başarılı kariyerler reddedilmelerle doludur. Hatalarımızdan ders çıkarıp, bir sonraki mülakata daha güçlü hazırlanacağız. Birlikte mülakat simülasyonu yapalım mı?";
      }
      
      resolve(response);
    }, 1500); // Simulate network delay
  });
};
