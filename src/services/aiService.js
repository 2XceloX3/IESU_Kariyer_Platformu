// src/services/aiService.js

/**
 * Anka AI API Integration Service
 * This service connects to an external LLM (e.g. Google Gemini or OpenAI)
 * 
 * Flow:
 * 1. Checks localStorage for 'anka_api_key'
 * 2. If present, it makes a real fetch to the generative AI endpoint.
 * 3. If absent, it simulates the response locally for development/demo.
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateAIResponse = async (prompt, systemInstruction = "Sen İESÜ Kariyer Merkezi'nin dijital asistanı Anka'sın. Arkadaş canlısı ve profesyonelsin.") => {
  const apiKey = localStorage.getItem('anka_api_key') || import.meta.env.VITE_ANKA_API_KEY;

  if (!apiKey) {
    console.warn("Anka AI: API key bulunamadı. Yerel (Mock) yanıt üretiliyor.");
    return await simulateLocalResponse(prompt);
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error("Anka AI API Error:", error);
    return "Üzgünüm, şu an sunucularıma bağlanamıyorum. Lütfen daha sonra tekrar deneyin veya API anahtarınızı kontrol edin.";
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
