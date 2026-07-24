import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, MapPin, ChevronLeft, Building, Coffee, Book, 
  Users, Wifi, Sparkles, Navigation, Layers, Compass, 
  Maximize2, Activity, Info, RotateCcw, AlertTriangle
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const LOCATIONS = [
  { id: 1, name: 'Merkez Kütüphane', type: 'study', top: '22%', left: '32%', icon: <Book size={20}/>, status: 'Yoğun (%85)', capacity: '850/1000 Kişi', description: 'Sessiz çalışma alanları ve bireysel çalışma odaları dolmak üzere.', quietLevel: 'Düşük' },
  { id: 2, name: 'Mühendislik Fakültesi', type: 'academic', top: '48%', left: '68%', icon: <Building size={20}/>, status: 'Sakin', capacity: '120/1200 Kişi', description: 'Laboratuvarlar ve amfiler açık durumda.', quietLevel: 'Yüksek' },
  { id: 3, name: 'Starbucks / Kafeterya', type: 'social', top: '70%', left: '28%', icon: <Coffee size={20}/>, status: 'Orta Yoğun (%50)', capacity: '150/300 Kişi', description: 'Sosyal alanlar ve kahve kuyruğu orta seviyede.', quietLevel: 'Gürültülü' },
  { id: 4, name: 'İnovasyon Lab.', type: 'tech', top: '38%', left: '78%', icon: <Wifi size={20}/>, status: 'Boş (%10)', capacity: '5/50 Kişi', description: 'Hızlı internet ve donanım geliştirme kitleri kullanılabilir.', quietLevel: 'Yüksek' },
  { id: 5, name: 'Öğrenci Dekanlığı', type: 'admin', top: '72%', left: '62%', icon: <Users size={20}/>, status: 'Normal', capacity: '15/100 Kişi', description: 'Öğrenci işleri ve dilekçe teslim masaları aktif.', quietLevel: 'Orta' },
];

