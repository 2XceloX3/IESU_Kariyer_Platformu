import React from 'react';
import { Building2, Calendar, Users, Briefcase, ExternalLink, ShieldCheck, ChevronRight, BookOpen } from 'lucide-react';

export default function CareerNetwork({ companies = [], academicStaff = [], setView, setSelectedUserId, currentUser }) {
  // Sadece onaylı gerçek firmalar (demolar hariç)
  const networkCompanies = (companies || []).filter(c => c.status === 'Onaylı' && c.source !== 'demo_seed');
  const networkAcademics = (academicStaff || []).filter(a => a.source !== 'demo_seed');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* PROFESSIONAL COMPACT CARD (REDESIGN) */}
      <div className="bg-gradient-to-br from-iesu-red to-red-900 rounded-3xl p-6 shadow-[0_8px_30px_rgb(185,28,28,0.2)] text-white relative overflow-hidden border border-red-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-red-50 mb-4 backdrop-blur-md shadow-sm">
            <ShieldCheck size={12} className="text-emerald-400" /> Resmi Protokol Ağı
          </div>
          
          <h2 className="text-2xl sm:text-[28px] font-black text-white mb-3 leading-tight tracking-tight">
            Firma ve Etkinlik Ağı
          </h2>
          
          <p className="text-red-100/90 text-[14px] leading-relaxed mb-6">
            Üniversitemizle protokolü olan, etkinliklerimize katılan veya staj imkânı sağlayan kurumlara buradan ulaşabilirsiniz.
          </p>

          {/* INTERNAL ACTION BUTTONS (Replaced Floating Icons) */}
          <div className="grid grid-cols-1 gap-2 mb-2">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-xl transition-all text-white text-xs font-bold w-full justify-start">
              <Building2 size={16} /> Firmaları Gör
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-xl transition-all text-white text-xs font-bold w-full justify-start">
              <Calendar size={16} /> Katılımcılar
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-xl transition-all text-white text-xs font-bold w-full justify-start">
              <Briefcase size={16} /> Staj İmkânları
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT COMPANY LIST */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Resmi Firmalar ({networkCompanies.length})</h3>
          {networkCompanies.length > 0 && <button className="text-xs font-bold text-iesu-red hover:underline">Tümünü Gör</button>}
        </div>

        {networkCompanies.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Building2 size={24} className="text-gray-300" />
            </div>
            <p className="text-[13px] font-bold text-gray-500 mb-1">Henüz firma ağına eklenmiş gerçek firma bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {networkCompanies.slice(0, 5).map(company => (
              <div key={company.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden p-1.5">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-lg font-black text-gray-300">
                        {(company.name || '?').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm truncate group-hover:text-iesu-red transition-colors">{company.name}</h4>
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
                    }
                  }}
                  className="w-full mt-3 bg-gray-50 group-hover:bg-red-50 text-gray-700 group-hover:text-iesu-red text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-gray-100 group-hover:border-red-100"
                >
                  Firma Profiline Git <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPACT ACADEMIC LIST */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-gray-900 text-sm">Akademik Kadro ({networkAcademics.length})</h3>
          {networkAcademics.length > 0 && <button className="text-xs font-bold text-iesu-red hover:underline">Tümünü Gör</button>}
        </div>

        {networkAcademics.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <p className="text-[13px] font-bold text-gray-500 mb-1">Henüz akademik personel bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {networkAcademics.slice(0, 5).map(academic => (
              <div key={academic.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-red-100 transition-all group cursor-pointer" onClick={() => {
                if (setSelectedUserId) setSelectedUserId(academic.id);
                if (setView) setView('user_profile');
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                    {academic.avatar ? (
                      <img src={academic.avatar} alt={academic.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-black text-gray-300">
                        {(academic.name || '?').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm truncate group-hover:text-iesu-red transition-colors">{academic.name}</h4>
                    <p className="text-[11px] font-bold text-gray-500 truncate mb-1">{academic.title || 'Akademisyen'} / {academic.department}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">
                        Danışman
                      </span>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-red-50 text-iesu-red flex items-center justify-center hover:bg-iesu-red hover:text-white transition-colors" title="Mesaj Gönder" onClick={(e) => {
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

    </div>
  );
}
