import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Search, Building2, X, Eye } from 'lucide-react';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';
import { liveEventData } from '../utils/liveData';
import { cleanScrapedText, normalizeTitleForDedup, normalizeScrapedImageUrl, deduplicateFeedItems } from '../services/scraper';
import SafeEventImage from './shared/SafeEventImage';

function inferEventCategory(title = '', rawCategory = '') {
  const text = `${title} ${rawCategory}`.toLowerCase();
  if (text.includes('kültür') || text.includes('sanat') || text.includes('şenlik') || text.includes('türkü') || text.includes('film') || text.includes('masal') || text.includes('müzik')) {
    return 'Kültür & Sanat';
  }
  if (text.includes('teknoloji') || text.includes('siber') || text.includes('yapay zek') || text.includes('robotik') || text.includes('dijital') || text.includes('bilişim') || text.includes('bilim') || text.includes('uçuş')) {
    return 'Teknoloji & Bilim';
  }
  if (text.includes('tübitak') || text.includes('proje') || text.includes('teknofest') || text.includes('atölye') || text.includes('mimarlık') || text.includes('aselsan')) {
    return 'Teknoloji & Proje';
  }
  if (text.includes('sempozyum') || text.includes('seminer') || text.includes('eğitim') || text.includes('diyetisyen') || text.includes('terapi') || text.includes('akademik') || text.includes('farkındalık')) {
    return 'Akademik';
  }
  if (text.includes('kariyer') || text.includes('mezun') || text.includes('sektör') || text.includes('söyleşi')) {
    return 'Kariyer & Sektör';
  }
  return 'Sosyal & Kurumsal';
}

export default function EventsPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  const storeEvents = useAppStore((state) => state.events) || [];

  // Sadece gerçek esenyurt.edu.tr etkinliklerini göster ve mükerrer kayıtları tamamen engelle
  const ALL_EVENTS = useMemo(() => {
    const deduplicated = deduplicateFeedItems(liveEventData, storeEvents, 30);
    const seenTitles = new Set();
    const seenUrls = new Set();
    const seenImages = new Set();
    const result = [];

    for (const raw of deduplicated) {
      if (!raw || !raw.title) continue;
      const cleanTitle = cleanScrapedText(raw.title);
      if (!cleanTitle || cleanTitle.length < 6) continue;

      const normTitle = normalizeTitleForDedup(cleanTitle);
      if (!normTitle || seenTitles.has(normTitle)) continue;

      const urlStr = String(raw.url || raw.link || '').trim();
      const idMatch = urlStr.match(/\/etkinlik\/(\d+)/i);
      const urlKey = idMatch ? `etkinlik:${idMatch[1]}` : urlStr.toLowerCase();
      if (urlKey && urlKey !== '#' && !urlKey.endsWith('/etkinlikler') && seenUrls.has(urlKey)) {
        continue;
      }

      const rawImgStr = String(raw.imageUrl || raw.image || '').trim();
      const safeRawImg = rawImgStr.includes('images.unsplash.com') ? '' : rawImgStr;
      const imgStr = normalizeScrapedImageUrl(safeRawImg, 'event');
      const isUniqueUpload =
        imgStr &&
        imgStr.includes('/uploads/') &&
        !imgStr.includes('nz19buzmdccs4-mimari-kultur-ve-sanat-kulubunden');
      if (isUniqueUpload && seenImages.has(imgStr)) continue;

      seenTitles.add(normTitle);
      if (urlKey && urlKey !== '#') seenUrls.add(urlKey);
      if (isUniqueUpload) seenImages.add(imgStr);

      const category = inferEventCategory(cleanTitle, raw.category);
      const cleanDesc = cleanScrapedText(raw.description || raw.summary || raw.content || cleanTitle);

      result.push({
        id: idMatch ? `etkinlik-${idMatch[1]}` : (raw.id || `evt-${result.length + 1}`),
        title: cleanTitle,
        category,
        speaker: raw.speaker || 'İstanbul Esenyurt Üniversitesi',
        date: raw.date || 'Güncel',
        time: raw.time || '13:00',
        location: raw.location || 'İstanbul Esenyurt Üniversitesi Kampüsü',
        imageUrl: imgStr,
        url: urlStr || 'https://www.esenyurt.edu.tr/etkinlikler',
        desc: cleanDesc || cleanTitle,
        content: raw.content ? cleanScrapedText(raw.content) : cleanDesc
      });
    }

    return result;
  }, [storeEvents]);

  const CATEGORIES = ['Tümü', 'Kültür & Sanat', 'Teknoloji & Bilim', 'Akademik', 'Teknoloji & Proje', 'Kariyer & Sektör', 'Sosyal & Kurumsal'];

  const filteredEvents = ALL_EVENTS.filter((evt) => {
    const matchesCat = filter === 'Tümü' || evt.category === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (evt.title || '').toLowerCase().includes(q) ||
      (evt.location || '').toLowerCase().includes(q) ||
      (evt.desc || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      <main className="flex-1 w-full max-w-[1250px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-red-900 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/70 px-4 py-1.5 rounded-full border border-amber-500/40 inline-block mb-3">
              İSTANBUL ESENYURT ÜNİVERSİTESİ
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight">
              Etkinliklerimiz & Zirve Portalı
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              Üniversitemizde düzenlenen tüm resmî paneller, bilimsel sempozyumlar, TEKNOFEST buluşmaları ve kültür-sanat etkinliklerini detaylarıyla takip edebilirsiniz.
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-full md:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
            <Search size={18} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Etkinlik veya salon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#990000] to-[#800000] text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-[#990000] border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Real Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => setSelectedEventModal(evt)}
                  className="aspect-[4/5] w-full bg-slate-100 relative overflow-hidden cursor-pointer"
                >
                  <SafeEventImage
                    src={evt.imageUrl}
                    alt={evt.title}
                    fallbackType="event"
                    mode="poster"
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 left-3 z-20 bg-[#990000] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {evt.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-[#990000] mb-2">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {evt.date}</span>
                    {evt.time && <span className="flex items-center gap-1"><Clock size={14} /> {evt.time}</span>}
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-[#990000] transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {evt.desc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-[#990000] shrink-0" />
                      <span className="truncate">{evt.speaker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#990000] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedEventModal(evt)}
                  className="w-full py-3 bg-[#990000] hover:bg-red-800 text-white font-black rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye size={15} /> Etkinlik Detaylarını Gör
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-2">
                {selectedEventModal.category}
              </span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {selectedEventModal.title}
              </h3>
            </div>

            {selectedEventModal.imageUrl && (
              <div className="h-80 w-full rounded-2xl overflow-hidden mb-5 bg-slate-900 relative">
                <SafeEventImage
                  src={selectedEventModal.imageUrl}
                  alt={selectedEventModal.title}
                  fallbackType="event"
                  mode="contain"
                  className="w-full h-full bg-slate-900"
                  imgClassName="p-2"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-black">Tarih / Saat</span>
                <span className="text-[#990000]">{selectedEventModal.date} - {selectedEventModal.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-black">Konum / Salon</span>
                <span className="text-slate-800">{selectedEventModal.location}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Etkinlik Açıklaması & Program Detayı:</h4>
              <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedEventModal.desc}
              </p>
              {selectedEventModal.content && selectedEventModal.content !== selectedEventModal.desc && (
                <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-100">
                  {selectedEventModal.content}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedEventModal(null)}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-md cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <SubPanelFooter setView={setView} />

      {currentUser && (
        <SubPanelFloatingDock
          currentUser={currentUser}
          setView={setView}
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
        />
      )}
    </div>
  );
}
