import React, { useState } from 'react';
import { 
  UserCircle2, GraduationCap, Briefcase, Award, Languages, 
  FileText, LogOut, ChevronDown, ChevronRight, CheckCircle2, 
  Save, AlertCircle, RefreshCw, UploadCloud, FileBadge, Map, Globe2
} from 'lucide-react';

export default function AlumniInformationSystem({ currentUser, setView, setAlumni }) {
  const [activeSection, setActiveSection] = useState('ozluk');
  const [isPersonalOpen, setIsPersonalOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    tc: currentUser?.tc || '',
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    birthDate: '',
    yoksisStatus: 'Senkronize Değil'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (window.toast) {
        window.toast.success("Bilgileriniz başarıyla güncellendi.");
      }
    }, 1500);
  };

  const handleYoksisSync = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setFormData(prev => ({ ...prev, yoksisStatus: 'Senkronize Edildi (Bugün)' }));
      if (window.toast) {
        window.toast.success("YÖKSİS verileriniz başarıyla senkronize edildi!");
      }
    }, 2000);
  };

  const SidebarItem = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-[#1f2937] text-white flex flex-col shrink-0 min-h-screen border-r border-gray-800">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/iesu-logo.svg" alt="IESU Logo" className="w-10 h-10 bg-white rounded-full p-1" />
            <div>
              <h1 className="text-sm font-bold leading-tight">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Mezun Bilgi Sistemi</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Kişisel Bilgiler Accordion */}
          <div className="mb-2">
            <button 
              onClick={() => setIsPersonalOpen(!isPersonalOpen)}
              className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCircle2 size={18} />
                Kişisel Bilgiler
              </div>
              {isPersonalOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isPersonalOpen && (
              <div className="bg-[#111827] py-2 flex flex-col">
                <button onClick={() => setActiveSection('ozluk')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'ozluk' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Özlük Bilgileri</button>
                <button onClick={() => setActiveSection('akademik')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'akademik' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Akademik Eğitim Bilgileri</button>
                <button onClick={() => setActiveSection('kurs')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'kurs' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Kurs/Eğitim/Seminer/Kongre</button>
                <button onClick={() => setActiveSection('sertifika')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'sertifika' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Sertifika/Belge ve Eğitim Prog.</button>
                <button onClick={() => setActiveSection('staj')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'staj' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>İş / Staj Tecrübeleri</button>
                <button onClick={() => setActiveSection('sinav')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'sinav' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Sınav Bilgileri</button>
                <button onClick={() => setActiveSection('dil')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'dil' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Yabancı Dil Bilgileri</button>
                <button onClick={() => setActiveSection('odul')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'odul' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>Alınan Ödüller</button>
                <button onClick={() => setActiveSection('yoksis')} className={`text-left px-11 py-2 text-xs font-medium transition-colors ${activeSection === 'yoksis' ? 'text-white border-l-2 border-blue-500 bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>YÖKSİS Bilgileri</button>
              </div>
            )}
          </div>

          <button onClick={() => {}} className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2"><FileText size={18} /> Özgeçmiş</div><ChevronRight size={16} />
          </button>
          <button onClick={() => {}} className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2"><FileBadge size={18} /> Diploma</div><ChevronRight size={16} />
          </button>
          <button onClick={() => {}} className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2"><Briefcase size={18} /> Müfredat Bilgi Paketi</div><ChevronRight size={16} />
          </button>
          <button onClick={() => {}} className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-2"><LogOut size={18} /> İlişik Kesme Talebi</div><ChevronRight size={16} />
          </button>
          <button onClick={() => setActiveSection('map')} className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-colors ${activeSection === 'map' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
            <div className="flex items-center gap-2"><Map size={18} /> Dünyadaki Mezunlarımız</div><ChevronRight size={16} />
          </button>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <button onClick={() => setView('landing')} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
            <LogOut size={14} /> Çıkış Yap
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white">
          <h2 className="text-lg font-black text-gray-800 capitalize tracking-tight">
            {activeSection === 'ozluk' && 'Özlük Bilgileri'}
            {activeSection === 'yoksis' && 'YÖKSİS Entegrasyonu'}
            {activeSection === 'akademik' && 'Akademik Eğitim Bilgileri'}
            {activeSection === 'staj' && 'İş / Staj Tecrübeleri'}
            {activeSection === 'map' && 'Dünyadaki Mezunlarımız (Harita Analitiği)'}
            {!['ozluk', 'yoksis', 'akademik', 'staj', 'map'].includes(activeSection) && 'Profil Yönetimi'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-700">MBS Bağlantısı Aktif</span>
            </div>
            <button onClick={() => setView('alumni')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
              Kariyer Portalı'na Dön
            </button>
          </div>
        </header>

        {/* Dynamic Form Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#f8f9fa]">
          <div className={`mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 ${activeSection === 'map' ? 'max-w-6xl' : 'max-w-4xl'}`}>
            
            {activeSection === 'map' && (
              <div className="flex flex-col items-center animate-fade-in">
                <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                   <h3 className="text-xl font-black text-gray-900">Global Mezun Ağımız</h3>
                   <div className="flex flex-wrap gap-4 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                     <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-sm font-bold text-gray-700">Kuzey Amerika (450)</span></div>
                     <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-sm font-bold text-gray-700">Avrupa (1.200)</span></div>
                     <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-gray-700">Asya (300)</span></div>
                   </div>
                </div>
                
                {/* SVG MAP Placeholder */}
                <div className="w-full aspect-video bg-[#0B1121] rounded-3xl relative overflow-hidden flex items-center justify-center p-8 shadow-2xl border border-gray-800">
                  <Globe2 size={400} className="text-blue-900 absolute opacity-20" strokeWidth={0.5} />
                  
                  {/* Decorative Map Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

                  {/* PING DOTS */}
                  <div className="absolute top-[30%] left-[20%] group cursor-pointer z-10">
                    <span className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-4 h-4 bg-blue-500 rounded-full block border-2 border-[#0B1121] shadow-[0_0_15px_rgba(59,130,246,0.6)]"></span>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none">New York, ABD<br/><span className="text-gray-500 text-[10px]">450 Mezun</span></div>
                  </div>

                  <div className="absolute top-[25%] left-[55%] group cursor-pointer z-10">
                    <span className="absolute w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-4 h-4 bg-emerald-500 rounded-full block border-2 border-[#0B1121] shadow-[0_0_15px_rgba(16,185,129,0.6)]"></span>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none">Berlin, Almanya<br/><span className="text-gray-500 text-[10px]">1.200 Mezun</span></div>
                  </div>

                  <div className="absolute top-[40%] left-[75%] group cursor-pointer z-10">
                    <span className="absolute w-4 h-4 bg-amber-500 rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-4 h-4 bg-amber-500 rounded-full block border-2 border-[#0B1121] shadow-[0_0_15px_rgba(245,158,11,0.6)]"></span>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none">Tokyo, Japonya<br/><span className="text-gray-500 text-[10px]">85 Mezun</span></div>
                  </div>

                  <div className="absolute top-[35%] left-[50%] group cursor-pointer z-20">
                    <span className="absolute w-6 h-6 bg-iesu-red rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-6 h-6 bg-iesu-red rounded-full block border-2 border-white shadow-[0_0_20px_rgba(220,38,38,0.8)]"></span>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center">İstanbul, Türkiye<br/><span className="text-gray-500 text-[10px]">Merkez (42,500 Mezun)</span></div>
                  </div>

                </div>
                
                <p className="text-gray-500 text-sm mt-8 font-medium text-center max-w-2xl">Bu interaktif harita üzerinden mezunlarımızın hangi ülkelerde ve sektörlerde çalıştığını analiz edebilirsiniz. Yukarıdaki ping noktalarına tıklayarak veya üzerine gelerek bölge detaylarını inceleyebilirsiniz.</p>
              </div>
            )}

            {activeSection === 'ozluk' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="pb-4 border-b border-gray-100 mb-6">
                  <h3 className="text-base font-bold text-gray-900">Temel Kimlik Bilgileri</h3>
                  <p className="text-sm text-gray-500">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">TC Kimlik No</label>
                    <input type="text" value={formData.tc} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Ad Soyad</label>
                    <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">E-Posta Adresi</label>
                    <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Telefon Numarası</label>
                    <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">İkametgah Adresi</label>
                    <textarea rows="3" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button type="button" className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm">İptal</button>
                  <button type="submit" disabled={isSaving} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-sm">
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            {activeSection === 'yoksis' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">YÖKSİS Entegrasyonu</h3>
                    <p className="text-sm text-gray-500">Yükseköğretim Bilgi Sistemi ile senkronizasyon sağlayın.</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-3 max-w-sm">
                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-amber-800 leading-relaxed">
                      E-Devlet üzerinden alınan güncel mezuniyet bilgileriniz Kariyer Portalı'na aktarılacaktır.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <RefreshCw size={32} className={`text-blue-500 ${isSaving ? 'animate-spin' : ''}`} />
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-2">Durum: {formData.yoksisStatus}</h4>
                  <p className="text-sm text-gray-500 max-w-md mb-8">
                    Son senkronizasyon tarihiniz bulunmuyor. YÖKSİS verilerinizin Kariyer Platformu'nda (Örn: CV'nizde) onaylı gözükmesi için senkronize etmelisiniz.
                  </p>
                  <button onClick={handleYoksisSync} disabled={isSaving} className="px-8 py-3 bg-[#e60000] hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5">
                    {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    E-Devlet ile Senkronize Et
                  </button>
                </div>
              </div>
            )}

            {!['ozluk', 'yoksis', 'akademik', 'staj', 'map'].includes(activeSection) && (
              <div className="flex-1 overflow-y-auto p-8">
                <h3 className="text-xl font-bold mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
                  <p className="mb-4">Bu alan şu anda geliştirme aşamasındadır.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
