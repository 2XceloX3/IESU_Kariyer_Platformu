import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, MapPin, Search, ChevronLeft, ArrowRight, Video, Briefcase, CalendarClock, MessageSquare, Target, Star, ExternalLink, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';

const MOCK_COMPANIES = [
  {
    id: 'aselsan',
    name: 'ASELSAN',
    sector: 'Savunma Sanayii',
    logo: 'https://ui-avatars.com/api/?name=ASELSAN&background=0A2342&color=fff',
    activeRecruiters: 3,
    openPositions: 12,
    availableSlots: 4,
    isHiring: true,
    tags: ['Mühendislik', 'Ar-Ge', 'Yazılım'],
    description: 'Savunma sanayiinde küresel bir teknoloji şirketi olarak, yetenekli mühendisleri aramızda görmekten mutluluk duyarız.'
  },
  {
    id: 'getir',
    name: 'Getir',
    sector: 'Teknoloji & Lojistik',
    logo: 'https://ui-avatars.com/api/?name=Getir&background=5b21b6&color=fff',
    activeRecruiters: 2,
    openPositions: 8,
    availableSlots: 2,
    isHiring: true,
    tags: ['Teknoloji', 'Pazarlama', 'Veri'],
    description: 'Dünyada bir ilki gerçekleştirerek dakikalar içinde teslimat modelini yarattık. Global ekibimize katılın.'
  },
  {
    id: 'ford',
    name: 'Ford Otosan',
    sector: 'Otomotiv',
    logo: 'https://ui-avatars.com/api/?name=Ford&background=1e3a8a&color=fff',
    activeRecruiters: 4,
    openPositions: 25,
    availableSlots: 8,
    isHiring: true,
    tags: ['Üretim', 'Elektrik', 'Otomotiv'],
    description: 'Geleceğin elektrikli ve bağlantılı ticari araçlarını geliştirmek için vizyoner yetenekler arıyoruz.'
  },
  {
    id: 'trendyol',
    name: 'Trendyol',
    sector: 'E-Ticaret',
    logo: 'https://ui-avatars.com/api/?name=Trendyol&background=ea580c&color=fff',
    activeRecruiters: 5,
    openPositions: 40,
    availableSlots: 15,
    isHiring: true,
    tags: ['Yazılım', 'E-Ticaret', 'Lojistik'],
    description: 'Türkiye\'nin ilk decacorn\'u olarak, teknolojiyi odağımıza alarak e-ticaret deneyimini yeniden tanımlıyoruz.'
  }
];

