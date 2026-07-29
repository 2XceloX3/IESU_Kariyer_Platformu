import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, ExternalLink, Bell, Newspaper, Image as ImageIcon, MapPin, Clock, ChevronRight, ArrowRight, Download, Sparkles, Megaphone, Tag, ShieldCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';

export default function NewsEvents({ setView, currentUser, userRole }) {
  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const events = useAppStore(state => state.events) || [];
  
  const path = window.location.pathname;
  const initialCategory = path.includes('duyurular') ? 'duyurular' : path.includes('etkinlikler') ? 'etkinlikler' : 'haberler';
  
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (setView) setView(tab);
  };

  const getCleanText = (str) => {
    if (!str) return '';
    return str
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<\/span>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // 📰 HABERLER SEKMESİ (Stitch Corporate Redesign)
  const renderHaberler = () => (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      {(news || []).map((item, index) => {
        const cleanTitle = getCleanText(item?.title);
        const cleanDesc = getCleanText(item?.description || item?.content);

        // Öne Çıkan Büyük Haber (Bento Featured Card)
        if (index === 0) {
          return (
            <div 
              key={index}
              onClick={() => setSelectedItem(item)}
              className="md:col-span-8 group bg-[#800000] rounded-3xl overflow-hidden shadow-2xl hover:shadow-red-950/40 transition-all duration-500 min-h-[460px] flex flex-col justify-end relative cursor-pointer border border-red-900"
            >
              <img 
                src={item?.imageUrl || 'https://www.esenyurt.edu.tr/uploads/2025/12/pjhehwxvm6o1u-yok-universite-izleme-ve-degerlendirme-genel-raporu-2025’te-onemli-basari.jpg'} 
                alt={cleanTitle} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              
              <div className="relative z-10 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#990000] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow border border-red-500/30 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-300" /> {item.category || 'Öne Çıkan Haber'}
                  </span>
                  <span className="text-slate-300 text-xs font-bold flex items-center gap-1">
                    <Calendar size={14} className="text-amber-400" /> {item.date || '02 Ocak 2026'}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3 group-hover:text-amber-300 transition-colors drop-shadow-md">
                  {cleanTitle}
                </h3>

                <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed max-w-3xl line-clamp-3 mb-6">
                  {cleanDesc}
                </p>

                <div className="inline-flex items-center gap-2 bg-white text-[#990000] hover:bg-amber-300 hover:text-slate-950 px-6 py-3 rounded-2xl font-black text-xs transition-colors shadow-lg">
                  Resmî Haberi İncele <ArrowRight size={15} />
                </div>
              </div>
            </div>
          );
        }

        // Standart Haber Kartları
        return (
          <div 
            key={index}
            onClick={() => setSelectedItem(item)}
            className="md:col-span-4 group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div>
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={item?.imageUrl || 'https://www.esenyurt.edu.tr/uploads/2026/06/qd2nc7jccjlfr-universitemizin-14-yil-donumu-kutlu-olsun.jfif'} 
                  alt={cleanTitle} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#990000] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {item.category || 'Haber'}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-2">
                  <Calendar size={13} className="text-[#990000]" /> {item.date || 'Tarih'}
                </div>
                <h4 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug line-clamp-2 mb-2">
                  {cleanTitle}
                </h4>
                <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {cleanDesc}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-black text-[#990000]">
              <span>Detaylı İncele</span>
              <div className="w-7 h-7 rounded-xl bg-red-50 group-hover:bg-[#990000] group-hover:text-white transition-colors flex items-center justify-center shadow-sm">
                <ChevronRight size={15} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 🔔 DUYURULAR SEKMESİ (Stitch Corporate Redesign)
  const renderDuyurular = () => (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      <div className="md:col-span-4">
        <div className="bg-gradient-to-br from-slate-950 via-[#800000] to-slate-900 rounded-3xl p-8 text-white shadow-xl sticky top-28 border border-red-900">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-amber-300 border border-white/10">
            <Bell size={28} />
          </div>
          <h2 className="text-2xl font-black mb-3 tracking-tight">Resmî Duyurular Hub</h2>
          <p className="text-slate-300 text-xs font-medium leading-relaxed mb-6">
            İstanbul Esenyurt Üniversitesi Rektörlüğü, Öğrenci İşleri ve Fakülte Dekanlıkları tarafından yayımlanan resmî bildirim ve duyuru akışı.
          </p>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[11px] font-bold text-amber-200">
            📌 Tüm duyurular senkronizasyon otomasyonu ile anlık güncellenmektedir.
          </div>
        </div>
      </div>

      <div className="md:col-span-8 flex flex-col gap-4">
        {(announcements || []).map((item, index) => {
          const cleanTitle = getCleanText(item?.title);
          const cleanDesc = getCleanText(item?.description || item?.content);

          return (
            <div 
              key={index}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#990000] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-red-50 text-[#990000] rounded-2xl shrink-0 group-hover:bg-[#990000] group-hover:text-white transition-colors shadow-sm">
                  <Megaphone size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-black uppercase text-[#990000] bg-red-100/80 px-2.5 py-0.5 rounded-full border border-red-200">
                      {item.tag || 'Resmî Duyuru'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {item.date || 'Yayın Tarihi'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug mb-1">
                    {cleanTitle}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">
                    {cleanDesc}
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center shrink-0 w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#990000] group-hover:text-white transition-colors flex items-center justify-center text-slate-600 shadow-sm">
                <ChevronRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 🎪 ETKİNLİKLER SEKMESİ (Stitch Corporate Redesign)
  const renderEtkinlikler = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      {(events || []).map((item, index) => {
        const cleanTitle = getCleanText(item?.title);
        const cleanDesc = getCleanText(item?.description || item?.content);

        return (
          <div 
            key={index}
            onClick={() => setSelectedItem(item)}
            className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img 
                  src={item?.imageUrl || 'https://www.esenyurt.edu.tr/uploads/2026/07/tjb9hhos5ydrt-gelecegin-dunyasini-sekillendiren-teknolojiler-ve-dijital-donusum-bilim-kafe’de-konusuluyor.jfif'} 
                  alt={cleanTitle} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#990000] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {item.category || 'Etkinlik'}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-bold text-[#990000] mb-2">
                  <span className="flex items-center gap-1"><Calendar size={13} /> {item.date}</span>
                  {item.time && <span className="flex items-center gap-1"><Clock size={13} /> {item.time}</span>}
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug line-clamp-2 mb-2">
                  {cleanTitle}
                </h3>

                <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {cleanDesc}
                </p>

                {item.location && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 pt-3 border-t border-slate-100">
                    <MapPin size={14} className="text-[#990000] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button className="w-full py-3 bg-[#990000] group-hover:bg-red-800 text-white font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2">
                Etkinlik Detaylarını Gör <ChevronRight size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <MainHeader setView={setView} />

      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-500/40 inline-block mb-3">
              RESMİ CANLI YAYIN MERKEZİ
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Neler Oluyor?
            </h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              İstanbul Esenyurt Üniversitesi'nin en son duyuruları, bilimsel sempozyumları, akademisyen haberleri ve kampüs içi tüm gelişmeler burada!
            </p>
          </div>
        </div>

        {/* Dynamic Nav Tabs */}
        <div className="flex justify-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto w-full">
          <button
            onClick={() => handleTabChange('haberler')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'haberler'
                ? 'bg-[#990000] text-white shadow-md'
                : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <Newspaper size={16} /> Haberler
          </button>
          
          <button
            onClick={() => handleTabChange('duyurular')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'duyurular'
                ? 'bg-[#990000] text-white shadow-md'
                : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <Bell size={16} /> Duyurular
          </button>
          
          <button
            onClick={() => handleTabChange('etkinlikler')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'etkinlikler'
                ? 'bg-[#990000] text-white shadow-md'
                : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <Calendar size={16} /> Etkinlikler
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'haberler' && renderHaberler()}
          {activeTab === 'duyurular' && renderDuyurular()}
          {activeTab === 'etkinlikler' && renderEtkinlikler()}
        </div>

      </main>

      {/* ULTRA-PREMIUM 5XL SPLIT-VIEW EXHIBITION MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white border border-slate-200/80 w-full max-w-5xl rounded-[32px] shadow-[0_35px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row relative my-auto max-h-[92vh]">
            
            {/* Top-Right Absolute Close (X) Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-[#990000] text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer border border-white/20 hover:scale-110 active:scale-95"
              title="Pencereyi Kapat"
            >
              ✕
            </button>

            {/* LEFT SIDE: Full-Size High Resolution Poster Canvas */}
            <div className="md:w-1/2 bg-slate-950 relative flex items-center justify-center p-4 min-h-[320px] md:min-h-[580px] border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 z-10 pointer-events-none"></div>
              {selectedItem.imageUrl ? (
                <img 
                  src={selectedItem.imageUrl} 
                  alt={getCleanText(selectedItem.title)} 
                  className="w-full h-full max-h-[520px] object-contain relative z-0 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-3 p-8 text-center">
                  <ImageIcon size={64} className="opacity-40" />
                  <span className="text-xs font-bold uppercase tracking-wider">Afiş Görseli Bulunmuyor</span>
                </div>
              )}
              
              {/* Category Badge on Poster */}
              <div className="absolute top-5 left-5 z-20">
                <span className="bg-[#990000] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl border border-red-400/30 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-300" /> {selectedItem.category || 'Resmî Etkinlik'}
                </span>
              </div>
            </div>

            {/* RIGHT SIDE: Rich Multi-Paragraph Content & Event Metadata */}
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-white">
              
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-black text-[#990000]">
                  {selectedItem.date && (
                    <span className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                      <Calendar size={14} /> {selectedItem.date}
                    </span>
                  )}
                  {selectedItem.time && (
                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      <Clock size={14} /> {selectedItem.time}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  {getCleanText(selectedItem.title)}
                </h2>

                {/* Metadata Details Grid */}
                {(selectedItem.location || selectedItem.speaker || selectedItem.organizer) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 my-4">
                    {selectedItem.location && (
                      <div className="flex items-start gap-2.5">
                        <MapPin size={18} className="text-[#990000] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Konum / Salon</div>
                          <div className="text-xs font-bold text-slate-900 leading-snug">{selectedItem.location}</div>
                        </div>
                      </div>
                    )}
                    {selectedItem.speaker && (
                      <div className="flex items-start gap-2.5">
                        <Tag size={18} className="text-[#990000] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Konuşmacı / Düzenleyen</div>
                          <div className="text-xs font-bold text-slate-900 leading-snug">{selectedItem.speaker}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Multi-paragraph Full Description Body */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#990000]">Etkinlik Açıklaması & Program Detayı:</h4>
                  <div className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed space-y-3 whitespace-pre-line pr-1">
                    {selectedItem.content || selectedItem.description || getCleanText(selectedItem.title)}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                {selectedItem.url && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-4 bg-[#990000] hover:bg-red-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 text-center hover:scale-[1.02] active:scale-95"
                  >
                    Resmî Duyuruyu İncele <ExternalLink size={15} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="py-4 px-8 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 text-center"
                >
                  Kapat
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <SubPanelFooter setView={setView} />
    </div>
  );
}