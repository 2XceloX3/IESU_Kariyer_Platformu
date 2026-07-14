import React, { useState } from 'react';
import { 
  UserCircle2, GraduationCap, Briefcase, Award, Languages, 
  FileText, LogOut, ChevronRight, CheckCircle2, 
  Save, RefreshCw, FileBadge, Map, Globe2, LayoutDashboard, Settings, Edit
} from 'lucide-react';
import { toast } from './shared/Toast';

export default function AlumniInformationSystem({ currentUser, setView }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSaving, setIsSaving] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    tc: currentUser?.tc || '',
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Bilgileriniz başarıyla güncellendi.");
    }, 1500);
  };

  const SidebarItem = ({ id, label, icon: Icon, isActive }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-xl mb-1 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
      {label}
      {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-[100dvh] bg-[#f8f9fa] font-sans flex relative overflow-hidden selection:bg-blue-500/30">
      {/* SIDEBAR - Inspired by AdminDashboard */}
      <div className="w-72 bg-[#0B1121] text-white flex flex-col shrink-0 min-h-screen border-r border-gray-800 relative z-20">
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black leading-tight text-white">IESU Alumni</h1>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Yönetim Paneli</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
          
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 px-4">Genel Bakış</p>
            <SidebarItem id="dashboard" label="Alumni Dashboard" icon={LayoutDashboard} isActive={activeSection === 'dashboard'} />
            <SidebarItem id="map" label="Global Ağ Analitiği" icon={Globe2} isActive={activeSection === 'map'} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 px-4">Profil Yönetimi</p>
            <SidebarItem id="ozluk" label="Özlük Bilgileri" icon={UserCircle2} isActive={activeSection === 'ozluk'} />
            <SidebarItem id="akademik" label="Akademik Eğitim" icon={GraduationCap} isActive={activeSection === 'akademik'} />
            <SidebarItem id="sertifika" label="Sertifika & Kurslar" icon={Award} isActive={activeSection === 'sertifika'} />
            <SidebarItem id="staj" label="İş / Staj Tecrübeleri" icon={Briefcase} isActive={activeSection === 'staj'} />
            <SidebarItem id="dil" label="Yabancı Dil Bilgileri" icon={Languages} isActive={activeSection === 'dil'} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 px-4">Belgeler</p>
            <SidebarItem id="ozgecmis" label="Özgeçmiş Yönetimi" icon={FileText} isActive={activeSection === 'ozgecmis'} />
            <SidebarItem id="mufredat" label="Müfredat Bilgi Paketi" icon={FileBadge} isActive={activeSection === 'mufredat'} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800/50 bg-[#0B1121]">
          <button onClick={() => setView('alumni')} className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <LogOut size={16} /> Portala Geri Dön
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-md z-10 sticky top-0">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {activeSection === 'dashboard' && 'Alumni Dashboard'}
              {activeSection === 'map' && 'Global Ağ Analitiği'}
              {activeSection === 'ozluk' && 'Özlük Bilgileri Yönetimi'}
              {activeSection === 'akademik' && 'Akademik Eğitim Yönetimi'}
              {activeSection === 'sertifika' && 'Sertifikasyon ve Eğitimler'}
              {activeSection === 'staj' && 'Kariyer ve Tecrübeler'}
              {activeSection === 'dil' && 'Dil Yetkinlikleri'}
              {activeSection === 'ozgecmis' && 'Özgeçmiş Veritabanı'}
              {activeSection === 'mufredat' && 'Müfredat Sistemi'}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">Mezun Bilgi Sistemi Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-sm font-bold text-blue-700">MBS Bağlantısı Aktif</span>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-700">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {activeSection === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <UserCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Profil Doluluk Oranı</p>
                    <p className="text-2xl font-black text-gray-900">%85</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Doğrulanmış Bilgi</p>
                    <p className="text-2xl font-black text-gray-900">4 Adet</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500">Kariyer Fırsatları</p>
                    <p className="text-2xl font-black text-gray-900">12 Yeni</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                 <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><Settings size={20} className="text-gray-400" /> Hızlı İşlemler</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setActiveSection('ozluk')} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <Edit size={18} className="text-blue-500" />
                        <span className="font-bold text-gray-700">Özlük Bilgilerini Güncelle</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button onClick={() => setActiveSection('ozgecmis')} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-emerald-500" />
                        <span className="font-bold text-gray-700">Özgeçmişini Yenile</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </button>
                 </div>
              </div>
            </div>
          )}

          {activeSection === 'map' && (
            <div className="max-w-6xl mx-auto flex flex-col items-center animate-fade-in bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><Map className="text-blue-600" /> Global Mezun Ağımız</h3>
                  <div className="flex flex-wrap gap-4 bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-sm font-bold text-gray-700">Kuzey Amerika (450)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-sm font-bold text-gray-700">Avrupa (1.200)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-gray-700">Asya (300)</span></div>
                  </div>
              </div>
              
              {/* SVG MAP Placeholder */}
              <div className="w-full aspect-[21/9] bg-[#0B1121] rounded-3xl relative overflow-hidden flex items-center justify-center p-8 shadow-2xl border border-gray-800">
                <Globe2 size={500} className="text-blue-900 absolute opacity-20" strokeWidth={0.5} />
                
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
                  <span className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></span>
                  <span className="relative w-6 h-6 bg-red-500 rounded-full block border-2 border-white shadow-[0_0_20px_rgba(239,68,68,0.8)]"></span>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center">İstanbul, Türkiye<br/><span className="text-gray-500 text-[10px]">Merkez (42,500 Mezun)</span></div>
                </div>

              </div>
              
              <p className="text-gray-500 text-sm mt-8 font-medium text-center max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">Bu interaktif harita üzerinden mezunlarımızın hangi ülkelerde ve sektörlerde çalıştığını analiz edebilirsiniz. Yukarıdaki ping noktalarına tıklayarak veya üzerine gelerek bölge detaylarını inceleyebilirsiniz.</p>
            </div>
          )}

          {activeSection === 'ozluk' && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-fade-in">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="pb-4 border-b border-gray-100 mb-6">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><UserCircle2 className="text-blue-600" /> Temel Kimlik Bilgileri</h3>
                  <p className="text-sm text-gray-500 mt-1">Kişisel bilgilerinizi buradan güvenle güncelleyebilirsiniz.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">TC Kimlik No</label>
                    <input type="text" value={formData.tc} disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Ad Soyad</label>
                    <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">E-Posta Adresi</label>
                    <input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Telefon Numarası</label>
                    <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">İkametgah Adresi</label>
                    <textarea rows="3" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
                  <button type="button" className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm border border-transparent hover:border-gray-200">İptal</button>
                  <button type="submit" disabled={isSaving} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40">
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {!['dashboard', 'map', 'ozluk'].includes(activeSection) && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center mx-auto mb-6">
                 <Settings size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Modül Geliştirme Aşamasında</h3>
              <p className="text-gray-500 font-medium max-w-md mx-auto">
                Bu modül, platformun yeni yapısına uygun olarak yapılandırılmaktadır. Kısa süre içerisinde aktif edilecektir.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
