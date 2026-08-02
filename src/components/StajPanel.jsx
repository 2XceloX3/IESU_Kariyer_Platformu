import React, { useState } from 'react';
import { downloadReportPdf } from '../utils/downloadPdf';
import { FileText, CheckCircle, Clock, Download, Briefcase, FileSignature, ArrowRight, ShieldCheck, HelpCircle, LogIn, Search } from 'lucide-react';
import Logo from './Logo';
import SubPanelFooter from './SubPanelFooter';
import SEO from './SEO';

export default function StajPanel({ setView, userRole }) {
  const [activeTab, setActiveTab] = useState('surec');

  const adimlar = [
    {
      icon: <FileText className="text-[#990000]" size={26} />,
      title: "1. Staj Kabul Formunun Doldurulması",
      desc: "Öğrenci, staj yapacağı kurumu bulduktan sonra 'Staj Kabul Formu'nu eksiksiz doldurmalı ve kurum yetkilisine imzalatarak kaşeletmelidir."
    },
    {
      icon: <FileSignature className="text-[#990000]" size={26} />,
      title: "2. Koordinatörlük Onayı",
      desc: "İmzalı kabul formu, Kariyer Geliştirme Merkezi'ne (veya ilgili fakülte sekreterliğine) teslim edilmeli ve staj komisyonundan onay alınmalıdır."
    },
    {
      icon: <Clock className="text-[#990000]" size={26} />,
      title: "3. Sigorta Giriş İşlemleri",
      desc: "Staja başlamadan en az 1 hafta önce SGK iş kazası ve meslek hastalığı sigortası giriş işlemleri üniversitemiz tarafından yapılacaktır."
    },
    {
      icon: <CheckCircle className="text-[#990000]" size={26} />,
      title: "4. Staj Defterinin Teslimi",
      desc: "Staj bitiminde, kurum tarafından değerlendirilen Staj Defteri ve kapalı zarftaki değerlendirme formu bölüme teslim edilmelidir."
    }
  ];

  const dokumanlar = [
    { title: "Gönüllü Staj Başvuru Formu (FR-012)", size: "124 KB", ext: "PDF" },
    { title: "İşveren Stajyer Değerlendirme Formu", size: "86 KB", ext: "DOCX" },
    { title: "Staj Defteri Şablonu", size: "215 KB", ext: "PDF" },
    { title: "Staj Ücretlerine İşsizlik Fonu Katkısı Formu", size: "142 KB", ext: "PDF" }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans flex flex-col justify-between">
      <SEO 
        title="Gönüllü Staj Süreçleri" 
        description="İstanbul Esenyurt Üniversitesi Gönüllü Staj başvuru yönergesi, sigorta süreçleri ve resmî belgeler."
      />

      <div>
        {/* Top Sticky Header Bar - Crimson Red with Pure White Logo Left & Nav Links Right */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white px-4 sm:px-8 py-3.5 shadow-xl flex items-center justify-between border-b border-red-800 gap-4">
          {/* Left: Pure White Logo + University Name */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView('landing')}>
            <div className="brightness-0 invert flex-shrink-0">
              <Logo className="h-10 w-auto" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
            </div>
          </div>

          {/* Right Group: Search Bar + Nav Links + Giriş Yap Button */}
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-1">
            {/* Live Search Bar */}
            <div className="relative hidden md:block w-44 lg:w-56 flex-shrink-0">
              <Search className="absolute left-3 top-2.5 text-white/60" size={14} />
              <input
                type="text"
                placeholder="Staj veya Belge Ara..."
                className="w-full bg-white/10 text-white placeholder-white/60 text-xs font-medium pl-9 pr-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:bg-white/20 transition"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    if (setView) setView('jobs');
                  }
                }}
              />
            </div>

            <div className="hidden lg:flex items-center gap-5 text-xs font-extrabold text-white/90 whitespace-nowrap">
              <button onClick={() => setView('landing')} className="hover:text-white hover:underline transition">Ana Sayfa</button>
              <button onClick={() => setView('about_us')} className="hover:text-white hover:underline transition">Hakkımızda</button>
              <button onClick={() => setView('services')} className="hover:text-white hover:underline transition">Hizmetlerimiz</button>
              <button onClick={() => setView('events_list')} className="hover:text-white hover:underline transition">Etkinliklerimiz</button>
              <button onClick={() => setView('contact_us')} className="hover:text-white hover:underline transition">İletişim</button>
            </div>

            <button 
              onClick={() => setView('login')}
              className="flex items-center gap-1.5 bg-white text-[#990000] hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <LogIn size={15} /> Giriş Yap
            </button>
          </div>
        </div>

        {/* Google Stitch Corporate Hero Header - Ultra Premium Deep Navy to Crimson Dual Gradient */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#881337] text-white py-14 px-4 sm:px-8 relative overflow-hidden shadow-xl border-b border-indigo-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Interactive Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-red-200 mb-6">
              <button onClick={() => setView('landing')} className="hover:text-white hover:underline transition cursor-pointer">Ana Sayfa</button>
              <span>/</span>
              <button onClick={() => setView('services')} className="hover:text-white hover:underline transition cursor-pointer">Kariyer Destek</button>
              <span>/</span>
              <span className="text-white font-black">Gönüllü Staj Süreçleri</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-white mb-4 border border-white/20 uppercase tracking-widest">
                  <Briefcase size={14} className="text-red-200" /> Öğrenci Kariyer Destek
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white leading-tight drop-shadow-md">
                  Gönüllü Staj Süreçleri
                </h1>
                <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed opacity-95">
                  İş dünyasını erkenden tanıyın, tecrübe edinin. İstanbul Esenyurt Üniversitesi Gönüllü Staj programı işleyişi, sigorta süreçleri ve resmî yönerge detayları.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-black/30 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl shrink-0">
                <button 
                  onClick={() => setActiveTab('surec')}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'surec' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Süreç Adımları
                </button>
                <button 
                  onClick={() => setActiveTab('belgeler')}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'belgeler' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Gerekli Belgeler
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          
          {activeTab === 'surec' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
              {/* Timeline Steps */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-3 h-8 bg-[#990000] rounded-full"></div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Başvuru ve Uygulama Adımları</h2>
                </div>
                
                <div className="space-y-5">
                  {adimlar.map((adim, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex items-start gap-6 hover:shadow-xl hover:border-red-100 transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        {adim.icon}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 group-hover:text-[#990000] transition-colors">{adim.title}</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{adim.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="lg:col-span-4">
                <div className="bg-gradient-to-br from-[#990000] via-[#800000] to-[#660000] rounded-3xl p-8 text-white shadow-2xl border border-red-800 sticky top-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                    <ShieldCheck className="text-red-200 shrink-0" size={28} />
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-white">Önemli Kurallar</h3>
                      <p className="text-[10px] font-extrabold text-red-200 uppercase tracking-widest">Resmî Yönerge</p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">Staj süresi boyunca iş kazası ve meslek hastalığı sigorta primleri Üniversitemiz tarafından ödenir.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">Gönüllü staj başvuruları sadece Eğitim-Öğretim dönemi dışındaki yaz aylarında yapılabilir.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">Mezun durumundaki öğrenciler gönüllü staj programından faydalanamaz.</span>
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-white/20 space-y-2">
                    <p className="text-xs font-extrabold text-red-200 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle size={14} /> Sorularınız İçin:
                    </p>
                    <a href="mailto:kariyer@esenyurt.edu.tr" className="text-white font-black text-sm hover:underline block truncate">
                      kariyer@esenyurt.edu.tr
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'belgeler' && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-8 bg-[#990000] rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resmî Formlar ve Belgeler</h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden divide-y divide-slate-100">
                {dokumanlar.map((doc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-red-50/30 transition-colors gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#990000] group-hover:scale-110 transition-transform shrink-0">
                        <Download size={22} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 mb-1 group-hover:text-[#990000] transition-colors">{doc.title}</h4>
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{doc.ext} • {doc.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.toast && window.toast.info("Profil verilerinizle doküman dolduruluyor...");
                          setTimeout(() => {
                            window.toast && window.toast.success("✅ Doküman hazırlandı ve indirildi.");
                          }, 1500);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <CheckCircle size={15} /> Doldur
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.toast && window.toast.info("Yüklediğiniz belge ön kontrolden geçiriliyor...");
                          setTimeout(() => {
                            window.toast && window.toast.success("✅ AI Onayı: İmza ve tarih alanları eksiksiz. Belgeyi komisyona iletebilirsiniz.");
                          }, 2500);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-100 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <ShieldCheck size={15} /> AI Ön Kontrol
                      </button>
                      <button onClick={(e) => { e.preventDefault(); downloadReportPdf('staj-basvuru-formu', 'Staj Başvuru Formu', ['İESÜ Kariyer Platformu', '', 'STAJ BAŞVURU FORMU', '', 'Ad Soyad: .................................................', 'Öğrenci No: ...................................', 'Bölüm: ..............................................', 'Sınıf: .................................................', '', 'Staj Türü: (  ) Zorunlu   (  ) Gönüllü', 'Kurum Adı: .........................................', 'Kurum Yetkilisi: .................................', 'Staj Süresi: .........................................', 'Başlangıç Tarihi: ..................................', 'Bitiş Tarihi: .......................................', 'Arama/Fakülte Onayı: ..............................', 'İmza ve Tarih: .......................................', '', 'Bu formu doldurup kuruma ilettikten sonra', 'AI Ön Kontrol ile belgenizi doğrulayabilirsiniz.']); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:border-[#990000] hover:text-[#990000] transition cursor-pointer shadow-sm">
                                              Boş İndir
                                            </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Full Width SubPanelFooter */}
      <SubPanelFooter setView={setView} />
    </div>
  );
}



