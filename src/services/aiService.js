// src/services/aiService.js
import { generateAIResponse as generateGeminiResponse } from '../lib/gemini';

/**
 * Anka AI Enterprise Career Advisor Integration Service
 * Connects directly to unified Gemini / AI Gateway pipeline.
 */
export const generateAIResponse = async (
  prompt,
  systemInstruction = "Sen İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü'nün resmi yapay zekâ asistanısın. Kurumsal, yapıcı, profesyonel ve öğrencilere kariyerlerinde rehberlik eden bir üsluba sahipsin."
) => {
  const safePrompt = typeof prompt === 'string' ? prompt.slice(0, 4000) : String(prompt || '').slice(0, 4000);
  const safeInstruction = typeof systemInstruction === 'string' ? systemInstruction.slice(0, 4000) : String(systemInstruction || '');

  // 1. Try unified production generative engine (Gemini / AI Gateway)
  try {
    const geminiRes = await generateGeminiResponse(safePrompt, safeInstruction);
    if (geminiRes && !geminiRes.includes("ulaşılamıyor") && !geminiRes.includes("yapılandırılmadı")) {
      return geminiRes;
    }
  } catch (err) {
    console.warn('[AIService] Primary generative gateway warning:', err);
  }

  // 2. High-fidelity career advisory fallback from institutional knowledge base
  return getInstitutionalAdvisoryResponse(safePrompt);
};

const getInstitutionalAdvisoryResponse = (prompt) => {
  const p = (prompt || '').toLowerCase();
  
  if (p.includes('cv') || p.includes('özgeçmiş') || p.includes('resume')) {
    return "İESÜ Kariyer Geliştirme Koordinatörlüğü Akredite CV Rehberi: Etkili bir CV hazırlamak için ATS uyumlu şablonları tercih etmeli, teknik yetkinliklerinizi GitHub/portfolyo bağlantılarıyla somutlaştırmalı ve üniversitemizin EuroPass formatındaki dijital çıktısını kullanmalısınız. Koordinatörlüğümüzden birebir CV inceleme randevusu alabilirsiniz.";
  }
  
  if (p.includes('staj') || p.includes('iş') || p.includes('ilan') || p.includes('kariyer')) {
    return "Staj ve İş Olanakları: 3308 Sayılı Kanun ve üniversitemizin sanayi iş birlikleri kapsamında yayınlanan onaylı ilanlara 'İlanlar & Stajlar' sekmesinden ve Başvuru Radarı'ndan erişebilirsiniz. Alanınıza en uygun eşleşmeler otomatik olarak listelenmektedir.";
  }
  
  if (p.includes('mülakat') || p.includes('interview')) {
    return "Mülakat Hazırlık Protokolü: Teknik ve yetkinlik bazlı mülakatlarda STAR tekniği (Durum, Görev, Eylem, Sonuç) kullanarak yanıtlarınızı yapılandırınız. Platformumuzdaki Mülakat Simülasyonu modülünü kullanarak pratik yapabilirsiniz.";
  }
  
  if (p.includes('mentor') || p.includes('mezun') || p.includes('kahve')) {
    return "Mezun Mentörlük ve İletişim Ağı: Alanında deneyimli İESÜ mezunlarımızla birebir Coffee-Chat ve mentörlük seansları planlamak için 'Mezunlar Portalı' veya akıştaki 'Mentör Bul' alanını ziyaret edebilirsiniz.";
  }

  return "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü asistanı olarak sorularınızı yanıtlamaktan memnuniyet duyarım. CV hazırlığı, staj başvuru süreçleri, sektörel mentörlük ve kariyer yol haritanızla ilgili detaylı danışmanlık alabilirsiniz.";
};
