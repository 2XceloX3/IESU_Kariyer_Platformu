import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Heart, X, FileText, User, GraduationCap, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import corporateData from '../data/knowledge_base/corporate_hierarchy.json';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';

export default function MainFooter({ setView }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [kvkkAgreed, setKvkkAgreed] = useState(false);

  const addNewsletterSubscriber = useAppStore(state => state.addNewsletterSubscriber);
  const siteConfig = useAppStore(state => state.siteConfig);

  const [form, setForm] = useState({
    fullName: '',
    faculty: 'Mühendislik ve Mimarlık Fakültesi',
    department: '',
    grade: '1. Sınıf',
    birthDate: ''
  });

  const handleOpenForm = (e) => {
    e.preventDefault();
    if (!email) return;
    setShowSubscriberModal(true);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.department || !form.birthDate) {
      if (window.toast) window.toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }

    const newSub = {
      id: 'SUB-' + Date.now(),
      email: email,
      fullName: form.fullName,
      faculty: form.faculty,
      department: form.department,
      grade: form.grade,
      birthDate: form.birthDate,
      date: new Date().toLocaleString("tr-TR"),
      status: 'Onaylandı (KVKK İzinli)'
    };

    if (addNewsletterSubscriber) {
      addNewsletterSubscriber(newSub);
    }

    setShowSubscriberModal(false);
    setSubscribed(true);
    setEmail('');
    setForm({
      fullName: '',
      faculty: 'Mühendislik ve Mimarlık Fakültesi',
      department: '',
      grade: '1. Sınıf',
      birthDate: ''
    });
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <div className="w-full flex flex-col mt-auto font-sans">
      
      {/* KVKK MODAL POPUP */}
      {showKvkkModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button 
              onClick={() => setShowKvkkModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-red-50 text-[#990000] rounded-2xl">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">KVKK Aydınlatma Metni</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">İstanbul Esenyurt Üniversitesi</p>
              </div>
            </div>

            <div className="text-xs leading-relaxed text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <p className="font-medium">
                <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK')</strong> uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla <strong>İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi</strong> tarafından işlenmektedir.
              </p>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-[#990000]">
                  1. İşlenme Amacı
                </h4>
                <p className="text-[11px]">
                  Öğrenci ve mezunlarımızın iş/staj olanaklarından faydalanması, kariyer etkinliklerine katılımı ve istatistiksel raporlamalar yapılması.
                </p>

                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-[#990000]">
                  2. Verilerin Aktarımı
                </h4>
                <p className="text-[11px]">
                  İzniniz doğrultusunda, işbirliği yapılan kurum ve kuruluşlarla (işverenlerle) staj ve iş başvurularınız kapsamında paylaşılabilir.
                </p>

                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-[#990000]">
                  3. Haklarınız
                </h4>
                <p className="text-[11px]">
                  KVKK Madde 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahipsiniz. Başvurularınızı <a href="mailto:kvkk@esenyurt.edu.tr" className="text-[#990000] underline font-bold">kvkk@esenyurt.edu.tr</a> adresine iletebilirsiniz.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setKvkkAgreed(true);
                  setShowKvkkModal(false);
                }}
                className="px-5 py-2.5 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition shadow-md"
              >
                Okudum, Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIBER REGISTRATION FORM MODAL */}
      {showSubscriberModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button 
              onClick={() => setShowSubscriberModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-red-50 text-[#990000] rounded-2xl">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">E-Bülten Kayıt Detayı</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Öğrenci & Mezun Profil Bilgisi</p>
              </div>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Ad Soyad *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Adınız ve Soyadınız..."
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Fakülte / Meslek Yüksekokulu</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <select
                    value={form.faculty}
                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  >
                    <option value="Mühendislik ve Mimarlık Fakültesi">Mühendislik ve Mimarlık Fakültesi</option>
                    <option value="İktisadi, İdari ve Sosyal Bilimler Fakültesi">İktisadi, İdari ve Sosyal Bilimler Fakültesi</option>
                    <option value="Sanat ve Tasarım Fakültesi">Sanat ve Tasarım Fakültesi</option>
                    <option value="Beden Eğitimi ve Spor Yüksekokulu (BESYO)">BESYO</option>
                    <option value="Meslek Yüksekokulu (MYO)">Meslek Yüksekokulu (MYO)</option>
                    <option value="Sağlık Hizmetleri Meslek Yüksekokulu (SHMYO)">Sağlık Hizmetleri MYO (SHMYO)</option>
                    <option value="Mezun / Diğer">Mezun / Diğer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bölüm / Program *</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yazılım Mühendisliği, İlk ve Acil Yardım..."
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Sınıf</label>
                  <select
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  >
                    <option value="Hazırlık">Hazırlık</option>
                    <option value="1. Sınıf">1. Sınıf</option>
                    <option value="2. Sınıf">2. Sınıf</option>
                    <option value="3. Sınıf">3. Sınıf</option>
                    <option value="4. Sınıf">4. Sınıf</option>
                    <option value="Mezun">Mezun</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Doğum Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubscriberModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition shadow-md"
                >
                  Kaydı Tamamla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 🌊 OFFICIAL RESMİ ESENYURT.EDU.TR DALGA (WAVE) DESENİ GEÇİŞİ */}
      <div className="w-full overflow-hidden leading-none bg-[#F8FAFC]">
        <svg 
          className="relative block w-full h-12 sm:h-16 text-[#990000] preserve-3d" 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 60C240 120 480 10 720 65C960 120 1200 15 1440 60V120H0V60Z" 
            fill="currentColor"
          />
          <path 
            d="M0 45C320 100 640 5 960 80C1280 20 1440 60 1440 60V120H0V45Z" 
            fill="#800000" 
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* FOOTER MAIN CONTAINER */}
      <footer className="w-full bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white pt-8 pb-6 px-4 sm:px-8 lg:px-12 shadow-2xl relative overflow-hidden">
        
        {/* Background Accent Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-red-800/60 relative z-10">
          
          {/* Column 1: Official Logo, Title & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="lg" />
              <div>
                <h3 className="font-black text-sm text-white tracking-wide">{corporateData.university}</h3>
                <p className="text-[11px] font-bold text-red-200 uppercase tracking-wider">{siteConfig?.logoSubText || 'Kariyer Geliştirme Merkezi'}</p>
              </div>
            </div>
            <p className="text-xs text-red-100/90 leading-relaxed font-medium">
              {siteConfig?.footerMotto || 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi olarak amacımız; öğrencilerimizi ve mezunlarımızı; kişisel farkındalığı yüksek, gelişmeleri yakından takip eden, kurumsal ve toplumsal gelişime katma değer yaratan bireyler olmaları yönünde desteklemektir.'}
            </p>
          </div>

          {/* Column 2: Fast Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-red-800/80 pb-2 flex items-center gap-2">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-red-100">
              <li>
                <a href="https://obs.esenyurt.edu.tr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1.5">
                  • Öğrenci Bilgi Sistemi (OBS)
                </a>
              </li>
              <li>
                <a href="https://eslms.esenyurt.edu.tr/almsp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1.5">
                  • Esuzemi (Uzaktan Eğitim)
                </a>
              </li>
              <li>
                <a href="https://kutuphane.esenyurt.edu.tr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1.5">
                  • Merkez Kütüphane
                </a>
              </li>
              <li>
                <button onClick={() => setView && setView('staj')} className="hover:text-white transition flex items-center gap-1.5 cursor-pointer">
                  • Gönüllü Staj Süreçleri
                </button>
              </li>
              <li>
                <button onClick={() => setView && setView('sem')} className="hover:underline transition flex items-center gap-2 text-left cursor-pointer">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Kariyer ve Yetenek Akademisi
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-red-800/80 pb-2 flex items-center gap-2">
              İletişim Bilgileri
            </h4>
            <div className="space-y-3 text-xs text-red-100 font-medium">
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-red-200 block font-black tracking-wider">E-Posta</span>
                  <a href="mailto:kariyer@esenyurt.edu.tr" className="hover:text-white transition font-bold text-white">kariyer@esenyurt.edu.tr</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-red-200 block font-black tracking-wider">Telefon</span>
                  <span className="font-bold text-white">444 9 123 (Dahili: 1102)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-red-200 block font-black tracking-wider">Adres</span>
                  <span className="font-bold text-white">Zafer Mahallesi, Doğan Araslı Bulvarı No:79, 34513 Esenyurt / İSTANBUL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-red-800/80 pb-2 flex items-center gap-2">
              E-Bülten'e Kayıt Olun
            </h4>
            <p className="text-xs text-red-100 leading-relaxed font-medium">
              Sektör buluşmaları, yeni staj programları ve duyurulardan ilk siz haberdar olun.
            </p>

            {subscribed ? (
              <div className="bg-emerald-800/90 border border-emerald-400 p-3 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-inner">
                <CheckCircle2 size={16} /> E-Bülten kaydınız başarıyla alındı!
              </div>
            ) : (
              <form onSubmit={handleOpenForm} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-red-950/60 border border-red-700/80 rounded-xl text-xs text-white placeholder-red-200/60 focus:outline-none focus:ring-2 focus:ring-white font-medium shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-white text-[#990000] hover:bg-slate-100 rounded-lg text-xs font-black transition flex items-center gap-1 cursor-pointer shadow"
                  >
                    <Send size={12} /> Gönder
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="kvkk-check-header-color" 
                    required 
                    checked={kvkkAgreed}
                    onChange={(e) => setKvkkAgreed(e.target.checked)}
                    className="rounded border-red-700 text-[#990000] focus:ring-white cursor-pointer" 
                  />
                  <label htmlFor="kvkk-check-header-color" className="text-[11px] text-red-100 font-medium cursor-pointer">
                    <button 
                      type="button" 
                      onClick={() => setShowKvkkModal(true)} 
                      className="underline font-bold text-white hover:text-red-200 mr-1"
                    >
                      Aydınlatma Metni
                    </button>
                    'ni okudum, onaylıyorum.
                  </label>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="max-w-[1250px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-red-200 relative z-10">
          <p>2026 © İstanbul Esenyurt Üniversitesi Bilgi İşlem Daire Başkanlığı tarafından hazırlanmıştır.</p>
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setView && setView('gizlilik')} className="hover:underline transition cursor-pointer">Gizlilik Politikası</button>
            <span>•</span>
            <button onClick={() => setView && setView('kullanim')} className="hover:underline transition cursor-pointer">Kullanım Koşulları</button>
            <span>•</span>
            <button onClick={() => setShowKvkkModal(true)} className="hover:underline transition cursor-pointer">KVKK Aydınlatma Metni</button>
          </div>
        </div>
      </footer>
    </div>
  );
}


