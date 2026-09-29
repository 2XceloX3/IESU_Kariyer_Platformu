import React, { useState } from 'react';
import { Building2, Calendar, Users, Briefcase, ExternalLink, ShieldCheck, ChevronRight, BookOpen, X, Search, CheckCircle2, MapPin, Sparkles, ArrowLeft } from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function CareerNetwork({ 
  companies = [], 
  academicStaff = [], 
  setView, 
  setSelectedUserId, 
  currentUser, 
  userRole = 'student', 
  previousView, 
  embedded = false 
}) {
  const [activeModal, setActiveModal] = useState(null); // 'companies', 'participants', 'internships'
  const [showAllAcademics, setShowAllAcademics] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  const store = useAppStore?.getState ? useAppStore.getState() : {};
  const effectiveCurrentUser = currentUser || store.currentUser;
  const effectiveRole = userRole || effectiveCurrentUser?.role || store.userRole || store.activePortalBranch || 'student';
  const isAlumni = effectiveRole === 'alumni';
  const isAcademic = effectiveRole === 'academic' || effectiveRole === 'academic_staff';
  const isCompany = effectiveRole === 'company' || effectiveRole === 'employer';
  const isAdmin = effectiveRole === 'admin';
  const isStudent = !isAlumni && !isAcademic && !isCompany && !isAdmin;

  const homeView = previousView || (isAdmin ? 'admin' : isAlumni ? 'alumni' : isAcademic ? 'academic' : isCompany ? 'company' : 'student');

  const bannerGradient = 
    isAlumni ? 'bg-gradient-to-br from-[#065F46] via-[#059669] to-[#047857] border-emerald-900' :
    isAcademic ? 'bg-gradient-to-br from-[#4C1D95] via-[#7c3aed] to-[#5B21B6] border-purple-900' :
    isCompany ? 'bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#1E293B] border-blue-900' :
    isAdmin ? 'bg-gradient-to-br from-[#78350F] via-[#b45309] to-[#92400E] border-amber-900' :
    'bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] border-red-900';

  const backBtnHoverClass = 
    isAlumni ? 'hover:bg-emerald-50 text-gray-700 hover:text-[#059669]' :
    isAcademic ? 'hover:bg-purple-50 text-gray-700 hover:text-[#7c3aed]' :
    isCompany ? 'hover:bg-blue-50 text-gray-700 hover:text-[#1e3a5f]' :
    isAdmin ? 'hover:bg-amber-50 text-gray-700 hover:text-[#b45309]' :
    'hover:bg-red-50 text-gray-700 hover:text-[#990000]';

  const titleColor = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#7c3aed]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const actionBtnTextClass = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#7c3aed]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const primaryBtnClass = 
    isAlumni ? 'bg-[#059669] hover:bg-emerald-700' :
    isAcademic ? 'bg-[#7c3aed] hover:bg-purple-700' :
    isCompany ? 'bg-[#1e3a5f] hover:bg-slate-800' :
    isAdmin ? 'bg-[#b45309] hover:bg-amber-700' :
    'bg-[#990000] hover:bg-red-800';

  const cardIconBg = 
    isAlumni ? 'bg-emerald-50 text-[#059669]' :
    isAcademic ? 'bg-purple-50 text-[#7c3aed]' :
    isCompany ? 'bg-blue-50 text-[#1e3a5f]' :
    isAdmin ? 'bg-amber-50 text-[#b45309]' :
    'bg-red-50 text-[#990000]';

  const cardHoverBorder = 
    isAlumni ? 'hover:border-emerald-200' :
    isAcademic ? 'hover:border-purple-200' :
    isCompany ? 'hover:border-blue-200' :
    isAdmin ? 'hover:border-amber-200' :
    'hover:border-red-100';

  // Sadece onaylı gerçek firmalar (demolar hariç)
  const networkCompanies = (companies || []).filter(c => (c.status === 'Onaylı' || c.status?.toLowerCase().includes('onay')) && c.source !== 'demo_seed');
  const networkAcademics = (academicStaff || []).filter(a => a.source !== 'demo_seed');

  const defaultStitchCompanies = [
    { id: 'cmp_p_1', name: 'Aselsan A.Ş.', sector: 'Savunma Sanayi & Bilişim', location: 'Ankara / İstanbul', protocolDate: '2025-2027', openPositions: 14, logo: 'https://ui-avatars.com/api/?name=Aselsan&background=990000&color=fff' },
    { id: 'cmp_p_2', name: 'Baykar Teknoloji', sector: 'Havacılık & İHA', location: 'İstanbul / Özdemir Bayraktar Kampüsü', protocolDate: '2025-2028', openPositions: 22, logo: 'https://ui-avatars.com/api/?name=Baykar&background=0A2342&color=fff' },
    { id: 'cmp_p_3', name: 'Trendyol Tech', sector: 'E-Ticaret & Yazılım', location: 'İstanbul Maslak', protocolDate: '2026-2027', openPositions: 8, logo: 'https://ui-avatars.com/api/?name=Trendyol&background=990000&color=fff' },
    { id: 'cmp_p_4', name: 'Turkcell Teknoloji', sector: 'Telekomünikasyon', location: 'İstanbul Küçükyalı', protocolDate: '2024-2027', openPositions: 19, logo: 'https://ui-avatars.com/api/?name=Turkcell&background=059669&color=fff' }
  ];

  const allCompanies = networkCompanies.length > 0 ? networkCompanies : defaultStitchCompanies;

  const defaultParticipants = [
    { id: 'part_1', name: 'Prof. Dr. Süleyman Özdemir', title: 'Rektör / Kurul Başkanı', unit: 'İESÜ Rektörlük', status: 'Katılımcı' },
    { id: 'part_2', name: 'Kariyer Geliştirme Merkezi', title: 'Resmî Merkez', unit: 'İESÜ KGM', status: 'Düzenleyen' },
    { id: 'part_3', name: 'Mühendislik & Mimarlık Fakültesi Dekanlığı', title: 'Fakülte Temsilcisi', unit: 'İESÜ MMF', status: 'Katılımcı' },
    { id: 'part_4', name: 'Esenyurt Sanayici ve İş İnsanları Derneği', title: 'Sektör Temsilcisi', unit: 'ESİDER', status: 'Protokol Ortağı' }
  ];

  const defaultInternships = [
    { id: 'int_p_1', title: 'Zorunlu Mühendislik Yaz Stajı Protokolü', company: 'Aselsan & Baykar Teknoloji', quota: '45 Öğrenci', deadline: '15 Mayıs 2026', type: 'Zorunlu / Gönüllü' },
    { id: 'int_p_2', title: 'Yazılım ve Yapay Zeka Aday Mühendislik', company: 'Trendyol & Turkcell', quota: '30 Öğrenci', deadline: '30 Nisan 2026', type: 'Aday Mühendislik' },
    { id: 'int_p_3', title: 'İktisadi ve İdari Bilimler Kurumsal Stajı', company: 'ESİDER Üye Firmaları', quota: '60 Öğrenci', deadline: '01 Haziran 2026', type: 'Kurumsal Staj' }
  ];

  const content = (
    <div className="w-full flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* PROFESSIONAL COMPACT CARD (REDESIGN) */}
      <div className={`rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden ${bannerGradient}`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <ShieldCheck size={13} className="text-emerald-400" /> Resmi Protokol Ağı
          </div>
          
          <h2 className="text-2xl sm:text-[28px] font-black text-white mb-2 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Akademik & Katılımcı Ağı
          </h2>
          
          <p className="text-white font-semibold text-[13px] leading-relaxed mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Üniversitemiz kurul üyeleri, akademisyenler ve resmi staj kontenjanı süreçlerine buradan ulaşabilirsiniz.
          </p>

          {/* INTERNAL ACTION BUTTONS */}
          <div className="grid grid-cols-1 gap-2.5 mb-1">
            <button 
              onClick={() => { setModalSearch(''); setActiveModal('participants'); }}
              className={`flex items-center justify-between bg-white ${actionBtnTextClass} hover:bg-slate-100 p-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider w-full shadow-md border border-white cursor-pointer group`}
            >
              <span className="flex items-center gap-2.5"><Calendar size={16} /> Katılımcılar & Kurullar</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => { setModalSearch(''); setActiveModal('internships'); }}
              className="flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 p-3 rounded-xl transition-all text-white text-xs font-bold w-full shadow-sm backdrop-blur-md cursor-pointer group"
            >
              <span className="flex items-center gap-2.5"><Briefcase size={16} /> Staj İmkânları & Kontenjanlar</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT PARTICIPANTS LIST */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Resmi Kurul & Katılımcılar ({defaultParticipants.length})</h3>
          <button onClick={() => { setModalSearch(''); setActiveModal('participants'); }} className={`text-xs font-bold ${actionBtnTextClass} hover:underline cursor-pointer`}>Tümünü Gör</button>
        </div>

        <div className="space-y-3">
          {defaultParticipants.map(participant => (
            <div key={participant.id} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md ${cardHoverBorder} transition-all group`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${cardIconBg} rounded-xl flex items-center justify-center shrink-0 font-black text-sm`}>
                  <ShieldCheck size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{participant.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {participant.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{participant.title} • {participant.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* COMPACT ACADEMIC LIST */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Akademik Kadro ({networkAcademics.length})</h3>
          {networkAcademics.length > 0 && <button onClick={() => setShowAllAcademics((v) => !v)} className={`text-xs font-bold ${actionBtnTextClass} hover:underline cursor-pointer`}>{showAllAcademics ? 'Daralt' : 'Tümünü Gör'}</button>}
        </div>

        {networkAcademics.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <p className="text-[13px] font-bold text-gray-500 mb-1">Henüz akademik personel bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {networkAcademics.slice(0, showAllAcademics ? networkAcademics.length : 5).map(academic => {
              const isSelf = !academic.id || academic.id === 'self' || academic.id === 'me' || (effectiveCurrentUser && (
                String(academic.id) === String(effectiveCurrentUser.id) ||
                String(academic.id) === String(effectiveCurrentUser.uid) ||
                (effectiveCurrentUser.name && academic.name && effectiveCurrentUser.name.trim().toLowerCase() === academic.name.trim().toLowerCase())
              ));
              const targetId = isSelf ? (effectiveCurrentUser?.id || academic.id) : academic.id;
              return (
              <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} key={academic.id} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md ${cardHoverBorder} transition-all group cursor-pointer`} onClick={() => {
                if (setSelectedUserId) setSelectedUserId(targetId);
                useAppStore.getState().setSelectedUserId?.(targetId);
                if (setView) setView(isSelf ? 'user_profile' : 'public_profile');
              }}>
                <div className="flex items-center gap-3">
                  <SafeAvatar 
                    name={academic.name} 
                    src={academic.avatar} 
                    isAdmin={false} 
                    size="lg" 
                    rounded="rounded-full" 
                    className="w-12 h-12 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm truncate transition-colors">{academic.name}</h4>
                    <p className="text-[11px] font-bold text-gray-500 truncate mb-1">{academic.title || 'Akademisyen'} / {academic.department}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">
                        Danışman
                      </span>
                    </div>
                  </div>
                  <button className={`w-8 h-8 rounded-full ${cardIconBg} flex items-center justify-center hover:${primaryBtnClass} hover:text-white transition-colors`} title="Mesaj Gönder" onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedUserId) setSelectedUserId(academic.id);
                    useAppStore.getState().setSelectedUserId?.(academic.id);
                    if (setView) setView('messaging');
                  }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* GOOGLE STITCH STYLED FULLSCREEN MODAL PANELS */}
      {activeModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-[#990000] rounded-2xl">
                  {activeModal === 'companies' && <Building2 size={24} />}
                  {activeModal === 'participants' && <Users size={24} />}
                  {activeModal === 'internships' && <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {activeModal === 'companies' && 'Resmî Anlaşmalı Firmalar & Protokol Ağı'}
                    {activeModal === 'participants' && 'Resmî Katılımcılar, Kurullar ve Temsilciler'}
                    {activeModal === 'internships' && 'Resmî Protokollü Staj İmkânları & Kontenjanlar'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi</p>
                </div>
              </div>

              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Firma, kurum, yetkili veya pozisyon ara..." 
                className="w-full bg-slate-50 pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold border border-slate-200 focus:ring-2 focus:ring-[#990000] outline-none"
              />
            </div>

            {/* PANEL 2: KATILIMCILAR */}
            {activeModal === 'participants' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultParticipants
                  .filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()) || p.title.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${cardIconBg} font-black rounded-xl flex items-center justify-center text-sm`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{p.title} · {p.unit}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-black ${actionBtnTextClass} bg-slate-100 px-3 py-1 rounded-full border border-slate-200`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* PANEL 3: STAJ İMKÂNLARI */}
            {activeModal === 'internships' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultInternships
                  .filter(i => i.title.toLowerCase().includes(modalSearch.toLowerCase()) || i.company.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(i => (
                    <div key={i.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          {i.type}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Son Başvuru: {i.deadline}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{i.title}</h4>
                      <p className="text-xs text-slate-600 font-medium flex items-center justify-between">
                        <span>Anlaşmalı Firmalar: <strong>{i.company}</strong></span>
                        <span className={`${titleColor} font-black`}>Kontenjan: {i.quota}</span>
                      </p>
                      <button 
                        onClick={() => {
                          setActiveModal(null);
                          if (setView) setView('staj');
                        }}
                        className={`w-full mt-2 py-2 ${primaryBtnClass} text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5`}
                      >
                        <Sparkles size={14} /> Yetenek Kapısı Üzerinden Başvur
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 pb-32 font-sans">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <button 
          onClick={() => setView ? setView(homeView) : null} 
          className={`w-10 h-10 rounded-full bg-white border border-gray-200 ${backBtnHoverClass} flex items-center justify-center shadow-xs transition cursor-pointer`}
          title="Geri Dön"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className={`text-xl font-black ${titleColor} tracking-tight`}>Akademik & Katılımcı Protokol Ağı</h1>
      </div>
      <div className="max-w-5xl mx-auto">
        {content}
      </div>
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        userRole={effectiveRole} 
        activeTab="network"
      />
    </div>
  );
}


