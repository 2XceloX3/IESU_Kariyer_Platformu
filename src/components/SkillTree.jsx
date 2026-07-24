import React, { useState } from 'react';
import { Target, Lock, CheckCircle2, Star, ShieldCheck, Cpu, Code, Database, LineChart, CheckCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const skillAssessments = [
  {
    id: 'badge_1',
    title: 'Frontend Mimarisi (React)',
    description: 'Bileşen tabanlı mimari ve state yönetimi konusunda uzmanlığınızı kanıtlayın.',
    icon: <Cpu size={24} />,
    color: 'from-blue-600 to-indigo-700',
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

export default function SkillTree() {
  const unlockedBadges = useAppStore(state => state.unlockedBadges);
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
    window.toast && window.toast.info(`AI: ${node.title} için açık kaynaklı projeleriniz ve Github kodlarınız analiz ediliyor...`);
    
    // Simulate taking an AI skill test
    setTimeout(() => {
      setUnlockedBadges([...unlockedBadges, node.id]);
      setIsEvaluating(null);
      window.toast && window.toast.success(`✅ AI Onayı: ${node.title} yetkinliğiniz kanıtlandı ve blockchain ile mühürlendi!`);
    }, 3000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
            <ShieldCheck className="text-[#0A66C2]" size={24} />
            Yetkinlik Değerlendirmeleri
          </h2>
          <p className="text-sm text-gray-500 font-medium">Sektör standartlarındaki testleri geçerek profilinize doğrulanmış yetenek rozetleri ekleyin.</p>
        </div>
        <div className="bg-[#0A66C2]/10 px-4 py-2 rounded-full flex items-center gap-2">
          <CheckCircle2 className="text-[#0A66C2]" size={18} />
          <span className="font-bold text-[#0A66C2] text-sm">{unlockedBadges.length} Doğrulanmış Yetenek</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillAssessments.map(node => {
          const isUnlocked = unlockedBadges.includes(node.id);
          const isLocked = !isUnlocked && node.requires && !node.requires.every(req => unlockedBadges.includes(req));

          return (
            <div 
              key={node.id} 
              className={`relative p-5 rounded-lg border transition-all duration-300 flex items-start gap-4 \${
                isUnlocked ? 'border-emerald-200 bg-emerald-50/20' : 
                isLocked ? 'border-gray-100 bg-gray-50 opacity-75' : 
                'border-gray-200 hover:border-[#0A66C2] hover:shadow-md bg-white'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm bg-gradient-to-tr \${isLocked ? 'bg-gray-400' : node.color}`}>
                {node.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base font-bold \${isUnlocked ? 'text-emerald-800' : 'text-gray-900'}`}>{node.title}</h3>
                  {isUnlocked && <CheckCircle size={18} className="text-emerald-600" />}
                  {isLocked && <Lock size={16} className="text-gray-400" />}
                </div>
                
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded mb-2">
                  {node.type}
                </span>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{node.description}</p>
                
                {!isUnlocked && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <button 
                      onClick={() => !isLocked && handleAssessment(node)}
                      disabled={isLocked || isEvaluating === node.id}
                      className={`text-sm font-bold py-2 px-4 rounded-full transition-colors flex-1 \${
                        isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                        isEvaluating === node.id ? 'bg-[#0A66C2]/20 text-[#0A66C2] animate-pulse' :
                        'border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white'
                      }`}
                    >
                      {isEvaluating === node.id ? 'Değerlendiriliyor...' : isLocked ? 'Kilitli' : 'Değerlendirmeye Katıl'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info(`Anka AI: ${node.title} yetkinliğini kazanmanız için size özel bir çalışma planı oluşturuluyor...`);
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ AI Çalışma Planı: '3 haftalık yoğunlaştırılmış eğitim programı' oluşturuldu.");
                        }, 2500);
                      }}
                      className="text-sm font-bold py-2 px-4 rounded-full transition-colors border border-blue-200 text-blue-600 hover:bg-blue-50 flex-1 flex items-center justify-center gap-1"
                      title="Bu yetkinliği nasıl kazanabilirim?"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                      AI Çalışma Planı
                    </button>
                  </div>
                )}
                {isUnlocked && (
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck size={16} /> Profilinize Eklendi
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
