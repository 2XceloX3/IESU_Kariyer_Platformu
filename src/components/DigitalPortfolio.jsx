import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, FileCheck2, ChevronLeft, ExternalLink, Award, Sparkles, 
  CheckCircle2, Star, Eye, Plus, ShieldCheck, Cpu, Code, Database, X, Compass
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const MOCK_PROJECTS = [
  { id: 1, title: 'AI Tabanlı Mülakat Botu', category: 'Yapay Zeka', tech: ['React', 'Python', 'OpenAI'], views: 1240, stars: 45, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', isCertified: true },
  { id: 2, title: 'Sürdürülebilir Kampüs IoT', category: 'Nesnelerin İnterneti', tech: ['Arduino', 'C++', 'Firebase'], views: 856, stars: 22, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', isCertified: false },
  { id: 3, title: 'Kripto Cüzdan Arayüzü', category: 'Web3', tech: ['Next.js', 'Solidity', 'Tailwind'], views: 2100, stars: 128, image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800', isCertified: true },
];

const MOCK_CERTS = [
  { id: 1, title: 'Google Advanced Data Analytics', issuer: 'Google', date: 'Ekim 2023', verifyUrl: '#', icon: <Award size={32} className="text-blue-500" /> },
  { id: 2, title: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', date: 'Kasım 2023', verifyUrl: '#', icon: <Award size={32} className="text-orange-500" /> },
  { id: 3, title: 'Esenyurt Blockchain Eğitimi', issuer: 'İESÜ Sürekli Eğitim', date: 'Aralık 2023', verifyUrl: '#', icon: <Award size={32} className="text-indigo-500" /> },
];

export default function DigitalPortfolio({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'certs'
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: 'Yapay Zeka', tech: '', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' });
  const [projectsList, setProjectsList] = useState(MOCK_PROJECTS);

  const handleAddProject = () => {
    if (!newProject.title) return;
    const techs = newProject.tech.split(',').map(item => item.trim()).filter(Boolean);
    const added = {
      id: Date.now(),
      title: newProject.title,
      category: newProject.category,
      tech: techs,
      views: 0,
      stars: 0,
      image: newProject.image,
      isCertified: Math.random() > 0.5
    };
    
    setProjectsList([added, ...projectsList]);
    setShowAddProjectModal(false);
    setNewProject({ title: '', category: 'Yapay Zeka', tech: '', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' });
    
    window.toast && window.toast.success("🚀 Projeniz portfolyonuza eklendi ve IPFS hash'i oluşturuldu!");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <FolderGit2 className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">Dijital Portfolyo</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <img src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-32 h-32 rounded-3xl object-cover shadow-xl border border-slate-100" />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h2 className="text-3xl font-black text-slate-900">{currentUser?.name || 'Öğrenci Adı'}</h2>
              <CheckCircle2 size={24} className="text-blue-500" />
            </div>
            <p className="text-slate-500 font-medium mb-4">{currentUser?.department || 'Yazılım Mühendisliği'} • {currentUser?.year || '4. Sınıf'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1"><Code size={12}/> Frontend</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1"><Database size={12}/> Backend</span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1"><Cpu size={12}/> AI Geliştirici</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("AI: Projeleriniz Github üzerinden analiz ediliyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("✅ AI Analizi Tamamlandı: Projeleriniz %92 oranında sektör trendleriyle eşleşiyor.");
                }, 2000);
              }}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-6 py-3 rounded-2xl font-black transition flex items-center justify-center gap-2 border border-indigo-200"
            >
              <Sparkles size={18} /> AI Portfolyo Analizi
            </button>
            <button 
              onClick={() => setShowAddProjectModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-black transition shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Yeni Proje Ekle
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-slate-200 pb-px">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 font-black text-lg transition-colors border-b-4 ${activeTab === 'projects' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <span className="flex items-center gap-2"><FolderGit2 size={20}/> Projeler ({projectsList.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('certs')}
            className={`pb-4 px-2 font-black text-lg transition-colors border-b-4 ${activeTab === 'certs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <span className="flex items-center gap-2"><FileCheck2 size={20}/> Sertifikalar ({MOCK_CERTS.length})</span>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projectsList.map(proj => (
                <div key={proj.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm border border-slate-100">
                        {proj.category}
                      </div>
                      
                      {proj.isCertified && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <ShieldCheck size={12} /> Onaylı
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{proj.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {proj.tech.map(t => (
                          <span key={t} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-[10px] font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-blue-500 transition cursor-pointer"><Eye size={14}/> {proj.views}</span>
                      <span className="flex items-center gap-1 hover:text-amber-500 transition cursor-pointer"><Star size={14}/> {proj.stars}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info("Anka AI: Proje kodları analiz ediliyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ AI Kod İncelemesi: Clean code standartlarına %89 uyumlu.");
                        }, 2500);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                    >
                       <Sparkles size={14} /> AI Analiz Et
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'certs' && (
            <motion.div 
              key="certs"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {MOCK_CERTS.map(cert => (
                <div key={cert.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all duration-300 flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {cert.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-black text-slate-900 leading-tight mb-1">{cert.title}</h3>
                    <p className="text-slate-500 font-medium text-xs mb-2">{cert.issuer}</p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{cert.date}</p>
                  </div>
                  <a href={cert.verifyUrl} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition shrink-0">
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))}
              
              {/* Blockchain Badge */}
              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Award size={150} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2"><Sparkles className="text-amber-400"/> Blockchain Doğrulaması</h3>
                  <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-xl">
                    Tüm sertifikaların Esenyurt Ağı üzerinde kriptografik olarak imzalanmış ve doğrulanmıştır. İşverenler QR kod ile anında teyit edebilir.
                  </p>
                </div>
                <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black shrink-0 hover:bg-slate-100 transition shadow-lg text-xs uppercase tracking-widest">
                  Sertifika Ağını Gör
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddProjectModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddProjectModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-950 text-base">Portfolyoya Yeni Proje Ekle</h3>
                <button onClick={() => setShowAddProjectModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Proje Başlığı</label>
                  <input 
                    type="text" 
                    value={newProject.title} 
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                    placeholder="Örn: AI Destekli Chatbot"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Proje Kategorisi</label>
                  <select 
                    value={newProject.category} 
                    onChange={e => setNewProject({...newProject, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Yapay Zeka">Yapay Zeka</option>
                    <option value="Nesnelerin İnterneti">Nesnelerin İnterneti</option>
                    <option value="Web3">Web3</option>
                    <option value="Mobil Uygulama">Mobil Uygulama</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Kullanılan Teknolojiler (Virgülle ayırın)</label>
                  <input 
                    type="text" 
                    value={newProject.tech} 
                    onChange={e => setNewProject({...newProject, tech: e.target.value})}
                    placeholder="Örn: React, Node.js, Web3.js"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <button 
                  onClick={handleAddProject}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition shadow-lg"
                >
                  Proje Ekle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
