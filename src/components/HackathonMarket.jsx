import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Terminal, Users, Trophy, ChevronLeft, Rocket, Zap, 
  ArrowRight, Star, Building2, Calendar, Target, Plus, X, 
  CheckCircle, Sparkles, UserPlus, Info
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const HACKATHONS = [
  { id: 1, title: 'Akıllı Kampüs İnovasyon Maratonu', company: 'Esenyurt Teknopark', prize: '₺50.000 Hibe Desteği', deadline: '2 Gün Kaldı', type: 'Sürdürülebilirlik', participants: 142, status: 'active', color: 'blue' },
  { id: 2, title: 'Finansal Teknolojiler (Fintech) Hackathonu', company: 'Garanti BBVA Teknoloji', prize: 'Staj + Mac M3', deadline: '5 Gün Kaldı', type: 'Finans & Web3', participants: 85, status: 'active', color: 'emerald' },
  { id: 3, title: 'Otonom Araç Sistemleri AR-GE Kampı', company: 'Ford Otosan', prize: 'Tam Zamanlı İş Teklifi', deadline: 'Kayıtlar Açık', type: 'Yapay Zeka & IoT', participants: 56, status: 'upcoming', color: 'purple' },
];

const MOCK_TEAMMATES = [
  { id: 1, name: 'Buse Demir', dept: 'Yazılım Müh.', role: 'Frontend Developer', compatibility: 96 },
  { id: 2, name: 'Can Korkmaz', dept: 'Bilgisayar Müh.', role: 'Backend Developer', compatibility: 92 },
  { id: 3, name: 'Selin Yıldız', dept: 'Yönetim Bilişim', role: 'UI/UX Designer', compatibility: 88 },
];

