import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, ChevronLeft, Target, Award, Sparkles, Zap, Rocket, Star } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import useAppStore from '../store/useAppStore';

const QUESTIONS = [
  {
    id: 1,
    text: "Bir problemle karşılaştığında ilk yaklaşımın nedir?",
    options: [
      { text: "Verileri analiz eder, mantıksal bir çözüm ararım.", traits: { logic: 10, creative: 2 } },
      { text: "Hemen farklı, alışılagelmişin dışında yollar denerim.", traits: { creative: 10, logic: 2 } },
      { text: "Takım arkadaşlarımla konuşur, beyin fırtınası yaparım.", traits: { social: 10, logic: 4 } },
      { text: "Benzer problemlerin nasıl çözüldüğüne bakar, uygularım.", traits: { practical: 10, logic: 6 } }
    ]
  },
  {
    id: 2,
    text: "Çalışma ortamında en çok neye önem verirsin?",
    options: [
      { text: "Sıfırdan bir şeyler üretme özgürlüğüne.", traits: { creative: 8, practical: 2 } },
      { text: "Sistematik, net kuralları olan bir düzene.", traits: { logic: 8, practical: 6 } },
      { text: "İletişimin ve sosyalliğin yüksek olduğu sıcak bir ekibe.", traits: { social: 10, logic: 2 } },
      { text: "Hızlı sonuç alınan, tempolu ve rekabetçi bir ortama.", traits: { practical: 8, creative: 4 } }
    ]
  },
  {
    id: 3,
    text: "Yeni bir konuyu öğrenirken hangi yöntemi tercih edersin?",
    options: [
      { text: "Dokümantasyon ve teknik makaleler okumak.", traits: { logic: 9, practical: 3 } },
      { text: "Başkalarının tasarımlarını inceleyip ilham almak.", traits: { creative: 9, social: 3 } },
      { text: "Grup çalışmaları veya mentor eşliğinde pratik yapmak.", traits: { social: 9, practical: 4 } },
      { text: "Hemen deneme-yanılma ile sahaya inmek.", traits: { practical: 10, logic: 2 } }
    ]
  }
];

