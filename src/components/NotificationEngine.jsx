import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

const MOCK_NOTIFICATIONS = [
  "Profilin Google İK uzmanı tarafından incelendi!",
  "Sana uygun yeni bir staj ilanı eklendi: Trendyol - Frontend Stajyeri",
  "Yeni bir yetenek önerisi var. Hemen incele!",
  "Mezunlar derneğinden Ahmet Yılmaz sana bir mesaj gönderdi.",
  "Kariyer fuarı için son 2 gün! Stant randevularını kontrol et.",
  "Katıldığın Python Eğitimi için Akıllı Sertifikan cüzdanına eklendi.",
  "Mentorun ile yarın saat 14:00'te görüşmen var.",
  "Paylaştığın gönderi 50 beğeniye ulaştı! 🎉"
];

const CHAOS_NOTIFICATIONS = [
  "🔥 SİSTEM ÇÖKÜYOR! 🔥",
  "😱 1.000.000 BEĞENİ GELDİ!",
  "🚀 TÜM ŞİRKETLER SENİ İŞE ALMAK İSTİYOR!",
  "👽 UZAYLILAR CV'Nİ İNCELİYOR!",
  "⚡ HACKER SALDIRISI ENGELLENDİ!",
  "💰 HESABINA 9.999.999 BP YÜKLENDİ!",
  "🤖 JARVIS KONTROLÜ ELE ALDI!",
  "🤯 ÖĞRENCİ İŞLERİNDEN BEKLENMEDİK MESAJ!"
];

export default function NotificationEngine() {
  // Automatic fake notification simulation disabled per user request
  return null;
}
