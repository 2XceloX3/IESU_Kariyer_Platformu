import React, { useState } from 'react';
import { Building2, Calendar, Users, Briefcase, ExternalLink, ShieldCheck, ChevronRight, BookOpen, X, Search, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export default function CareerNetwork({ companies = [], academicStaff = [], setView, setSelectedUserId, currentUser }) {
  const [activeModal, setActiveModal] = useState(null); // 'companies', 'participants', 'internships'
  const [modalSearch, setModalSearch] = useState('');

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
    { id: 'part_2', name: 'Kariyer Geliştirme Koordinatörlüğü', title: 'Resmî Koordinatörlük', unit: 'İESÜ KGM', status: 'Düzenleyen' },
    { id: 'part_3', name: 'Mühendislik & Mimarlık Fakültesi Dekanlığı', title: 'Fakülte Temsilcisi', unit: 'İESÜ MMF', status: 'Katılımcı' },
    { id: 'part_4', name: 'Esenyurt Sanayici ve İş İnsanları Derneği', title: 'Sektör Temsilcisi', unit: 'ESİDER', status: 'Protokol Ortağı' }
  ];

  const defaultInternships = [
    { id: 'int_p_1', title: 'Zorunlu Mühendislik Yaz Stajı Protokolü', company: 'Aselsan & Baykar Teknoloji', quota: '45 Öğrenci', deadline: '15 Mayıs 2026', type: 'Zorunlu / Gönüllü' },
    { id: 'int_p_2', title: 'Yazılım ve Yapay Zeka Aday Mühendislik', company: 'Trendyol & Turkcell', quota: '30 Öğrenci', deadline: '30 Nisan 2026', type: 'Aday Mühendislik' },
    { id: 'int_p_3', title: 'İktisadi ve İdari Bilimler Kurumsal Stajı', company: 'ESİDER Üye Firmaları', quota: '60 Öğrenci', deadline: '01 Haziran 2026', type: 'Kurumsal Staj' }
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* PROFESSIONAL COMPACT CARD (REDESIGN) */}
      <div className="bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden border border-red-900">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <ShieldCheck size={13} className="text-emerald-400" /> Resmi Protokol Ağı
          </div>
          
          <h2 className="text-2xl sm:text-[28px] font-black text-white mb-2 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Firma ve Etkinlik Ağı
          </h2>
          
          <p className="text-white font-semibold text-[13px] leading-relaxed mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Üniversitemizle protokolü olan, etkinliklerimize katılan veya staj imkânı sağlayan kurumlara buradan ulaşabilirsiniz.
          </p>

          {/* INTERNAL ACTION BUTTONS */}
          <div className="grid grid-cols-1 gap-2.5 mb-1">
            <button 
              onClick={() => { setModalSearch(''); setActiveModal('companies'); }}
              className="flex items-center justify-between bg-white text-[#990000] hover:bg-slate-100 p-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider w-full shadow-md border border-white cursor-pointer group"
            >
              <span className="flex items-center gap-2.5"><Building2 size={16} /> Firmaları Gör</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => { setModalSearch(''); setActiveModal('participants'); }}
              className="flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 p-3 rounded-xl transition-all text-white text-xs font-bold w-full shadow-sm backdrop-blur-md cursor-pointer group"
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

      {/* COMPACT COMPANY LIST */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Resmi Firmalar ({allCompanies.length})</h3>
          <button onClick={() => { setModalSearch(''); setActiveModal('companies'); }} className="text-xs font-bold text-[#990000] hover:underline cursor-pointer">Tümünü Gör</button>
        </div>

        <div className="space-y-3">
          {allCompanies.slice(0, 4).map(company => (
            <div key={company.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden p-1.5">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-black text-gray-400">
                      {(company.name || '?').substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 text-sm truncate group-hover:text-[#990000] transition-colors">{company.name}</h4>
                  <p className="text-xs text-gray-500 truncate mb-1">{company.sector || 'Sektör bilgisi yok'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">
                      Resmi Protokol
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (setSelectedUserId && setView) {
                    setSelectedUserId(company.id);
                    setView('user_profile');
                  } else {
                    setActiveModal('companies');
                  }
                }}
                className="w-full mt-3 bg-gray-50 group-hover:bg-red-50 text-gray-700 group-hover:text-[#990000] text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-gray-100 group-hover:border-red-100 cursor-pointer"
              >
                Firma Profiline Git <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COMPACT ACADEMIC LIST */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Akademik Kadro ({networkAcademics.length})</h3>
          {networkAcademics.length > 0 && <button className="text-xs font-bold text-[#990000] hover:underline">Tümünü Gör</button>}
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
            {networkAcademics.slice(0, 5).map(academic => (
              <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  key={academic.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer" onClick={() => {
                if (setSelectedUserId) setSelectedUserId(academic.id);
                if (setView) setView('user_profile');
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                    {academic.avatar ? (
                      <img src={academic.avatar} alt={academic.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-black text-gray-400">
                        {(academic.name || '?').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm truncate group-hover:text-[#990000] transition-colors">{academic.name}</h4>
                    <p className="text-[11px] font-bold text-gray-500 truncate mb-1">{academic.title || 'Akademisyen'} / {academic.department}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">
                        Danışman
                      </span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-red-50 text-[#990000] flex items-center justify-center hover:bg-[#990000] hover:text-white transition-colors" title="Mesaj Gönder" onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedUserId) setSelectedUserId(academic.id);
                    if (setView) setView('messaging');
                  }}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
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
                  <p className="text-xs font-semibold text-slate-500">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü</p>
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

            {/* PANEL 1: FIRMALARI GÖR */}
            {activeModal === 'companies' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {allCompanies
                  .filter(c => c.name.toLowerCase().includes(modalSearch.toLowerCase()) || (c.sector && c.sector.toLowerCase().includes(modalSearch.toLowerCase())))
                  .map(c => (
                    <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-red-300 transition">
                      <div className="flex items-center gap-3">
                        <img src={c.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=990000&color=fff`} className="w-12 h-12 rounded-xl object-cover border border-slate-200" alt="" />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{c.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{c.sector || 'Sektör Bilgisi'} · {c.location || 'Esenyurt / İstanbul'}</p>
                          <span className="inline-block mt-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Protokol Süresi: {c.protocolDate || '2026-2028'}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveModal(null);
                          if (setSelectedUserId && setView) {
                            setSelectedUserId(c.id);
                            setView('user_profile');
                          }
                        }}
                        className="px-4 py-2 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition cursor-pointer"
                      >
                        Resmî İncele
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* PANEL 2: KATILIMCILAR */}
            {activeModal === 'participants' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultParticipants
                  .filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()) || p.title.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 text-[#990000] font-black rounded-xl flex items-center justify-center text-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{p.title} · {p.unit}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
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
                        <span className="text-[#990000] font-black">Kontenjan: {i.quota}</span>
                      </p>
                      <button 
                        onClick={() => {
                          setActiveModal(null);
                          if (setView) setView('staj');
                        }}
                        className="w-full mt-2 py-2 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition cursor-pointer flex items-center justify-center gap-1.5"
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
}
