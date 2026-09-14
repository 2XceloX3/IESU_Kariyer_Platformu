import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Newspaper, Clock, MapPin, Share2, X, Check } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const DEFAULT_NEWS = [
  {
    id: 'h1',
    title: 'Yeni Kariyer Fuarı Duyuruldu',
    time: '12 saat önce',
    readers: '4.2B okuyucu',
    category: 'Fuar',
    summary: 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi tarafından düzenlenen 2026 Ulusal Kariyer Fuarı için kayıtlar başladı. 50+ lider savunma, bilişim ve sanayi firması kampüsümüzde stajyer ve mezun adaylarla buluşuyor.',
    location: 'Ana Kampüs Konferans Salonu',
    date: '15 Nisan 2026'
  },
  {
    id: 'h2',
    title: 'Yapay Zeka ve İstihdam Raporu',
    time: '1 gün önce',
    readers: '3.1B okuyucu',
    category: 'Rapor',
    summary: 'İESÜ Araştırma OS Merkezi tarafından hazırlanan 2026 Yapay Zeka ve Geleceğin Meslekleri raporu yayımlandı. Rapor, veri analitiği, istem mühendisliği ve yapay zeka entegrasyonunun mezun istihdamındaki %45 artışını belgeliyor.',
    location: 'İESÜ Ar-Ge OS Merkezi',
    date: '10 Nisan 2026'
  },
  {
    id: 'h3',
    title: 'Mezunlar Zirvesi Başlıyor',
    time: '2 gün önce',
    readers: '8.4B okuyucu',
    category: 'Zirve',
    summary: 'Geleneksel İESÜ Mezunlar ve Sektör Zirvesi bu yıl hibrit katılım modeliyle kapılarını açıyor. Türkiye ve dünyadaki mezunlarımız deneyimlerini aktif öğrencilerimizle paylaşacak.',
    location: 'İESÜ Kültür Merkezi & Online Stream',
    date: '22 Nisan 2026'
  }
];

const BRANCH_CONFIGS = {
  student: {
    title: 'KGM Haberleri',
    badge: 'Canlı',
    liveDot: 'bg-[#990000]',
    headerBg: 'bg-red-50 text-[#990000]',
    glow: 'bg-red-600/5',
    hoverText: 'group-hover/item:text-[#990000]',
    hoverDot: 'group-hover/item:bg-[#990000]',
    badgeStyle: 'bg-red-50 text-[#990000] border-red-100',
    modalTheme: 'from-slate-950 via-[#990000] to-red-950'
  },
  alumni: {
    title: 'KGM Haberleri',
    badge: 'Canlı',
    liveDot: 'bg-emerald-600',
    headerBg: 'bg-emerald-50 text-emerald-700',
    glow: 'bg-emerald-600/5',
    hoverText: 'group-hover/item:text-emerald-700',
    hoverDot: 'group-hover/item:bg-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    modalTheme: 'from-slate-950 via-emerald-800 to-teal-950'
  },
  academic: {
    title: 'KGM Haberleri',
    badge: 'Canlı',
    liveDot: 'bg-[#4C1D95]',
    headerBg: 'bg-purple-50 text-[#4C1D95]',
    glow: 'bg-purple-600/5',
    hoverText: 'group-hover/item:text-[#4C1D95]',
    hoverDot: 'group-hover/item:bg-[#4C1D95]',
    badgeStyle: 'bg-purple-50 text-[#4C1D95] border-purple-100',
    modalTheme: 'from-slate-950 via-[#4C1D95] to-indigo-950'
  },
  company: {
    title: 'KGM Haberleri',
    badge: 'Canlı',
    liveDot: 'bg-[#0A2342]',
    headerBg: 'bg-blue-50 text-[#0A2342]',
    glow: 'bg-blue-600/5',
    hoverText: 'group-hover/item:text-[#0A2342]',
    hoverDot: 'group-hover/item:bg-[#0A2342]',
    badgeStyle: 'bg-blue-50 text-[#0A2342] border-blue-100',
    modalTheme: 'from-slate-950 via-[#0A2342] to-blue-950'
  },
  admin: {
    title: 'KGM Haberleri',
    badge: 'Canlı',
    liveDot: 'bg-amber-600',
    headerBg: 'bg-amber-50 text-amber-800',
    glow: 'bg-amber-600/5',
    hoverText: 'group-hover/item:text-amber-800',
    hoverDot: 'group-hover/item:bg-amber-800',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-100',
    modalTheme: 'from-slate-950 via-amber-800 to-slate-900'
  }
};

