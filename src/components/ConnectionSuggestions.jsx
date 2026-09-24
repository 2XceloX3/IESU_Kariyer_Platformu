import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Users, UserPlus, ChevronRight, Check, Sparkles, X, ShieldCheck, Search } from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import useAppStore from '../store/useAppStore';

const BRANCH_THEMES = {
  student: {
    headerBg: 'bg-red-50 text-[#990000]',
    badgeStyle: 'bg-red-50 text-[#990000]',
    hoverText: 'group-hover:text-[#990000]',
    followBtn: 'bg-red-50 text-[#990000] hover:bg-[#990000] hover:text-white border border-red-200',
    footerBtn: 'hover:bg-red-50/60 text-[#990000]',
    modalGradient: 'from-slate-950 via-[#990000] to-red-950',
    modalTitle: 'İESÜ Kampüs & Kariyer Ağı',
    modalSub: 'Öğrenci, Mezun ve Akademisyenler',
    modalBtn: 'bg-[#990000] hover:bg-red-800',
    tabActive: 'bg-[#990000] text-white shadow-sm'
  },
  alumni: {
    headerBg: 'bg-emerald-50 text-emerald-700',
    badgeStyle: 'bg-emerald-50 text-emerald-700',
    hoverText: 'group-hover:text-emerald-700',
    followBtn: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-200',
    footerBtn: 'hover:bg-emerald-50/60 text-emerald-800',
    modalGradient: 'from-slate-950 via-emerald-800 to-teal-950',
    modalTitle: 'İESÜ Mezunlar İletişim & İş Ağı',
    modalSub: 'Mezunlar, Sektör Liderleri ve Bölüm Hocaları',
    modalBtn: 'bg-emerald-700 hover:bg-emerald-800',
    tabActive: 'bg-emerald-700 text-white shadow-sm'
  },
  academic: {
    headerBg: 'bg-purple-50 text-[#4C1D95]',
    badgeStyle: 'bg-purple-50 text-[#4C1D95]',
    hoverText: 'group-hover:text-[#4C1D95]',
    followBtn: 'bg-purple-50 text-[#4C1D95] hover:bg-[#4C1D95] hover:text-white border border-purple-200',
    footerBtn: 'hover:bg-purple-50/60 text-[#4C1D95]',
    modalGradient: 'from-slate-950 via-[#4C1D95] to-indigo-950',
    modalTitle: 'İESÜ Akademik Personel & Araştırmacı Ağı',
    modalSub: 'Öğretim Üyeleri, Araştırmacılar ve Lisansüstü',
    modalBtn: 'bg-[#4C1D95] hover:bg-purple-900',
    tabActive: 'bg-[#4C1D95] text-white shadow-sm'
  },
  company: {
    headerBg: 'bg-blue-50 text-[#0A2342]',
    badgeStyle: 'bg-blue-50 text-[#0A2342]',
    hoverText: 'group-hover:text-[#0A2342]',
    followBtn: 'bg-blue-50 text-[#0A2342] hover:bg-[#0A2342] hover:text-white border border-blue-200',
    footerBtn: 'hover:bg-blue-50/60 text-[#0A2342]',
    modalGradient: 'from-slate-950 via-[#0A2342] to-blue-950',
    modalTitle: 'İESÜ Kurumsal Yetenek & İstihdam Havuzu',
    modalSub: 'Yetenekli Öğrenciler, Stajyerler ve Mezun Adayları',
    modalBtn: 'bg-[#0A2342] hover:bg-blue-900',
    tabActive: 'bg-[#0A2342] text-white shadow-sm'
  },
  admin: {
    headerBg: 'bg-amber-50 text-amber-800',
    badgeStyle: 'bg-amber-50 text-amber-800',
    hoverText: 'group-hover:text-amber-800',
    followBtn: 'bg-amber-50 text-amber-800 hover:bg-amber-700 hover:text-white border border-amber-200',
    footerBtn: 'hover:bg-amber-50/60 text-amber-800',
    modalGradient: 'from-slate-950 via-amber-800 to-slate-900',
    modalTitle: 'İESÜ Platform Ekosistem Ağı',
    modalSub: 'Öğrenci, Mezun, Akademisyen ve Kurumsal Paydaşlar',
    modalBtn: 'bg-amber-700 hover:bg-amber-800',
    tabActive: 'bg-amber-700 text-white shadow-sm'
  }
};

