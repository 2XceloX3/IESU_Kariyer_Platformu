import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;

if (API_KEY && API_KEY !== 'Buraya_Kendi_API_Anahtarinizi_Ekleyin') {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateAIResponse = async (prompt, systemInstruction = null) => {
  if (!genAI) {
    // Fallback if API key is not configured
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Lütfen .env.local dosyasına geçerli bir VITE_GEMINI_API_KEY ekleyin. Yapay zeka entegrasyonu başarıyla kuruldu, ancak API anahtarı eksik olduğu için şu an statik bir yanıt alıyorsunuz.");
      }, 1500);
    });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      ...(systemInstruction && { systemInstruction })
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Yapay Zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
  }
};
