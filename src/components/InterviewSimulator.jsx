import React, { useState, useEffect } from 'react';
import { Mic, Play, Square, CheckCircle, AlertCircle, Award, ChevronLeft, Volume2, History, MessageSquare, Lightbulb, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const INTERVIEW_SCENARIOS = [
  {
    id: 'software_engineer',
    title: 'Yazılım Mühendisliği',
    icon: '💻',
    questions: [
      "Bize biraz kendinden ve bugüne kadar geliştirdiğin en karmaşık projeden bahseder misin?",
      "React'ta useEffect hook'unun yaşam döngüsünü ve bağımlılık dizisinin (dependency array) önemini açıklar mısın?",
      "Büyük bir ekipte çalışırken bir kod çatışmasını (merge conflict) nasıl çözersin?"
    ]
  },
  {
    id: 'marketing',
    title: 'Dijital Pazarlama Uzmanı',
    icon: '📈',
    questions: [
      "Bir markanın dijital varlığını sıfırdan kurmak istesen ilk 3 adımın ne olurdu?",
      "Veriye dayalı bir kampanya optimizasyonu sürecini nasıl yönetirsin?",
      "Zorlu bir müşteri veya yöneticinin olumsuz geri bildirimine nasıl yaklaşırsın?"
    ]
  },
  {
    id: 'hr',
    title: 'İnsan Kaynakları (İK)',
    icon: '🤝',
    questions: [
      "Yeni nesil yetenekleri (Gen Z) şirkete çekmek için nasıl bir strateji izlersin?",
      "Performans düşüklüğü yaşayan bir çalışana geri bildirim verme sürecini simüle eder misin?",
      "Şirket kültürünün korunması sence neden önemlidir?"
    ]
  }
];

export default function InterviewSimulator({ setView, userRole, currentUser, setSelectedUserId }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, processing, feedback
  const [timer, setTimer] = useState(0);

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
      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-3xl w-full mx-auto"
    >
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
          <Award size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Yapay Zeka Analizi Hazır</h2>
          <p className="text-gray-500">Mülakat performansınız İESÜ Kariyer Yapay Zekası tarafından analiz edildi.</p>
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
            <AlertCircle size={20} /> Gelişim Alanları
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

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-8">
        <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
          <Lightbulb size={20} /> Yapay Zeka Önerisi
        </h3>
        <p className="text-blue-700 text-[15px] leading-relaxed">
          Bir dahaki sefere deneyimlerinizi anlatırken "Ben bu projeyi yaptım" yerine, "Projeyi şu zorluklara rağmen şu yöntemlerle başardım" formatını kullanmak ikna ediciliğinizi %40 artıracaktır.
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
          className="px-8 py-3 rounded-xl font-bold text-white bg-iesu-red hover:bg-red-700 transition shadow-lg shadow-red-500/20"
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
            onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto text-iesu-red" />
            <div className="hidden sm:block">
              <h1 className="font-black text-gray-900 text-lg leading-tight">Yapay Zeka Mülakat</h1>
              <p className="text-[12px] font-bold text-gray-400">Simülasyon Merkezi</p>
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 text-iesu-red mb-6 shadow-inner">
                  <Mic size={40} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Gerçekçi Bir Mülakata Hazır mısın?</h2>
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
                    className="bg-white rounded-3xl p-8 text-left border border-gray-100 hover:border-iesu-red/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div className="text-5xl mb-6">{scenario.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-iesu-red transition-colors">{scenario.title}</h3>
                    <p className="text-gray-500 text-sm">{scenario.questions.length} Kritik Soru</p>
                    <div className="mt-6 flex items-center text-iesu-red font-bold text-sm">
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
                  <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute top-6 left-6 text-[13px] font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                      Soru {currentQuestionIndex + 1} / {activeScenario.questions.length}
                    </div>
                    
                    <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-8 mt-4 shadow-inner">
                      {activeScenario.icon}
                    </div>
                    
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-12">
                      "{activeScenario.questions[currentQuestionIndex]}"
                    </h2>

                    <div className="flex flex-col items-center justify-center">
                      <AnimatePresence>
                        {recordingState === 'recording' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col items-center mb-8"
                          >
                            <div className="flex items-center gap-2 text-iesu-red font-bold text-xl mb-4">
                              <span className="w-3 h-3 rounded-full bg-iesu-red animate-pulse" />
                              {formatTime(timer)}
                            </div>
                            <div className="flex items-end justify-center gap-1 h-12 w-48">
                              {[...Array(20)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: ['20%', `${Math.random() * 80 + 20}%`, '20%'] }}
                                  transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.5 }}
                                  className="w-1.5 bg-iesu-red/60 rounded-t-full"
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {recordingState === 'idle' ? (
                        <button 
                          onClick={handleStartRecording}
                          className="w-24 h-24 rounded-full bg-iesu-red text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(185,28,28,0.3)] hover:shadow-[0_0_60px_rgba(185,28,28,0.5)]"
                        >
                          <Mic size={40} />
                        </button>
                      ) : (
                        <button 
                          onClick={handleStopRecording}
                          className="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,0,0,0.2)]"
                        >
                          <Square size={32} className="fill-current" />
                        </button>
                      )}
                      
                      <p className="text-gray-400 font-medium mt-6">
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
                  <div className="w-24 h-24 border-4 border-gray-200 border-t-iesu-red rounded-full animate-spin mb-8" />
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
