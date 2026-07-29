import React from 'react';
import { Sparkles, Calendar, ArrowRight, Megaphone, ChevronRight } from 'lucide-react';
import { liveNewsData } from '../utils/liveData';

export default function NelerOluyorPanel({ onSelectAnnouncement, setView }) {
  // Temizlenmiş ve Filtrelenmiş Resmî Haber Verileri (HTML tag'lerinden arındırılmış)
  const officialNews = (liveNewsData || [])
    .filter(item => item.title && !item.title.includes('<span>'))
    .slice(0, 3)
    .map((item, idx) => ({
      id: item.id || `news-${idx}`,
      title: (item.title || '').replace(/<[^>]+>/g, '').trim(),
      category: item.category || 'Haber & Rapor',
      date: item.date || '02 Ocak 2026',
      badge: idx === 0 ? '🔥 YÖK Resmi Raporu' : idx === 1 ? '🎓 Akreditasyon Başarısı' : '🚀 TEKNOFEST 2026',
      summary: (item.description || item.content || '').replace(/<[^>]+>/g, '').slice(0, 120) + '...',
      rawItem: item
    }));

  // Fallback Resmî Veriler (Eğer liveNewsData boşsa)
  const newsItems = officialNews.length >= 3 ? officialNews : [
    {
      id: 'news-yok-2025',
      title: 'YÖK Üniversite İzleme ve Değerlendirme Genel Raporu 2025’te Önemli Başarı',
      category: 'Haber & Rapor',
      date: '02 Ocak 2026',
      badge: '🔥 YÖK Resmi Raporu',
      summary: 'İstanbul Esenyurt Üniversitesi, YÖK 2025 genel değerlendirme raporunda Ar-Ge, mezun istihdamı ve toplumsal katkı alanlarında yüksek başarı kaydetti.',
      rawItem: liveNewsData?.[0] || null
    },
    {
      id: 'news-akredite-2026',
      title: 'Akredite Program Sayısı 12’ye, Başvurularla Toplam Sayı 31’e Ulaştı',
      category: 'Akademik Başarı',
      date: '12 Nisan 2026',
      badge: '🎓 Akreditasyon Başarısı',
      summary: 'Üniversitemizde uluslararası standartlarda eğitim veren akredite lisans ve önlisans program sayı hızla artıyor.',
      rawItem: liveNewsData?.[1] || null
    },
    {
      id: 'news-teknofest-2026',
      title: 'İstanbul Esenyurt Üniversitesi’nde TEKNOFEST 2026 Yolculuğu Başladı',
      category: 'Teknoloji & Proje',
      date: '15 Mayıs 2026',
      badge: '🚀 TEKNOFEST 2026',
      summary: 'TEKNOFEST yarışmalarına katılacak öğrenci takımlarımıza prototip geliştirme, lab ve mentörlük desteği sağlanıyor.',
      rawItem: liveNewsData?.[2] || null
    }
  ];

  return (
    <section className="bg-gradient-to-b from-slate-950 via-[#400000] to-slate-950 py-10 px-4 sm:px-8 border-y border-red-900/50 relative overflow-hidden text-white shadow-2xl">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-[#990000] to-red-900 text-white rounded-2xl shadow-lg border border-red-500/30">
              <Sparkles size={24} className="animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                  RESMİ CANLI AKIŞ
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Neler Oluyor? <span className="text-slate-400 font-medium text-sm font-sans hidden sm:inline">| Son Duyurular & Resmî Haberler</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={() => setView && setView('haberler')}
            className="flex items-center gap-2 text-xs font-black text-white hover:text-amber-300 transition self-start sm:self-auto bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg cursor-pointer group"
          >
            Tüm Haber ve Duyuruları Gör <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Live Premium Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onSelectAnnouncement && item.rawItem) {
                  onSelectAnnouncement(item.rawItem);
                } else if (setView) {
                  setView('haberler');
                }
              }}
              className="group bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-800 hover:border-red-500/50 shadow-xl hover:shadow-red-950/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#990000] via-red-500 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <Megaphone size={12} className="text-amber-400" /> {item.badge}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-500" /> {item.date}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs font-medium text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                <span>Detaylı İncele</span>
                <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-[#990000] group-hover:text-white transition-colors flex items-center justify-center shadow-md">
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

