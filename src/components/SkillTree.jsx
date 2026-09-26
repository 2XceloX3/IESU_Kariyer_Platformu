import React, { useState } from 'react';
import { Target, Lock, CheckCircle2, Star, ShieldCheck, Cpu, Code, Database, LineChart, CheckCircle, ChevronLeft } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';

const skillAssessments = [
  {
    id: 'badge_1',
    title: 'Frontend Mimarisi (React)',
    description: 'Bileşen tabanlı mimari ve state yönetimi konusunda uzmanlığınızı kanıtlayın.',
    icon: <Cpu size={24} />,
    color: 'from-red-600 to-rose-700',
    type: 'Teknik Değerlendirme'
  },
  {
    id: 'badge_2',
    title: 'UI/UX Tasarım Prensipleri',
    description: 'Kullanıcı deneyimi standartları ve erişilebilirlik (a11y) testini geçin.',
    icon: <Star size={24} />,
    color: 'from-purple-600 to-fuchsia-700',
    type: 'Tasarım Değerlendirme',
    requires: ['badge_1']
  },
  {
    id: 'badge_3',
    title: 'İleri Seviye Veri Analizi',
    description: 'Büyük veri setlerini işleme ve görselleştirme yetkinliğinizi doğrulayın.',
    icon: <LineChart size={24} />,
    color: 'from-emerald-600 to-teal-700',
    type: 'Analitik Değerlendirme'
  },
  {
    id: 'badge_4',
    title: 'Sistem Mimarisi & Backend',
    description: 'API tasarımı, mikroservisler ve veritabanı optimizasyonu testini tamamlayın.',
    icon: <Database size={24} />,
    color: 'from-amber-600 to-orange-700',
    type: 'Sistem Değerlendirme'
  }
];

export default function SkillTree({ setView, currentUser, userRole, setSelectedUserId }) {
  const unlockedBadges = useAppStore(state => state.unlockedBadges || []);
  const setUnlockedBadges = useAppStore(state => state.setUnlockedBadges);
  const [isEvaluating, setIsEvaluating] = useState(null);

  const handleAssessment = (node) => {
    if (unlockedBadges.includes(node.id)) return;
    
    // Check requirements
    if (node.requires) {
      const meetsReqs = node.requires.every(req => unlockedBadges.includes(req));
      if (!meetsReqs) {
        window.toast && window.toast.error("Önce gerekli temel değerlendirmeleri tamamlamalısınız.");
        return;
      }
    }

    setIsEvaluating(node.id);
    window.toast && window.toast.info(`${node.title} için açık kaynaklı projeleriniz ve GitHub kodlarınız analiz ediliyor...`);
    
    // Simulate taking a skill test
    setTimeout(() => {
      if (setUnlockedBadges) {
        setUnlockedBadges([...unlockedBadges, node.id]);
      }
      setIsEvaluating(null);
      window.toast && window.toast.success(`✅ Onaylandı: ${node.title} yetkinliğiniz doğrulandı ve profilinize eklendi!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (setView) {
                setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student');
              }
            }} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-[#990000]" />
            <div>
              <h1 className="font-black text-gray-900 text-sm sm:text-base leading-tight">Yetkinlik Değerlendirme Ağacı</h1>
              <p className="text-[11px] font-bold text-gray-500">Doğrulanmış Sektörel Yetenek Rozetleri</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col">
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 skew-x-12 transform origin-bottom pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Yetkinlik Doğrulama
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Kariyerinde Fark Yaratan Yetenekler</h2>
            <p className="text-red-100 text-sm md:text-base leading-relaxed">
              Sektör standartlarındaki testleri geçerek profilinize doğrulanmış yetenek rozetleri ekleyin ve işverenlerin dikkatini çekin.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:absolute md:right-8 md:bottom-8 z-10">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="text-white" size={20} />
              <span className="font-bold text-white text-sm">{unlockedBadges.length} / {skillAssessments.length} Rozet Kazanıldı</span>
            </div>
          </div>
        </div>

        {/* Skill Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillAssessments.map(node => {
            const isUnlocked = unlockedBadges.includes(node.id);
            const isLocked = !isUnlocked && node.requires && !node.requires.every(req => unlockedBadges.includes(req));

            return (
              <div 
                key={node.id} 
                className={`relative p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                  isUnlocked ? 'border-emerald-200 bg-emerald-50/30 shadow-xs' : 
                  isLocked ? 'border-gray-200 bg-gray-50/80 opacity-75' : 
                  'border-gray-200 hover:border-red-300 hover:shadow-md bg-white'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm bg-gradient-to-tr ${isLocked ? 'bg-gray-400' : node.color}`}>
                  {node.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-base font-bold ${isUnlocked ? 'text-emerald-800' : 'text-gray-900'}`}>{node.title}</h3>
                    {isUnlocked && <CheckCircle size={18} className="text-emerald-600" />}
                    {isLocked && <Lock size={16} className="text-gray-400" />}
                  </div>
                  
                  <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded mb-2">
                    {node.type}
                  </span>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{node.description}</p>
                  
                  {!isUnlocked && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <button 
                        onClick={() => !isLocked && handleAssessment(node)}
                        disabled={isLocked || isEvaluating === node.id}
                        className={`text-sm font-bold py-2 px-4 rounded-xl transition-colors flex-1 cursor-pointer ${
                          isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                          isEvaluating === node.id ? 'bg-red-50 text-[#990000] border border-red-200 animate-pulse' :
                          'border border-[#990000] text-[#990000] hover:bg-[#990000] hover:text-white'
                        }`}
                      >
                        {isEvaluating === node.id ? 'Değerlendiriliyor...' : isLocked ? 'Kilitli' : 'Değerlendirmeye Katıl'}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.toast && window.toast.info(`"${node.title}" yetkinliğini kazanmanız için size özel çalışma planı oluşturuluyor...`);
                          setTimeout(() => {
                            window.toast && window.toast.success("✅ Çalışma Planı: '3 haftalık yoğunlaştırılmış eğitim programı' oluşturuldu.");
                          }, 2500);
                        }}
                        className="text-sm font-bold py-2 px-4 rounded-xl transition-colors border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 flex items-center justify-center gap-1 cursor-pointer"
                        title="Bu yetkinliği nasıl kazanabilirim?"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        Çalışma Planı
                      </button>
                    </div>
                  )}
                  {isUnlocked && (
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-fit px-3 py-1 rounded-lg border border-emerald-100">
                      <ShieldCheck size={16} /> Profilinize Eklendi
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

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
