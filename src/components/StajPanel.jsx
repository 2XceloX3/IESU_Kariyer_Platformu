import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, Clock, Download, Briefcase, FileSignature } from 'lucide-react';

export default function StajPanel({ setView, userRole }) {
  const [activeTab, setActiveTab] = useState('surec');

  const adimlar = [
    {
      icon: <FileText className="text-iesu-primary" size={24} />,
      title: "1. Staj Kabul Formunun Doldurulması",
      desc: "Öğrenci, staj yapacağı kurumu bulduktan sonra 'Staj Kabul Formu'nu eksiksiz doldurmalı ve kurum yetkilisine imzalatarak kaşeletmelidir."
    },
    {
      icon: <FileSignature className="text-iesu-primary" size={24} />,
      title: "2. Koordinatörlük Onayı",
      desc: "İmzalı kabul formu, Kariyer Geliştirme Merkezi'ne (veya ilgili fakülte sekreterliğine) teslim edilmeli ve staj komisyonundan onay alınmalıdır."
    },
    {
      icon: <Clock className="text-iesu-primary" size={24} />,
      title: "3. Sigorta Giriş İşlemleri",
      desc: "Staja başlamadan en az 1 hafta önce SGK iş kazası ve meslek hastalığı sigortası giriş işlemleri üniversitemiz tarafından yapılacaktır."
    },
    {
      icon: <CheckCircle className="text-iesu-primary" size={24} />,
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
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-iesu-navy text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://panel.esenyurt.edu.tr/assets/2026/resimler/kurumsaliletisim/62874c3cf50e414a8630cf9be5f17172_aa25bf7819ce46e4b5208f35658a624f.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#990000]/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => {
              if (!userRole) { setView('landing'); return; }
              if (userRole === 'employer') { setView('company'); return; }
              setView(userRole === 'admin' ? 'admin' : userRole);
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition font-medium mb-8 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-md w-fit border border-white/10"
          >
            <ArrowLeft size={18} /> Ana Sayfaya Dön
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[13px] font-bold text-white mb-4 border border-white/20">
                <Briefcase size={14} /> Öğrenci Kariyer Destek
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-4 tracking-tight drop-shadow-md">Gönüllü Staj Süreçleri</h1>
              <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                İş dünyasını erkenden tanıyın, tecrübe edinin. İstanbul Esenyurt Üniversitesi Gönüllü Staj programı işleyiş ve yönerge detayları.
              </p>
            </div>
            
            <div className="flex bg-black/20 p-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <button 
                onClick={() => setActiveTab('surec')}
                className={`px-6 py-2.5 rounded-lg font-bold text-[14px] transition-all flex items-center gap-2 ${activeTab === 'surec' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:bg-white/10'}`}
              >
                Süreç Adımları
              </button>
              <button 
                onClick={() => setActiveTab('belgeler')}
                className={`px-6 py-2.5 rounded-lg font-bold text-[14px] transition-all flex items-center gap-2 ${activeTab === 'belgeler' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:bg-white/10'}`}
              >
                Gerekli Belgeler
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {activeTab === 'surec' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Timeline */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-iesu-primary rounded-full"></span> Başvuru ve Uygulama Adımları
              </h2>
              
              <div className="space-y-6">
                {adimlar.map((adim, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      {adim.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-3">{adim.title}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{adim.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-iesu-navy to-iesu-navy rounded-xl p-8 text-white shadow-xl sticky top-8">
                <h3 className="text-2xl font-black mb-6">Önemli Notlar</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-red-200 flex-shrink-0 mt-1" size={20} />
                    <span className="text-[15px] font-medium text-red-50">Staj süresi boyunca iş kazası ve meslek hastalığı sigorta primleri Üniversitemiz tarafından ödenir.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-red-200 flex-shrink-0 mt-1" size={20} />
                    <span className="text-[15px] font-medium text-red-50">Gönüllü staj başvuruları sadece Eğitim-Öğretim dönemi dışındaki yaz aylarında yapılabilir.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-red-200 flex-shrink-0 mt-1" size={20} />
                    <span className="text-[15px] font-medium text-red-50">Mezun durumundaki öğrenciler gönüllü staj programından faydalanamaz.</span>
                  </li>
                </ul>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-[13px] text-red-200 font-bold mb-2">Sorularınız için:</p>
                  <a href="mailto:kariyer@esenyurt.edu.tr" className="text-white font-black text-lg hover:underline">kariyer@esenyurt.edu.tr</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'belgeler' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-gray-900 rounded-full"></span> Formlar ve Belgeler
            </h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {dokumanlar.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#990000] group-hover:scale-110 transition-transform">
                      <Download size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[16px] text-gray-900 mb-1">{doc.title}</h4>
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{doc.ext} • {doc.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info("Profil verilerinizle doküman dolduruluyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ Doküman hazırlandı ve indirildi.");
                        }, 1500);
                      }}
                      className="px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[13px] hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle size={16} /> AI ile Doldur
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info("Anka AI: Yüklediğiniz belge ön kontrolden geçiriliyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ AI Onayı: İmza ve tarih alanları eksiksiz. Belgeyi komisyona iletebilirsiniz.");
                        }, 2500);
                      }}
                      className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 font-bold text-[13px] hover:bg-red-100 transition-colors flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
                      AI Ön Kontrol
                    </button>
                    <button className="px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-600 font-bold text-[13px] hover:border-[#990000] hover:text-[#990000] transition-colors">
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
  );
}