export default function CareerTest({ setView, currentUser, userRole, setSelectedUserId }) {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-3: questions, 4: result
  const [scores, setScores] = useState({ logic: 0, creative: 0, social: 0, practical: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (traits) => {
    const newScores = {
      logic: scores.logic + (traits.logic || 0),
      creative: scores.creative + (traits.creative || 0),
      social: scores.social + (traits.social || 0),
      practical: scores.practical + (traits.practical || 0),
    };
    
    if (currentStep < QUESTIONS.length) {
      setScores(newScores);
      setCurrentStep(prev => prev + 1);
    } else {
      setScores(newScores);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(prev => prev + 1);
      }, 2500);
    }
  };

  const getPersona = () => {
    const maxTrait = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    if (maxTrait === 'logic') return { title: 'Sistem Mimarı', icon: <Brain className="text-blue-500" size={48} />, desc: 'Analitik zekasıyla karmaşık sorunları çözen stratejist.', color: 'from-blue-500 to-indigo-600', paths: ['Yazılım Geliştirme', 'Veri Bilimi', 'Finansal Analiz'] };
    if (maxTrait === 'creative') return { title: 'Vizyoner Tasarımcı', icon: <Sparkles className="text-purple-500" size={48} />, desc: 'Sınırları zorlayan, inovatif ve sanatsal düşünen yaratıcı güç.', color: 'from-purple-500 to-pink-600', paths: ['UI/UX Tasarım', 'Pazarlama İletişimi', 'Oyun Tasarımı'] };
    if (maxTrait === 'social') return { title: 'Lider & Takım Oyuncusu', icon: <Target className="text-emerald-500" size={48} />, desc: 'İnsanları bir araya getiren, iletişimi güçlü organizatör.', color: 'from-emerald-400 to-teal-600', paths: ['İnsan Kaynakları', 'Proje Yöneticisi', 'Satış & İş Geliştirme'] };
    return { title: 'Uygulama Uzmanı', icon: <Rocket className="text-orange-500" size={48} />, desc: 'Düşünceleri anında eyleme döken, sonuç odaklı hız makinesi.', color: 'from-orange-400 to-red-500', paths: ['Operasyon Yönetimi', 'Girişimcilik', 'Saha Mühendisliği'] };
  };

  const DrawRadarChart = () => {
    // Normalize scores to max 30
    const maxScore = 30;
    const l = (scores.logic / maxScore) * 100;
    const c = (scores.creative / maxScore) * 100;
    const s = (scores.social / maxScore) * 100;
    const p = (scores.practical / maxScore) * 100;
    
    // Calculate coordinates for polygon (100x100 box, center 50,50)
    // Points: Logic(top), Creative(right), Practical(bottom), Social(left)
    const points = `
      50,${50 - (l/2)} 
      ${50 + (c/2)},50 
      50,${50 + (p/2)} 
      ${50 - (s/2)},50
    `;

    return (
      <div className="relative w-48 h-48 mx-auto my-8">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
          {/* Base Grid */}
          <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          
          {/* Axis lines */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="1"/>
          
          {/* Data Polygon */}
          <polygon 
            points={points} 
            fill="rgba(99, 102, 241, 0.4)" 
            stroke="#4f46e5" 
            strokeWidth="2"
            className="drop-shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000"
          />
        </svg>
        
        {/* Labels outside SVG so they don't rotate */}
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">Mantık</span>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">Pratik</span>
        <span className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs font-bold text-gray-500">Yaratıcı</span>
        <span className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs font-bold text-gray-500">Sosyal</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} />
            <h1 className="font-black text-gray-900">Anka Kariyer Analizi</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: INTRO */}
          {currentStep === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl w-full text-center"
            >
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                <Brain size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Potansiyelini Keşfet!</h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Yapay zeka motorumuz Anka, bilişsel seçimlerini analiz ederek kariyer arketipini belirliyor. Sadece 3 soruda gerçek yetenek alanını keşfet.
              </p>
              <button 
                onClick={() => setCurrentStep(1)}
                className="bg-[#0A2342] text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 mx-auto group"
              >
                Analize Başla <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STEPS 1-3: QUESTIONS */}
          {currentStep > 0 && currentStep <= QUESTIONS.length && (
            <motion.div 
              key={`q-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl w-full"
            >
              <div className="mb-8 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Soru {currentStep} / {QUESTIONS.length}</span>
                <div className="flex gap-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-8 leading-tight">
                {QUESTIONS[currentStep - 1].text}
              </h3>

              <div className="space-y-4">
                {QUESTIONS[currentStep - 1].options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(opt.traits)}
                    className="w-full text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50/30 transition-all group"
                  >
                    <span className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-gray-700 font-medium text-lg">{opt.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: ANALYZING LOADING */}
          {isAnalyzing && (
             <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
             >
               <div className="relative w-24 h-24 mx-auto mb-6">
                 <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-50" />
                 <div className="relative bg-white rounded-full p-6 border-4 border-indigo-50 shadow-sm flex items-center justify-center h-full">
                   <Zap size={40} className="text-indigo-600 animate-pulse" />
                 </div>
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2">Anka Analiz Ediyor...</h3>
               <p className="text-gray-500">Nöral ağlar cevaplarını işliyor.</p>
             </motion.div>
          )}

          {/* STEP 5: RESULT */}
          {currentStep > QUESTIONS.length && !isAnalyzing && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-100 relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
              
              <div className="mb-2">
                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black uppercase tracking-wider mb-6">
                  Analiz Sonucu
                </span>
              </div>

              <div className="flex justify-center mb-4">
                <div className={`w-24 h-24 rounded-xl flex items-center justify-center bg-gradient-to-br ${getPersona().color} text-white shadow-xl`}>
                   {React.cloneElement(getPersona().icon, { className: 'text-white' })}
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2">Sen Bir <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">"{getPersona().title}"</span>sin!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">{getPersona().desc}</p>

              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h3 className="font-black text-gray-900 mb-2">Yetenek Haritası</h3>
                <DrawRadarChart />
              </div>

              <div className="mb-8">
                <h3 className="font-black text-gray-900 mb-4 text-left">Sana En Uygun Kariyer Yolları:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {getPersona().paths.map((path, idx) => (
                    <div key={idx} className="bg-white border-2 border-indigo-50 p-4 rounded-xl flex items-center gap-3">
                      <Star className="text-amber-400" size={20} />
                      <span className="font-bold text-gray-800 text-sm">{path}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.toast && window.toast.info(`Anka AI: ${getPersona().title} profiline sahip en başarılı mentorlar taranıyor...`);
                    setTimeout(() => {
                      window.toast && window.toast.success("✅ AI Eşleşmesi: Sizinle aynı profilde %94 uyumlu 2 mentora otomatik tanışma isteği gönderildi.");
                    }, 2500);
                  }}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-100 text-indigo-700 py-4 rounded-2xl font-black text-lg transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Bu Profile Uygun AI Mentor Bul
                </button>
                <button 
                  onClick={() => setView('jobs')}
                  className="w-full bg-[#0A2342] text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/20"
                >
                  Bu Yollara Uygun İlanları Gör
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
