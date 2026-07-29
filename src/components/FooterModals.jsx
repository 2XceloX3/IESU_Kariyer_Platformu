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
      subtitle: "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü",
      icon: <Info className="text-red-600" size={24} />,
      content: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü; öğrencilerimizin ve mezunlarımızın kariyer yolculuklarında potansiyellerini en üst seviyeye çıkarmalarını, iş dünyasına nitelikli ve özgüvenli bireyler olarak adım atmalarını hedefleyen resmî üniversite birimidir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
              <h4 className="font-bold text-[#990000] text-xs uppercase mb-1">Misyonumuz</h4>
              <p className="text-xs text-slate-600">Öğrencilere staj, yetenek gelişimi, kariyer danışmanlığı ve kurumsal eşleşme hizmetleri sunmak.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Vizyonumuz</h4>
              <p className="text-xs text-slate-600">Türkiye'nin lider üniversite-sanayi iş birliği ve dijital istihdam ekosistemini yürütmek.</p>
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
            Kariyer Portalı; W3C WCAG 2.1 AA erişilebilirlik standartlarına uygun olarak tasarlanmıştır. Görme, işitme ve motor beceri farklılıkları olan tüm kullanıcılarımız için yüksek kontrastlı arayüz ve ekran okuyucu uyumluluğu sunulmaktadır.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Ekran Okuyucu (Screen Reader) Uyumlu Semantic HTML</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Yüksek Kontrast Metin & Odaklama Göstergeleri (Focus Ring)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Klavye İle Tam Navigasyon Erişimi (Tab/Enter)</li>
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
            <p className="text-xs text-slate-600">Öğrenci ve mezunlarımız ÖBS/MBS bilgileriyle, firmalar ise kurumsal vergi no doğrulama protokolüyle anında giriş yapabilir.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs mb-1">Staj ve İlan Başvuruları nasıl iletilir?</h4>
            <p className="text-xs text-slate-600">İlan detayındaki "Hemen Başvur" butonuna tıklayarak profilinizi ve CV'nizi doğrudan firma İKY paneline iletebilirsiniz.</p>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-900">Doğrudan Destek Hattı</p>
              <p className="text-[11px] text-blue-700">kariyer@esenyurt.edu.tr | +90 (212) 699 00 00</p>
            </div>
            <button onClick={() => { onClose?.(); setView?.('messaging'); }} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer">Mesaj Gönder</button>
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
          <p className="text-xs">
            Kişisel verileriniz, 6698 sayılı KVKK mevzuatına uygun olarak yalnızca kariyer geliştirme, staj eşleştirme, mezun takip ve iş başvurularının kurumsal firmalara iletilmesi amacıyla işlenmektedir.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <p className="font-bold text-slate-900">Veri Güvenliği Garantisi:</p>
            <p className="text-slate-600">• Kişisel verileriniz hiçbir üçüncü taraf reklam veya pazarlama şirketine satılmaz.</p>
            <p className="text-slate-600">• Özgeçmişiniz yalnızca başvurduğunuz onaylı anlaşmalı kurumsal firmalara gösterilir.</p>
          </div>
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
            İstanbul Esenyurt Üniversitesi Kariyer Portalı'nda onaylı kurumsal firmalar, Yetenek Fuarı sponsorlukları, öne çıkan staj duyuruları ve kurumsal marka tanıtım panelleri yayınlayabilir.
          </p>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-900 text-xs uppercase">Sponsorluk Seçenekleri:</h4>
            <p className="text-xs text-amber-800">• Öne Çıkan Kurum Banner İlanları</p>
            <p className="text-xs text-amber-800">• Kampüs Kariyer Zirvesi Stant Kurulum Hakları</p>
            <p className="text-xs text-amber-800">• Doğrudan Hedefli Yetenek E-Posta Duyuruları</p>
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
          <p>
            İstanbul Esenyurt Üniversitesi kadrosu veya yüksek teknoloji park ortaklıklarında açık akademik/idari pozisyonlara göz atın.
          </p>
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Yazılım & Sistem Uzmanı</span>
              <span className="text-[10px] font-bold text-[#990000] bg-white px-2 py-0.5 rounded border border-red-200">Tam Zamanlı</span>
            </div>
            <p className="text-xs text-slate-600">Bilgi İşlem Daire Başkanlığı bünyesinde web portal geliştirici pozisyonu.</p>
          </div>
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
