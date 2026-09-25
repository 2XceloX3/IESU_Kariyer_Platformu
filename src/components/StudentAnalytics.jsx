import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Search, Eye, BarChart2, Star, 
  Target, Award, Zap, Building2, UserCheck, 
  Activity, Sparkles, Download, PieChart as PieIcon, Briefcase, 
  ChevronRight, Brain, Medal, Rocket, Clock, ShieldCheck, X,
  HelpCircle, CheckCircle2, DollarSign, BookOpen, Layers, Share2,
  CalendarCheck, FileText, GraduationCap
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';
import DailyQuestsPanel from './DailyQuestsPanel';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, PieChart, Cell, Pie, BarChart, Bar 
} from 'recharts';

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-xl p-3 z-50">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((pld, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: pld.color || pld.fill }}></span>
            <span className="text-gray-900 font-bold text-xs">{pld.value} <span className="text-[10px] text-slate-400 font-medium ml-1">Skor/İşlem</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentAnalytics({ setView, currentUser, userRole, previousView }) {
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const [timeRange, setTimeRange] = useState('90');
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showVisitorsModal, setShowVisitorsModal] = useState(false);
  const [showGuideDrawer, setShowGuideDrawer] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculatedMetrics = useMemo(() => {
    let factor = 1.0;
    let period = 'Son 90 gün';
    
    if (timeRange === '7') { factor = 0.12; period = 'Son 7 gün'; } 
    else if (timeRange === '30') { factor = 0.42; period = 'Son 30 gün'; } 
    else if (timeRange === '365') { factor = 3.6; period = 'Son 1 yıl'; }

    return {
      period,
      views: Math.max(12, Math.round(285 * factor)),
      searches: Math.max(8, Math.round(150 * factor)),
      viewsPercent: Math.round(12 + (factor * 8)),
      searchesPercent: Math.round(5 + (factor * 4)),
      score: Math.min(98, Math.max(65, Math.round(85 + (factor * 2)))),
      trendData: [
        { name: '1. Hafta', Görüntülenme: Math.round(30 * factor), Arama: Math.round(15 * factor) },
        { name: '2. Hafta', Görüntülenme: Math.round(58 * factor), Arama: Math.round(22 * factor) },
        { name: '3. Hafta', Görüntülenme: Math.round(45 * factor), Arama: Math.round(18 * factor) },
        { name: '4. Hafta', Görüntülenme: Math.round(89 * factor), Arama: Math.round(35 * factor) },
        { name: '5. Hafta', Görüntülenme: Math.round(72 * factor), Arama: Math.round(28 * factor) },
        { name: '6. Hafta', Görüntülenme: Math.round(110 * factor), Arama: Math.round(45 * factor) },
        { name: '7. Hafta', Görüntülenme: Math.round(145 * factor), Arama: Math.round(65 * factor) },
      ],
      keywordData: [
        { name: 'Yazılım Stajyeri', count: Math.max(5, Math.round(62 * factor)) },
        { name: 'React Developer', count: Math.max(3, Math.round(45 * factor)) },
        { name: 'Node.js Developer', count: Math.max(2, Math.round(28 * factor)) },
        { name: 'Veri Bilimi', count: Math.max(1, Math.round(15 * factor)) }
      ],
      industryData: [
        { name: 'Yazılım', value: Math.max(10, Math.round(120 * factor)), color: '#990000' },
        { name: 'Fintech', value: Math.max(5, Math.round(80 * factor)), color: '#10B981' },
        { name: 'Oyun', value: Math.max(5, Math.round(55 * factor)), color: '#8B5CF6' },
        { name: 'E-Ticaret', value: Math.max(2, Math.round(30 * factor)), color: '#F59E0B' }
      ]
    };
  }, [timeRange]);

  const skillRadarData = [
    { subject: 'Frontend', Siz: 95, Ortanca: 65, fullMark: 100 },
    { subject: 'Backend', Siz: 70, Ortanca: 55, fullMark: 100 },
    { subject: 'Algoritma', Siz: 85, Ortanca: 70, fullMark: 100 },
    { subject: 'Sistem Mimari.', Siz: 60, Ortanca: 45, fullMark: 100 },
    { subject: 'İletişim', Siz: 90, Ortanca: 80, fullMark: 100 },
    { subject: 'Liderlik', Siz: 65, Ortanca: 50, fullMark: 100 },
  ];

  const mockCompanies = [
    { name: 'Trendyol', logo: 'https://ui-avatars.com/api/?name=Trendyol&background=F97316&color=fff', sector: 'E-Ticaret', time: '2 saat önce' },
    { name: 'Getir', logo: 'https://ui-avatars.com/api/?name=Getir&background=5B21B6&color=fff', sector: 'Lojistik / Teknoloji', time: 'Dün' },
    { name: 'Aselsan', logo: 'https://ui-avatars.com/api/?name=Aselsan&background=0A2342&color=fff', sector: 'Savunma Sanayi', time: '3 gün önce' },
    { name: 'Havelsan', logo: 'https://ui-avatars.com/api/?name=Havelsan&background=1E3A8A&color=fff', sector: 'Savunma Sanayi', time: '1 hafta önce' },
    { name: 'Peak Games', logo: 'https://ui-avatars.com/api/?name=Peak&background=E11D48&color=fff', sector: 'Oyun Sektörü', time: '2 hafta önce' }
  ];

  const topCompetitors = [
    { rank: 1, init: 'A.Y.', ssp: 3450, projects: 12 },
    { rank: 2, init: 'M.K.', ssp: 2890, projects: 8 },
    { rank: 3, init: 'Z.T.', ssp: 2600, projects: 7 },
  ];

  const missingSkills = [
    { skill: 'Docker & Kubernetes', demand: 'Çok Yüksek', level: '%82 İK İsteği', category: 'DevOps & Bulut' },
    { skill: 'TypeScript Enterprise', demand: 'Yüksek', level: '%75 İK İsteği', category: 'Frontend' },
    { skill: 'AWS / Cloud Architecture', demand: 'Kritik', level: '%90 İK İsteği', category: 'Sistem' },
  ];

  const handleGenerateAiReport = () => {
    if (aiResponse) return;
    setAiReportLoading(true);
    setTimeout(() => {
      setAiReportLoading(false);
      setAiResponse({
        score: "92/100",
        level: "İESÜ Yıldız Yetenek Seviyesi (Top %5)",
        tips: [
          "🚀 Mobil & Çapraz Platform: React Native / Flutter projelerini portfolyona ekleyerek global işveren ilanlarındaki görünürlüğünü %55 artırabilirsin.",
          "🤝 Kampüs & Mezun Ağı: Profili inceleyen Kurumsal İK yöneticilerine 'İESÜ Mezun Ağı' üzerinden ortak bağlantılarla mesaj gönder.",
          "📜 YÖK Uyumlu Akreditasyon: Sistem Mimarisi puanın (78) bölüm ortalamasının (52) üzerinde! AWS veya Cloud Practitioner sertifikası yükleyerek yetkinliğini tescille.",
          "💡 Mülakat Simülasyonu: Mülakat Simülatörü & Prova Odası ile 1 canlı teknik pratik tamamlayarak kariyer skorunu +5 puan daha yükseltebilirsin."
        ]
      });
      if (window.toast) window.toast.success("İESÜ Stratejik Kariyer Raporunuz Başarıyla Hazırlandı!");
    }, 1200);
  };

  const handleExportReport = () => {
    if (window.toast) window.toast.info("YÖK Uyumlu Kurumsal PDF Analiz Raporu oluşturuluyor...");
    setTimeout(() => {
      if (window.toast) window.toast.success("İESÜ_Öğrenci_Kariyer_Raporu.pdf başarıyla indirildi.");
    }, 1200);
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-gray-900 pb-28 selection:bg-red-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(previousView || 'student')} 
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shadow-xs"
              title="Geri Dön"
            >
              <ArrowLeft size={18} />
            </button>
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(previousView || 'student')}>
              <Logo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={10} className="animate-pulse" /> Kariyer Analitiği Merkezi
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TopProfileMenu currentUser={currentUser || { name: 'Öğrenci' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="student_analytics" />
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight flex-wrap">
              Kariyer Analitiği Merkezi <span className="bg-red-100 text-[#990000] text-xs px-3 py-1 rounded-full uppercase tracking-widest font-black border border-red-200">PREMIUM ANALYTICS</span>
            </h2>
            <p className="text-gray-600 mt-2 font-medium text-sm lg:text-base max-w-3xl">
              Veriye dayalı piyasa öngörüleri, İK arama trendleri ve akran kıyaslaması ile kariyer değerinizi anlık olarak takip edin.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end lg:self-auto w-full lg:w-auto">
            <button 
              onClick={() => setShowGuideDrawer(!showGuideDrawer)}
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-red-50 text-[#990000] font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-red-100 transition-all border border-red-200"
            >
              <HelpCircle size={16} /> {showGuideDrawer ? 'Rehberi Gizle' : 'Nasıl Kullanılır?'}
            </button>
            <button 
              onClick={handleExportReport}
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-white text-gray-700 font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
            >
              <Download size={16} className="text-[#990000]" /> PDF Rapor İndir
            </button>
            <div className="relative flex-1 lg:flex-none">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full lg:w-auto appearance-none bg-[#990000] text-white text-xs sm:text-sm rounded-2xl font-bold p-2.5 pl-4 pr-10 hover:bg-red-800 transition shadow-sm outline-none cursor-pointer"
              >
                <option value="7">Son 7 gün görünümü</option>
                <option value="30">Son 30 gün görünümü</option>
                <option value="90">Son 90 gün görünümü</option>
                <option value="365">Son 1 yıl görünümü</option>
              </select>
              <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-200 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* ONBOARDING & PURPOSE GUIDE DRAWER */}
        <AnimatePresence>
          {showGuideDrawer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-800 relative">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-red-200 shrink-0 backdrop-blur-md">
                      <Brain size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Kariyer Analitiği Merkezi Nedir ve Nasıl Kullanılır?</h3>
                      <p className="text-xs text-red-200 font-medium">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi Bilgilendirme Rehberi</p>
                    </div>
                  </div>
                  <button onClick={() => setShowGuideDrawer(false)} className="text-red-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 font-black text-amber-300 text-sm mb-2">
                      <Target size={18} /> 1. Amacı Nedir?
                    </div>
                    <p className="text-xs text-red-100 leading-relaxed font-medium">
                      İESÜ Kariyer Platformu veritabanındaki 5.000+ mezun ve öğrenci arasında özgeçmişinizi, yetkinliklerinizi ve İK uzmanları nezdindeki cazibenizi canlı metriklerle ölçümler.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 font-black text-emerald-300 text-sm mb-2">
                      <Activity size={18} /> 2. Nasıl Kullanılır?
                    </div>
                    <p className="text-xs text-red-100 leading-relaxed font-medium">
                      Profilinizin hangi şirketlerce görüntülendiğini takip edin, bölüm ortalamanızla teknik yeteneklerinizi kıyaslayın ve kariyer merkezi tavsiyeleriyle eksik sertifikalarınızı tamamlayın.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 font-black text-cyan-300 text-sm mb-2">
                      <DollarSign size={18} /> 3. Piyasa Öngörüsü
                    </div>
                    <p className="text-xs text-red-100 leading-relaxed font-medium">
                      Mevcut becerilerinizle mezuniyet sonrası muhtemel başlangıç maaşınızı ve iş piyasasındaki yıllık büyüme trendlerini canlı olarak görün.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Score */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={64} className="text-emerald-500" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 text-gray-500 font-black mb-4 text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Profil Sağlık Skoru
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-5xl font-black text-gray-900">{calculatedMetrics.score}</h3>
                    <span className="text-lg font-bold text-slate-600">/ 100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-[#990000] h-full rounded-full" style={{ width: `${calculatedMetrics.score}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Views */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Eye size={120} className="text-[#990000]" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-gray-500 font-black mb-3 text-xs uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center"><Eye size={14} className="text-[#990000]" /></div>
                  Profil İncelemeleri
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">{calculatedMetrics.views}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2.5 py-1.5 rounded-xl border border-emerald-100">
                    <TrendingUp size={14} /> +%{calculatedMetrics.viewsPercent} artış
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Card 3: Searches */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Search size={120} className="text-purple-600" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-gray-500 font-black mb-3 text-xs uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center"><Search size={14} className="text-purple-600" /></div>
                  Aramalar & Keşfet
                </div>
                <div>
                  <h3 className="text-4xl font-black text-gray-900 mb-2">{calculatedMetrics.searches}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2.5 py-1.5 rounded-xl border border-emerald-100">
                    <TrendingUp size={14} /> +%{calculatedMetrics.searchesPercent} artış
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Ranking */}
            <motion.div variants={itemVars} className="bg-gradient-to-br from-red-800 via-[#990000] to-rose-900 rounded-3xl border border-red-800 p-6 shadow-lg relative overflow-hidden group text-white">
              <div className="absolute -right-8 -top-8 text-white/10 group-hover:rotate-12 transition-transform duration-700">
                <Award size={150} />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-red-200 font-black mb-3 text-xs uppercase tracking-widest">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> Bölüm Sıralaması
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-5xl font-black text-white">%10</h3>
                  </div>
                  <p className="text-red-100 text-[11px] mt-2 font-medium leading-relaxed opacity-90">
                    Kariyer merkezinin veritabanında yazılım mühendisliği öğrencileri arasında elit gruptasınız.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>



          {/* GÜNLÜK KARİYER GÖREVLERİ & GELİŞİM HEDEFLERİ (DAILY QUESTS) */}
          <motion.div variants={itemVars}>
            <DailyQuestsPanel />
          </motion.div>

          {/* BİREBİR KARİYER DANIŞMANLIĞI & RANDEVU MERKEZİ (HUMAN ADVISORY) */}
          <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center font-black shrink-0 border border-red-100 shadow-sm">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    İESÜ Birebir Kariyer Danışmanlığı Randevusu
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Kariyer Geliştirme Merkezi uzmanlarımızla yüz yüze veya çevrim içi 15 dakikalık birebir görüşme yapın.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setView('mentor_booking')} 
                className="w-full md:w-auto bg-[#990000] hover:bg-red-800 text-white font-black px-6 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0"
              >
                <CalendarCheck size={16} /> Hemen Randevu Al
              </button>
            </div>

            {/* Quick Advisory Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setView('mentor_booking')} 
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#990000] flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-1">CV & Portfolyo İnceleme</h4>
                <p className="text-[11px] text-gray-500 font-medium">Özgeçmişinizi İK standartlarına göre uzmanla birlikte revize edin.</p>
              </div>

              <div 
                onClick={() => setView('mentor_booking')} 
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <Target size={18} />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Mülakat Provası</h4>
                <p className="text-[11px] text-gray-500 font-medium">Gerçek mülakat öncesi birebir soru-cevap ve yetkinlik provası yapın.</p>
              </div>

              <div 
                onClick={() => setView('mentor_booking')} 
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <Briefcase size={18} />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Staj & Referans Desteği</h4>
                <p className="text-[11px] text-gray-500 font-medium">İESÜ partner şirketlerine doğrudan referans yazısı talebinde bulunun.</p>
              </div>

              <div 
                onClick={() => setView('mentor_booking')} 
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 hover:bg-red-50/40 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-3 group-hover:scale-110 transition-transform">
                  <GraduationCap size={18} />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-1">Yurt Dışı & Lisansüstü</h4>
                <p className="text-[11px] text-gray-500 font-medium">Erasmus, yurt dışı kariyer veya yüksek lisans rotanızı planlayın.</p>
              </div>
            </div>
          </motion.div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Area Chart: Traffic Trend */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <BarChart2 size={20} className="text-[#990000]" /> Profil Trafiği & İK İnceleme Trendi
                </h3>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{calculatedMetrics.period}</span>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculatedMetrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#990000" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#990000" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94A3B8', fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94A3B8', fontWeight: 'bold'}} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="Görüntülenme" stroke="#990000" strokeWidth={4} fillOpacity={1} fill="url(#colorG)" activeDot={{r: 6, strokeWidth: 0, fill: '#990000'}} />
                    <Area type="monotone" dataKey="Arama" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorA)" activeDot={{r: 6, strokeWidth: 0, fill: '#8B5CF6'}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radar Chart: Skills vs Average */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Activity size={20} className="text-purple-600" /> Yetenek Kıyaslaması (Akran Karşılaştırması)
                </h3>
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-4">Mevcut becerilerinizin aynı bölümdeki akranlarınızın ortalaması ile karşılaştırması.</p>
              
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillRadarData}>
                    <PolarGrid stroke="#F1F5F9" strokeWidth={2} />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 11, fontWeight: '900'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Sizin Profiliniz" dataKey="Siz" stroke="#990000" fill="#990000" fillOpacity={0.3} strokeWidth={3} />
                    <Radar name="Bölüm Ortalaması" dataKey="Ortanca" stroke="#CBD5E1" fill="#F8FAFC" fillOpacity={0.6} strokeWidth={2} strokeDasharray="3 3" />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-6 mt-2 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <span className="w-3 h-3 rounded bg-[#990000]"></span> Siz
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <span className="w-3 h-3 rounded bg-gray-300 border border-gray-400 border-dashed"></span> Ortanca
                </div>
              </div>
            </motion.div>
          </div>

          {/* SKILLS GAP & MISSING COMPETENCIES ROW */}
          <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Layers size={20} className="text-[#990000]" /> Eksik Yetkinlikler Analizi (Skills Gap)
                </h3>
                <p className="text-xs text-gray-500 font-medium">Hedeflediğiniz pozisyonlarda İK uzmanlarının en çok aradığı ancak profilinizde henüz onaylanmamış olan beceriler</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missingSkills.map((sk, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-100">{sk.category}</span>
                      <span className="text-[10px] font-bold text-slate-600">{sk.level}</span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">{sk.skill}</h4>
                    <p className="text-xs text-gray-500 font-medium">İş ilanlarında talep oranı: <strong className="text-gray-700">{sk.demand}</strong></p>
                  </div>
                  <button 
                    onClick={() => { setView('sem'); }} 
                    className="mt-4 w-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-[#990000] font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <BookOpen size={14} /> SEM Kursunu Tamamla
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Breakdown / Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Top Viewers */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                  <Building2 size={16} className="text-[#990000]" /> Profil İnceleyen Şirketler
                </h3>
              </div>
              <div className="space-y-4 flex-grow">
                {mockCompanies.slice(0,3).map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                    <img src={comp.logo} alt={comp.name} className="w-10 h-10 rounded-xl border border-gray-100 object-cover shadow-sm" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-black text-gray-900 text-sm truncate">{comp.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{comp.sector}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-black shrink-0 bg-slate-100 px-2 py-1 rounded">{comp.time}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowVisitorsModal(true)}
                className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-black rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-1 border border-gray-200"
              >
                Tümünü Gör (12) <ChevronRight size={14} />
              </button>
            </motion.div>

            {/* Keyword Performance */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-xs font-black text-gray-900 mb-5 flex items-center gap-2 uppercase tracking-widest">
                <Search size={16} className="text-[#990000]" /> Arama Anahtar Kelimeleri
              </h3>
              <div className="space-y-5 flex-grow">
                {calculatedMetrics.keywordData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-gray-700">{item.name}</span>
                      <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded uppercase">{item.count} Kez</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (item.count / 75) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-red-500 to-[#990000] h-full rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* KGB — Kariyer Gelisim Profilim */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col h-full bg-gradient-to-b from-white to-red-50/20">
              <h3 className="text-xs font-black text-gray-900 mb-2 flex items-center gap-2 uppercase tracking-widest">
                <GraduationCap size={16} className="text-red-600" /> Kariyer Gelişim Profilim
              </h3>
              <p className="text-[10px] font-bold text-gray-500 mb-4">KGB — Kariyer Gelişim Belgesi özet görünümü</p>

              {/* 4 metrik kart */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { icon: '🏢', label: 'Staj', value: currentUser?.internships ?? 2 },
                  { icon: '📜', label: 'Sertifika', value: currentUser?.certifications ?? 3 },
                  { icon: '🎯', label: 'Workshop', value: currentUser?.workshopsAttended ?? 7 },
                  { icon: '👥', label: 'Mentor Görüşmesi', value: currentUser?.mentorMeetings ?? 4 },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-red-50 border border-red-100 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-lg mb-0.5">{icon}</span>
                    <span className="text-base font-black text-gray-900">{value}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>

              {/* CV Doluluk % */}
              {(() => {
                const pct = currentUser?.cvCompleteness ?? 85;
                const color = pct >= 80 ? 'bg-emerald-500' : pct >= 51 ? 'bg-orange-400' : 'bg-red-500';
                const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 51 ? 'text-orange-500' : 'text-red-600';
                return (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">CV Doluluk</span>
                      <span className={`text-xs font-black ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => setView('user_profile')}
                className="w-full py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition mb-4 flex items-center justify-center gap-1.5"
              >
                <BookOpen size={13}/> KGB Belgemi Görüntüle
              </button>

              {/* Sektörden anonim karşılaştırma profilleri */}
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Sektörünüzdeki Diğer Kariyer Profilleri</p>
              <div className="space-y-2">
                {topCompetitors.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[11px] ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-700'}`}>
                      {comp.rank}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-black text-gray-900 text-[11px]">{comp.init}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{comp.projects} Workshop</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-[11px] font-black text-gray-900">{comp.certifications ?? comp.ssp}</span>
                      <span className="block text-[9px] font-bold text-slate-600 uppercase">Sertifika</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* Visitors Modal */}
      <AnimatePresence>
        {showVisitorsModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowVisitorsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Profilini İnceleyen Şirketler</h3>
                  <p className="text-xs font-bold text-gray-500 mt-1">Son 90 günde inceleyen 12 şirket</p>
                </div>
                <button onClick={() => setShowVisitorsModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition">
                  <X size={16} />
                </button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {mockCompanies.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition cursor-pointer group border-b border-gray-50 last:border-0">
                    <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-xl border border-gray-200 object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="flex-grow">
                      <h4 className="font-black text-gray-900 text-sm">{comp.name}</h4>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{comp.sector}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-[10px] text-slate-700 font-black bg-slate-100 px-2 py-0.5 rounded">{comp.time}</span>
                      <button onClick={() => { setShowVisitorsModal(false); setView('jobs'); }} className="text-[10px] font-black text-[#990000] hover:text-red-800 uppercase tracking-wider">İlanları Gör</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BOTTOM DOCK */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole={userRole || 'student'}
      />
    </div>
  );
}

