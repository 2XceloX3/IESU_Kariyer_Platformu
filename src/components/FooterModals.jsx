import React, { useEffect } from 'react';
import { X, Info, Accessibility, HelpCircle, ShieldCheck, Megaphone, Briefcase, CheckCircle2 } from 'lucide-react';

export default function FooterModals({ activeModal, onClose, setView }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  const modalData = {
    about: {
      title: "Hakkımızda",
      subtitle: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi",
      icon: <Info className="text-red-600" size={24} />,
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi, öğrencilerin ve mezunların kariyer planlama süreçlerini destekleyen üniversite birimidir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
              <h4 className="font-bold text-[#990000] text-xs uppercase mb-1">Misyonumuz</h4>
              <p className="text-xs text-slate-600">Öğrencilere staj, yetenek gelişimi, kariyer danışmanlığı ve kurumsal eşleşme hizmetleri sunmak.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Vizyonumuz</h4>
              <p className="text-xs text-slate-600">Öğrenci ve mezunların kariyer gelişimini destekleyen, iş dünyasıyla bağlantı kuran bir yapı oluşturmak.</p>
            </div>
          </div>
        </div>
      )
    },
    accessibility: {
      title: "Erişilebilirlik Standartları",
      subtitle: "Engelsiz Üniversite & Dijital Kapsayıcılık",
      icon: <Accessibility className="text-emerald-600" size={24} />,
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Portalın erişilebilirliğini geliştirmeye devam ediyoruz. Klavye kullanımı, ekran okuyucu veya görsel okunabilirlikle ilgili bir sorunla karşılaşırsanız üniversitenin resmî iletişim kanalından bildirebilirsiniz.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Ekran boyutlarına uyumlu düzen üzerinde çalışıyoruz</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Klavye ve odak göstergeleri için iyileştirmeler sürüyor</li>
          </ul>
        </div>
      )
    },
    help: {
      title: "Yardım Merkezi & SSS",
      subtitle: "Canlı Destek ve Sıkça Sorulan Sorular",
      icon: <HelpCircle className="text-blue-600" size={24} />,
      content: (
        <div className="space-y-3 text-slate-700 text-sm">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">Portala nasıl kaydolabilirim?</h4>
            <p className="text-xs text-slate-600">Kayıt ekranında hesabınıza uygun kullanıcı türünü seçin ve istenen bilgileri tamamlayın. Hesap erişiminde sorun yaşarsanız resmî üniversite iletişim kanalına başvurun.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">Staj ve İlan Başvuruları nasıl iletilir?</h4>
            <p className="text-xs text-slate-600">İlan detayındaki başvuru adımlarını ve paylaşım onayını inceleyin. Başvurularım ekranından mevcut başvurularınızı takip edebilirsiniz.</p>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-900">Doğrudan Destek Hattı</p>
              <p className="text-[11px] text-blue-700">444 9 123 / 1322</p>
            </div>
            <a href="https://www.esenyurt.edu.tr/icerik/3223-kariyer-gelistirme-merkezi-koordinatorlugu-iletisim" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">İletişim bilgileri</a>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Gizlilik ve KVKK Şartları",
      subtitle: "6698 Sayılı KVKK Kapsamında Aydınlatma Metni",
      icon: <ShieldCheck className="text-purple-600" size={24} />,
      content: (
        <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
          <p className="text-xs">Bu portalda profil ve başvuru verilerinin işlenme kapsamı, aktarımı ve saklama süresi için portala özgü onaylı aydınlatma metni yayımlanmalıdır. Bu kart hukuki aydınlatma metni yerine geçmez.</p>
          <a href="https://www.esenyurt.edu.tr/icerik/1013-kisisel-verilerin-korunmasi" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-900">Üniversitenin resmî KVKK sayfası</a>
        </div>
      )
    },
    ads: {
      title: "Reklam & Sponsorluk Seçenekleri",
      subtitle: "Kurumsal Marka ve Kampüs Etkinlik Sponsorlukları",
      icon: <Megaphone className="text-amber-600" size={24} />,
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            İşveren iş birliği veya etkinlik desteği için Kariyer Geliştirme Merkeziyle resmî iletişim kanallarından bağlantı kurun. Bu portalda ücretli reklam veya sponsorluk satın alma akışı tanımlı değildir.
          </p>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 text-xs uppercase">İletişim</h4>
            <a className="text-xs text-amber-800 underline" href="https://www.esenyurt.edu.tr/icerik/3223-kariyer-gelistirme-merkezi-koordinatorlugu-iletisim" target="_blank" rel="noreferrer">Güncel iletişim bilgilerini aç</a>
          </div>
        </div>
      )
    },
    careers: {
      title: "İESÜ Kariyer Fırsatları",
      subtitle: "Üniversitemiz Bünyesinde ve Anlaşmalı Kurumlarda Açık Pozisyonlar",
      icon: <Briefcase className="text-[#990000]" size={24} />,
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>Portalda yayımlanan güncel iş ve staj ilanlarını inceleyin. Boş pozisyonlar listede gösterilmediğinde açık ilan bulunmuyor olabilir.</p>
          <button onClick={() => { onClose?.(); setView?.('jobs'); }} className="w-full py-2.5 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition shadow-sm cursor-pointer">
            Tüm İlan & Staj Pozisyonlarına Git
          </button>
        </div>
      )
    }
  };

  const active = modalData[activeModal];
  if (!active) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-slide-up relative"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
              {active.icon}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">{active.title}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{active.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {active.content}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer">
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

