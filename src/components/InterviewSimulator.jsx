import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Square, CheckCircle, AlertCircle, Award, ChevronLeft, Volume2, History, MessageSquare, Lightbulb, User, Glasses, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const INTERVIEW_SCENARIOS = [
  {
    id: 'software_engineer',
    title: 'Yazılım Mühendisliği (FAANG Seviyesi)',
    icon: '💻',
    questions: [
      "Bize biraz kendinden ve bugüne kadar geliştirdiğin en karmaşık projeden bahseder misin?",
      "Dağıtık bir sistemde (örneğin LangChain/AutoGPT tabanlı) çoklu yapay zeka ajanlarını orkestre ederken 'State' yönetimini nasıl tasarlarsın?",
      "Teknik bir kararda kıdemli bir mühendis veya PM ile ciddi şekilde anlaşmazlığa düştüğün bir anı STAR(L) tekniği ile anlatır mısın?",
      "Beklenmedik bir şekilde bütçe kısıtlaması veya yüksek API maliyeti sorunuyla karşılaştığında mimariyi nasıl pivote ettin?"
    ]
  },
  {
    id: 'marketing',
    title: 'Dijital Pazarlama Uzmanı',
    icon: '📈',
    questions: [
      "Bir markanın dijital varlığını sıfırdan kurmak istesen ilk 3 adımın ne olurdu?",
      "SEO'nun Answer Engine (Perplexity/ChatGPT) dünyasına evrildiği bu dönemde içerik stratejini nasıl güncellersin?",
      "Zorlu bir müşteri veya yöneticinin olumsuz geri bildirimine nasıl yaklaşırsın?"
    ]
  },
  {
    id: 'business_finance',
    title: 'İşletme & Finans (Otonom Finans)',
    icon: '📊',
    questions: [
      "Bize biraz kendinden bahseder misin?",
      "Excel'de statik tablolar yerine Power Query ve API bağlantıları kullanarak otomatize ettiğin bir veri sürecini anlatır mısın?",
      "Beklenmedik bir pazar krizi durumunda nakit akışı senaryo modellemesini (Scenario Modeling) nasıl yaparsın?"
    ]
  }
];