export default function BranchNewsWidget({ branch, currentUser }) {
  const storeActiveBranch = useAppStore(state => state.activePortalBranch);
  const storeNews = useAppStore(state => state.news) || [];

  const effectiveBranch = useMemo(() => {
    if (branch) return branch;
    if (storeActiveBranch) return storeActiveBranch;
    const role = currentUser?.role;
    if (role === 'alumni') return 'alumni';
    if (role === 'academic') return 'academic';
    if (role === 'employer' || role === 'company') return 'company';
    if (role === 'admin') return 'admin';
    return 'student';
  }, [branch, storeActiveBranch, currentUser]);

  const cfg = BRANCH_CONFIGS[effectiveBranch] || BRANCH_CONFIGS.student;

  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [copied, setCopied] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    if (!selectedNewsItem) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedNewsItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNewsItem]);

  const newsList = useMemo(() => {
    if (storeNews && storeNews.length >= 3) {
      return storeNews.slice(0, 3).map((item, idx) => ({
        id: item.id || `news_${idx}`,
        title: item.title,
        time: item.date ? `${item.date}` : 'Yeni',
        readers: item.views ? `${item.views} okuyucu` : '3.5B okuyucu',
        category: item.category || 'Haber',
        summary: item.summary || item.content || item.description || '',
        location: item.location || 'İESÜ Kampüs',
        date: item.date || 'Nisan 2026'
      }));
    }
    return DEFAULT_NEWS;
  }, [storeNews]);

  const handleShare = (item) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${item.title} — İESÜ Kariyer & Geliştirme Portalı`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.toast && window.toast.success('Haber bağlantısı panoya kopyalandı.');
    }
  };

  return (
    <>
      {/* ─── ESKİ GÖRÜNÜMÜNE SADIK ULTRA-ŞIK KGM HABERLERİ KARTI ─── */}
      <div className="relative bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${cfg.glow} rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150 pointer-events-none`}></div>
        
        <div className="p-5 sm:p-6 relative z-10">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${cfg.headerBg}`}>
                <Newspaper size={16} strokeWidth={2.5} />
              </div>
              <h3 className="font-black text-slate-900 text-[15px] tracking-tight">{cfg.title}</h3>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-full ${cfg.badgeStyle}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.liveDot}`}></div>
              <span className="text-[9px] font-black uppercase tracking-wider">{cfg.badge}</span>
            </div>
          </div>
          
          {/* News List */}
          <div className="flex flex-col gap-4">
            {newsList.map((newsItem) => (
              <div 
                key={newsItem.id} 
                onClick={() => setSelectedNewsItem(newsItem)} 
                className="group/item cursor-pointer flex gap-3 items-start"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 ${cfg.hoverDot} group-hover/item:scale-150 transition-all duration-300`}></div>
                <div className="flex flex-col">
                  <span className={`text-[13px] font-bold text-slate-800 ${cfg.hoverText} transition-colors leading-snug`}>
                    {newsItem.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-slate-500">{newsItem.time}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-semibold text-slate-500">{newsItem.readers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SADE & ZARİF HABER DETAY MODALI (PORTAL İLE BODY'YE BAĞLI) ─── */}
      {selectedNewsItem && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-fade-in font-sans"
          onClick={() => setSelectedNewsItem(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${cfg.modalTheme} text-white p-5 flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Newspaper size={20} className="text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90 bg-white/15 px-2 py-0.5 rounded-md">
                    {selectedNewsItem.category || 'KGM Haber'}
                  </span>
                  <h4 className="font-black text-sm text-white mt-1 line-clamp-1">{selectedNewsItem.title}</h4>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNewsItem(null)} 
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
                title="Kapat (ESC)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-slate-400" /> {selectedNewsItem.time}</span>
                <span>{selectedNewsItem.readers}</span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 leading-snug mb-2">
                  {selectedNewsItem.title}
                </h3>
                <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap text-xs">
                  {selectedNewsItem.summary}
                </p>
              </div>

              {selectedNewsItem.location && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <MapPin size={14} className="text-rose-500" />
                    <span>Konum / Platform: {selectedNewsItem.location}</span>
                  </div>
                  {selectedNewsItem.date && (
                    <div className="text-[11px] text-slate-500 font-semibold ml-5">
                      Tarih: {selectedNewsItem.date}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleShare(selectedNewsItem)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                <span>{copied ? 'Kopyalandı!' : 'Haberi Paylaş'}</span>
              </button>
              <button
                onClick={() => setSelectedNewsItem(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
