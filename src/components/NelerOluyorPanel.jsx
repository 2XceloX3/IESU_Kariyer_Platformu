import useAppStore from '../store/useAppStore';
import React from 'react';
import { Sparkles, Calendar, ArrowRight, Megaphone, ChevronRight } from 'lucide-react';
import { liveNewsData } from '../utils/liveData';

export default function NelerOluyorPanel({ onSelectAnnouncement, setView }) {
  const news = useAppStore(state => state.news);
  const announcements = useAppStore(state => state.announcements);

  const storeItems = [...(news || []), ...(announcements || [])];
  const sourceList = storeItems.length > 0 ? storeItems : (liveNewsData || []);

  const officialNews = (sourceList || [])
    .filter(item => item && (item.title || item.name))
    .slice(0, 3)
    .map((item, idx) => {
      const titleClean = (item.title || item.name || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim();
      const descClean = (item.description || item.content || item.summary || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim();
      return {
        id: item.id || `news-${idx}`,
        title: titleClean,
        category: item.category || 'Haber & Rapor',
        date: item.date || '02 Ocak 2026',
        badge: item.badge || (idx === 0 ? '🔥 YÖK Resmi Raporu' : idx === 1 ? '🎓 Akreditasyon Başarısı' : '🚀 TEKNOFEST 2026'),
        summary: descClean ? (descClean.slice(0, 120) + '...') : 'İçerik detayları için tıklayınız.',
        rawItem: item
      };
    });

  const newsItems = officialNews.length >= 1 ? officialNews : [
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
    <section className="bg-slate-50 py-12 px-4 sm:px-8 border-y border-slate-200/80 relative overflow-hidden text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#990000] text-white rounded-2xl shadow-md border border-red-800">
              <Sparkles size={24} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-100 px-3 py-1 rounded-full border border-red-200">
                  RESMİ CANLI AKIŞ
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#990000]"></span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Neler Oluyor? <span className="text-slate-500 font-bold text-sm font-sans hidden sm:inline">| Son Duyurular & Resmî Haberler</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={() => setView && setView('haberler')}
            className="flex items-center gap-2 text-xs font-black text-white hover:bg-red-800 transition self-start sm:self-auto bg-[#990000] px-5 py-3 rounded-2xl shadow-md cursor-pointer group"
          >
            Tüm Haber ve Duyuruları Gör <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Open Light Interactive Cards with High Contrast Text */}
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
              className="group bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-red-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#990000]"></div>
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-black text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5 shadow-xs">
                    <Megaphone size={12} className="text-[#990000]" /> {item.badge}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" /> {item.date}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs font-semibold text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#990000] group-hover:text-red-700 transition-colors">
                <span>Detaylı İncele</span>
                <div className="w-8 h-8 rounded-xl bg-red-50 group-hover:bg-[#990000] group-hover:text-white transition-colors flex items-center justify-center shadow-xs">
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
