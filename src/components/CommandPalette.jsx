import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, User, Briefcase, Calendar, Home, Settings, MessageCircle, 
  FileText, ShieldAlert, Palette, ShieldCheck, ExternalLink, Utensils, 
  Users, Server, BookOpen, GraduationCap, ChevronRight, Sparkles, X, ArrowUpRight,
  Trophy, Globe, Building2
} from 'lucide-react';
import { searchKnowledgeBase } from '../utils/searchIndex';

const PORTAL_LINKS = [
  { id: 'portal_lunch', title: 'Günün Yemekhane Menüsü (SKSDB)', category: 'Kampüs Yaşamı', icon: <Utensils size={18} className="text-amber-600" />, view: 'sksdb_lunch' },
  { id: 'portal_clubs', title: 'Öğrenci Kulüpleri Dizini', category: 'Kulüpler & Topluluklar', icon: <Users size={18} className="text-teal-600" />, view: 'sksdb_clubs' },
  { id: 'portal_wifi', title: 'BİDB Sistem Durumu & Wi-Fi', category: 'Bilişim & Altyapı', icon: <Server size={18} className="text-blue-600" />, view: 'bidb_status' },
  { id: 'portal_helpdesk', title: 'BİDB Şifre Sıfırlama & Destek Bileti', category: 'Teknik Destek', icon: <Server size={18} className="text-indigo-600" />, view: 'bidb_helpdesk' },
  { id: 'portal_obis', title: 'OBİS Öğrenci Bilgi Sistemi', category: 'Resmi Sistemler', icon: <ExternalLink size={18} className="text-rose-600" />, externalUrl: 'https://obis.esenyurt.edu.tr', isExternal: true },
  { id: 'portal_edevlet', title: 'e-Devlet Kapısı / Öğrenci Belgesi', category: 'Resmi Sistemler', icon: <ExternalLink size={18} className="text-red-700" />, externalUrl: 'https://www.turkiye.gov.tr', isExternal: true }
];

