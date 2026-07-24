import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, Check, X, Users, ChevronLeft, ArrowRight, BarChart3, 
  Clock, Vote, Plus, ClipboardList, Coins, ShieldAlert, BadgeCheck, FileText
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const INITIAL_PROPOSALS = [
  { id: 1, title: 'Bahar Şenlikleri Sanal Gerçeklik Sahnesi Kurulumu', author: 'Oğuzhan K. (2018 Mezunu)', category: 'Kampüs & Etkinlik', date: '3 Gün Kaldı', for: 1240, against: 150, status: 'active' },
  { id: 2, title: 'Yeni Nesil Web3 Seçmeli Dersinin Müfredata Eklenmesi', author: 'Doç. Dr. Ayşe M.', category: 'Eğitim & Ders', date: 'Oylama Kapandı', for: 890, against: 45, status: 'passed' },
  { id: 3, title: 'Silikon Vadisi Mezunlar Evi Fonlaması', author: 'Global Esenyurt Derneği', category: 'Sosyal & Ağ', date: '5 Gün Kaldı', for: 420, against: 600, status: 'active' },
];

export default function AlumniDAO({ setView, currentUser, userRole, setSelectedUserId }) {
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [voted, setVoted] = useState({});
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', category: 'Eğitim & Ders', budget: '', desc: '' });

  const handleVote = (id, type) => {
    if (voted[id]) return;
    
    setVoted(prev => ({ ...prev, [id]: type }));
    setProposals(prev => prev.map(prop => {
      if (prop.id === id) {
        return {
          ...prop,
          for: type === 'for' ? prop.for + 1 : prop.for,
          against: type === 'against' ? prop.against + 1 : prop.against
        };
      }
      return prop;
    }));
    
    window.toast && window.toast.success("🗳️ Oyunuz akıllı kontrata kaydedildi ve imzalandı!");
  };

  const handleAddProposal = (e) => {
    e.preventDefault();
    if (!newProposal.title || !newProposal.desc) {
      window.toast && window.toast.error("Lütfen başlık ve açıklama alanlarını doldurun.");
      return;
    }
    
    const added = {
      id: Date.now(),
      title: newProposal.title,
      author: `${currentUser?.name || 'Anonim Mezun'}`,
      category: newProposal.category,
      date: '7 Gün Kaldı',
      for: 1,
      against: 0,
      status: 'active'
    };

    setProposals([added, ...proposals]);
    setShowAddProposal(false);
    setNewProposal({ title: '', category: 'Eğitim & Ders', budget: '', desc: '' });
    
    window.toast && window.toast.success("🚀 Önergeniz başarıyla oluşturuldu ve oylamaya sunuldu!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Landmark className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">Mezunlar Meclisi (DAO)</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Overview stats */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/85 p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider mb-5">
              <Vote size={14} /> Esenyurt DAO Konsepti
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-bold mb-6">
              İstanbul Esenyurt Üniversitesi Mezuniyet Ağı kararlarında söz sahibi olun. Oy ağırlığı profil doluluk oranınıza ve kazandığınız SSP puanlarına göre belirlenir.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Aktif Seçmen</span>
                  <span className="text-lg font-black text-slate-800">15.4K</span>
                </div>
                <Users size={20} className="text-indigo-600" />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Yönetilen Fon</span>
                  <span className="text-lg font-black text-slate-800">₺1.2M</span>
                </div>
                <Coins size={20} className="text-emerald-600" />
              </div>
            </div>

            <button 
              onClick={() => setShowAddProposal(true)}
              className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <Plus size={16} /> Önerge Gönder
            </button>
          </div>
        </div>

        {/* Right column: active proposals list */}
        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="text-indigo-500" /> Aktif Önergeler
            </h3>
            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {proposals.length} Toplam
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {proposals.map(prop => {
              const total = prop.for + prop.against;
              const forPercent = total > 0 ? Math.round((prop.for / total) * 100) : 0;
              const againstPercent = total > 0 ? Math.round((prop.against / total) * 100) : 0;
              
              return (
                <div key={prop.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  
                  {/* Status header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/50 rounded-md text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {prop.category}
                    </span>
                    
                    {prop.status === 'passed' ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <BadgeCheck size={12} /> Kabul Edildi
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Clock size={12} /> {prop.date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-md sm:text-lg font-black text-slate-900 mb-2 leading-tight">{prop.title}</h4>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6">
                    <span>Yazar: {prop.author}</span>
                  </div>

                  {/* Voting sliders */}
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-emerald-600">{forPercent}% Kabul ({prop.for} Oy)</span>
                        <span className="text-red-500">{againstPercent}% Ret ({prop.against} Oy)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full flex overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${forPercent}%` }} className="bg-emerald-500 h-full" />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${againstPercent}%` }} className="bg-red-500 h-full" />
                      </div>
                    </div>

                    {/* Voted check/actions */}
                    {prop.status === 'active' && (
                      <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <button 
                          onClick={() => handleVote(prop.id, 'for')}
                          disabled={!!voted[prop.id]}
                          className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${voted[prop.id] === 'for' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                        >
                          <Check size={14} /> Kabul
                        </button>
                        <button 
                          onClick={() => handleVote(prop.id, 'against')}
                          disabled={!!voted[prop.id]}
                          className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition ${voted[prop.id] === 'against' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-500'}`}
                        >
                          <X size={14} /> Ret
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Add Proposal Modal */}
      <AnimatePresence>
        {showAddProposal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddProposal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-950 text-base">Yeni Önerge Taslağı</h3>
                <button onClick={() => setShowAddProposal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddProposal} className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Önerge Başlığı</label>
                  <input 
                    type="text" 
                    value={newProposal.title} 
                    onChange={e => setNewProposal({...newProposal, title: e.target.value})}
                    placeholder="Kampüste neyi değiştirmek istersiniz?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Kategori</label>
                  <select 
                    value={newProposal.category} 
                    onChange={e => setNewProposal({...newProposal, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Eğitim & Ders">Eğitim & Ders</option>
                    <option value="Kampüs & Etkinlik">Kampüs & Etkinlik</option>
                    <option value="Sosyal & Ağ">Sosyal & Ağ</option>
                    <option value="Altyapı & Lab">Altyapı & Lab</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Önerge Detayı</label>
                  <textarea 
                    value={newProposal.desc} 
                    onChange={e => setNewProposal({...newProposal, desc: e.target.value})}
                    placeholder="Gerekçelerinizi ve uygulama modelinizi detaylandırın..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-indigo-400 min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition shadow-lg"
                >
                  Oylamaya Başlat
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
