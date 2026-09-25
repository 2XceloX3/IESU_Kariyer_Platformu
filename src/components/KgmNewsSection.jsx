import React from 'react';
import { Bell, Calendar, ExternalLink, Pin, ArrowRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function KgmNewsSection({ onSelectAnnouncement, limit }) {
  const storeAnnouncements = useAppStore((state) => state.announcements) || [];
  const announcements = limit ? storeAnnouncements.slice(0, limit) : storeAnnouncements;

  return (
    <section className="py-12 bg-transparent" data-testid="kgm-news-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A80016] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
              esenyurt.edu.tr Güncel İçerik
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 tracking-tight">
              Kariyer Ofisi Duyuruları & Haberler
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="announcements-list">
          {announcements.map((ann) => (
            <div
              key={ann.id || ann.title}
              data-testid={`announcement-card-${ann.id}`}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative ${
                ann.isPinned ? 'border-red-300 ring-2 ring-red-500/10' : 'border-slate-200'
              }`}
            >
              {ann.isPinned && (
                <div className="absolute top-4 right-4 bg-red-100 text-[#A80016] p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold" data-testid="pinned-badge">
                  <Pin size={12} /> Sabitlendi
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                  <Calendar size={13} />
                  <span>{ann.date || 'Günün Duyurusu'}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-red-700 font-bold">{ann.category || 'Duyuru'}</span>
                </div>

                <h3 className="text-lg font-black text-gray-900 leading-snug mb-3 hover:text-[#A80016] transition-colors" data-testid="announcement-title">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3" data-testid="announcement-summary">
                  {ann.summary || ann.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {ann.link && ann.link !== '#' ? (
                  <a
                    href={ann.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A80016] font-bold flex items-center gap-1 hover:underline"
                    data-testid="announcement-link"
                  >
                    Detayı Oku <ExternalLink size={13} />
                  </a>
                ) : (
                  <button
                    onClick={() => onSelectAnnouncement && onSelectAnnouncement(ann)}
                    className="text-[#A80016] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    data-testid="announcement-btn"
                  >
                    İncele <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
