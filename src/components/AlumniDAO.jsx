import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, Check, X, Users, ArrowLeft, ArrowRight, BarChart3, 
  Clock, Vote, Plus, ClipboardList, Coins, ShieldAlert, BadgeCheck, FileText, Sparkles
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';

const INITIAL_PROPOSALS = [
  { id: 1, title: 'İESÜ Mezunlar Başarı & İhtiyaç Burs Fonu 2026', author: 'Dr. Mehmet Y. (2015 Mezunu)', category: 'Burs & Sosyal Katkı', date: '3 Gün Kaldı', for: 1420, against: 85, status: 'active' },
  { id: 2, title: 'Global Diaspora: Berlin & Londra Mezunlar Çalışma Masası', author: 'Zeynep Kaya (Global Ağı)', category: 'Uluslararası Ağ', date: 'Oylama Kapandı', for: 980, against: 32, status: 'passed' },
  { id: 3, title: 'Genç Mezunlar Girişimcilik & Melek Yatırım Çekirdek Havuzu', author: 'İESÜMED Yönetim Kurulu', category: 'Girişim & Yatırım', date: '5 Gün Kaldı', for: 740, against: 190, status: 'active' },
];

export default function AlumniDAO({ setView, currentUser, userRole = 'alumni', setSelectedUserId, previousView = 'alumni' }) {
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [voted, setVoted] = useState({});
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', category: 'Girişim & Yatırım', budget: '', desc: '' });

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
    
    window.toast && window.toast.success("🗳️ Oyunuz mezun yönetişim ağına kaydedildi ve onaylandı!");
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
      author: `${currentUser?.name || 'Değerli Mezunumuz'}`,
      category: newProposal.category,
      date: '7 Gün Kaldı',
      for: 1,
      against: 0,
      status: 'active'
    };

    setProposals([added, ...proposals]);
    setShowAddProposal(false);
    setNewProposal({ title: '', category: 'Girişim & Yatırım', budget: '', desc: '' });
    
    window.toast && window.toast.success("🚀 Mezunlar Meclisi önergeniz başarıyla oluşturuldu ve oylamaya sunuldu!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-32 selection:bg-emerald-500/20">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'alumni'))} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 flex items-center justify-center text-slate-700 hover:text-[#059669] transition cursor-pointer shadow-2xs"
            title="Geri Dön"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#059669]">
              <Landmark size={20} />
            </div>
            <h1 className="font-black text-slate-900 text-lg tracking-tight">Mezunlar Meclisi & Karar Platformu (DAO)</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1240px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left column: Overview stats */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#059669] rounded-full text-xs font-black uppercase tracking-wider mb-5">
              <Vote size={14} /> İESÜ Mezun Yönetişimi
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
              İstanbul Esenyurt Üniversitesi Mezuniyet Ağı kararlarında doğrudan söz sahibi olun. Oy ağırlığı doğrulanmış mezuniyet derecenize ve KGB kariyer katkı seviyenize göre belirlenir.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Aktif Mezun Seçmen</span>
                  <span className="text-lg font-black text-[#059669]">15.4K</span>
                </div>
                <Users size={20} className="text-[#059669]" />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Yönetilen Fon & Destek</span>
                  <span className="text-lg font-black text-[#059669]">₺1.8M</span>
                </div>
                <Coins size={20} className="text-emerald-600" />
              </div>
            </div>

            <button 
              onClick={() => setShowAddProposal(true)}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-700 via-[#059669] to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Önerge Sun
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-sm border border-emerald-800/40">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Şeffaf & Doğrulanmış
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tüm oylamalar mezun kimlik kartı hash doğrulaması ile şeffaf biçimde İESÜMED sisteminde kayıt altına alınır.
            </p>
          </div>
        </div>

        {/* Right column: active proposals list */}
        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="text-[#059669]" /> Aktif Mezun Önergeleri
            </h3>
            <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              {proposals.length} Toplam Önerge
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {proposals.map(prop => {
              const total = prop.for + prop.against;
              const forPercent = total > 0 ? Math.round((prop.for / total) * 100) : 0;
              const againstPercent = total > 0 ? Math.round((prop.against / total) * 100) : 0;
              
              return (
                <div key={prop.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition relative overflow-hidden">
                  
                  {/* Status header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-black text-slate-600 uppercase tracking-widest">
                      {prop.category}
                    </span>
                    
                    {prop.status === 'passed' ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <BadgeCheck size={14} /> Kabul Edildi
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} /> {prop.date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2 leading-tight">{prop.title}</h4>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
                    <span>Öneren: <strong className="text-slate-700 font-bold">{prop.author}</strong></span>
                  </div>

                  {/* Voting sliders */}
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-[#059669] font-black">{forPercent}% Kabul ({prop.for} Oy)</span>
                        <span className="text-rose-600 font-black">{againstPercent}% Ret ({prop.against} Oy)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full flex overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${forPercent}%` }} className="bg-[#059669] h-full" />
                        <motion.div initial={{ width: 0 }} animate={{ width: `${againstPercent}%` }} className="bg-rose-500 h-full" />
                      </div>
                    </div>

                    {/* Voted check/actions */}
                    {prop.status === 'active' && (
                      <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <button 
                          onClick={() => handleVote(prop.id, 'for')}
                          disabled={!!voted[prop.id]}
                          className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${voted[prop.id] === 'for' ? 'bg-[#059669] text-white border-[#059669]' : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-[#059669]'}`}
                        >
                          <Check size={14} /> Kabul
                        </button>
                        <button 
                          onClick={() => handleVote(prop.id, 'against')}
                          disabled={!!voted[prop.id]}
                          className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${voted[prop.id] === 'against' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-600'}`}
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
                <h3 className="font-black text-slate-900 text-base">Meclise Yeni Önerge Sun</h3>
                <button onClick={() => setShowAddProposal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition cursor-pointer">
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
                    placeholder="Örn: 2026 Mezun Girişim Melek Fonu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Kategori</label>
                  <select 
                    value={newProposal.category} 
                    onChange={e => setNewProposal({...newProposal, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Girişim & Yatırım">Girişim & Yatırım</option>
                    <option value="Burs & Sosyal Katkı">Burs & Sosyal Katkı</option>
                    <option value="Uluslararası Ağ">Uluslararası Ağ</option>
                    <option value="Mentörlük & Eğitim">Mentörlük & Eğitim</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Önerge Detayı</label>
                  <textarea 
                    value={newProposal.desc} 
                    onChange={e => setNewProposal({...newProposal, desc: e.target.value})}
                    placeholder="Mezunlar ağına katkı hedefini ve uygulama adımlarını belirtin..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-[#059669] hover:from-emerald-800 hover:to-teal-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition shadow-md cursor-pointer"
                >
                  Oylamaya Başlat
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock */}
      <SubPanelFloatingDock 
        currentUser={currentUser}
        userRole="alumni"
        activeTab="alumni_dao"
        setView={setView}
        setSelectedUserId={setSelectedUserId}
      />
    </div>
  );
}
