import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, Target, Sparkles, ChevronLeft, ArrowRight, Zap, CheckCircle2, CircleDashed, Rocket, Code, Award, Users, CalendarClock } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import { generateAIResponse } from '../lib/gemini';
import useAppStore from '../store/useAppStore';

export default function CareerRoadmap({ setView, currentUser, userRole, setSelectedUserId }) {
  const [dreamRole, setDreamRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async () => {
    if (!dreamRole.trim()) return;
    setIsGenerating(true);

    const prompt = `
      Sen Esenyurt Üniversitesi kariyer yapay zekası Anka'sın.
      Öğrenci "${currentUser?.name}" şu hedefi belirledi: "${dreamRole}".
      Bu hedefe ulaşması için 4 aşamalı (Faz 1, Faz 2, Faz 3, Faz 4) bir kariyer yol haritası (roadmap) çıkar.
      Lütfen sadece aşağıdaki JSON formatında, geçerli bir JSON objesi döndür, başka hiçbir metin (markdown backtickleri dahil) KULLANMA.
      JSON Formatı:
      {
        "title": "Hedef Başlığı (Örn: Google Frontend Developer Yol Haritası)",
        "phases": [
          {
            "id": 1,
            "title": "Temelleri Atmak",
            "timeframe": "1. - 2. Yıl",
            "desc": "Kısa açıklama",
            "tasks": ["Görev 1", "Görev 2", "Görev 3"]
          },
          ... (toplam 4 faz olacak)
        ]
      }
    `;

    setTimeout(async () => {
      try {
        const response = await generateAIResponse(prompt, "Sadece JSON dön");
        // Clean markdown backticks if AI still returns them
        let cleanJson = response.replace(/json/gi, '').replace(/[\`]/g, '').trim();
        const data = JSON.parse(cleanJson);
        setRoadmap(data);
        setIsGenerating(false);
      } catch (e) {
        // Fallback mock if JSON parsing fails
        setRoadmap({
          title: `${dreamRole} Yol Haritası`,
          phases: [
            { id: 1, title: 'Temeller ve İlk Adımlar', timeframe: '0-6 Ay', desc: 'Sektörün temellerini öğrenmek ve ilk portfolyoyu oluşturmak.', tasks: ['İlgili temel eğitimleri tamamla', 'GitHub/Behance profili aç', 'İlk küçük projeni yayınla'] },
            { id: 2, title: 'Esenyurt ve Derinleşme', timeframe: '6-12 Ay', desc: 'İleri düzey kavramları öğrenmek ve mentor bulmak.', tasks: ['İleri seviye kurslara katıl', 'Mezun ağından bir mentor bul', 'Gönüllü staj başvuruları yap'] },
            { id: 3, title: 'Saha Deneyimi', timeframe: '1-2 Yıl', desc: 'Gerçek dünya projelerinde yer almak ve sektörle tanışmak.', tasks: ['Kariyer Fuarında staj ayarla', 'Freelance / Açık kaynak projelere katkı yap', 'Mülakat simülasyonları ile pratik yap'] },
            { id: 4, title: 'Zirve ve Hedef', timeframe: '2+ Yıl', desc: 'Açık pozisyonlara başvuru ve profesyonel kariyerin başlangıcı.', tasks: ['CV ve Portfolyoyu son haline getir', 'Şirketlerin Senior İK çalışanları ile bağlantı kur', 'Hedef rol için resmi başvurulara başla'] },
          ]
        });
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Target className="text-[#990000]" size={24} />
            <h1 className="font-black text-[#990000]">Kariyer Simülasyonu</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 lg:p-8">
        
        {!roadmap && !isGenerating && (
          <div className="text-center py-20 px-4">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 shadow-inner">
              <Target size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Hayalindeki Rolü Söyle</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Hedefine giden en kısa ve verimli yolu hesaplayarak sana özel, adım adım bir kariyer haritası çıkarsın.
            </p>
            
            <div className="max-w-md mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-red-900/5 flex items-center border border-gray-100 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100 transition-all">
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none px-4 text-gray-700 placeholder-gray-400 font-medium"
                placeholder="Örn: Trendyol'da Veri Analisti..."
                value={dreamRole}
                onChange={(e) => setDreamRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                onClick={handleGenerate}
                disabled={!dreamRole.trim()}
                className="bg-[#990000] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition disabled:opacity-50"
              >
                Rota Oluştur <Sparkles size={18} />
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              <span className="text-xs font-bold text-gray-400 uppercase w-full mb-1">Popüler Hedefler</span>
              {['Google Yazılım Mühendisi', 'THY Kabin Memuru', 'Aselsan Siber Güvenlik Uzmanı', 'Akbank Finansal Analist'].map(r => (
                <button key={r} onClick={() => setDreamRole(r)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition">
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50" />
              <div className="relative bg-white rounded-full p-6 border-4 border-red-50 shadow-sm flex items-center justify-center h-full">
                <Zap size={40} className="text-red-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Kariyer Rotası Hesaplanıyor...</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Anka, sektör verilerini ve binlerce mezunun geçmişini analiz ederek en güvenli yolu çiziyor.</p>
          </div>
        )}

        {roadmap && !isGenerating && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <div className="flex justify-between items-end mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-red-100">
                    <MapPin size={14} /> Hedef Kilitlendi
                  </div>
                  <h2 className="text-3xl lg:text-2xl font-black text-gray-900 leading-tight">
                    {roadmap.title}
                  </h2>
                </div>
                <button 
                  onClick={() => { setRoadmap(null); setDreamRole(''); }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
                >
                  Yeni Rota
                </button>
              </div>

              {/* Vertical Timeline */}
              <div className="relative border-l-4 border-red-100 ml-6 md:ml-10 space-y-12">
                {roadmap.phases.map((phase, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    key={phase.id} 
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Node marker */}
                    <div className="absolute -left-[22px] top-0 w-10 h-10 bg-white border-4 border-red-500 rounded-full flex items-center justify-center shadow-sm z-10">
                      <span className="text-red-600 font-black text-sm">{phase.id}</span>
                    </div>

                    <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:border-red-200 transition-colors">
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-5 transition-opacity pointer-events-none">
                        {idx === 0 ? <Code size={150} /> : idx === 1 ? <Users size={150} /> : idx === 2 ? <Rocket size={150} /> : <Award size={150} />}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h3 className="text-2xl font-black text-gray-900">{phase.title}</h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold mt-2 md:mt-0 w-max">
                          <CalendarClock size={16} /> {phase.timeframe}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-lg mb-6">{phase.desc}</p>
                      
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target size={18} className="text-red-500"/> Hedef Görevler
                        </h4>
                        <ul className="space-y-3">
                          {phase.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-3">
                              <CircleDashed size={20} className="text-gray-300 shrink-0 mt-0.5" />
                              <span className="text-gray-700 font-medium">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-[#990000] rounded-full text-white shadow-sm mb-4">
                   <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-[#990000]">Kariyer Hedefine Ulaşıldı</h3>
                 <p className="text-gray-500 mt-2">Bu adımları izlediğinizde hedefinize ulaşmak için gerekli kurumsal yetkinlikleri kazanmış olacaksınız. Kariyer Geliştirme Koordinatörlüğü tüm bu süreçte yanınızda.</p>
              </div>

            </motion.div>
          </AnimatePresence>
        )}

      </main>
    </div>
  );
}
