import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Search, Eye, BarChart2, Star, 
  Target, Award, Zap, Building2, UserCheck, 
  Activity, Sparkles, Download, PieChart as PieIcon, Briefcase, 
  ChevronRight, Brain, Medal, Rocket, Clock, ShieldCheck, X
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import useAppStore from '../store/useAppStore';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, PieChart, Cell, Pie, BarChart, Bar 
} from 'recharts';

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-xl p-3">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((pld, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: pld.color || pld.fill }}></span>
            <span className="text-slate-800 font-bold">{pld.value} <span className="text-[10px] text-slate-400 font-medium ml-1">İşlem</span></span>
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
        { name: 'Yazılım', value: Math.max(10, Math.round(120 * factor)), color: '#3B82F6' },
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

  const handleAIRequest = () => {
    if (aiResponse) return;
    setAiReportLoading(true);
    setTimeout(() => {
      setAiReportLoading(false);
      setAiResponse({
        score: "85/100",
        level: "Elit Seviye (%10)",
        tips: [
          "React Native projeleri ekleyerek mobil geliştirici pazarındaki görüntülenebilirliğini %45 artırabilirsin.",
          "Profili görüntüleyen Trendyol İK ekibine doğrudan mesaj atmak için 'İESÜ Mezun Ağı' üzerinden ortak bağlantıları kullan.",
          "Sistem Mimarisi yeteneğin (60) bölüm ortalamasının (45) üzerinde, ancak en iyi %5'lik dilime girmek için AWS sertifikası yüklemelisin."
        ]
      });
      window.toast && window.toast.success("Yapay Zeka Raporunuz Hazırlandı!");
    }, 2000);
  };

  const handleExportReport = () => {
    window.toast && window.toast.info("PDF Analiz Raporu oluşturuluyor...");
    setTimeout(() => {
      window.toast && window.toast.success("Kariyer_Analizi_Raporu.pdf başarıyla indirildi.");
    }, 1500);
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800 pb-20 selection:bg-blue-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(previousView || 'student')}>
            <Logo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#0A2342] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={10} className="animate-pulse" /> Analitik Merkezi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TopProfileMenu currentUser={currentUser || { name: 'Öğrenci' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="student_analytics" />
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <button onClick={() => setView(previousView || 'student')} className="flex items-center gap-2 text-slate-500 hover:text-[#0A66C2] font-bold mb-4 transition-colors text-xs uppercase tracking-wider group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Platforma Dön
            </button>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              Kariyer Analitiği Merkezi <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">Premium</span>
            </h2>
            <p className="text-slate-500 mt-2 font-medium text-sm lg:text-base max-w-2xl">
              Veriye dayalı öngörülerle kariyer rotanızı optimize edin. İK profesyonelleri tarafından nasıl algılandığınızı ve rakiplerinize göre konumunuzu keşfedin.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-end lg:self-auto w-full lg:w-auto">
            <button 
              onClick={handleExportReport}
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-white/60 backdrop-blur-md border border-slate-200/50 text-slate-700 font-bold px-5 py-2.5 rounded-2xl text-xs hover:bg-white hover:shadow-lg transition-all shadow-sm"
            >
              <Download size={16} className="text-blue-500" /> Detaylı PDF İndir
            </button>
            <div className="relative flex-1 lg:flex-none">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full lg:w-auto appearance-none bg-blue-600 text-white text-xs sm:text-sm rounded-2xl font-bold p-2.5 pl-4 pr-10 hover:bg-blue-700 transition shadow-[0_4px_20px_rgba(37,99,235,0.25)] outline-none cursor-pointer"
              >
                <option value="7">Son 7 gün görünümü</option>
                <option value="30">Son 30 gün görünümü</option>
                <option value="90">Son 90 gün görünümü</option>
                <option value="365">Son 1 yıl görünümü</option>
              </select>
              <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Top Metric Cards (Glassmorphism style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Score */}
            <motion.div variants={itemVars} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={64} className="text-emerald-500" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-black mb-4 text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Profil Sağlık Skoru
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-5xl font-black text-slate-900">{calculatedMetrics.score}</h3>
                    <span className="text-lg font-bold text-slate-400">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full" style={{ width: `${calculatedMetrics.score}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Views */}
            <motion.div variants={itemVars} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Eye size={120} className="text-blue-600" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-slate-500 font-black mb-3 text-xs uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center"><Eye size={14} className="text-blue-500" /></div>
                  İncelemeler
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">{calculatedMetrics.views}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2.5 py-1.5 rounded-xl border border-emerald-100">
                    <TrendingUp size={14} /> +%{calculatedMetrics.viewsPercent} artış
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Card 3: Searches */}
            <motion.div variants={itemVars} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Search size={120} className="text-purple-600" />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-slate-500 font-black mb-3 text-xs uppercase tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center"><Search size={14} className="text-purple-500" /></div>
                  Aramalar
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 mb-2">{calculatedMetrics.searches}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-max px-2.5 py-1.5 rounded-xl border border-emerald-100">
                    <TrendingUp size={14} /> +%{calculatedMetrics.searchesPercent} artış
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Ranking */}
            <motion.div variants={itemVars} className="bg-gradient-to-br from-[#0A2342] via-[#0d315c] to-[#0A66C2] rounded-3xl border border-blue-800 p-6 shadow-[0_15px_40px_rgba(10,102,194,0.3)] relative overflow-hidden group text-white">
              <div className="absolute -right-8 -top-8 text-white/10 group-hover:rotate-12 transition-transform duration-700">
                <Award size={150} />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-2 text-blue-200 font-black mb-3 text-xs uppercase tracking-widest">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> Bölüm Sıralaması
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-5xl font-black text-white">%10</h3>
                  </div>
                  <p className="text-blue-100 text-[11px] mt-2 font-medium leading-relaxed opacity-90">
                    Kariyer merkezinin veritabanında yazılım mühendisliği öğrencileri arasında elit gruptasınız.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Career Assistant Panel (Expanding) */}
          <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${aiResponse ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100' : 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white'}`}>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${aiResponse ? 'bg-white text-indigo-600' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'}`}>
                  {aiReportLoading ? <Sparkles size={28} className="animate-spin" /> : <Brain size={28} />}
                </div>
                <div>
                  <h3 className={`text-xl font-black mb-1 ${aiResponse ? 'text-indigo-950' : 'text-white'}`}>Yapay Zeka Kariyer Koçu</h3>
                  <p className={`text-sm font-medium ${aiResponse ? 'text-indigo-800' : 'text-slate-300'}`}>Profil verilerinizi saniyeler içinde analiz edip aksiyon planı çıkartın.</p>
                </div>
              </div>
              
              {!aiResponse && (
                <button 
                  onClick={handleAIRequest}
                  disabled={aiReportLoading}
                  className="w-full md:w-auto whitespace-nowrap bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black px-8 py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {aiReportLoading ? 'Analiz Ediliyor...' : 'Derin Analizi Başlat'}
                  {!aiReportLoading && <Zap size={18} className="fill-current animate-bounce" />}
                </button>
              )}
            </div>

            <AnimatePresence>
              {aiResponse && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 sm:p-8 bg-white"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Özel Aksiyon Planınız</h4>
                      <div className="space-y-4">
                        {aiResponse.tips.map((tip, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {idx + 1}
                            </div>
                            <p className="text-slate-700 text-sm font-semibold leading-relaxed mt-1">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                        <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Hedef Tahmini</span>
                        <div className="text-3xl font-black text-indigo-900 mb-1">%85</div>
                        <span className="text-xs font-bold text-indigo-700">Mülakata Çağrılma İhtimali</span>
                      </div>
                      <button className="w-full bg-white border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-black py-3 rounded-2xl transition text-sm">
                        Mentorluk Randevusu Al
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Area Chart: Traffic Trend */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <BarChart2 size={20} className="text-blue-500" /> Profil Trafiği
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{calculatedMetrics.period}</span>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculatedMetrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                    <Area type="monotone" dataKey="Görüntülenme" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorG)" activeDot={{r: 6, strokeWidth: 0, fill: '#3B82F6'}} />
                    <Area type="monotone" dataKey="Arama" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorA)" activeDot={{r: 6, strokeWidth: 0, fill: '#8B5CF6'}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radar Chart: Skills vs Average */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Activity size={20} className="text-purple-500" /> Yetenek Kıyaslaması
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-4">Mevcut becerilerinizin aynı bölümdeki (Yazılım Müh.) akranlarınızın ortalaması ile karşılaştırması.</p>
              
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillRadarData}>
                    <PolarGrid stroke="#F1F5F9" strokeWidth={2} />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 11, fontWeight: '900'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Sizin Profiliniz" dataKey="Siz" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} strokeWidth={3} />
                    <Radar name="Bölüm Ortalaması" dataKey="Ortanca" stroke="#CBD5E1" fill="#F8FAFC" fillOpacity={0.6} strokeWidth={2} strokeDasharray="3 3" />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-6 mt-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-3 h-3 rounded bg-blue-500"></span> Siz
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-3 h-3 rounded bg-slate-300 border border-slate-400 border-dashed"></span> Ortanca
                </div>
              </div>
            </motion.div>
          </div>

          {/* Breakdown / Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Top Viewers */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full relative">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                  <Building2 size={16} className="text-slate-400" /> Profil İnceleyenler
                </h3>
              </div>
              <div className="space-y-4 flex-grow">
                {mockCompanies.slice(0,3).map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition cursor-pointer">
                    <img src={comp.logo} alt={comp.name} className="w-10 h-10 rounded-xl border border-slate-100 object-cover shadow-sm" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-black text-slate-800 text-sm truncate">{comp.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{comp.sector}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-black shrink-0 bg-slate-100 px-2 py-1 rounded">{comp.time}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowVisitorsModal(true)}
                className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-1 border border-slate-200"
              >
                Tümünü Gör (12) <ChevronRight size={14} />
              </button>
            </motion.div>

            {/* Keyword Performance */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
              <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-widest">
                <Search size={16} className="text-slate-400" /> Arama Anahtar Kelimeleri
              </h3>
              <div className="space-y-5 flex-grow">
                {calculatedMetrics.keywordData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-700">{item.name}</span>
                      <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase">{item.count} Kez</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min(100, (item.count / 75) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Competitor Board */}
            <motion.div variants={itemVars} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full bg-gradient-to-b from-white to-orange-50/30">
              <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-widest">
                <Medal size={16} className="text-orange-500" /> Sınıf İçi Liderlik
              </h3>
              <p className="text-[10px] font-bold text-slate-500 mb-4">Esenyurt Ekosistemindeki genel durumunuz (Anonimleştirilmiş veriler)</p>
              
              <div className="space-y-3 flex-grow relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100 z-0"></div>
                {topCompetitors.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm relative z-10 hover:-translate-y-0.5 transition-transform">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' : idx === 1 ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                      {comp.rank}
                    </div>
                    <div className="flex-grow min-w-0 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-slate-800 text-xs">{comp.init}</h4>
                        <p className="text-[10px] text-slate-500 font-bold">{comp.projects} Proje</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black text-slate-900">{comp.ssp}</span>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">SSP Puanı</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* User's position indicator */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sizin Sıranız</span>
                  <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">#42</span>
                </div>
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
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowVisitorsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Profilini İnceleyenler</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">Son 90 günde inceleyen 12 şirket</p>
                </div>
                <button onClick={() => setShowVisitorsModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {mockCompanies.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition cursor-pointer group border-b border-slate-50 last:border-0">
                    <img src={comp.logo} alt={comp.name} className="w-12 h-12 rounded-xl border border-slate-200 object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="flex-grow">
                      <h4 className="font-black text-slate-900 text-sm">{comp.name}</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{comp.sector}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-[10px] text-slate-400 font-black bg-slate-100 px-2 py-0.5 rounded">{comp.time}</span>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-wider">İncele</button>
                    </div>
                  </div>
                ))}
                {/* Fake older visitors */}
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition cursor-pointer border-b border-slate-50">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400 font-black shadow-sm">GZ</div>
                  <div className="flex-grow">
                    <h4 className="font-black text-slate-900 text-sm">Gizia Teknoloji</h4>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Yazılım Danışmanlık</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-400 font-black bg-slate-100 px-2 py-0.5 rounded">1 ay önce</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
