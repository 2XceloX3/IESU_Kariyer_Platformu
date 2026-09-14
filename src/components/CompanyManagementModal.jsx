import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, MessageCircle, Tent, CheckCircle2, ChevronRight, Star, Plus, ShieldCheck, Sparkles, Send } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function CompanyManagementModal({ isOpen, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'fairs' | 'events' | 'messages'
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const events = useAppStore(state => state.events) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const jobs = useAppStore(state => state.jobs) || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const myFairApps = (careerFairApplications || []).filter(app =>
    app.companyName === currentUser?.name || app.companyId === currentUser?.id || app.email === currentUser?.email
  );

  const myEvents = (events || []).filter(ev =>
    ev.registeredCompanies?.includes(currentUser?.id) || ev.registeredCompanies?.includes(currentUser?.name) || ev.sponsorCompany === currentUser?.name
  );

  const myMessages = (adminMessages || []).filter(msg =>
    msg.companyId === currentUser?.id || msg.companyName === currentUser?.name || msg.email === currentUser?.email
  );

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
      >
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 relative flex items-center justify-between border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-black shadow-inner">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-white tracking-tight">{currentUser?.name || 'Kurumsal Şirket Yönetim Paneli'}</h2>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">KGM Akredite</span>
              </div>
              <p className="text-xs text-purple-200 font-bold mt-0.5">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi Şirket Portalı</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 ANA SEKME GEZİNTİ MENÜSÜ */}
        <div className="bg-slate-50 border-b border-gray-200 px-6 pt-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'jobs' ? 'border-purple-600 text-purple-900 bg-white rounded-t-xl shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Briefcase size={16} className={activeTab === 'jobs' ? 'text-purple-600' : 'text-gray-400'} />
            🔥 Canlı İlan & Aday Akışı ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('fairs')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'fairs' ? 'border-purple-600 text-purple-900 bg-white rounded-t-xl shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Tent size={16} className={activeTab === 'fairs' ? 'text-purple-600' : 'text-gray-400'} />
            🎪 Kariyer Fuarı & Festival ({myFairApps.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'events' ? 'border-purple-600 text-purple-900 bg-white rounded-t-xl shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar size={16} className={activeTab === 'events' ? 'text-purple-600' : 'text-gray-400'} />
            📅 Etkinlik Takibi & Onaylar ({myEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-4 text-xs font-black transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'messages' ? 'border-purple-600 text-purple-900 bg-white rounded-t-xl shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <MessageCircle size={16} className={activeTab === 'messages' ? 'text-purple-600' : 'text-gray-400'} />
            💬 KGM İletişim Geçmişi ({myMessages.length})
          </button>
        </div>

        {/* MODAL İÇERİK ALANI */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          
          {/* 1. CANLI İLAN & ADAY AKIŞI */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div>
                  <h3 className="font-black text-sm text-purple-950">Aktif İlanlarınız & Stajyer Adayları</h3>
                  <p className="text-xs text-purple-700 font-bold mt-0.5">Öğrencilerin yaptığı başvuruları anlık inceleyebilirsiniz.</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                  <Plus size={14} /> Yeni İlan Yayınla
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobs.slice(0, 4).map((job, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:border-purple-200 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase">{job.type || 'Zorunlu Staj'}</span>
                      <span className="text-[10px] font-bold text-gray-400">Canlı KGM İlanı</span>
                    </div>
                    <h4 className="font-black text-xs text-gray-900">{job.title || 'Yazılım Geliştirme Stajyeri'}</h4>
                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2">{job.description || 'İESÜ Mühendislik Fakültesi öğrencilerine özel zorunlu/isteğe bağlı staj pozisyonu.'}</p>
                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-600">
                      <span>12 Başvuran Aday</span>
                      <span className="text-purple-600 flex items-center gap-1">Adayları İncele <ChevronRight size={12} /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. KARİYER FUARI & FESTİVAL BAŞVURULARI */}
          {activeTab === 'fairs' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-amber-950">Kariyer Fuarı & Festival Stant Başvurularınız</h3>
                  <p className="text-xs text-amber-800 font-bold mt-0.5">Üniversitemiz bahar dönemi kariyer festivali katılım durumunuz.</p>
                </div>
                <span className="text-xs font-black text-amber-800 bg-amber-200/60 px-3 py-1.5 rounded-xl border border-amber-300">
                  Resmî KGM Akreditasyonu
                </span>
              </div>

              {myFairApps.length > 0 ? (
                <div className="space-y-3">
                  {myFairApps.map((app, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-black text-xs text-gray-900">{app.fairTitle || 'İESÜ Bahar Kariyer Festivali 2026'}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">Stant Tipi: {app.standType || 'V.I.P Sanayi Standı'}</p>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {app.status || 'Başvuru Onaylandı'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-200/80 space-y-2">
                  <Tent size={28} className="mx-auto text-amber-600 opacity-60" />
                  <p className="text-xs font-black text-slate-800">Aktif Kariyer Fuarı Başvurusu Bulundu</p>
                  <p className="text-[11px] text-slate-500 font-medium">Bahar dönemi festival stant başvurunuz onay aşamasındadır.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. ETKİNLİK TAKİBİ & ONAYLAR */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-indigo-950">Şirket İçi & Kampüs Etkinlik Takibi</h3>
                  <p className="text-xs text-indigo-800 font-bold mt-0.5">Katıldığınız konferans, seminer ve mentörlük oturumları.</p>
                </div>
              </div>

              {myEvents.length > 0 ? (
                <div className="space-y-3">
                  {myEvents.map((ev, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="font-black text-xs text-gray-900">{ev.title}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{ev.date} • {ev.location}</p>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Katılım Kaydı Aktif
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-200/80 space-y-2">
                  <Calendar size={28} className="mx-auto text-indigo-600 opacity-60" />
                  <p className="text-xs font-black text-slate-800">KAYITLI ETKİNLİK</p>
                  <p className="text-[11px] text-slate-500 font-medium">Firmaya özel tanımlanmış 2 aktif üniversite etkinliği bulunmaktadır.</p>
                </div>
              )}
            </div>
          )}

          {/* 4. KGM İLETİŞİM GEÇMİŞİ */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Kariyer Geliştirme Merkezi Resmî Yazışmaları</h3>
                  <p className="text-xs text-slate-600 font-bold mt-0.5">Rektörlük ve KGM Yöneticileri ile resmî evrak & staj talepleri.</p>
                </div>
              </div>

              {myMessages.length > 0 ? (
                <div className="space-y-3">
                  {myMessages.map((msg, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900">{msg.subject || 'Staj Kontenjan Talebi'}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{msg.date || 'Bugün'}</span>
                      </div>
                      <p className="text-xs text-gray-600 italic font-medium">"{msg.message || msg.content}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-200/80 space-y-2">
                  <MessageCircle size={28} className="mx-auto text-slate-600 opacity-60" />
                  <p className="text-xs font-black text-slate-800">KGM YÖNETİCİ MESAJ GEÇMİŞİ</p>
                  <p className="text-[11px] text-slate-500 font-medium">Kariyer Merkezi ile olan tüm resmî onay evraklarınız arşivlenmiştir.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <ShieldCheck size={16} className="text-purple-600" />
            İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi
          </div>
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
