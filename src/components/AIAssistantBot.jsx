import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, MessageSquare, Send, ArrowRight, BookOpen, BrainCircuit, ShieldCheck, Activity, ThumbsUp, ThumbsDown, Brain, BarChart3, ExternalLink, Mic, Volume2, VolumeX } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { AIEngine, SelfLearningMemory } from '../data/AIEngine';
import { generateAIResponse } from '../services/aiService';

export default function AIAssistantBot({ currentUser }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const swarmMetrics = useAppStore(state => state.swarmMetrics);
  const incrementSwarmData = useAppStore(state => state.incrementSwarmData);
  const events = useAppStore(state => state.events) || [];
  const clubs = useAppStore(state => state.clubs) || [];
  const jobs = useAppStore(state => state.jobs) || [];
  const news = useAppStore(state => state.news) || [];
  const liveRooms = useAppStore(state => state.liveRooms) || [];
  const sharedBrainDictionary = useAppStore(state => state.sharedBrainDictionary) || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [learnedFacts, setLearnedFacts] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isOmniScanning, setIsOmniScanning] = useState(false);
  const [currentBgTask, setCurrentBgTask] = useState('Sonsuz Öğrenme Modu: Aktif');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Tarayıcınız sesli komutları desteklemiyor.');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto send could be done here, but let's let user verify text
    };

    recognition.start();
  };

  const speakResponse = (text) => {
    if (!isVoiceMode) return;
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── JARVIS V2 WINDOWS INSPIRATION: Global Hotkey (Ctrl+J) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(prev => {
          const nextState = !prev;
          if (nextState) {
            // Asistan açıldığında 500ms sonra otomatik olarak mikrofonu dinlemeye başla
            setTimeout(() => {
              if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                startListening();
              }
            }, 500);
          }
          return nextState;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // AUTONOMOUS DEPARTMENT RESEARCH ON LOAD
  useEffect(() => {
    if (currentUser && messages.length === 0) {
      const name = currentUser?.name?.split(' ')[0] || 'Dostum';
      const dept = currentUser?.department || '';
      
      let initialMsg = `Merhaba ${name}, hoş geldin! 😊 Ben senin dijital kariyer asistanın Anka.`;
      
      if (dept) {
        // Auto-research logic mock
        const autoLearnId = `dept_${dept}`;
        if (!learnedFacts.includes(autoLearnId)) {
          const newFact = `${dept} bölümü için en çok aranan yetenekleri araştırdım: Sürekli kendini güncel tutman lazım. Birlikte projeler yapıp portfolyonu uçuracağız!`;
          setLearnedFacts(prev => [...prev, newFact]);
          initialMsg = `Merhaba ${name}, hoş geldin! 😊 ${dept} bölümünde okuduğunu görüyorum. Senin için sektör trendlerini ve uygun staj fırsatlarını araştırmaya başladım bile. Sana nasıl yardımcı olabilirim? 🚀`;
        }
      } else {
        initialMsg += ` Bugün neler yapmak istersin? CV oluşturabilir, iş ilanlarına bakabilir veya mülakat pratiği yapabiliriz.`;
      }
      
      setMessages([{ sender: 'ai', text: initialMsg }]);
    }
  }, [currentUser]);

  // Canlı Swarm Datasını Simulasyonla Arttır (Evolution Loop)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      incrementSwarmData();
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, incrementSwarmData]);

  // Sonsuz Öğrenme Modu (Infinite Learning) Arka Plan Göstergesi
  useEffect(() => {
    if (!isOpen) return;
    const bgTasks = [
      'Arka planda GitHub trendleri taranıyor...',
      'Kariyer piyasası analiz ediliyor...',
      'Öğrenci profiline uygun stajlar aranıyor...',
      'Esenyurt duyuruları kontrol ediliyor...',
      'İletişim algoritması sana göre ayarlanıyor...'
    ];
    let i = 0;
    const taskInterval = setInterval(() => {
      i = (i + 1) % bgTasks.length;
      setCurrentBgTask(bgTasks[i]);
    }, 6000);
    return () => clearInterval(taskInterval);
  }, [isOpen]);

  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(0);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    const msgLower = userMsg.toLowerCase();
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    // ── MODÜL 1: Niyet Sınıflandırma (Intent Classifier) ──
    const intents = {
      greeting: ["merhaba", "selam", "hey", "günaydın", "iyi akşamlar", "iyi günler", "hello", "hi"],
      status: ["nasılsın", "naber", "ne haber", "nasıl gidiyor", "durumun ne", "iyi misin"],
      thanks: ["teşekkür", "sağol", "eyvallah", "çok sağ ol"],
      cv: ["cv", "özgeçmiş", "resume", "portfolyo", "portfolio"],
      job: ["iş", "ilan", "staj", "kariyer", "pozisyon", "iş ilanı", "maaş", "başvuru"],
      interview: ["mülakat", "interview", "görüşme", "soru sor", "mülakat sorusu"],
      skill: ["yetenek", "beceri", "skill", "öğren", "kurs", "eğitim", "sertifika"],
      network: ["network", "bağlantı", "linkedin", "profesyonel ağ", "mentor"],
      help: ["yardım", "help", "ne yapabilirsin", "komutlar", "neler yapabilirsin"],
      goodbye: ["görüşürüz", "hoşça kal", "bye", "güle güle", "kapan"],
      emotion_negative: ["üzgün", "mutsuz", "stres", "sıkıldım", "korkuyorum", "endişe", "kaygı", "moral", "motivasyon"],
      emotion_positive: ["mutlu", "harika", "süper", "muhteşem", "çok iyi", "başardım", "kabul edildim", "kazandım"],
      university: ["üniversite", "bölüm", "hoca", "ders", "not", "vize", "final", "devam"],
      club: ["kulüp", "topluluk", "etkinlik", "sosyal"],
      exam: ["sınav", "vize", "final", "ödev", "proje teslim"],
      scan: ["tara", "araştır", "scan", "derin", "omni", "öğren", "internet", "github", "kariyer", "işkur", "trend"],
      query_events: ["etkinlik", "bugün ne var", "faaliyet", "seminer", "konferans", "zirve"],
      query_clubs: ["kulüp", "kulüpler", "topluluklar", "öğrenci topluluğu"],
      query_jobs: ["iş ilanı", "staj", "açık pozisyon", "bana uygun", "iş bul"]
    };

    // ── Gelişmiş Çoklu Niyet (Multi-Intent) Algılayıcı ──
    const classifyAllIntents = (msg) => {
      const found = [];
      for (const [intent, keywords] of Object.entries(intents)) {
        if (keywords.some(kw => msg.includes(kw))) found.push(intent);
      }
      return found.length > 0 ? found : ["unknown"];
    };

    const detectedIntents = classifyAllIntents(msgLower);
    // Ana intent olarak ilkini al (UI state ve animasyonlar için)
    const detectedIntent = detectedIntents[0];

    setIsThinking(true);
    setThinkingStage(1);

    if (detectedIntent === "scan") {
      setIsOmniScanning(true);
      setTimeout(() => setThinkingStage(2), 1500); 
      setTimeout(() => setThinkingStage(3), 3000); 
      setTimeout(() => setThinkingStage(4), 4500); 
    } else {
      setTimeout(() => setThinkingStage(2), 1000); 
      setTimeout(() => setThinkingStage(3), 2000); 
      setTimeout(() => setThinkingStage(4), 3000); 
    }

    const waitTime = detectedIntent === "scan" ? 6000 : 3500;

    
    const processAI = async () => {
      setIsThinking(false);
      setIsOmniScanning(false);
      setThinkingStage(0);
      let aiActions = null;
      let earnedBP = 0;

      const blockedWords = [
        "amk", "aq", "mk", "sik", "yarr", "orospu", "piç", "göt", 
        "yavşak", "salak", "gerizekalı", "aptal", "mal ", "dangalak",
        "hıyar", "kodumun", "kahpe", "puşt", "pezevenk", "ibne",
        "s2m", "anan", "bacın", "sg", "stfu", "fuck", "shit", "damn",
        "bitch", "ass ", "dick", "wtf", "kapa çene", "defol"
      ];
      
      if (blockedWords.some(word => msgLower.includes(word))) {
        const aiResponse = "Bu tarz ifadeler platformumuzda uygun değil. Burası profesyonel bir kariyer geliştirme alanı, lütfen saygılı bir dil kullanalım. 😊 Sana nasıl yardımcı olabilirim?";
        const msgId = Date.now();
        SelfLearningMemory.logConversation(userMsg, aiResponse, 'blocked_slang');
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse, id: msgId, feedbackGiven: false }]);
        return;
      }

      // Determine UI actions based on intents
      let finalIntents = [...detectedIntents];
      if (finalIntents.includes("greeting") && finalIntents.includes("status")) {
        finalIntents = finalIntents.filter(i => i !== "status"); 
      }

      finalIntents.forEach((intent) => {
        if (intent === 'cv') { aiActions = [...(aiActions||[]), { label: "CV Oluşturucu", path: "/ai-cv" }]; earnedBP += 15; }
        else if (intent === 'job') { aiActions = [...(aiActions||[]), { label: "İlanlara Akalım", path: "/jobs" }]; earnedBP += 10; }
        else if (intent === 'interview') { aiActions = [...(aiActions||[]), { label: "Simülatöre Gir", path: "/interview_sim" }]; earnedBP += 20; }
        else if (intent === 'skill') { aiActions = [...(aiActions||[]), { label: "Profilini Güçlendir", path: "/profile_update" }]; earnedBP += 10; }
        else if (intent === 'network') { aiActions = [...(aiActions||[]), { label: "Ağı Keşfet", path: "/groups" }]; earnedBP += 10; }
      });

      // Call LLM
      const sysInst = `Sen İESÜ Kariyer Merkezi'nin dijital asistanı Anka'sın. Kullanıcı: ${currentUser?.name || 'Öğrenci'}, Bölümü: ${currentUser?.department || 'Bilinmiyor'}. Kullanıcıya samimi, motive edici ve profesyonel cevap ver. Esenyurt Üniversitesi kariyer merkezi odaklı ol.`;
      
      const aiResponse = await generateAIResponse(userMsg, sysInst);

      const msgId = Date.now();
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse, actions: aiActions, id: msgId, feedbackGiven: false }]);

      if (earnedBP > 0) {
        useAppStore.getState().setUserBP(useAppStore.getState().userBP + earnedBP);
        window.toast && window.toast.success(`🎉 Anka ile interaksiyondan +${earnedBP} BP kazandın!`);
      }

      speakResponse(aiResponse);
      SelfLearningMemory.logConversation(userMsg, aiResponse, detectedIntent);
    };

    setTimeout(processAI, waitTime);

  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-gradient-to-tr from-red-600 to-violet-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] flex items-center justify-center text-white hover:scale-110 transition-transform group"
      >
        {isOpen ? <X size={24} /> : <BrainCircuit size={24} className="group-hover:animate-pulse" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-violet-600 p-4 text-white shrink-0 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <BrainCircuit size={100} />
            </div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div 
                className="cursor-pointer hover:bg-white/10 p-1.5 -ml-1.5 rounded-lg transition-colors group"
                onClick={() => setShowStats(!showStats)}
                title="Yapay Zeka Belleğini Görüntüle"
              >
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BrainCircuit size={20} className="text-indigo-200 group-hover:animate-spin-slow" />
                  Akıllı Kariyer Asistanı
                </h3>
                <p className="text-xs text-indigo-200 opacity-90 mt-0.5 flex items-center gap-1 transition-all duration-500">
                  <Activity size={10} className="animate-pulse shrink-0" />
                  <span className="truncate max-w-[180px]">{currentBgTask}</span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button 
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`p-1.5 rounded-lg transition-colors ${isVoiceMode ? 'bg-red-500 text-white' : 'hover:bg-red-500/30 text-indigo-100'}`}
                  title={isVoiceMode ? "Sesli Yanıt Kapat" : "Sesli Yanıt Aç"}
                >
                  {isVoiceMode ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-indigo-100 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="mt-3 bg-black/20 rounded-lg p-2 backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity size={12} className="text-amber-300" />
                <span className="text-[10px] font-medium text-indigo-100">Duygu Analizi (NLP):</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-300">Stabil</span>
                <div className="w-16 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat / Stats Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative scrollbar-thin scrollbar-thumb-gray-200">
            {isOmniScanning && (
              <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6 rounded-t-none animate-fade-in">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-red-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
                  <BrainCircuit size={40} className="absolute inset-0 m-auto text-emerald-400 animate-pulse" />
                </div>
                
                <h3 className="text-xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  OMNI-CRAWLER AKTİF
                </h3>
                
                <div className="h-6 overflow-hidden w-full text-center">
                  <p className="text-sm text-slate-300 font-mono animate-fade-in-up">
                    {thinkingStage === 1 && "> Başlatılıyor..."}
                    {thinkingStage === 2 && "> Kariyer.net ve İŞKUR veritabanları taranıyor..."}
                    {thinkingStage === 3 && "> GitHub açık kaynak trendleri analiz ediliyor..."}
                    {thinkingStage >= 4 && "> Veriler SelfLearningMemory ağına işleniyor..."}
                  </p>
                </div>

                <div className="w-full bg-red-900 rounded-full h-1.5 mt-8 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(thinkingStage / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {showStats ? (
              <div className="animate-fade-in text-sm space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full pointer-events-none"></div>
                  <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <Brain size={16} className="text-red-500" /> 
                    Nöral Bellek İstatistikleri
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
                      <div className="text-xs text-red-600/80 mb-1">Toplam Etkileşim</div>
                      <div className="text-xl font-bold text-indigo-700">{SelfLearningMemory.getStats().totalConversations}</div>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-50">
                      <div className="text-xs text-emerald-600/80 mb-1">Çıkarılan Örüntü</div>
                      <div className="text-xl font-bold text-emerald-700">{SelfLearningMemory.getStats().totalPatterns}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 text-xs uppercase tracking-wider">Son Algılanan Niyetler</h4>
                  <div className="flex flex-wrap gap-2">
                    {conversationContext.length > 0 ? (
                      conversationContext.map((intent, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium border border-gray-200">
                          #{intent}
                        </span>
                      ))
                    ) : (
                      <div className="text-gray-400 text-xs italic">Henüz yeterli veri yok.</div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Otomatik Öğrenilenler</span>
                    <span className="bg-indigo-100 text-red-600 px-1.5 py-0.5 rounded text-[10px]">{learnedFacts.length}</span>
                  </h4>
                  {learnedFacts.length > 0 ? (
                    <ul className="space-y-2">
                      {learnedFacts.slice(-3).map((fact, i) => (
                        <li key={i} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-2">
                          "{fact}"
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 text-xs italic flex items-center gap-1.5">
                      <BookOpen size={12} /> Sisteme yeni bilgi girişi bekleniyor...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-violet-500 flex items-center justify-center mr-2 shrink-0 shadow-sm text-white relative">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm max-w-[80%] ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'}`}>
                      <div className="whitespace-pre-line">{msg.text}</div>
                      
                      {msg.actions && msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(act.path);
                          }}
                          className="mt-3 flex items-center gap-1.5 w-full justify-center bg-indigo-50 text-red-600 hover:bg-indigo-100 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border border-indigo-100/50"
                        >
                          {act.label} <ExternalLink size={12} />
                        </button>
                      ))}

                      {msg.sender === 'ai' && idx > 0 && !msg.feedbackGiven && (
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400 mr-1">Faydalı mı?</span>
                          <button 
                            onClick={() => {
                              SelfLearningMemory.recordFeedback(msg.id, 1);
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, feedbackGiven: true, feedbackScore: 1 } : m));
                            }}
                            className="p-1 rounded hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition"
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button 
                            onClick={() => {
                              SelfLearningMemory.recordFeedback(msg.id, -1);
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, feedbackGiven: true, feedbackScore: -1 } : m));
                            }}
                            className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition"
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                      {msg.sender === 'ai' && msg.feedbackGiven && (
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                            <Brain size={10} /> Geri bildirim kaydedildi — AI öğreniyor
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isThinking && (
                  <div className="flex gap-3 items-end">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm text-white">
                      <Sparkles size={14} className="animate-spin-slow" />
                    </div>
                    <div className="p-3 bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] text-[13px] flex flex-col gap-1.5 animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                        </span>
                        <span className="text-xs font-medium text-red-500">
                          {thinkingStage === 1 && "Düşünüyorum..."}
                          {thinkingStage === 2 && "Bilgilerimi tarıyorum..."}
                          {thinkingStage === 3 && "Sana en iyi cevabı hazırlıyorum..."}
                          {thinkingStage >= 4 && "Neredeyse hazır..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <button
              onClick={startListening}
              disabled={isThinking}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              title="Sesli Soru Sor"
            >
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isThinking && handleSend()}
              disabled={isThinking}
              placeholder={isThinking ? "Ajanlar veri işliyor..." : isListening ? "Dinleniyor..." : "Yapay Zeka'ya sor..."}
              className={`flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all ${isThinking ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-red-500/50'}`}
            />
            <button 
              onClick={handleSend}
              disabled={isThinking || !input.trim()}
              className={`w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 ${(isThinking || !input.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 hover:scale-105 active:scale-95'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