export default function ConnectionSuggestions({ 
  currentUser, 
  students = [], 
  alumni = [], 
  companies = [],
  academicStaff = [],
  setView,
  setSelectedUserId,
  maxSuggestions = 4,
  branch
}) {
  const storeActiveBranch = useAppStore(state => state.activePortalBranch);
  const [followedIds, setFollowedIds] = useState([]);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [modalTab, setModalTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Close modal on ESC key
  useEffect(() => {
    if (!showNetworkModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowNetworkModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNetworkModal]);

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

  const theme = BRANCH_THEMES[effectiveBranch] || BRANCH_THEMES.student;

  const allNetworkUsers = useMemo(() => {
    return [
      ...(students || []).map(u => ({ ...u, _type: 'student' })),
      ...(alumni || []).map(u => ({ ...u, _type: 'alumni' })),
      ...(academicStaff || []).map(u => ({ ...u, _type: 'academic' })),
      ...(companies || []).map(u => ({ ...u, _type: 'company' }))
    ];
  }, [students, alumni, academicStaff, companies]);

  const suggestions = useMemo(() => {
    if (!currentUser && allNetworkUsers.length === 0) return [];

    const currentId = currentUser?.id;
    const currentEmail = currentUser?.email;
    const others = allNetworkUsers.filter(u => u.id !== currentId && (!currentEmail || u.email !== currentEmail));

    if (others.length === 0) return [];

    const scored = others.map(u => {
      let score = 0;
      const uDept = (u?.department || '').toLowerCase();
      const cDept = (currentUser?.department || '').toLowerCase();
      const sameDept = uDept && cDept && (uDept.includes(cDept) || cDept.includes(uDept));

      if (sameDept) score += 10;
      if (u.faculty && currentUser?.faculty && u.faculty === currentUser.faculty) score += 5;

      if (effectiveBranch === 'alumni') {
        if (u._type === 'alumni') score += 12;
        if (u._type === 'academic') score += 8;
        if (u._type === 'student') score += 4;
      } else if (effectiveBranch === 'academic') {
        if (u._type === 'academic') score += 14;
        if (sameDept) score += 8;
        if (u._type === 'student') score += 5;
      } else if (effectiveBranch === 'company') {
        if (u._type === 'student') score += 12;
        if (u._type === 'alumni') score += 10;
        if (u._type === 'academic') score += 6;
      } else if (effectiveBranch === 'student') {
        if (u._type === 'alumni') score += 12;
        if (u._type === 'academic') score += 8;
        if (u._type === 'student' && sameDept) score += 6;
      } else {
        score += 5;
      }

      return { ...u, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, maxSuggestions);
  }, [currentUser, allNetworkUsers, effectiveBranch, maxSuggestions]);

  const handleViewProfile = (userId) => {
    if (setSelectedUserId) setSelectedUserId(userId);
    if (setView) setView('public_profile');
  };

  const handleToggleFollow = (e, userId) => {
    e.stopPropagation();
    if (followedIds.includes(userId)) {
      setFollowedIds(followedIds.filter(id => id !== userId));
    } else {
      setFollowedIds([...followedIds, userId]);
    }
  };

  const filteredModalUsers = useMemo(() => {
    let list = allNetworkUsers;
    if (modalTab === 'students') list = list.filter(u => u._type === 'student');
    else if (modalTab === 'alumni') list = list.filter(u => u._type === 'alumni');
    else if (modalTab === 'academics') list = list.filter(u => u._type === 'academic');
    else if (modalTab === 'companies') list = list.filter(u => u._type === 'company');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(u => 
        (u.name || '').toLowerCase().includes(q) || 
        (u.department || '').toLowerCase().includes(q) ||
        (u.title || '').toLowerCase().includes(q) ||
        (u.sector || '').toLowerCase().includes(q) ||
        (u.location || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allNetworkUsers, modalTab, searchTerm]);

  if (suggestions.length === 0) return null;

  return (
    <>
      {/* ─── GOOGLE STITCH ULTRA-MODERN CONNECTION CARD (ORİJİNAL TASARIMA SADIK) ─── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Card Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100/60">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 ${theme.headerBg} rounded-xl flex items-center justify-center font-bold`}>
              <Users size={15} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Senin İçin Önerilenler</h3>
              <p className="text-[10px] text-slate-400 font-medium">Ortak ağ & bölüm eşleşmeleri</p>
            </div>
          </div>
          <span className={`${theme.badgeStyle} text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
            <Sparkles size={10} /> Akıllı Eşleşme
          </span>
        </div>

        {/* User Items List (Sade, Şık, Orijinal Düzen) */}
        <div className="divide-y divide-slate-50">
          {suggestions.map((person) => {
            const isFollowed = followedIds.includes(person.id);
            return (
              <div 
                key={person.id} 
                onClick={() => handleViewProfile(person.id)}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform flex items-center justify-center">
                      <SafeAvatar 
                        name={person.name} 
                        src={person.avatar} 
                        isAdmin={person.role === 'admin'} 
                        size="md" 
                        rounded="rounded-2xl" 
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold text-slate-900 ${theme.hoverText} transition-colors truncate`}>
                      {person.name}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 truncate">
                      {person.sector ? `${person.sector} • ${person.location || 'Kurumsal Paydaş'}` : (person.department || person.title || 'İESÜ Üyesi')}
                    </p>
                  </div>
                </div>

                {/* Follow / Connection Button */}
                <button
                  onClick={(e) => handleToggleFollow(e, person.id)}
                  className={`ml-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    isFollowed 
                      ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                      : theme.followBtn
                  }`}
                >
                  {isFollowed ? (
                    <> <Check size={12} /> Takipte </>
                  ) : (
                    <> <UserPlus size={12} /> Takip Et </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Safe View All Modal Trigger */}
        <button
          onClick={() => setShowNetworkModal(true)}
          className={`w-full py-2.5 bg-slate-50/50 text-xs font-bold transition-colors border-t border-slate-100 flex items-center justify-center gap-1 cursor-pointer ${theme.footerBtn}`}
        >
          Tüm Bağlantıları Keşfet <ChevronRight size={14} />
        </button>
      </div>

      {/* ─── IN-APP NETWORK DISCOVERY MODAL (PORTAL İLE DOĞRUDAN BODY'YE BAĞLI) ─── */}
      {showNetworkModal && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 pt-16 pb-24 animate-fade-in font-sans"
          onClick={() => setShowNetworkModal(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className={`p-5 bg-gradient-to-r ${theme.modalGradient} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{theme.modalTitle}</h3>
                  <p className="text-xs text-white/80 font-medium">{theme.modalSub}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNetworkModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                title="Kapat (ESC)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/60 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="İsim, bölüm veya unvana göre ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Tümü', count: allNetworkUsers.length },
                  { id: 'students', label: 'Öğrenciler', count: (students || []).length },
                  { id: 'alumni', label: 'Mezunlar', count: (alumni || []).length },
                  { id: 'academics', label: 'Akademisyenler', count: (academicStaff || []).length },
                  { id: 'companies', label: 'Firmalar', count: (companies || []).length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
                    className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                      modalTab === tab.id 
                        ? theme.tabActive 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tab.label} <span className="opacity-70 text-[10px]">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Network Body List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {filteredModalUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Aramanıza uygun bağlantı bulunamadı.
                </div>
              ) : (
                filteredModalUsers.map((userItem) => (
                  <div 
                    key={userItem.id} 
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 transition cursor-pointer"
                    onClick={() => { setShowNetworkModal(false); handleViewProfile(userItem.id); }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                        <SafeAvatar 
                          name={userItem.name} 
                          src={userItem.avatar} 
                          isAdmin={userItem.role === 'admin'} 
                          size="md" 
                          rounded="rounded-2xl" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {userItem.name}
                          </h4>
                          <ShieldCheck size={14} className="text-teal-600 shrink-0" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 truncate">
                          {userItem.sector ? `${userItem.sector} • ${userItem.location || 'Kurumsal Paydaş'}` : (userItem.department || userItem.title || 'İESÜ Kariyer Üyesi')}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowNetworkModal(false); handleViewProfile(userItem.id); }}
                      className={`px-3.5 py-2 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${theme.modalBtn}`}
                    >
                      Profili İncele
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
