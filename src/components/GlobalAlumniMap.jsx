import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Globe2, MapPin, Users, Briefcase, ExternalLink, Star } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import useAppStore from '../store/useAppStore';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Realistic markers with top companies
const MOCK_ALUMNI_HUBS = [
  { id: 'h1', name: "San Francisco, ABD", coordinates: [-122.4194, 37.7749], count: 120, topCompanies: ['Google', 'Apple', 'Meta'], topRoles: ['Yazılım Müh.', 'Ürün Yöneticisi'] },
  { id: 'h2', name: "Londra, UK", coordinates: [-0.1276, 51.5072], count: 85, topCompanies: ['Amazon', 'Revolut', 'Barclays'], topRoles: ['Finans Analisti', 'Veri Bilimcisi'] },
  { id: 'h3', name: "Berlin, Almanya", coordinates: [13.4050, 52.5200], count: 150, topCompanies: ['Delivery Hero', 'Zalando', 'N26'], topRoles: ['Backend Dev.', 'Pazarlama'] },
  { id: 'h4', name: "Dubai, BAE", coordinates: [55.2708, 25.2048], count: 45, topCompanies: ['Emirates', 'Careem', 'Noon'], topRoles: ['İş Geliştirme', 'Mühendislik'] },
  { id: 'h5', name: "Tokyo, Japonya", coordinates: [139.6917, 35.6895], count: 12, topCompanies: ['Sony', 'Toyota', 'Rakuten'], topRoles: ['Ar-Ge', 'Tasarım'] },
  { id: 'h6', name: "İstanbul, Türkiye", coordinates: [28.9784, 41.0082], count: 3400, topCompanies: ['Trendyol', 'Aselsan', 'Getir'], topRoles: ['Her Alanda'] }
];

export default function GlobalAlumniMap({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeHub, setActiveHub] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");

  const totalAlumni = MOCK_ALUMNI_HUBS.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex flex-col font-sans overflow-hidden">
      <header className="h-16 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Globe2 className="text-blue-500" size={24} />
            <h1 className="font-black text-white tracking-tight">Küresel Mezun Haritası</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full items-center gap-2 text-xs font-bold border border-blue-500/30">
            <Users size={14} /> {totalAlumni.toLocaleString()}+ Mezun Dünya Çapında
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      <main className="flex-1 relative flex flex-col lg:flex-row">
        
        {/* Map Area */}
        <div className="flex-1 relative h-[60vh] lg:h-auto overflow-hidden bg-gradient-to-b from-[#020817] to-[#0f172a]">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 140 }} 
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={[20, 40]} zoom={1} maxZoom={8}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b" // Dark slate
                      stroke="#0f172a" // Darker border
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#334155", outline: "none", cursor: 'pointer' },
                        pressed: { fill: "#475569", outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {MOCK_ALUMNI_HUBS.map((hub) => (
                <Marker 
                  key={hub.id} 
                  coordinates={hub.coordinates}
                  onMouseEnter={() => setTooltipContent(hub.name)}
                  onMouseLeave={() => setTooltipContent("")}
                  onClick={() => setActiveHub(hub)}
                  className="cursor-pointer"
                >
                  <circle 
                    r={Math.min(12, Math.max(4, hub.count / 20))} 
                    fill={activeHub?.id === hub.id ? "#60a5fa" : "#3b82f6"} // Blue-400 or Blue-500
                    stroke="#ffffff" 
                    strokeWidth={1} 
                    className={`transition-all ${activeHub?.id === hub.id ? 'animate-none' : 'animate-pulse'}`}
                  />
                  {activeHub?.id === hub.id && (
                    <circle r={18} fill="none" stroke="#60a5fa" strokeWidth={1} className="animate-ping" />
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map Tooltip */}
          <AnimatePresence>
            {tooltipContent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold text-white pointer-events-none z-50 shadow-2xl"
              >
                {tooltipContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Sidebar */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0f172a] border-l border-white/5 h-[40vh] lg:h-auto overflow-y-auto flex flex-col z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!activeHub ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400"
              >
                <Globe2 size={64} className="mb-6 text-slate-700" />
                <h2 className="text-xl font-black text-white mb-2">Haritadan Bir Bölge Seçin</h2>
                <p className="text-sm">İESÜ mezunlarının dünyada en çok nerede çalıştığını, hangi şirketlerde yer aldıklarını görmek için haritadaki noktalara tıklayın.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeHub.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 md:p-8 flex flex-col"
              >
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">
                  <MapPin size={14} /> Hub Detayı
                </div>
                <h2 className="text-2xl font-black text-white mb-6 leading-tight">{activeHub.name}</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
                    <Users className="text-blue-500 mb-2" size={20} />
                    <span className="text-3xl font-black text-white">{activeHub.count.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Aktif Mezun</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
                    <Star className="text-amber-500 mb-2" size={20} />
                    <span className="text-3xl font-black text-white">#1</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Bölge Sıralaması</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Building2 size={16} className="text-slate-500" /> En Çok Çalışılan Kurumlar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeHub.topCompanies.map((comp, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition cursor-default">
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-500" /> Popüler Pozisyonlar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeHub.topRoles.map((role, idx) => (
                        <div key={idx} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10">
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info(`Anka AI: ${activeHub.name} bölgesi için çalışma vizesi ve relocation prosedürleri analiz ediliyor...`);
                        setTimeout(() => {
                          window.toast && window.toast.success("🌍 AI Analizi: Hedef bölge için Start-up Vizesi ve Ankara Antlaşması alternatifleri raporlandı.");
                        }, 2500);
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                      AI Vize & Relocation Raporu
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info(`Anka AI: ${activeHub.name} bölgesindeki mezunlar için kişiselleştirilmiş tanışma mesajı hazırlanıyor...`);
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ AI Taslağı Hazır: 'Merhaba, ben de İESÜ mezunuyum...' taslağı Anka Chat'e aktarıldı.");
                        }, 2500);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      Bu Bölgedeki Mezunlarla İletişime Geç
                      <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-slate-500 text-xs mt-1">Anka AI üzerinden otomatik mesaj taslağı oluşturulur.</p>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