export default function InterviewSimulator({ setView, userRole, currentUser, setSelectedUserId }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, processing, feedback
  const [timer, setTimer] = useState(0);
  const [isVREnabled, setIsVREnabled] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;
    if (recordingState === 'recording') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const handleStartRecording = () => {
    setTimer(0);
    setRecordingState('recording');
  };

  const handleStopRecording = () => {
    setRecordingState('processing');
    setTimeout(() => {
      setRecordingState('feedback');
    }, 2500); // Simulate AI processing
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderFeedback = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 max-w-3xl w-full mx-auto"
    >
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
          <Award size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Yapay Zeka Analizi Hazır</h2>
          <p className="text-gray-500">Mülakat performansınız Esenyurt Kariyer Yapay Zekası tarafından analiz edildi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <h3 className="font-bold text-green-800 flex items-center gap-2 mb-4">
            <CheckCircle size={20} /> Güçlü Yönleriniz
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-green-700 text-[15px]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Soruya doğrudan ve net bir giriş yaptınız.
            </li>
            <li className="flex items-start gap-2 text-green-700 text-[15px]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Ses tonunuz kendinden emin ve profesyoneldi.
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4">
            <AlertCircle size={20} /> Esenyurt Alanları
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-orange-700 text-[15px]">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              Teknik terimleri açıklarken çok fazla "ııı" kullandınız.
            </li>
            <li className="flex items-start gap-2 text-orange-700 text-[15px]">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              Örneklendirme kısmını biraz daha STAR (Durum, Görev, Eylem, Sonuç) tekniğine uygun anlatabilirdiniz.
            </li>
          </ul>
        </div>
      </div>

      {/* Corporate SaaS Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Zap size={20} className="text-[#0A66C2]" /> Performans Metrikleri
        </h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">İletişim Becerisi</span>
              <span className="text-sm font-black text-[#0A66C2]">%85</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0A66C2] rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">Teknik Yeterlilik</span>
              <span className="text-sm font-black text-[#0A66C2]">%70</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">Problem Çözme Analizi</span>
              <span className="text-sm font-black text-[#0A66C2]">%92</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl p-6 border border-red-100 mb-8">
        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
          <Lightbulb size={20} /> Yapay Zeka Önerisi (STAR-L Metodu)
        </h3>
        <p className="text-red-700 text-[15px] leading-relaxed">
          Bir dahaki sefere deneyimlerinizi anlatırken doğrudan "Ben bu projeyi yaptım" yerine, <strong>STAR(L)</strong> metodunu kullanın: Durum (Situation), Görev (Task), Eylem (Action), Sonuç (Result) ve en önemlisi <strong>Öğrenilenler (Learnings)</strong> formatını eklemek ikna ediciliğinizi %40 artıracaktır.
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        <button 
          onClick={() => {
            setRecordingState('idle');
            setTimer(0);
          }}
          className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
        >
          Tekrar Dene
        </button>
        <button 
          onClick={() => {
            if (currentQuestionIndex < activeScenario.questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
              setRecordingState('idle');
              setTimer(0);
            } else {
              setActiveScenario(null);
              setCurrentQuestionIndex(0);
              setRecordingState('idle');
            }
          }}
          className="px-8 py-3 rounded-xl font-bold text-white bg-[#990000] hover:bg-red-700 transition shadow-lg shadow-red-500/20"
        >
          {currentQuestionIndex < activeScenario.questions.length - 1 ? 'Sıradaki Soruya Geç' : 'Mülakatı Tamamla'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col font-sans">
      <header className="h-20 bg-white border-b border-gray-200/50 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto text-[#990000]" />
            <div className="hidden sm:block">
              <h1 className="font-black text-gray-900 text-lg leading-tight">Yapay Zeka Mülakat</h1>
              <p className="text-[12px] font-bold text-gray-500">Simülasyon Merkezi</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-12">
        <AnimatePresence mode="wait">
          {!activeScenario ? (
            <motion.div 
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-red-50 text-[#990000] mb-6 shadow-inner">
                  <Mic size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Gerçekçi Bir Mülakata Hazır mısın?</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                  İESÜ Yapay Zeka Mülakat Koçu ile pratik yap, heyecanını yen ve mülakatlardaki eksiklerini keşfet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INTERVIEW_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setActiveScenario(scenario);
                      setCurrentQuestionIndex(0);
                    }}
                    className="bg-white rounded-xl p-8 text-left border border-gray-100 hover:border-iesu-navy/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-6">{scenario.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#990000] transition-colors">{scenario.title}</h3>
                    <p className="text-gray-500 text-sm">{scenario.questions.length} Kritik Soru</p>
                    <div className="mt-6 flex items-center text-[#990000] font-bold text-sm">
                      Simülasyonu Başlat <Play size={16} className="ml-2" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="interview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              {recordingState === 'idle' || recordingState === 'recording' ? (
                <div className="w-full max-w-3xl">
                  <div className="bg-white rounded-xl p-8 lg:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-6 left-6 text-[13px] font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                      Soru {currentQuestionIndex + 1} / {activeScenario.questions.length}
                    </div>
                    
                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-8 mt-4 shadow-inner">
                      {activeScenario.icon}
                    </div>
                    
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-12">
                      "{activeScenario.questions[currentQuestionIndex]}"
                    </h2>

                    {/* 2026 Spatial Computing (VR) Integration */}
                    <div className="bg-indigo-900/90 backdrop-blur border border-red-500/30 rounded-2xl p-4 sm:p-6 mb-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-indigo-300">
                            <Glasses size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">Holografik Mülakat (WebXR)</h4>
                            <p className="text-indigo-200 text-xs">Adayı ve Mülakatçıyı 3D Sanal Odada Simüle Et</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsVREnabled(!isVREnabled)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isVREnabled ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {isVREnabled ? <><CheckCircle size={14} /> VR Aktif</> : <><Zap size={14} /> VR Başlat</>}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <AnimatePresence>
                        {recordingState === 'recording' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center mb-8"
                          >
                            <div className="flex items-center gap-2 text-[#990000] font-bold text-xl mb-4">
                              <span className="w-3 h-3 rounded-full bg-[#990000] animate-pulse" />
                              {formatTime(timer)}
                            </div>
                            <div className="flex items-end justify-center gap-1 h-12 w-48">
                              {[...Array(20)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                                  transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.5 }}
                                  className="w-1.5 bg-[#990000]/60 rounded-t-full"
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {recordingState === 'idle' ? (
                        <button aria-label="İşlem Butonu" 
                          onClick={handleStartRecording}
                          className="w-24 h-24 rounded-full bg-[#990000] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(185,28,28,0.3)] hover:shadow-[0_0_60px_rgba(185,28,28,0.5)]"
                        >
                          <Mic size={40} />
                        </button>
                      ) : (
                        <button aria-label="İşlem Butonu" 
                          onClick={handleStopRecording}
                          className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,0,0,0.2)]"
                        >
                          <Square size={32} className="fill-current" />
                        </button>
                      )}
                      
                      <p className="text-gray-500 font-medium mt-6">
                        {recordingState === 'idle' ? 'Cevabınızı kaydetmek için mikrofona dokunun' : 'Kaydı durdurmak ve analize göndermek için dokunun'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : recordingState === 'processing' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 border-4 border-gray-200 border-t-iesu-navy rounded-full animate-spin mb-8" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Yapay Zeka Cevabınızı Analiz Ediyor...</h3>
                  <p className="text-gray-500">Ses tonunuz, kullandığınız kelimeler ve içerik kalitesi değerlendiriliyor.</p>
                </motion.div>
              ) : (
                renderFeedback()
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
