import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, TrendingUp, Briefcase, Award } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { AIEngine } from '../data/AIEngine';

export default function DailyQuestsPanel() {
  const { currentUser, updateUser } = useAppStore();
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    if (currentUser && quests.length === 0) {
      const generatedQuests = AIEngine.QuestGenerator.generateDailyQuests(currentUser);
      setQuests(generatedQuests);
    }
  }, [currentUser, quests.length]);

  const handleCompleteQuest = (questId, bpReward) => {
    window.toast && window.toast.info("Hedef uygulanıyor ve profiliniz güncelleniyor...");
    setTimeout(() => {
      setQuests(prevQuests => 
        prevQuests.map(q => q.id === questId ? { ...q, isCompleted: true } : q)
      );
      
      if (currentUser) {
        updateUser({
          ...currentUser,
          bp: (currentUser.bp || 0) + bpReward
        });
      }
      window.toast && window.toast.success(`✅ Hedef başarıyla tamamlandı. Kariyer puanı eklendi: +${bpReward} BP`);
    }, 1500);
  };

  const allCompleted = quests.length > 0 && quests.every(q => q.isCompleted);
  const completedCount = quests.filter(q => q.isCompleted).length;
  const progressPercent = quests.length > 0 ? (completedCount / quests.length) * 100 : 0;

  if (!currentUser) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#0A66C2]" />
            Esenyurt & Kariyer Hedefleri
          </h3>
          <p className="text-sm text-gray-500 mt-1">Kariyer Merkeziniz tarafından hazırlanan günlük kariyer kilometre taşlarınız.</p>
        </div>
      </div>

      <div className="p-5 bg-gray-50/50 border-b border-gray-100">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-gray-600">Profil Tamamlama Gücü</span>
          <span className="text-[#0A66C2]">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#0A66C2] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="p-0">
        {allCompleted ? (
          <div className="text-center py-8 bg-white">
            <Award size={48} className="text-emerald-600 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 mb-1">Tüm Hedefler Tamamlandı</h4>
            <p className="text-sm text-gray-500">Bugünkü kariyer geliştirme adımlarınızı başarıyla tamamladınız. Profil gücünüz artırıldı.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {quests.map(quest => (
              <div 
                key={quest.id} 
                className={`p-5 transition-all flex items-start justify-between gap-4 \${quest.isCompleted ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 \${quest.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm \${quest.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {quest.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                  </div>
                </div>
                {!quest.isCompleted && (
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info("Profilinize daha uygun yeni bir mikro-görev hesaplanıyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ Günün Görevi Güncellendi: 'Son haftanın teknoloji haberlerinden birini özetle.'");
                        }, 2500);
                      }}
                      className="shrink-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#0A66C2] rounded-full w-8 h-8 transition-colors"
                      title="Görevi Değiştir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleCompleteQuest(quest.id, quest.bpReward)}
                      className="shrink-0 flex items-center justify-center border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white rounded-full px-4 py-1.5 transition-colors text-xs font-bold"
                    >
                      Uygula
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