export default function CommandPalette({ isOpen, setIsOpen, setView, currentUser }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Keyboard shortcut Escape listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const role = currentUser?.role || 'landing';
  const isAdmin = role === 'admin' || currentUser?.academicRole === 'super_admin';

  const baseActions = useMemo(() => [
    { id: 'home', title: 'Ana Sayfaya Git', category: 'Gezinme', icon: <Home size={18} className="text-blue-600" />, action: () => setView(role === 'admin' ? 'admin' : role === 'employer' ? 'company' : role) },
    ...(isAdmin ? [
      { id: 'super_admin', title: '🛡️ Süper Admin Kontrol Merkezi', category: 'Yönetim', icon: <ShieldAlert size={18} className="text-[#990000]" />, action: () => setView('admin_cms') },
      { id: 'site_editor', title: '🎨 Görsel Site Düzenleyici (CMS Pro)', category: 'Yönetim', icon: <Palette size={18} className="text-[#990000]" />, action: () => setView('admin_cms') },
      { id: 'audit_logs', title: '🔒 Denetim Logları & Güvenlik Takibi', category: 'Yönetim', icon: <ShieldCheck size={18} className="text-[#990000]" />, action: () => setView('audit_logs') },
      { id: 'idari_portal', title: '🏛️ İdari Birimler & Koordinatörlük Portalı', category: 'Yönetim', icon: <Building2 size={18} className="text-slate-700" />, action: () => setView('idari_portal') },
    ] : []),
    { id: 'knowledge_portal', title: '📚 Kurumsal Bilgi Bankası & Mevzuat', category: 'Bilgi Merkezi', icon: <BookOpen size={18} className="text-blue-600" />, action: () => setView('knowledge_portal') },
    { id: 'leaderboard', title: '🏆 İESÜ Başarı & Liderlik Sıralaması', category: 'Sosyal & Puan', icon: <Trophy size={18} className="text-amber-500" />, action: () => setView('leaderboard') },
    { id: 'student_kgb', title: '🎓 KGB Kariyer Karnem & Yetenek Belgesi', category: 'Kariyer & Gelişim', icon: <GraduationCap size={18} className="text-[#990000]" />, action: () => setView('student_kgb') },
    { id: 'jobs', title: 'İş ve Staj İlanları', category: 'Kariyer Fırsatları', icon: <Briefcase size={18} className="text-emerald-600" />, action: () => setView('jobs') },
    { id: 'company_ats', title: 'İşe Alım Panosu (ATS)', category: 'Kurumsal', icon: <Briefcase size={18} className="text-purple-600" />, action: () => setView('company_ats') },
    { id: 'events', title: 'Yaklaşan Etkinlikler & Seminerler', category: 'Akademik & Sosyal', icon: <Calendar size={18} className="text-orange-600" />, action: () => setView('etkinlikler') },
    { id: 'news', title: 'Haberler ve Resmi Duyurular', category: 'Duyuru & Medya', icon: <FileText size={18} className="text-red-600" />, action: () => setView('haberler') },
    { id: 'organization', title: 'Akademik Birimler & Fakülteler', category: 'Üniversite', icon: <GraduationCap size={18} className="text-indigo-600" />, action: () => setView('organization') },
    { id: 'sem', title: 'SEM Sürekli Eğitim Merkezi Sertifikaları', category: 'Eğitim', icon: <BookOpen size={18} className="text-teal-600" />, action: () => setView('sem') },
    { id: 'profile', title: 'Profilimi Görüntüle', category: 'Hesap', icon: <User size={18} className="text-gray-700" />, action: () => setView('user_profile') },
    { id: 'messages', title: 'Doğrudan Mesajlar', category: 'İletişim', icon: <MessageCircle size={18} className="text-sky-600" />, action: () => setView('messaging') },
    { id: 'settings', title: 'Hesap & Güvenlik Ayarları', category: 'Hesap', icon: <Settings size={18} className="text-slate-600" />, action: () => setView('profile_update') },
  ], [role, isAdmin, setView]);

  // Combined Results: Base Actions + Portals + Knowledge Base Search
  const results = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    
    // 1. Matched navigation actions
    const matchedActions = baseActions
      .filter(action => !cleanQ || action.title.toLowerCase().includes(cleanQ) || action.category.toLowerCase().includes(cleanQ))
      .map(item => ({ ...item, resultType: 'action' }));

    // 2. Matched portal links
    const matchedPortals = PORTAL_LINKS
      .filter(portal => !cleanQ || portal.title.toLowerCase().includes(cleanQ) || portal.category.toLowerCase().includes(cleanQ))
      .map(portal => ({
        id: portal.id,
        title: portal.title,
        category: portal.category,
        icon: portal.icon,
        resultType: 'portal',
        action: () => {
          if (portal.isExternal) {
            window.open(portal.externalUrl, '_blank');
          } else {
            setView(portal.view);
          }
        }
      }));

    // 3. Matched Knowledge Base items from searchIndex.js
    let matchedKnowledge = [];
    if (cleanQ.length >= 2) {
      const kbResults = searchKnowledgeBase(cleanQ, { limit: 10 });
      matchedKnowledge = kbResults.map(item => {
        const getIconAndAction = () => {
          switch (item.type) {
            case 'haber':
              return { icon: <FileText size={18} className="text-red-500" />, action: () => setView('haberler') };
            case 'duyuru':
              return { icon: <FileText size={18} className="text-amber-500" />, action: () => setView('duyurular') };
            case 'staj':
            case 'kariyer_hizmet':
              return { icon: <Briefcase size={18} className="text-emerald-500" />, action: () => setView('jobs') };
            case 'fakulte':
            case 'myo':
              return { icon: <GraduationCap size={18} className="text-indigo-500" />, action: () => setView('organization') };
            case 'sem':
              return { icon: <BookOpen size={18} className="text-teal-500" />, action: () => setView('sem') };
            default:
              return { icon: <Sparkles size={18} className="text-[#990000]" />, action: () => setView('explore') };
          }
        };
        const { icon, action } = getIconAndAction();
        return {
          id: `kb_${item.id}`,
          title: item.title,
          summary: item.summary,
          category: item.typeLabel || item.category || 'Bilgi Bankası',
          date: item.date,
          icon,
          resultType: 'knowledge',
          sourceUrl: item.sourceUrl,
          action
        };
      });
    }

    return [...matchedActions, ...matchedPortals, ...matchedKnowledge];
  }, [query, baseActions, setView]);

  // Handle keyboard arrow navigation and enter key
  const handleKeyNavigation = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        executeItem(results[selectedIndex]);
      }
    }
  };

  const executeItem = (item) => {
    if (item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-start justify-center pt-[10vh] sm:pt-[12vh] p-4 font-sans animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Evrensel Komut Paleti ve Arama"
        className="bg-white/95 backdrop-blur-2xl w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyNavigation}
      >
        {/* Search Bar Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-white/50">
          <Search size={22} className="text-[#990000] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Üniversite portalları, ilanlar, haberler veya sayfalarda ara... (Ctrl+K)"
            className="w-full bg-transparent outline-none text-gray-800 text-base sm:text-lg placeholder-gray-400 font-medium"
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 mr-2 shrink-0"
              title="Temizle"
            >
              <X size={16} />
            </button>
          )}
          <span className="text-[11px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md shrink-0 border border-gray-200">ESC</span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {results.length > 0 ? (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id || index}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#990000]/10 text-gray-900 border border-[#990000]/20 shadow-sm' 
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-white shadow-sm' : 'bg-gray-100'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 truncate">{item.title}</span>
                        {item.date && (
                          <span className="text-[10px] text-gray-400 font-medium shrink-0">{item.date}</span>
                        )}
                      </div>
                      {item.summary && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{item.summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-[#990000] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.category}
                    </span>
                    {item.sourceUrl ? (
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-[#990000] transition"
                        title="Resmi Kaynağı Aç"
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <ChevronRight size={14} className={`transition-transform ${isSelected ? 'translate-x-0.5 text-[#990000]' : 'text-gray-300'}`} />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search size={22} />
              </div>
              <p className="font-bold text-gray-800 text-sm">"{query}" için sonuç bulunamadı</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">Farklı anahtar kelimelerle arama yapabilir veya Fakülte, İlan ya da Yemekhane yazmayı deneyebilirsiniz.</p>
            </div>
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-xs">↓</kbd>
              Geçin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono shadow-xs">↵</kbd>
              Seçin
            </span>
          </div>
          <span className="font-bold text-[#990000] flex items-center gap-1">
            <Sparkles size={12} /> İESÜ Evrensel Dizin
          </span>
        </div>
      </div>
    </div>
  );
}