export default function CampusMap({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeLocation, setActiveLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [perspectiveX, setPerspectiveX] = useState(60);
  const [perspectiveZ, setPerspectiveZ] = useState(-30);
  const [smartRouteActive, setSmartRouteActive] = useState(false);
  const [showDensityAlert, setShowDensityAlert] = useState(true);

  const handleSmartRoute = () => {
    setSmartRouteActive(true);
    window.toast && window.toast.info("📍 AI: Size en uygun sakin çalışma rotası hesaplanıyor...");
    
    setTimeout(() => {
      setSelectedLocation(LOCATIONS.find(l => l.id === 4)); // Redirect to innovation lab
      window.toast && window.toast.success("✅ Rota Çizildi: Kütüphane yoğun olduğu için sizi İnovasyon Lab'e yönlendirdik!");
    }, 1500);
  };

  const resetMap = () => {
    setPerspectiveX(60);
    setPerspectiveZ(-30);
    setSmartRouteActive(false);
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30">
      
      {/* Header */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Map className="text-teal-400" size={24} />
            <h1 className="font-black tracking-tight text-white">İESÜ Metaverse Kampüs</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 lg:p-8 flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Map Controls & Stats */}
        <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
          
          {/* Header Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Canlı Yoğunluk Haritası</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kampüsteki tüm istasyonların doluluk durumunu, gürültü seviyelerini ve çalışma konforunu gerçek zamanlı izleyin.
            </p>
            
            <div className="flex flex-col gap-3 mt-5">
              <button 
                onClick={handleSmartRoute}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Navigation size={14} className="animate-bounce" /> AI Sakin Çalışma Rotası Çiz
              </button>
              
              <button 
                onClick={resetMap}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700/50"
              >
                <RotateCcw size={14} /> Haritayı Sıfırla
              </button>
            </div>
          </div>

          {/* Density Alert Notification */}
          {showDensityAlert && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 text-amber-200 relative overflow-hidden">
              <div className="flex gap-3">
                <AlertTriangle size={20} className="shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Yoğunluk Uyarısı</h4>
                  <p className="text-xs text-amber-300/90 leading-relaxed">
                    Merkez Kütüphane şu an vize döneminden dolayı maksimum kapasiteye (%85) yaklaşmış durumda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* List of Stations */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex-grow">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} className="text-teal-400" /> İstasyon Durumları
            </h3>
            <div className="space-y-3">
              {LOCATIONS.map(loc => (
                <div 
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${selectedLocation?.id === loc.id ? 'bg-teal-500/10 border-teal-500/50 text-white' : 'bg-slate-800/40 border-slate-800/60 hover:bg-slate-800 text-slate-300'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${loc.type === 'study' ? 'bg-blue-500' : loc.type === 'academic' ? 'bg-indigo-500' : loc.type === 'social' ? 'bg-amber-500' : loc.type === 'tech' ? 'bg-cyan-500' : 'bg-emerald-500'}`}>
                    {loc.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-xs truncate">{loc.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{loc.capacity}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${loc.status.includes('Yoğun') ? 'bg-red-500/10 text-red-400' : loc.status.includes('Orta') ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {loc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive 2.5D Map */}
        <div className="flex-grow bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative flex flex-col min-h-[550px] shadow-2xl p-6">
          
          {/* Map Controls */}
          <div className="absolute bottom-6 left-6 z-20 flex gap-2">
            <button 
              onClick={() => setPerspectiveX(prev => Math.min(80, prev + 5))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs border border-slate-700 shadow-lg"
              title="Yukarı Eğ"
            >
              ▲
            </button>
            <button 
              onClick={() => setPerspectiveX(prev => Math.max(30, prev - 5))}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs border border-slate-700 shadow-lg"
              title="Aşağı Eğ"
            >
              ▼
            </button>
            <button 
              onClick={() => setPerspectiveZ(prev => prev - 15)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs border border-slate-700 shadow-lg"
              title="Sola Döndür"
            >
              ◀
            </button>
            <button 
              onClick={() => setPerspectiveZ(prev => prev + 15)}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs border border-slate-700 shadow-lg"
              title="Sağa Döndür"
            >
              ▶
            </button>
          </div>

          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-teal-400">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div> Live WebGL Canvas
          </div>

          {/* Perspective Viewport wrapper */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            
            {/* Grid base */}
            <div 
              className="relative w-full max-w-4xl aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl border-4 border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700"
              style={{ 
                transform: `rotateX(${perspectiveX}deg) rotateZ(${perspectiveZ}deg)`, 
                transformStyle: 'preserve-3d', 
                perspective: '1500px'
              }}
            >
              
              {/* Walking paths SVG rendering */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ transform: 'translateZ(2px)' }}>
                {/* Connection lines (Paths) */}
                <path d="M 32% 22% L 28% 70% L 62% 72% L 68% 48% L 78% 38% Z" fill="rgba(20, 184, 166, 0.03)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" strokeDasharray="6 6" />
                
                {/* AI Smart route animated paths */}
                {smartRouteActive && (
                  <motion.path 
                    d="M 32% 22% L 28% 70% L 62% 72% L 78% 38%" 
                    fill="none" 
                    stroke="url(#smartGrad)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "15 5", strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  />
                )}
                
                <defs>
                  <linearGradient id="smartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Pins & Buildings */}
              {LOCATIONS.map(loc => {
                const isSelected = selectedLocation?.id === loc.id;
                
                return (
                  <div 
                    key={loc.id}
                    className="absolute z-10 cursor-pointer"
                    style={{ 
                      top: loc.top, 
                      left: loc.left, 
                      transform: 'translate(-50%, -50%) translateZ(20px)',
                      transformStyle: 'preserve-3d'
                    }}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    
                    {/* Visual 3D Column representing building */}
                    <div className="relative flex flex-col items-center select-none" style={{ transform: 'rotateX(-60deg)' }}>
                      
                      {/* Floating building model card */}
                      <motion.div 
                        animate={{ 
                          y: isSelected ? -15 : 0,
                          scale: isSelected ? 1.05 : 1
                        }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white border shadow-2xl relative transition-all duration-300
                          ${loc.type === 'study' ? 'bg-blue-600 border-blue-400' : loc.type === 'academic' ? 'bg-indigo-600 border-indigo-400' : loc.type === 'social' ? 'bg-amber-500 border-amber-400' : loc.type === 'tech' ? 'bg-cyan-600 border-cyan-400' : 'bg-emerald-600 border-emerald-400'}
                          ${isSelected ? 'ring-4 ring-teal-400 ring-offset-4 ring-offset-slate-900 shadow-[0_0_30px_rgba(20,184,166,0.5)]' : ''}`}
                      >
                        {loc.icon}
                        
                        {/* Tiny live indicator */}
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${loc.status.includes('Yoğun') ? 'bg-red-500 animate-pulse' : loc.status.includes('Orta') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        </div>
                      </motion.div>

                      {/* Line connecting column to floor */}
                      <div className={`w-0.5 h-10 bg-gradient-to-b opacity-60 ${isSelected ? 'from-teal-400 to-transparent' : 'from-slate-400 to-transparent'}`} />

                      {/* Floor spot shadow */}
                      <div className={`w-8 h-2.5 rounded-full blur-xs transition-all duration-300 ${isSelected ? 'bg-teal-500/40 w-10' : 'bg-black/60'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Location Details Card (Floating Overlay) */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                className="absolute top-6 left-6 right-6 lg:right-auto lg:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${selectedLocation.type === 'study' ? 'bg-blue-500' : selectedLocation.type === 'academic' ? 'bg-indigo-500' : selectedLocation.type === 'social' ? 'bg-amber-500' : selectedLocation.type === 'tech' ? 'bg-cyan-500' : 'bg-emerald-500'}`}>
                      {selectedLocation.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-md text-white">{selectedLocation.name}</h3>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{selectedLocation.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedLocation(null)}
                    className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-5 font-semibold">
                  {selectedLocation.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-bold text-slate-300">
                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Doluluk Durumu</span>
                    <span className="text-white font-extrabold">{selectedLocation.status}</span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1">Gürültü Düzeyi</span>
                    <span className="text-white font-extrabold">{selectedLocation.quietLevel}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    window.toast && window.toast.info(`📍 ${selectedLocation.name} için sanal kapı açılıyor...`);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition"
                >
                  Metaverse Giriş Yap
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
