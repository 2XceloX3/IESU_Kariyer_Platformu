import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, ChevronRight, CheckCircle2, X, FileText, User, GraduationCap, Calendar, BookOpen, Send } from 'lucide-react';
import Logo from './Logo';
import corporateData from '../data/knowledge_base/corporate_hierarchy.json';
import useAppStore from '../store/useAppStore';
import ContactModal from './ContactModal';

// Authentic Social Brand SVG Components
const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const XIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function SubPanelFooter({ setView, theme = 'red' }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const isEmerald = theme === 'emerald';
  const waveBgClass = isEmerald ? 'text-[#064E3B]' : 'text-[#8F0808]';
  const waveOpacityFill = isEmerald ? '#022C22' : '#750606';
  const footerBgClass = isEmerald ? 'bg-[#064E3B]' : 'bg-[#8F0808]';
  const buttonHoverClass = isEmerald ? 'hover:text-[#064E3B]' : 'hover:text-[#8F0808]';
  const kvkkAgreedState = useState(false);
  const kvkkAgreed = kvkkAgreedState[0];
  const setKvkkAgreed = kvkkAgreedState[1];

  const siteConfig = useAppStore(state => state.siteConfig);
  const addNewsletterSubscriber = useAppStore(state => state.addNewsletterSubscriber);

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
      
      {/* 🌊 TOP ORGANIC SVG WAVE DIVIDER TRANSITION */}
      <div className="w-full overflow-hidden leading-none bg-[#F8FAFC]">
        <svg 
          className={`relative block w-full h-12 sm:h-16 ${waveBgClass}`} 
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
            fill={waveOpacityFill} 
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* SUB-PANEL FOOTER MAIN CONTAINER */}
      <footer className={`w-full ${footerBgClass} text-white pt-8 pb-6 px-4 sm:px-8 lg:px-12 shadow-2xl relative overflow-hidden`}>
        
        {/* Subtle Background Accent Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Social Top Circle Strip Header */}
        <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-white/20 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h4 className="font-extrabold text-sm text-white tracking-wide uppercase">Resmî Sosyal Medya Hesaplarımız</h4>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="https://x.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#8F0808] text-white flex items-center justify-center transition border border-white/20 shadow-md">
              <XIcon size={16} />
            </a>
            <a href="https://www.facebook.com/iesuniversitesi/?locale=tr_TR" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#8F0808] text-white flex items-center justify-center transition border border-white/20 shadow-md">
              <FacebookIcon size={16} />
            </a>
            <a href="https://www.instagram.com/iesukariyer/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#8F0808] text-white flex items-center justify-center transition border border-white/20 shadow-md">
              <InstagramIcon size={16} />
            </a>
            <a href="https://www.youtube.com/@%C4%B0stanbulEsenyurt%C3%9Cniversitesi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#8F0808] text-white flex items-center justify-center transition border border-white/20 shadow-md">
              <YoutubeIcon size={16} />
            </a>
            <a href="https://www.linkedin.com/in/istanbul-esenyurt-%C3%BCniversitesi-kariyer-ofisi-4a03ba16b/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#8F0808] text-white flex items-center justify-center transition border border-white/20 shadow-md">
              <LinkedinIcon size={16} />
            </a>
          </div>
        </div>

        <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 relative z-10">
          
          {/* Column 1: Logo, Mission & Social Circle Icons */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="lg" variant="white" />
              <div>
                <h3 className="font-black text-sm text-white tracking-wide">{corporateData.university}</h3>
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-wider">{siteConfig?.logoSubText || 'Kariyer Geliştirme Merkezi'}</p>
              </div>
            </div>

            <p className="text-xs text-white/95 leading-relaxed font-medium">
              {siteConfig?.footerMotto || 'Geleceğe açılan kapı.'}
            </p>

            {/* Social Circle Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a href="https://x.com/iesuniversitesi" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#990000] text-white flex items-center justify-center transition border border-white/20" title="X (Twitter)">
                <XIcon size={14} />
              </a>
              <a href="https://www.facebook.com/iesuniversitesi/?locale=tr_TR" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#990000] text-white flex items-center justify-center transition border border-white/20" title="Facebook">
                <FacebookIcon size={14} />
              </a>
              <a href="https://www.instagram.com/iesukariyer/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#990000] text-white flex items-center justify-center transition border border-white/20" title="Instagram">
                <InstagramIcon size={14} />
              </a>
              <a href="https://www.youtube.com/@%C4%B0stanbulEsenyurt%C3%9Cniversitesi" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#990000] text-white flex items-center justify-center transition border border-white/20" title="YouTube">
                <YoutubeIcon size={14} />
              </a>
              <a href="https://www.linkedin.com/in/istanbul-esenyurt-%C3%BCniversitesi-kariyer-ofisi-4a03ba16b/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#990000] text-white flex items-center justify-center transition border border-white/20" title="LinkedIn">
                <LinkedinIcon size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Fast Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/20 pb-2">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-white">
              <li>
                <a href="https://obs.esenyurt.edu.tr" target="_blank" rel="noreferrer" className="hover:underline transition flex items-center gap-2">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Öğrenci Bilgi Sistemi (OBS)
                </a>
              </li>
              <li>
                <a href="https://eslms.esenyurt.edu.tr/almsp" target="_blank" rel="noreferrer" className="hover:underline transition flex items-center gap-2">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Esuzemi (Uzaktan Eğitim)
                </a>
              </li>
              <li>
                <a href="https://kutuphane.esenyurt.edu.tr" target="_blank" rel="noreferrer" className="hover:underline transition flex items-center gap-2">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Merkez Kütüphane
                </a>
              </li>
              <li>
                <button onClick={() => setView && setView('staj')} className="hover:underline transition flex items-center gap-2 text-left cursor-pointer">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> İsteğe Bağlı Staj Süreçleri
                </button>
              </li>
              <li>
                <button onClick={() => setView && setView('knowledge_portal')} className="hover:underline transition flex items-center gap-2 text-left cursor-pointer">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Bilgi Bankası & Mevzuat
                </button>
              </li>
              <li>
                <button onClick={() => setView && setView('leaderboard')} className="hover:underline transition flex items-center gap-2 text-left cursor-pointer">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> Başarı & Liderlik Sıralaması
                </button>
              </li>
              <li>
                <button onClick={() => setShowContactModal(true)} className="hover:underline transition flex items-center gap-2 text-left cursor-pointer">
                  <ChevronRight size={14} className="text-white/80 shrink-0" /> İletişim & Bize Ulaşın
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info Box */}
          <div className="space-y-3 text-xs font-medium text-white">
            <div className="flex items-center justify-between border-b border-white/20 pb-2">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                İletişim Bilgileri
              </h4>
              <button 
                type="button"
                onClick={() => setShowContactModal(true)}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition font-bold cursor-pointer border border-white/20"
              >
                Mesaj Bırak
              </button>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5 border border-white/10">
                <Mail size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/70 block">E-POSTA</span>
                <a href="mailto:kariyer@esenyurt.edu.tr" className="font-bold hover:underline">kariyer@esenyurt.edu.tr</a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5 border border-white/10">
                <Phone size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/70 block">TELEFON</span>
                <span className="font-bold">444 9 123 (Dahili: 1102)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5 border border-white/10">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-white/70 block">ADRES</span>
                <span className="font-bold">Zafer Mahallesi, Doğan Araslı Bulvarı No:79, 34513 Esenyurt / İSTANBUL</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Box */}
          <div className={`${isEmerald ? 'bg-[#022C22]/80 border-emerald-500/30' : 'bg-[#660000]/80 border-white/20'} backdrop-blur-md p-5 rounded-3xl border shadow-2xl space-y-3`}>
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/20 pb-1.5">
              E-Bülten&apos;e Kayıt Olun
            </h4>
            <p className="text-[11px] text-white/90 leading-relaxed font-medium">
              Sektör buluşmaları, yeni staj programları ve duyurulardan ilk siz haberdar olun.
            </p>

            {subscribed ? (
              <div className="bg-emerald-800/90 p-3 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Aboneliğiniz Kaydedildi!
              </div>
            ) : (
              <form onSubmit={handleOpenForm} className="space-y-3">
                <div className="flex items-center bg-black/40 border border-white/30 rounded-2xl p-1.5 shadow-inner">
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-3 text-xs text-white placeholder-white/70 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className={`w-8 h-8 bg-white ${isEmerald ? 'text-[#064E3B]' : 'text-[#990000]'} hover:bg-slate-100 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer shadow-lg`}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="sub-kvkk-visible" 
                    required 
                    checked={kvkkAgreed}
                    onChange={(e) => setKvkkAgreed(e.target.checked)}
                    className="rounded border-white/40 text-[#990000] focus:ring-white cursor-pointer" 
                  />
                  <label htmlFor="sub-kvkk-visible" className="text-[10px] text-white/90 font-medium cursor-pointer">
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

        {/* Bottom Copyright & Legal Links */}
        <div className="max-w-[1250px] mx-auto pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-white/90 relative z-10">
          <p>2026 © İstanbul Esenyurt Üniversitesi Bilgi İşlem Daire Başkanlığı tarafından hazırlanmıştır.</p>
          <div className="flex items-center gap-4 text-white">
            <button onClick={() => setView && setView('gizlilik')} className="hover:underline transition cursor-pointer">Gizlilik Politikası</button>
            <button onClick={() => setView && setView('kullanim')} className="hover:underline transition cursor-pointer">Kullanım Koşulları</button>
            <button onClick={() => setShowKvkkModal(true)} className="hover:underline transition cursor-pointer">KVKK Aydınlatma Metni</button>
          </div>
        </div>
      </footer>

      {showContactModal && (
        <ContactModal 
          isOpen={showContactModal} 
          onClose={() => setShowContactModal(false)} 
        />
      )}
    </div>
  );
}


