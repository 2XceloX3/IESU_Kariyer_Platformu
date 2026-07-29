import React, { useState, useMemo } from 'react';
import {
  Search, BookOpen, Newspaper, Bell, Briefcase, GraduationCap, 
  ExternalLink, Download, ChevronRight, Shield, X, FileText,
  Globe, Building2, Award, Calendar, MapPin, Phone, Mail,
  ArrowLeft, Filter, Tag, Clock, Star
} from 'lucide-react';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import { searchKnowledgeBase, getIndexStats, getSearchIndex } from '../utils/searchIndex';

// JSON data imports
import newsData from '../data/knowledge_base/news.json';
import announcementsData from '../data/knowledge_base/announcements.json';
import kariyerData from '../data/knowledge_base/kariyer_data.json';
import universityData from '../data/knowledge_base/university_data.json';

const TYPE_CONFIG = {
  haber: { label: 'Haber', icon: Newspaper, color: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  duyuru: { label: 'Duyuru', icon: Bell, color: 'bg-amber-100 text-amber-800', border: 'border-amber-200' },
  staj: { label: 'Staj', icon: Briefcase, color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200' },
  kariyer_hizmet: { label: 'Kariyer', icon: Award, color: 'bg-purple-100 text-purple-800', border: 'border-purple-200' },
  sem: { label: 'SEM Kursu', icon: BookOpen, color: 'bg-orange-100 text-orange-800', border: 'border-orange-200' },
  fakulte: { label: 'Fakülte', icon: Building2, color: 'bg-red-100 text-red-800', border: 'border-red-200' },
  myo: { label: 'Meslek Yüksekokulu', icon: GraduationCap, color: 'bg-slate-100 text-slate-800', border: 'border-slate-200' },
};

const SECTIONS = [
  { id: 'all', label: 'Tümü', icon: Globe },
  { id: 'haber', label: 'Haberler', icon: Newspaper },
  { id: 'duyuru', label: 'Duyurular', icon: Bell },
  { id: 'staj', label: 'Staj İlanları', icon: Briefcase },
  { id: 'kariyer_hizmet', label: 'Kariyer Hizmetleri', icon: Award },
  { id: 'sem', label: 'SEM Kursları', icon: BookOpen },
  { id: 'fakulte', label: 'Fakülteler', icon: Building2 },
  { id: 'myo', label: 'Meslek Yüksekokulları', icon: GraduationCap },
];

function ItemCard({ item, onClick }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.haber;
  const Icon = cfg.icon;
  return (
    <div
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:border-[#990000]/30"
      onClick={() => onClick(item)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.color}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${cfg.color} ${cfg.border}`}>
              {cfg.label}
            </span>
            {item.isPinned && (
              <span className="text-[10px] font-black bg-red-50 text-[#990000] border border-red-200 px-2 py-0.5 rounded-lg">📌 SABİTLENDİ</span>
            )}
            {item.verificationStatus === 'VERIFIED' && (
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <Shield size={10} /> Doğrulandı
              </span>
            )}
          </div>
          <h3 className="font-black text-slate-800 text-sm leading-snug mb-1.5 group-hover:text-[#990000] transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
          <div className="flex items-center gap-3 mt-2.5 text-[10px] text-slate-400 font-semibold">
            {item.date && (
              <span className="flex items-center gap-1"><Calendar size={10} /> {item.date}</span>
            )}
            {item.category && (
              <span className="flex items-center gap-1"><Tag size={10} /> {item.category}</span>
            )}
            {item.attachments?.length > 0 && (
              <span className="flex items-center gap-1 text-[#990000]"><Download size={10} /> {item.attachments.length} ek</span>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#990000] transition-colors shrink-0 mt-1" />
      </div>
    </div>
  );
}

function ItemDetail({ item, onClose }) {
  if (!item) return null;
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.haber;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-10">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Detail Header */}
        <div className="bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-red-200 uppercase tracking-wider mb-1">{cfg.label}</div>
                <h2 className="text-base font-black text-white leading-tight">{item.title}</h2>
                {item.date && <p className="text-[11px] text-red-200 mt-1">{item.date}</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition cursor-pointer mt-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Detail Content */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Verification Badge */}
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <Shield size={14} />
            <span className="font-bold">Kaynak: esenyurt.edu.tr — Doğrulandı (VERIFIED)</span>
          </div>

          {/* Main Content */}
          {item.content && (
            <div>
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">İçerik</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.content}</p>
            </div>
          )}

          {/* Programs (for faculties) */}
          {item.programs?.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Programlar ({item.programs.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {item.programs.map((prog, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-50 rounded-lg px-3 py-1.5">
                    <GraduationCap size={12} className="text-[#990000] shrink-0" />
                    {prog.name}
                    {prog.duration && <span className="text-slate-400 ml-auto">{prog.duration}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {item.requirements?.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Başvuru Koşulları</h4>
              <ul className="space-y-1">
                {item.requirements.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <ChevronRight size={12} className="text-[#990000]" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Attachments */}
          {item.attachments?.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                <Download size={12} className="inline mr-1" /> Ekler ve Belgeler
              </h4>
              <div className="space-y-2">
                {item.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition group"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#990000]">
                      <FileText size={14} /> {att.title}
                    </div>
                    <Download size={14} className="text-[#990000] group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Application Link */}
          {item.applicationUrl && (
            <a
              href={item.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#990000] hover:bg-[#800000] text-white font-black text-sm rounded-2xl transition shadow-lg"
            >
              <ExternalLink size={16} /> Başvurmak için tıklayın
            </a>
          )}

          {/* Source Link */}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-[#990000] transition font-semibold"
            >
              <Globe size={12} /> Resmi kaynağa git: {item.sourceUrl}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePortal({ setView, currentUser, userRole }) {
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const stats = useMemo(() => getIndexStats(), []);

  const results = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      return searchKnowledgeBase(searchQuery, {
        types: activeSection === 'all' ? null : [activeSection],
        limit: 50,
      });
    }

    // No search — load all by section
    const index = getSearchIndex();
    return index.filter(item => activeSection === 'all' || item.type === activeSection);
  }, [searchQuery, activeSection]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <MainHeader setView={setView} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white py-10 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1250px] mx-auto">
          <div className="flex items-center gap-2 text-red-200 text-xs font-bold mb-2">
            <Globe size={12} /> Resmi Kaynak: esenyurt.edu.tr
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-3">İESÜ Bilgi Merkezi</h1>
          <p className="text-red-200 text-sm font-medium mb-6">
            Resmi üniversite web sitesinden çekilen ve doğrulanmış tüm içeriklere buradan erişebilirsiniz.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Haber, duyuru, staj, fakülte, kurs ara..."
              className="w-full pl-11 pr-4 py-4 bg-white/15 backdrop-blur border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:bg-white/25 focus:border-white/60 transition text-sm font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition cursor-pointer">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-5 text-xs font-bold text-red-200">
            <span>📰 {stats.byType?.haber || 0} Haber</span>
            <span>📢 {stats.byType?.duyuru || 0} Duyuru</span>
            <span>💼 {stats.byType?.staj || 0} Staj</span>
            <span>🏛️ {stats.byType?.fakulte || 0} Fakülte</span>
            <span>📚 {stats.byType?.sem || 0} SEM Kursu</span>
            <span className="text-white font-black">Toplam: {stats.total} içerik</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-[1250px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
        {/* Section Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {SECTIONS.map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-[#990000] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-[#990000]/40 hover:text-[#990000]'
                }`}
              >
                <Icon size={13} /> {sec.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {searchQuery.trim().length >= 2 && (
          <div className="mb-4 text-sm text-slate-500 font-semibold">
            "{searchQuery}" için <strong className="text-slate-800">{results.length}</strong> sonuç bulundu
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-black text-slate-500">İçerik bulunamadı.</p>
            <p className="text-xs mt-1">Farklı bir arama terimi deneyin veya kategori filtresini değiştirin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(item => (
              <ItemCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <MainFooter setView={setView} />
    </div>
  );
}
