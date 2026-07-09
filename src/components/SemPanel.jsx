import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, ChevronRight, Award, Megaphone, ArrowRight, ShieldCheck, MonitorPlay, X } from 'lucide-react';

export default function SemPanel({ setView, semCourses, userRole }) {
  const [activeTab, setActiveTab] = useState('egitimler');
  const [selectedItem, setSelectedItem] = useState(null);

  const combinedEgitimler = semCourses || [];

  const haberler = [
    { title: "Dijital Pazarlama Eğitimleri", date: "28/07/2025", img: "https://www.esenyurt.edu.tr/uploads/2025/07/u4d5ft8lbhama-dijital-pazarlama-egitimleri.png", desc: "Yeni dönem dijital pazarlama eğitimlerimizin kontenjanları dolmak üzeredir. Öğrencilerimize özel sağlanan indirimlerden yararlanmak için kariyer merkezini ziyaret edebilirsiniz." },
    { title: "Sertifikalarınız Artık E-Devlet Sisteminde", date: "28/07/2025", img: "https://www.esenyurt.edu.tr/uploads/2025/07/l6fmm4b5on8gr-sertifikalariniz-artik-e-devlet-sisteminde.png", desc: "Üniversitemiz Sürekli Eğitim Merkezi bünyesinde aldığınız tüm onaylı sertifikalar, E-Devlet kapısı üzerinden doğrulanabilir belge olarak sunulmaya başlanmıştır." },
    { title: "Temel ve Orta Seviye Excel Eğitimi", date: "28/07/2025", img: "https://www.esenyurt.edu.tr/uploads/2025/07/qq6jv1w9cbqj4-temel-ve-orta-seviye-excel-egitimi.png", desc: "İş dünyasının vazgeçilmez aracı Excel'i temel seviyeden orta seviyeye kadar uygulamalı olarak öğreneceğiniz yeni eğitim programımız başlıyor." }
  ];

  const duyurular = [
    { title: "Sürekli Eğitim, Uygulama ve Araştırma Merkezi Sertifikalandırma Süreçleri Hakkında", date: "20/11/2025" },
    { title: "Sürekli Eğitim Uygulama ve Araştırma Merkezi ve İş Birlikleri Hususunda", date: "31/07/2025" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FC] via-[#f0f2f8] to-[#e6e9f0]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => {
              if (!userRole) { setView('landing'); return; }
              if (userRole === 'employer') { setView('company'); return; }
              setView(userRole === 'admin' ? 'admin' : userRole);
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition font-bold mb-10 bg-white/5 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/10 w-fit hover:bg-white/10"
          >
            <ArrowLeft size={18} /> Ana Sayfaya Dön
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-iesu-red/20 rounded-full text-sm font-black text-red-200 mb-6 border border-red-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(211,47,47,0.3)]">
                <Award size={16} /> Sertifikalı Açık Eğitimler
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Sürekli Eğitim Merkezi
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                İstanbul Esenyurt Üniversitesi Sürekli Eğitim Merkezi ile kariyerinize değer katın. Uzman kadromuzla hazırlanan sertifikalı eğitim programları.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="https://sertifikaonline.esenyurt.edu.tr/verify" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={18} /> Sertifika Doğrulama
                </a>
                <a href="https://sertifikaonline.esenyurt.edu.tr/login-student" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl font-bold transition border border-blue-500/30 shadow-lg shadow-blue-500/20">
                  <MonitorPlay size={18} /> Sertifika Paneli
                </a>
              </div>
            </div>
            
            <div className="flex bg-white/5 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
              <button 
                onClick={() => setActiveTab('egitimler')}
                className={`px-8 py-3 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 ${activeTab === 'egitimler' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <BookOpen size={18} /> Eğitimler
              </button>
              <button 
                onClick={() => setActiveTab('haberler')}
                className={`px-8 py-3 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 ${activeTab === 'haberler' ? 'bg-white text-gray-900 shadow-md scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <Megaphone size={18} /> Haberler
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        
        {/* Eğitimler Tab */}
        {activeTab === 'egitimler' && (
          <div className="space-y-16 animate-fade-in">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-4">
                <span className="w-2 h-10 bg-iesu-red rounded-full shadow-[0_0_10px_rgba(211,47,47,0.5)]"></span> 
                Tüm Eğitim Programları
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {combinedEgitimler.map((egitim, i) => (
                  <div key={i} onClick={() => setSelectedItem({...egitim, type: 'egitim'})} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2">
                    <div className="h-48 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
                      <img src={egitim.img || egitim.image || egitim.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(egitim.title || 'SEM')}&background=random`} alt={egitim.title} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(egitim.title || 'Eğitim')}&background=random&size=512`; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-0 drop-shadow-sm" />
                      
                      {/* Ücretli / Ücretsiz Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        {egitim.isFree || egitim.isFree === undefined ? (
                          <span className="bg-emerald-500/90 backdrop-blur text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                            ÜCRETSİZ
                          </span>
                        ) : (
                          <span className="bg-amber-500/90 backdrop-blur text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                            {egitim.price || 'ÜCRETLİ'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="font-black text-lg text-gray-800 group-hover:text-iesu-red transition-colors mb-4 leading-tight">{egitim.title}</h3>
                      <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6">{egitim.desc || "Eğitim detayları ve içerik bilgisi için tıklayınız."}</p>
                      
                      <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-iesu-red font-bold text-sm tracking-wide">Programa Katıl</span>
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-iesu-red group-hover:bg-iesu-red group-hover:text-white transition-colors duration-300 shadow-sm">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Duyurular (Glassmorphic Side by Side) */}
            <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-10 lg:p-14 shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
              
              <h2 className="text-3xl font-black text-gray-900 mb-10 relative z-10 flex items-center gap-3">
                <Megaphone className="text-iesu-red" size={28} /> SEM Duyuruları
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {duyurular.map((duyuru, i) => (
                  <div key={i} onClick={() => setSelectedItem({...duyuru, type: 'duyuru'})} className="flex gap-5 p-6 rounded-3xl bg-white/80 hover:bg-white transition-all duration-300 border border-white shadow-sm hover:shadow-lg cursor-pointer group">
                    <div className="w-14 h-14 flex-shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-iesu-red group-hover:bg-iesu-red group-hover:text-white transition-colors shadow-inner">
                      <Calendar size={24} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-black text-gray-400 mb-1.5 uppercase tracking-wider block">{duyuru.date}</span>
                      <h4 className="font-bold text-[15px] text-gray-800 group-hover:text-iesu-red transition-colors leading-relaxed">{duyuru.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Haberler Tab */}
        {activeTab === 'haberler' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-4">
              <span className="w-2 h-10 bg-gray-900 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]"></span> 
              SEM'den Haberler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {haberler.map((haber, i) => (
                <div key={i} onClick={() => setSelectedItem({...haber, type: 'haber'})} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="h-60 relative overflow-hidden bg-gray-100">
                    <img src={haber.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(haber.title || 'Haber')}&background=random`} alt={haber.title} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(haber.title || 'Haber')}&background=random&size=512`; }} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-gray-900 font-black text-xs flex items-center gap-2">
                      <Calendar size={14} className="text-iesu-red" /> {haber.date}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black text-gray-800 mb-4 leading-relaxed group-hover:text-iesu-red transition-colors">{haber.title}</h3>
                    <p className="text-gray-500 text-sm font-bold flex items-center gap-2 group-hover:gap-3 group-hover:text-iesu-red transition-all">
                      Haberin Devamı <ArrowRight size={18} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in flex flex-col">
            {(selectedItem.img || selectedItem.image || selectedItem.imageUrl) && (
              <div className="w-full h-64 bg-gray-100 shrink-0 relative">
                <img src={selectedItem.img || selectedItem.image || selectedItem.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedItem.title || 'Detay')}&background=random`} alt={selectedItem.title} onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedItem.title || 'Detay')}&background=random&size=512`; }} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-gray-900 shadow-sm transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {!selectedItem.img && !selectedItem.image && !selectedItem.imageUrl && (
              <div className="w-full flex justify-end p-4 shrink-0 absolute top-0 right-0 z-20">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-900 shadow-sm transition-all"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className={`p-8 ${!selectedItem.img && !selectedItem.image ? 'pt-14' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-iesu-red/10 text-iesu-red text-xs font-black uppercase tracking-wider rounded-lg border border-red-100">
                  {selectedItem.type === 'egitim' ? 'Eğitim Programı' : selectedItem.type === 'duyuru' ? 'Duyuru' : 'Haber'}
                </span>
                {selectedItem.date && <span className="text-gray-500 font-bold text-sm flex items-center gap-1.5"><Calendar size={14} /> {selectedItem.date}</span>}
                
                {selectedItem.type === 'egitim' && (
                  <span className={`px-3 py-1 text-white text-xs font-black rounded-lg shadow-sm ${selectedItem.isFree || selectedItem.isFree === undefined ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {selectedItem.isFree || selectedItem.isFree === undefined ? 'ÜCRETSİZ' : (selectedItem.price || 'ÜCRETLİ')}
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">{selectedItem.title}</h2>
              
              <div className="text-gray-600 font-medium leading-relaxed bg-gray-50 rounded-2xl p-6 border border-gray-100">
                {selectedItem.desc || selectedItem.content || "Detaylı içerik bulunamadı. Lütfen daha fazla bilgi için Kariyer Merkezimizle veya Sürekli Eğitim Merkezi ile iletişime geçiniz."}
              </div>

              {selectedItem.type === 'egitim' && (
                <div className="mt-8 flex justify-end">
                  <button onClick={() => { alert('Ön kayıt sistemine yönlendiriliyorsunuz...'); setSelectedItem(null); }} className="bg-iesu-red hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(211,47,47,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
                    Programa Ön Kayıt Yap <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
