import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

const MOCK_NOTIFICATIONS = [
  "Profilin Google İK uzmanı tarafından incelendi!",
  "Sana uygun yeni bir staj ilanı eklendi: Trendyol - Frontend Stajyeri",
  "Yapay Zeka (Anka) yeni bir yetenek önerisinde bulundu. Hemen incele!",
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
  const addNotification = useAppStore(state => state.addNotification);
  const chaosMode = useAppStore(state => state.chaosMode);

  useEffect(() => {
    const list = chaosMode ? CHAOS_NOTIFICATIONS : MOCK_NOTIFICATIONS;
    const baseInterval = chaosMode ? 800 : 45000;
    const randVariance = chaosMode ? 200 : 45000;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * list.length);
      const text = list[randomIndex];
      
      const newNotif = {
        id: Date.now() + Math.random(),
        text,
        time: 'Şimdi',
        read: false,
        icon: chaosMode ? 'zap' : 'bell'
      };

      addNotification(newNotif);
      
      if (window.toast) {
        if (chaosMode) {
          window.toast.error(text);
        } else {
          window.toast.info(text);
        }
      }
    }, Math.random() * randVariance + baseInterval);

    return () => clearInterval(interval);
  }, [addNotification, chaosMode]);

  return null;
}
