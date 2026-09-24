import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, ChevronRight, Award, Megaphone, ArrowRight, ShieldCheck, MonitorPlay, X, Sparkles, Send, Lightbulb } from 'lucide-react';
import { toast } from './shared/Toast';
import useAppStore from '../store/useAppStore';
import CertificateVerifyModal from './CertificateVerifyModal';
import ParticipantStudentPortalModal from './ParticipantStudentPortalModal';

export default function SemPanel({ setView, userRole, currentUser }) {
  const { semCourses } = useAppStore();
  const [activeTab, setActiveTab] = useState('egitimler');
  const [selectedItem, setSelectedItem] = useState(null);

  // Yerel Modal Stateleri (Dış Linkler Yerine)
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showStudentPortalModal, setShowStudentPortalModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Eğitim Öneri Formu State
  const [suggestForm, setSuggestForm] = useState({
    title: '',
    category: 'Yazılım & Teknoloji',
    reason: '',
    format: 'Online'
  });

  const combinedEgitimler = semCourses || [];

  const haberler = [
    { title: "Dijital Pazarlama ve İleri Analitik Eğitim Kampı", date: "28/07/2026", img: "https://panel.esenyurt.edu.tr/assets/2026/resimler/hitm/2bc4c0e60e3b47caa79942047cfbfa2c_(375_300).jpg", desc: "Yeni dönem dijital pazarlama ve modern analitik araçları sertifika programımız için başvurular başladı." },
    { title: "Sertifikalarınız E-Devlet Onaylı Sistemde", date: "20/07/2026", img: "https://panel.esenyurt.edu.tr/assets/2026/resimler/hitm/e7a58ae4556c4fc7b8e8ece79e7dab4e_c55aa2c1fdb748f88ed58923c177ad35.jpg", desc: "Kariyer Akademimiz bünyesinde tamamladığınız sertifikalar e-Devlet kapısında doğrulanabilir barkod ile yayımlanmaktadır." },
    { title: "İş Dünyası İçin İleri Seviye Excel & Veri Analitiği", date: "15/07/2026", img: "https://panel.esenyurt.edu.tr/assets/2026/resimler/kurumsaliletisim/8722de546e4b4b5094898382e568ac94_e5a6d2495aab41beacc7391bf5d903ae.jpg", desc: "Sektör profesyonellerinin katılımıyla 4 haftalık uygulamalı Veri Analitiği atölyemiz açılıyor." }
  ];

  const duyurular = [
    { title: "Kariyer ve Yetenek Akademisi Sertifikalandırma Süreçleri Hakkında", date: "20/11/2026" },
    { title: "Kariyer Geliştirme Merkezi ve Sektörel İş Birlikleri Hususunda", date: "31/07/2026" }
  ];

  const handleSuggestSubmit = (e) => {
    e.preventDefault();
    if (!suggestForm.title || !suggestForm.reason) {
      toast.error("Lütfen eğitim başlığı ve talep nedenini giriniz.");
      return;
    }
    toast.success("Eğitim öneriniz Kariyer & Yetenek Akademisi kuruluna başarıyla iletildi!");
    setShowSuggestModal(false);
    setSuggestForm({ title: '', category: 'Yazılım & Teknoloji', reason: '', format: 'Online' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Modern High-End Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-16 px-4 relative overflow-hidden shadow-2xl border-b border-white/10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => {
              if (userRole === 'employer' || userRole === 'company') { setView('company'); return; }
              if (userRole === 'alumni') { setView('alumni'); return; }
              if (userRole === 'academic') { setView('academic'); return; }
              if (userRole === 'admin') { setView('admin'); return; }
              setView('student');
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition mb-6 cursor-pointer"
            title="Geri Dön"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 rounded-full text-xs font-black text-amber-300 mb-4 border border-amber-400/30 backdrop-blur-md uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-300" /> Kariyer & Yetenek Geliştirme Akademisi
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md">
                Kariyer ve Yetenek Akademisi
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                İESÜ Kariyer Geliştirme Merkezi bünyesinde hazırlanan, nitelikli iş gücü ve sektörel yetkinlikler kazandıran e-Devlet onaylı sertifika ve atölye portalı.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button 
                  onClick={() => setView && setView('smart_certs')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white rounded-xl font-bold text-xs transition border border-emerald-400/30 backdrop-blur-md cursor-pointer"
                >
                  <ShieldCheck size={16} /> Belge Doğrulama (e-Devlet)
                </button>
                <button 
                  onClick={() => setView && setView('smart_certs')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-slate-200 hover:bg-white hover:text-slate-900 rounded-xl font-bold text-xs transition border border-white/20 backdrop-blur-md cursor-pointer"
                >
                  <MonitorPlay size={16} /> Katılımcı Öğrenci Paneli
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setShowSuggestModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer border border-amber-300/50"
              >
                <Lightbulb size={18} className="fill-current" /> Eğitim Öner Formu
              </button>

              <div className="flex bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
                <button 
                  onClick={() => setActiveTab('egitimler')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'egitimler' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'}`}
                >
                  <BookOpen size={15} /> Eğitimler
                </button>
                <button 
                  onClick={() => setActiveTab('haberler')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'haberler' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'}`}
                >
                  <Megaphone size={15} /> Haberler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        
        {/* Eğitimler Tab */}
        {activeTab === 'egitimler' && (
          <div className="space-y-12 animate-fade-in">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Award className="text-slate-900" size={24} /> Tüm Sertifika ve Atölye Programları
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Aktif dönemde başvurabileceğiniz canlı ve e-öğrenme modülleri.</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
                  {combinedEgitimler.length} Eğitim Mevcut
                </span>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combinedEgitimler.map((egitim, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedItem({...egitim, type: 'egitim'})} 
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden relative bg-slate-100">
                      <img 
                        src={egitim.img || egitim.image || egitim.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(egitim.title || 'SEM')}&background=0F172A&color=fff`} 
                        alt={egitim.title} 
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(egitim.title || 'Eğitim')}&background=0F172A&color=fff&size=512`; }} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      <div className="absolute top-3 right-3 z-10">
                        {egitim.isFree === true ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
                            ÜCRETSİZ
                          </span>
                        ) : (
                          <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
                            {egitim.price || 'ÜCRETLİ'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Akademi Sertifika Programı</span>
                        <h3 className="font-black text-base text-slate-900 group-hover:text-indigo-900 transition-colors mb-2 leading-snug">{egitim.title}</h3>
                        <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">{egitim.desc || "Eğitim müfredatı ve başvuru süreci hakkında detaylar..."}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <span className="text-slate-900 font-bold text-xs group-hover:text-indigo-900 transition-colors flex items-center gap-1">
                          Program Detayı <ArrowRight size={14} />
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xs">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Announcements Panel */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xs border border-slate-200">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <Megaphone className="text-slate-900" size={22} /> Akademi Duyuruları & Önemli Tarihler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {duyurular.map((duyuru, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedItem({...duyuru, type: 'duyuru'})} 
                    className="flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-white transition-all duration-300 border border-slate-100 hover:border-slate-200 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-slate-800 border border-slate-200 shadow-xs group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Calendar size={20} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{duyuru.date}</span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-900 transition-colors leading-snug">{duyuru.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Haberler Tab */}
        {activeTab === 'haberler' && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
              <Megaphone size={24} className="text-slate-900" /> Akademi & Sektör Haberleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {haberler.map((haber, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedItem({...haber, type: 'haber'})} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-52 relative overflow-hidden bg-slate-100">
                    <img src={haber.img} alt={haber.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-[11px] flex items-center gap-1.5">
                      <Calendar size={13} /> {haber.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-black text-slate-900 mb-3 leading-snug group-hover:text-indigo-900 transition-colors">{haber.title}</h3>
                    <p className="text-slate-500 text-xs font-medium line-clamp-3 mb-4 leading-relaxed">{haber.desc}</p>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Haberin Devamı <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ─── EĞİTİM ÖNERİ FORMU MODAL ─── */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative">
            <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black">
                  <Lightbulb size={22} className="fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Eğitim & Atölye Öneri Formu</h3>
                  <p className="text-xs text-slate-300 font-medium">Açılmasını istediğiniz eğitimleri kurula bildirin</p>
                </div>
              </div>
              <button onClick={() => setShowSuggestModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSuggestSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Talep Edilen Eğitim / Atölye Başlığı *</label>
                <input 
                  required 
                  type="text" 
                  value={suggestForm.title} 
                  onChange={e => setSuggestForm({...suggestForm, title: e.target.value})} 
                  placeholder="Örn: Python ile Veri Bilimi, Prompt Engineering, UI/UX Tasarım..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Kategori</label>
                  <select 
                    value={suggestForm.category} 
                    onChange={e => setSuggestForm({...suggestForm, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition"
                  >
                    <option value="Yazılım & Teknoloji">Yazılım & Teknoloji</option>
                    <option value="Yapay Zeka & Veri">Yapay Zeka & Veri</option>
                    <option value="Tasarım & Kreatif">Tasarım & Kreatif</option>
                    <option value="Dijital Pazarlama">Dijital Pazarlama</option>
                    <option value="Yabancı Dil">Yabancı Dil</option>
                    <option value="Kişisel Gelişim">Kişisel Gelişim</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">Tercih Edilen Format</label>
                  <select 
                    value={suggestForm.format} 
                    onChange={e => setSuggestForm({...suggestForm, format: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition"
                  >
                    <option value="Online">Online / Webinar</option>
                    <option value="Yüz yüze Kampüs">Yüz Yüze (Kampüs)</option>
                    <option value="Hibrit">Hibrit Model</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">Bu Eğitime Neden İhtiyaç Duyuyorsunuz? *</label>
                <textarea 
                  required 
                  rows={3}
                  value={suggestForm.reason} 
                  onChange={e => setSuggestForm({...suggestForm, reason: e.target.value})} 
                  placeholder="Kariyer hedefleriniz, proje ihtiyaçlarınız veya staj beklentileriniz hakkında kısa açıklama ekleyin..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowSuggestModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} /> Öneriyi Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto relative z-10 border border-slate-100">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {selectedItem.type === 'egitim' ? 'Akademi Eğitimi' : 'Duyuru & Bilgilendirme'}
              </span>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedItem.title}</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">{selectedItem.desc || selectedItem.content || "Bu program İESÜ Kariyer ve Yetenek Akademisi kapsamında sertifikalı olarak yürütülmektedir."}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button 
                  onClick={() => {
                    toast.success("Eğitim ön kaydınız başarıyla alındı!");
                    setSelectedItem(null);
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Ön Kayıt Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yerel Sertifika & Belge Doğrulama Modalı */}
      <CertificateVerifyModal 
        isOpen={showVerifyModal} 
        onClose={() => setShowVerifyModal(false)} 
      />

      {/* Yerel Katılımcı Öğrenci Paneli Modalı */}
      <ParticipantStudentPortalModal 
        isOpen={showStudentPortalModal} 
        onClose={() => setShowStudentPortalModal(false)} 
        currentUser={currentUser} 
      />
    </div>
  );
}

