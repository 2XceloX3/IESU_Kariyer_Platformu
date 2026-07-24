import React, { useState } from 'react';
import { 
  ChevronLeft, Server, Utensils, Briefcase, GraduationCap, ArrowRight, ShieldCheck, 
  HeartPulse, BookOpen, Globe2, Sparkles, Building2, Zap, Activity, Award, Eye, 
  CheckCircle2, Search, Target, Users, X, FileText, Compass, Star, Lock
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';

const CATEGORIES = ['Tümü', 'Kariyer & Gelecek', 'Akademik & Ar-Ge', 'Bilişim & Altyapı', 'Sağlık & Yaşam'];

const SERVICES_CATALOG = [
  {
    id: 'career_counseling',
    title: "Kariyer & Özgeçmiş Danışmanlığı",
    category: "Kariyer & Gelecek",
    tagline: "Bireysel Kariyer Haritası & Yapay Zeka Uyum Analizi",
    desc: "1-on-1 Profesyonel kariyer koçluğu, yetkinlik envanter testi, ATS uyumlu CV tasarımı ve mülakat simülasyonları.",
    view: "mentor_booking",
    badge: "🔥 4 Uzman Çevrimiçi",
    gradient: "from-red-600 to-red-700",
    glowColor: "rgba(99,102,241,0.15)",
    icon: <Briefcase className="text-red-600" size={26} />,
    previewData: {
      title: "Kariyer & Danışmanlık Modülü İç Görünümü",
      subtitle: "Öğrencilerimiz İçin Hazırlanan Özel Araçlar",
      stats: [
        { label: "1-on-1 Mentor Randevusu", val: "Ücretsiz" },
        { label: "AI CV Puanlama Hızı", val: "3 Saniye" },
        { label: "Mezun İstihdam Oranı", val: "%94.8" }
      ],
      features: [
        "ATS (Aday Takip Sistemi) Filtre Geçecek CV Formatları",
        "Uzman Kariyer Danışmanlarıyla Birebir Görüntülü Randevu",
        "Sektörel Yetkinlik ve Kişilik Envanter Testleri",
        "Mülakat Provası ve Canlı Beden Dili Geri Bildirimi"
      ]
    }
  },
  {
    id: 'research_os',
    title: "Research OS & Akademik Ar-Ge Merkezi",
    category: "Akademik & Ar-Ge",
    tagline: "110+ Laboratuvar & Scopus/YÖK Makale Havuzu",
    desc: "Üniversitemizin 110+ gelişmiş Ar-Ge laboratuvarından ekipman rezerve edin, uluslararası yayınları ve TÜBİTAK proje çağrılarını inceleyin.",
    view: "research_hub",
    badge: "🔬 110+ Lab Hazır",
    gradient: "from-purple-600 to-indigo-800",
    glowColor: "rgba(168,85,247,0.15)",
    icon: <Search className="text-purple-600" size={26} />,
    previewData: {
      title: "Research OS & Lab Rezervasyon Ekosistemi",
      subtitle: "Geleceğin Bilim İnsanları ve Araştırmacıları İçin",
      stats: [
        { label: "Aktif Laboratuvar", val: "110+" },
        { label: "Yıllık Scopus Yayın", val: "1.450+" },
        { label: "BAP/TÜBİTAK Bütçesi", val: "25M ₺" }
      ],
      features: [
        "Laboratuvar Cihaz ve Ekipman Canlı Takvimi",
        "YÖK ve Scopus İndeksli Üniversite Yayın Otomasyonu",
        "Öğrenci Proje Çağrıları ve Burs Başvuru Portalı",
        "Disiplinlerarası Akademik Takım Eşleştirme"
      ]
    }
  },
  {
    id: 'bidb_tech',
    title: "BİDB 10Gbps Bilişim & Altyapı",
    category: "Bilişim & Altyapı",
    tagline: "Yüksek Hızlı Fiber Ağ & 7/24 Teknik Bilet",
    desc: "Kampüs içi Wi-Fi 6 kablosuz internet, OBİS Öğrenci Bilgi Sistemi, LMS Uzaktan Eğitim sunucu izleme ve canlı arıza destek sistemi.",
    view: "bidb_status",
    badge: "⚡ 10Gbps Aktif",
    gradient: "from-amber-500 to-orange-700",
    glowColor: "rgba(245,158,11,0.15)",
    icon: <Server className="text-amber-600" size={26} />,
    previewData: {
      title: "BİDB Bilişim Altyapısı & Canlı Sistem HUD",
      subtitle: "Kesintisiz Yüksek Hızlı İnternet ve Dijital Sunucular",
      stats: [
        { label: "Hat Kapasitesi", val: "10 Gbps" },
        { label: "Sunucu Erişilebilirliği", val: "%99.98" },
        { label: "Destek Yanıt Süresi", val: "12 Dk" }
      ],
      features: [
        "Kampüs Geneli Wi-Fi 6 Anlık Sinyal Haritası",
        "OBİS, LMS ve Kütüphane Sunucu Durumu Ticker'ı",
        "Öğrenci E-posta ve Microsoft 365 Ücretsiz Lisansı",
        "1-Tıkla BİDB Bilişim Destek Bileti Oluşturma"
      ]
    }
  },
  {
    id: 'sksdb_health',
    title: "SKSDB Öğrenci Sağlık & BMI Diyetisyen",
    category: "Sağlık & Yaşam",
    tagline: "İdeal Kilo Hesabı & Mediko-Sosyal Randevu",
    desc: "Öğrencilerimize özel Vücut Kitle İndeksi (BMI) analizi, bazal metabolizma hızı takibi ve Mediko-Sosyal diyetisyeninden ücretsiz randevu.",
    view: "sksdb_lunch",
    badge: "🩺 Ücretsiz Randevu",
    gradient: "from-emerald-600 to-teal-800",
    glowColor: "rgba(16,185,129,0.15)",
    icon: <Utensils className="text-emerald-600" size={26} />,
    previewData: {
      title: "SKSDB Sağlıklı Yaşam & Diyetisyen Portalı",
      subtitle: "Öğrenci Sağlığı ve Beslenme Rehberi",
      stats: [
        { label: "Diyetisyen Randevusu", val: "Ücretsiz" },
        { label: "BMI Analiz Süresi", val: "Anında" },
        { label: "Günlük Kalori Hesabı", val: "Kişiye Özel" }
      ],
      features: [
        "BMR (Bazal Metabolizma) & Hedef Kalori Hesaplama",
        "Üniversite Mediko-Sosyal Diyetisyen Randevu Formu",
        "Günlük Diyetisyen Tarafından Onaylanan Menü Analizi",
        "Sağlıklı Yaşam ve Spor Kompleksi Üyelik Takibi"
      ]
    }
  },
  {
    id: 'corporate_agreements',
    title: "Sektörel Protokoller & Birlik Ağı",
    category: "Kariyer & Gelecek",
    tagline: "1.200+ Kurumsal Ortaklık & 77.000+ Mezun Ağı",
    desc: "Sektörün lider holding ve teknoloji firmalarıyla staj anlaşmaları, mezun takip sistemi ve Birlik Ağı iş birliği görevleri.",
    view: "about_us",
    badge: "🤝 1.200 Anlaşma",
    gradient: "from-[#990000] to-red-950",
    glowColor: "rgba(10,35,66,0.2)",
    icon: <Building2 className="text-[#990000]" size={26} />,
    previewData: {
      title: "Kurumsal İşbirlikleri & Mezun İletişim Portalı",
      subtitle: "77.000+ Mezun ve Dev Şirketlerle Doğrudan Ağ",
      stats: [
        { label: "Anlaşmalı Kurum", val: "1.200+" },
        { label: "Mezun Sayısı", val: "77.000+" },
        { label: "Uluslararası Akreditasyon", val: "65+" }
      ],
      features: [
        "Global ve Ulusal Şirketlerle Özel Staj Protokolleri",
        "İESÜ Mezun Kartı ve Dijital Portfolyo Paylaşımı",
        "Öğrenci Kulüpleri Birlik Ağı Görev Sistemi",
        "AQAS / AHPGS Uluslararası Eğitim Kalitesi"
      ]
    }
  },
  {
    id: 'events_cert',
    title: "Kariyer Günleri & Dijital Etkinlikler",
    category: "Kariyer & Gelecek",
    tagline: "Geleneksel Kariyer Zirvesi & Anında Dijital Bilet",
    desc: "CEO buluşmaları, teknik atölyeler, sertifikalı webinarlar ve kampüs içi kültür-sanat etkinliklerine katılım bileti oluşturun.",
    view: "events_list",
    badge: "🎟️ Canlı Etkinlikler",
    gradient: "from-cyan-600 to-red-800",
    glowColor: "rgba(6,182,212,0.15)",
    icon: <Award className="text-cyan-600" size={26} />,
    previewData: {
      title: "Etkinlik & Dijital Bilet Otomasyonu",
      subtitle: "Sektör Liderleriyle Buluşma ve Akıllı Sertifika",
      stats: [
        { label: "Yıllık Etkinlik", val: "350+" },
        { label: "Dijital Bilet", val: "Anında QR" },
        { label: "Akıllı Sertifika", val: "Blokzincir" }
      ],
      features: [
        "1-Tıkla Etkinlik Bilet Kaydı ve Takvime Ekleme",
        "Katılım Sonrası Otomatik Akıllı Sertifika Hesabı",
        "Soru-Cevap Oturumlarına Canlı Katılım",
        "Öğrenci Kulüpleri Festival ve Zirve Duyuruları"
      ]
    }
  }
];

const LIVE_PULSE_LOGS = [
  "⚡ Ahmet Y. (Yazılım Müh.) Yapay Zeka Mülakat Simülasyonunu tamamladı.",
  "🩺 Zeynep K. Mediko-Sosyal Diyetisyen randevusunu onayladı.",
  "🔬 Dr. Öğr. Üyesi S. Kaya Scopus indeksli yeni makalesini Research OS'e ekledi.",
  "🎓 Caner D. Ulusal Staj Programı başvuru dosyasını güncelledi.",
  "🎟️ Elif T. 2026 Kariyer Zirvesi için dijital biletini oluşturdu."
];

export default function ServicesPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedServicePreview, setSelectedServicePreview] = useState(null);

  const filteredServices = SERVICES_CATALOG.filter(s => 
    activeCategory === 'Tümü' || s.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Aurora Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-900/20 via-red-900/10 to-transparent blur-3xl pointer-events-none"></div>

      {/* Top Header Navbar */}
      <header className="h-16 bg-[#0B1528]/80 backdrop-blur-xl border-b border-red-900/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView((currentUser && currentUser.id) ? (userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : userRole === 'admin' ? 'admin' : 'student') : 'landing')} 
            className="p-2 rounded-full bg-red-900/80 text-slate-300 hover:bg-slate-700 transition border border-slate-700/60"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400 animate-pulse" size={22} />
            <h1 className="font-black text-white text-base md:text-lg tracking-tight">Hizmetlerimiz & İdari Birimler</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-10 relative z-10">
        
        {/* MAGNETIC HERO BANNER (HIGH CURIOSITY) */}
        <div className="relative bg-gradient-to-r from-slate-950 via-[#0B1A30] to-indigo-950 rounded-3xl p-8 md:p-12 border border-indigo-900/40 shadow-2xl overflow-hidden group">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-950/90 px-4 py-1.5 rounded-full border border-indigo-700/50 shadow-inner mb-4">
                <Zap size={14} className="text-amber-400" />
                İESÜ Dijital Kampüs Ekosistemi
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Üniversitenizin Tüm Gücü <br/>
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Tek Bir Dijital Kapıda.
                </span>
              </h2>
              <p className="text-slate-300 text-xs md:text-sm font-medium mt-3 leading-relaxed">
                Kariyer danışmanlığından Ar-Ge laboratuvarlarına, BİDB yüksek hızlı bilişimden SKSDB diyetisyen randevusuna kadar üniversitemizin idari ve akademik imkanlarını keşfetmeye başlayın.
              </p>

              {/* Live Ticker inside Hero */}
              <div className="mt-6 p-3 bg-red-950/80 backdrop-blur-md rounded-2xl border border-red-900 flex items-center gap-3 text-xs font-semibold text-indigo-200">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="truncate">{LIVE_PULSE_LOGS[0]}</span>
              </div>
            </div>

            {/* Quick Hero Counters */}
            <div className="grid grid-cols-2 gap-4 lg:w-[320px] shrink-0">
              <div className="bg-red-950/90 p-5 rounded-2xl border border-red-900 flex flex-col justify-center">
                <span className="text-2xl font-black text-indigo-400">77.000+</span>
                <span className="text-[11px] font-bold text-slate-400 mt-1">Mezun Ağ Lideri</span>
              </div>
              <div className="bg-red-950/90 p-5 rounded-2xl border border-red-900 flex flex-col justify-center">
                <span className="text-2xl font-black text-purple-400">110+</span>
                <span className="text-[11px] font-bold text-slate-400 mt-1">Ar-Ge Laboratuvarı</span>
              </div>
              <div className="bg-red-950/90 p-5 rounded-2xl border border-red-900 flex flex-col justify-center">
                <span className="text-2xl font-black text-emerald-400">1.200+</span>
                <span className="text-[11px] font-bold text-slate-400 mt-1">Sektör Protokolü</span>
              </div>
              <div className="bg-red-950/90 p-5 rounded-2xl border border-red-900 flex flex-col justify-center">
                <span className="text-2xl font-black text-amber-400">10 Gbps</span>
                <span className="text-[11px] font-bold text-slate-400 mt-1">BİDB Fiber Ağ</span>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS FILTER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-red-600 to-red-600 text-white shadow-lg shadow-red-600/30 scale-105' 
                  : 'bg-red-950/80 text-slate-400 hover:bg-red-900 hover:text-white border border-red-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CURIOSITY-INDUCING BENTO MAGNET GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => (
            <div 
              key={srv.id}
              className="bg-[#0B1528] rounded-3xl p-6 border border-red-900/80 shadow-xl hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              style={{ boxShadow: `0 10px 30px -10px ${srv.glowColor}` }}
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 bg-red-950/90 rounded-2xl border border-red-900 group-hover:scale-110 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                    {srv.badge}
                  </span>
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {srv.category}
                </span>
                <h3 className="text-lg font-black text-white mt-1 mb-2 group-hover:text-indigo-300 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs font-bold text-slate-300 leading-snug mb-3">
                  {srv.tagline}
                </p>
                <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              {/* Action Buttons: Preview Drawer & Direct SPA Navigation */}
              <div className="flex flex-col gap-2 pt-4 border-t border-red-900/80">
                <button
                  onClick={() => setSelectedServicePreview(srv)}
                  className="w-full py-2.5 bg-red-950 hover:bg-red-900 text-indigo-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-red-900 cursor-pointer"
                >
                  <Eye size={15} /> İç Mimari Önizleme
                </button>
                <button
                  onClick={() => setView(srv.view)}
                  className={`w-full py-3 bg-gradient-to-r ${srv.gradient} hover:opacity-95 text-white font-black rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md cursor-pointer`}
                >
                  Hizmete Git <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* SERVICE INSPECTION DRAWER MODAL (CURIOSITY & HIGH ENGAGEMENT) */}
      {selectedServicePreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1528] border border-indigo-900/60 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedServicePreview(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-red-950 hover:bg-red-900 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-950/80 text-indigo-400 rounded-2xl border border-indigo-900/60">
                {selectedServicePreview.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {selectedServicePreview.category}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  {selectedServicePreview.title}
                </h3>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-400 mt-2 mb-6">
              {selectedServicePreview.previewData.subtitle}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedServicePreview.previewData.stats.map((st, i) => (
                <div key={i} className="bg-red-950 p-3 rounded-2xl border border-red-900 text-center">
                  <span className="block text-base font-black text-indigo-400">{st.val}</span>
                  <span className="text-[10px] font-bold text-slate-400">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 mb-8">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-2">Bu Hizmet İçerisinde Neler Var?</h4>
              {selectedServicePreview.previewData.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-medium text-slate-300 bg-red-950/60 p-2.5 rounded-xl border border-red-900/80">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Direct Entry Button */}
            <button
              onClick={() => {
                const targetView = selectedServicePreview.view;
                setSelectedServicePreview(null);
                setView(targetView);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-red-600 to-indigo-700 hover:opacity-95 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 cursor-pointer"
            >
              Hemen Portala Geç & Kullan <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
