import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, Megaphone, Search, X, ShieldCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

export default function PublicNewsView({ setView, currentUser, userRole }) {
  const news = useAppStore(state => state.news) || [];
  const announcements = useAppStore(state => state.announcements) || [];
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const combinedItems = [
    ...news.map(n => ({ ...n, itemType: 'Haber', badge: '🔥 Resmî Haber' })),
    ...announcements.map(a => ({ ...a, itemType: 'Duyuru', badge: '📢 Duyuru' }))
  ];

  const filteredItems = combinedItems.filter(item => {
    const titleMatch = (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = activeTab === 'all' || (activeTab === 'news' && item.itemType === 'Haber') || (activeTab === 'announcements' && item.itemType === 'Duyuru');
    return titleMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans selection:bg-red-600 selection:text-white flex flex-col justify-between">
      
      {/* ─── ANA GİRİŞ HEADER'I ─── */}
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      {/* ─── AÇIK RENK MODERN HERO BANNER ─── */}
      <main className="flex-1">
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-100/60 rounded-full blur-[100px] pointer-events-none"></div>
          
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#990000] bg-red-50 px-4 py-2 rounded-full border border-red-200/80 mb-4 shadow-sm">
            <Sparkles size={16} className="text-[#990000] animate-pulse" /> Resmî Basın & Duyuru Portalı
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Kampüste Neler Oluyor?
          </h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-base max-w-2xl mx-auto">
            İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi en güncel resmî duyuruları, başarı haberleri ve kampüs etkinlikleri.
          </p>

          {/* AÇIK TEMALI ARAMA & FİLTRE PANELİ */}
          <div className="mt-8 max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-3xl border border-slate-200 shadow-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Haber veya duyuru ara..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'news', label: 'Haberler' },
                { id: 'announcements', label: 'Duyurular' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#990000] text-white shadow-md shadow-red-900/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ─── AÇIK RENK HABER KARTLARI (SİTEYE UYGUN ARAYÜZ) ─── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Megaphone size={40} className="text-slate-400 mx-auto mb-3" />
              <p className="font-bold text-slate-700 text-base">Aradığınız kriterde resmî duyuru bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  onClick={() => setSelectedItem(item)}
                  className="group bg-white border border-slate-200/80 hover:border-red-500/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#990000]"></div>

                  <div>
                    {(item.imageUrl || item.image) && (
                      <div className="w-full h-52 bg-slate-100 overflow-hidden relative">
                        <img 
                          src={item.imageUrl || item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-[#990000] text-[10px] font-black px-3 py-1 rounded-full border border-red-100 shadow-sm">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                        <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#990000]" /> {item.date || '02 Ocak 2026'}</span>
                        <span className="bg-red-50 text-[#990000] border border-red-100 px-2.5 py-0.5 rounded font-black text-[10px] uppercase">{item.itemType}</span>
                      </div>

                      <h2 className="text-lg font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug mb-3">
                        {(item.title || item.name || '').replace(/<[^>]+>/g, '')}
                      </h2>

                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-medium">
                        {(item.description || item.content || item.summary || '').replace(/<[^>]+>/g, '')}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#990000] group-hover:text-red-700 transition-colors">
                      <span>Resmî Detayı Okuyun</span>
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center group-hover:bg-[#990000] group-hover:text-white transition-all shadow-xs">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ─── DETAY MODALI (AÇIK TEMALI) ─── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-fade-in">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            {(selectedItem.imageUrl || selectedItem.image) && (
              <div className="w-full h-64 shrink-0 bg-slate-100 relative">
                <img src={selectedItem.imageUrl || selectedItem.image} alt="Detail" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-800">
              <div className="flex items-center gap-2">
                <span className="bg-[#990000] text-white font-black text-[10px] px-3 py-1 rounded-full uppercase">
                  {selectedItem.itemType}
                </span>
                <span className="text-xs text-slate-500 font-bold">{selectedItem.date}</span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {(selectedItem.title || selectedItem.name || '').replace(/<[^>]+>/g, '')}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {(selectedItem.description || selectedItem.content || selectedItem.summary || '').replace(/<[^>]+>/g, '')}
              </p>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-600" /> İESÜ Kariyer Geliştirme Merkezi Resmî Bildirimidir.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ANA GİRİŞ FOOTER'I ─── */}
      <MainFooter setView={setView} />

    </div>
  );
}