export default function VirtualCareerFair({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('booths'); // booths, sessions, appointments
  const [myAppointments, setMyAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = MOCK_COMPANIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans flex flex-col pb-24">
      {/* Professional Corporate Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer"
              title="Geri Dön"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-auto text-[#990000]" />
              <div className="hidden sm:block">
                <h1 className="font-black text-gray-900 leading-tight">Dijital Kariyer Zirvesi 2026</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">İESÜ Kariyer Geliştirme Merkezi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Etkinlik Aktif</span>
            </div>
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1200px] mx-auto px-4 flex items-center gap-6 mt-2">
          {[
            { id: 'booths', label: 'Firma Stantları' },
            { id: 'sessions', label: 'Canlı Oturumlar' },
            { id: 'appointments', label: 'Randevularım' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-[#990000] text-[#990000]' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 lg:p-8">
        
        {/* Banner */}
        <div className="bg-[#990000] rounded-2xl p-8 mb-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-red-600/20 skew-x-12 transform origin-bottom pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-black mb-3">Geleceğin Liderleriyle Tanışın</h2>
            <p className="text-red-100 text-lg leading-relaxed">
              Türkiye'nin öncü firmalarının İK profesyonelleriyle doğrudan görüşün, staj ve iş fırsatlarını değerlendirin.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[120px]">
              <div className="text-2xl font-black text-white mb-1">45</div>
              <div className="text-xs font-bold text-red-200 uppercase tracking-wider">Katılımcı Firma</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[120px]">
              <div className="text-2xl font-black text-white mb-1">120+</div>
              <div className="text-xs font-bold text-red-200 uppercase tracking-wider">Açık Pozisyon</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'booths' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">Dijital Stantlar</h3>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.toast && window.toast.info("Akıllı Sistem: Özgeçmişiniz analiz ediliyor...");
                    setTimeout(() => {
                      setSearchQuery('Yazılım');
                      window.toast && window.toast.success("✅ Yetkinliklerinize (React, Node.js) en uygun teknoloji firmaları filtrelendi.");
                    }, 1500);
                  }}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <Star size={14} /> Filtrele
                </button>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Firma veya sektör ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#990000] focus:border-transparent outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(company => (
                <div key={company.id} className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col h-full group">
                  <div className="flex items-start justify-between mb-4">
                    <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-xl border border-gray-100 shadow-xs" />
                    {company.isHiring && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Briefcase size={12} /> Aktif İşe Alım
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-[#990000] transition-colors">{company.name}</h4>
                  <p className="text-sm font-medium text-gray-500 mb-4">{company.sector}</p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {company.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {company.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <div className="text-sm font-black text-gray-900 mb-0.5">{company.openPositions}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Pozisyon</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <div className="text-sm font-black text-[#990000] mb-0.5">{company.availableSlots}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Boş Randevu</div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full mt-auto">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info(`"${company.name}" şirketinin geçmiş mülakat soruları derleniyor...`);
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ Mülakat Provası başlatıldı. İlk soru: 'Bize biraz kendinizden bahseder misiniz?'");
                        }, 2500);
                      }}
                      className="flex-1 py-2.5 bg-red-50 border-2 border-red-100 text-[#990000] hover:bg-red-100 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Mülakat Provası"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                    <button 
                      onClick={() => setSelectedCompany(company)}
                      className="flex-[3] py-2.5 bg-[#990000] text-white hover:bg-red-800 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      Standı Ziyaret Et <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canlı Oturumlar Mock */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <Video size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Canlı Oturumlar Saat 14:00'te Başlıyor</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Sektör liderlerinin katılacağı "Geleceğin Yetkinlikleri" paneli için yerinizi ayırttınız. Oturum saati geldiğinde buradan yayına katılabilirsiniz.
            </p>
          </div>
        )}

        {/* Randevularım Mock */}
                {activeTab === 'appointments' && (
                  myAppointments.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                    <CalendarIcon size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Randevunuz Yok</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Firma stantlarını ziyaret ederek İK temsilcileriyle birebir ön görüşme veya mülakat randevusu oluşturabilirsiniz.
                    </p>
                    <button onClick={() => setActiveTab('booths')} className="px-6 py-2.5 bg-[#0A66C2] text-white rounded-xl font-bold text-sm cursor-pointer">
                      Firma Stantlarına Git
                    </button>
                  </div>
                  ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <CalendarIcon size={22} className="text-[#0A66C2]" />
                      <div>
                        <h3 className="text-lg font-black text-gray-900">Randevularım</h3>
                        <p className="text-xs text-gray-500 font-medium">Onaylanan birebir görüşme ve mülakat randevularınız.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {myAppointments.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center font-black text-sm">VC</div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{a.company}</p>
                              <p className="text-xs text-gray-500 font-medium">Birebir Görüşme · {a.date} · {a.time}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  )
                )}

      </main>

      {/* Selected Company Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-12 h-12 rounded-xl border border-gray-100" />
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{selectedCompany.name} <span className="text-sm font-medium text-gray-500 font-normal">| Sanal Stant</span></h3>
                  </div>
                </div>
                <button onClick={() => setSelectedCompany(null)} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-8 flex-1">
                {/* About */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Building2 size={18} className="text-[#0A66C2]"/> Firma Hakkında</h4>
                  <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedCompany.description} {selectedCompany.name}, sektördeki liderliğini yenilikçi teknolojiler ve dinamik ekibiyle sürdürmektedir. 
                    Öğrenmeye açık, takım çalışmasına yatkın yeni yetenekleri aramızda görmekten heyecan duyuyoruz.
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      const slot = { id: Date.now(), company: selectedCompany?.name, date: 'Yaklaşan Fuar Günü', time: '14:30', status: 'Onaylandı' };
                      setMyAppointments(prev => [...prev, slot]);
                      setSelectedCompany(null);
                      setActiveTab('appointments');
                      window.toast && window.toast.success(`"${selectedCompany?.name}" İK temsilcisiyle randevunuz oluşturuldu.`);
                    }}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-[#990000] bg-[#990000] text-white rounded-xl font-bold hover:bg-red-800 transition cursor-pointer shadow-xs"
                  >
                    <CalendarClock size={20} /> 
                    Birebir Görüşme Randevusu Al
                  </button>
                  <button onClick={() => {
                    if (selectedCompany) window.toast && window.toast.success(`Mesajınız "${selectedCompany.name}" İK temsilcisine iletildi.`);
                  }} className="flex items-center justify-center gap-2 p-4 border-2 border-gray-200 bg-white text-gray-700 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer">
                    <MessageSquare size={20} />
                    İK Temsilcisine Mesaj Gönder
                  </button>
                </div>

                {/* Openings */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={18} className="text-[#990000]"/> Açık Pozisyonlar & İlanlar</h4>
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition">
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm mb-1">{i===1 ? 'Yazılım Mühendisi (Yeni Mezun)' : i===2 ? 'Proje Yönetimi Stajyeri' : 'Veri Analisti (Yarı Zamanlı)'}</h5>
                          <div className="flex gap-3 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin size={12} /> İstanbul / Hibrit</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> 2 gün önce</span>
                          </div>
                        </div>
                        <button className="mt-3 sm:mt-0 text-sm font-bold text-[#990000] hover:underline flex items-center gap-1 cursor-pointer">
                          İncele & Başvur <ExternalLink size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
        />
      )}
    </div>
  );
}