export default function HackathonMarket({ setView, currentUser, userRole, setSelectedUserId }) {
  const [hackathonsList, setHackathonsList] = useState(HACKATHONS);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [teamForm, setTeamForm] = useState({ teamName: '', projectName: '', members: [] });

  const handleOpenTeamModal = (hack) => {
    setSelectedHackathon(hack);
    setShowTeamModal(true);
  };

  const handleToggleMember = (member) => {
    const isSelected = teamForm.members.find(m => m.id === member.id);
    if (isSelected) {
      setTeamForm({ ...teamForm, members: teamForm.members.filter(m => m.id !== member.id) });
    } else {
      setTeamForm({ ...teamForm, members: [...teamForm.members, member] });
    }
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!teamForm.teamName || !teamForm.projectName) {
      window.toast && window.toast.error("Lütfen takım ve proje isimlerini girin.");
      return;
    }

    setHackathonsList(prev => prev.map(hack => {
      if (hack.id === selectedHackathon.id) {
        return { ...hack, participants: hack.participants + 1 };
      }
      return hack;
    }));

    setShowTeamModal(false);
    setTeamForm({ teamName: '', projectName: '', members: [] });
    window.toast && window.toast.success(`🚀 "${teamForm.teamName}" takımı başarıyla kuruldu ve hackathona kayıt yapıldı!`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
              <Rocket className="text-white" size={16} />
            </div>
            <div>
              <h1 className="font-black text-red-950 leading-tight">İnovasyon & Proje Pazarı</h1>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 lg:p-8 flex flex-col">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-red-950 via-indigo-950 to-red-950 rounded-3xl p-8 md:p-12 shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 text-white">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-red-500/5 skew-x-12 transform origin-bottom pointer-events-none"></div>
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-[10px] font-black uppercase tracking-wider mb-6 border border-white/20">
              <Target size={14} /> Fikrini Projeye Dönüştür
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              Sektör Liderleriyle <br/><span className="text-indigo-400">Geleceği Kodla.</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-xl leading-relaxed">
              Öncü şirketlerin düzenlediği kurumsal hackathonlara katılın, gerçek dünya problemlerini çözün ve doğrudan iş/staj teklifleri kazanın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  window.toast && window.toast.info("Yetkinlik Analizi Yapılıyor...");
                  setTimeout(() => {
                    window.toast && window.toast.success("✅ Yetkinliklerinize en uygun 3 takım arkadaşı bulundu. Eşleşme yüzdeleri: %92, %88, %85");
                  }, 2000);
                }}
                className="bg-red-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition shadow-lg"
              >
                <Zap size={16} /> Takım Arkadaşı Bul
              </button>
            </div>
          </div>

          <div className="hidden lg:flex w-64 h-64 bg-white/5 border border-white/10 backdrop-blur rounded-3xl relative z-10 p-6 flex-col justify-center items-center">
             <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-400">
               <Trophy size={28} className="text-white" />
             </div>
             <Code2 size={56} className="text-indigo-400 mb-6" />
             <div className="text-center w-full bg-red-950/50 p-4 rounded-2xl border border-white/10">
               <div className="text-white font-black text-xs mb-1">Kurumsal İnovasyon</div>
               <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">3 Aktif Yarışma</div>
             </div>
          </div>
        </div>

        {/* Hackathons List */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
            <Building2 className="text-red-600" size={20} /> Kurumsal Yarışmalar
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathonsList.map(hack => (
            <div key={hack.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200/50 flex items-center gap-1">
                  <Calendar size={12} /> {hack.deadline}
                </span>
                <span className="text-[10px] text-red-600 font-bold px-2.5 py-1 bg-indigo-50 border border-indigo-100/50 rounded-md">
                  {hack.type}
                </span>
              </div>
              
              <h4 className="text-md sm:text-base font-black text-red-950 mb-1 group-hover:text-red-600 transition-colors line-clamp-2">{hack.title}</h4>
              <p className="text-xs text-slate-400 font-bold mb-6">{hack.company}</p>
              
              <div className="flex flex-col gap-3 text-xs mb-6 flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                 <div className="flex items-center justify-between font-bold">
                   <span className="text-slate-500 flex items-center gap-1.5"><Users size={16}/> Başvuru:</span>
                   <span className="text-red-900">{hack.participants} Takım</span>
                 </div>
                 <div className="w-full h-px bg-slate-200"></div>
                 <div className="flex items-center justify-between font-bold">
                   <span className="text-slate-500 flex items-center gap-1.5"><Star size={16}/> Ödül:</span>
                   <span className="text-emerald-600">{hack.prize}</span>
                 </div>
              </div>

              <div className="flex gap-2 w-full mt-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.toast && window.toast.info(`Anka AI: Profiliniz ve "${hack.title}" teması analiz ediliyor...`);
                    setTimeout(() => {
                      window.toast && window.toast.success("💡 AI Fikri: 'IoT tabanlı akıllı atık yönetimi sistemi'. Şansınız: Yüksek.");
                    }, 2500);
                  }}
                  className="w-12 h-12 bg-indigo-50 hover:bg-indigo-100 text-red-600 rounded-2xl border border-indigo-200 flex items-center justify-center transition shrink-0"
                  title="Proje Fikri Üret"
                >
                  <Sparkles size={18} />
                </button>
                <button 
                  onClick={() => handleOpenTeamModal(hack)}
                  className="flex-1 py-3 bg-red-600 text-white hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2"
                >
                  Takım Kur & Katıl <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Team Creation Modal */}
      <AnimatePresence>
        {showTeamModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTeamModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-black text-slate-950 text-base">Katılım Takımı Kur</h3>
                  <span className="text-[10px] text-slate-400 font-bold">{selectedHackathon?.title}</span>
                </div>
                <button onClick={() => setShowTeamModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Takım Adı</label>
                  <input 
                    type="text" 
                    value={teamForm.teamName} 
                    onChange={e => setTeamForm({...teamForm, teamName: e.target.value})}
                    placeholder="Örn: Gen Z Innovators"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Proje Konusu</label>
                  <input 
                    type="text" 
                    value={teamForm.projectName} 
                    onChange={e => setTeamForm({...teamForm, projectName: e.target.value})}
                    placeholder="Örn: Blokzincir Tabanlı Karne Sistemi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Önerilen Takım Arkadaşları Ekle</label>
                  <div className="space-y-2 mt-1">
                    {MOCK_TEAMMATES.map(member => {
                      const isAdded = teamForm.members.find(m => m.id === member.id);
                      return (
                        <div key={member.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div>
                            <h5 className="font-bold text-xs text-red-900">{member.name} <span className="text-[9px] text-red-600 bg-indigo-50 px-1 py-0.5 rounded font-black">%{member.compatibility} Eşleşme</span></h5>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{member.role} • {member.dept}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleMember(member)}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${isAdded ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {isAdded ? <X size={14} /> : <UserPlus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition shadow-lg mt-4"
                >
                  Kayıt Yap ve Katıl
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
