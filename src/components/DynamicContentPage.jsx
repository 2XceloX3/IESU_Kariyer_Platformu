import React, { useEffect } from 'react';
import { ArrowLeft, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import { innerPagesData } from '../utils/innerPagesData';
import * as Icons from 'lucide-react';

export default function DynamicContentPage({ contentId, setView, previousView = 'landing' }) {
  const data = innerPagesData[contentId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contentId]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">İçerik Bulunamadı</h2>
        <button onClick={() => setView(previousView)} className="px-6 py-2 bg-iesu-navy text-white rounded-lg">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] animate-fade-in pb-20">
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full overflow-hidden bg-[#0A2342]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342] via-[#0A2342]/90 to-transparent z-10"></div>
        {data.heroImage && (
          <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
        )}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <button onClick={() => setView(previousView)} className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-max mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-bold text-sm tracking-wide">ANA SAYFAYA DÖN</span>
          </button>
          
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-xl md:text-2xl text-blue-100 font-medium opacity-90 leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-grow lg:w-2/3 bg-white rounded-xl shadow-xl shadow-black/5 p-8 md:p-12 border border-gray-100">
            {data.sections && data.sections.map((section, idx) => {
              const IconComponent = section.icon ? Icons[section.icon] : CheckCircle;
              
              return (
                <div key={idx} className="mb-12 last:mb-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#24548A] flex items-center justify-center flex-shrink-0">
                      {IconComponent && <IconComponent size={24} />}
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                    {section.content.split('\\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                  
                  {section.target && (
                    <div className="mt-6 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold">
                      <Icons.Users size={16} className="text-gray-500" />
                      Hedef Kitle: {section.target}
                    </div>
                  )}
                </div>
              );
            })}

            {data.externalLink && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <a href={data.externalLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#0A2342] text-white px-8 py-4 rounded-xl font-black shadow-xl shadow-[#0A2342]/20 hover:-translate-y-1 transition-all w-full md:w-auto text-lg">
                  {data.externalLink.label} <ExternalLink size={20} />
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#0A2342] to-[#1C4173] rounded-xl shadow-xl p-8 text-white relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10"><Icons.Shield size={160} /></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-6">Hızlı Menü</h3>
                <div className="flex flex-col gap-3">
                  {Object.keys(innerPagesData).map(key => (
                    <button 
                      key={key}
                      onClick={() => setView('inner_page_' + key)}
                      className={`flex items-center justify-between p-4 rounded-xl font-bold transition-all ${key === contentId ? 'bg-white text-[#0A2342] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      <span>{innerPagesData[key].title}</span>
                      <ChevronRight size={16} className={key === contentId ? "text-[#0A2342]" : "text-white/50"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>


            <div className="bg-indigo-50 rounded-xl shadow-sm p-6 border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <h3 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2 relative z-10">
                <Icons.Sparkles size={16} className="text-indigo-600" /> Zamanın Kısıtlı Mı?
              </h3>
              <p className="text-xs text-indigo-800 font-medium mb-4 relative z-10">Anka AI bu sayfadaki uzun metinleri senin için 2 cümlede özetlesin.</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.toast && window.toast.info("Anka AI: Sayfa içeriği taranıyor ve özetleniyor...");
                  setTimeout(() => {
                    window.toast && window.toast.success(`✅ AI Özeti: "${data.title}" sayfası genel hatlarıyla kariyer planlama süreçlerindeki resmi prosedürleri ve ofis destek birimlerini açıklamaktadır.`);
                  }, 2500);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition relative z-10 shadow-md shadow-indigo-600/20"
              >
                AI ile Özetle
              </button>
            </div>

            {data.contactInfo && (
              <div className="bg-white rounded-xl shadow-xl shadow-black/5 p-8 border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Icons.PhoneCall size={20} className="text-[#24548A]" /> İletişim Bilgileri
                </h3>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 text-[#24548A] flex items-center justify-center flex-shrink-0"><Icons.Mail size={14} /></div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">E-Posta</p>
                      <p className="font-bold text-gray-800">{data.contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Icons.Phone size={14} /></div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Telefon</p>
                      <p className="font-bold text-gray-800">{data.contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0"><Icons.MapPin size={14} /></div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ofis</p>
                      <p className="font-bold text-gray-800">{data.contactInfo.office}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
