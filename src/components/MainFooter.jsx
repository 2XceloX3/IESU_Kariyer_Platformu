import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';
import useAdminStore from '../brain/useAdminStore';
import { getTenantConfig } from '../config/tenantConfig';
import FooterNewsletterModals from './shared/FooterNewsletterModals';

export default function MainFooter({ setView }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [kvkkAgreed, setKvkkAgreed] = useState(false);
  const tenant = getTenantConfig();

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
      tenantId: tenant?.id || 'iesu',
      email: email,
      fullName: form.fullName,
      faculty: form.faculty,
      department: form.department,
      grade: form.grade,
      birthDate: form.birthDate,
      date: new Date().toLocaleString("tr-TR"),
      kvkkConsent: true,
      kvkkVersion: 'KVKK-2026-V1',
      status: 'Onaylandı (KVKK İzinli)'
    };

    if (addNewsletterSubscriber) {
      addNewsletterSubscriber(newSub);
    }

    try {
      useAdminStore.getState().logAuditAction?.(
        email,
        `E-Bülten Aboneliği & KVKK Onayı (${form.fullName})`,
        'Bülten & KVKK',
        'info',
        { tenantId: tenant?.id || 'iesu', email, kvkkVersion: 'KVKK-2026-V1' }
      );
    } catch { /* intentional */ }

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
      <FooterNewsletterModals
        showKvkkModal={showKvkkModal}
        setShowKvkkModal={setShowKvkkModal}
        setKvkkAgreed={setKvkkAgreed}
        showSubscriberModal={showSubscriberModal}
        setShowSubscriberModal={setShowSubscriberModal}
        form={form}
        setForm={setForm}
        onSubmitSubscriber={handleFinalSubmit}
      />
      
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
                <h3 className="font-black text-sm text-white tracking-wide">İstanbul Esenyurt Üniversitesi</h3>
                <p className="text-[11px] font-bold text-red-200 tracking-wider">Kariyer Geliştirme Koordinatörlüğü</p>
              </div>
            </div>
            <p className="text-xs text-red-100/90 leading-relaxed font-medium">
              {siteConfig?.footerMotto || `${tenant.institutionName} ${tenant.coordinatorTitle} olarak amacımız; öğrencilerimizi ve mezunlarımızı; kişisel farkındalığı yüksek, gelişmeleri yakından takip eden, kurumsal ve toplumsal gelişime katma değer yaratan bireyler olmaları yönünde desteklemektir.`}
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
                  <a href={`mailto:${tenant.supportEmail || 'kariyer@esenyurt.edu.tr'}`} className="hover:text-white transition font-bold text-white">{tenant.supportEmail || 'kariyer@esenyurt.edu.tr'}</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-red-200 block font-black tracking-wider">Telefon</span>
                  <span className="font-bold text-white">{tenant.phone || '444 9 123 / 1322'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-red-200 block font-black tracking-wider">Adres</span>
                  <span className="font-bold text-white">{tenant.address || 'Zafer Mah. Adile Naşit Bulv. No:1, Esenyurt / İstanbul'}</span>
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
          <p>2026 © {tenant.institutionName} Bilgi İşlem Daire Başkanlığı tarafından hazırlanmıştır.</p>
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


