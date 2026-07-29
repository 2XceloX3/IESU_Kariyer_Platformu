import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Trophy, Target, Heart, Award, Flame, Minimize2, Maximize2, Zap } from 'lucide-react';
import { generateAIResponse } from '../lib/gemini';
import useAppStore from '../store/useAppStore';

export default function AICareerWingman() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      text: "Selam! Ben Wingman, Esenyurt Kariyer Asistanın. 🚀\nBugün CV'ni ATS sistemlerine uygun hale getirebilir, yaklaşan mülakatın için pratik yapabilir veya sadece iş arama stresi hakkında dertleşebiliriz. Nereden başlayalım?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Gamification Mock States
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(450);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    // XP kazanımı simülasyonu
    setXp(prev => prev + 15);
    
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    const systemPrompt = `Sen Esenyurt Kariyer Platformu'nun Kariyer Asistanısın.

CORE RULES (Kesinlikle Uyulacaklar):
1. **Duygusal Zeka ve Empati (A-A-A Framework)**: Öğrenci yorgun, reddedilmiş veya stresli hissediyorsa önce durumu kabul et (Acknowledge), onunla aynı tarafta olduğunu göster (Align) ve sonra çözüme geç (Action). "Reddedilmek sürecin bir parçası, bu senin değerini belirlemez" gibi motive edici cümleler kur.
2. **Sokratik Sorgulama**: Cevabı direkt verme. "Sence bu yeteneği CV'ne nasıl daha etkili yazabiliriz?" gibi sorularla onu düşündürt.
3. **Maaş Pazarlığı (Salary Negotiation)**: İlk iş tekliflerinde pazarlık yapmaktan çekinenlere cesaret ver. "İlk teklifi hemen kabul etme, yazılı olarak isteyip değerlendir" stratejisini ve pazar araştırmasına dayalı mantıklı pazarlık kalıplarını öğret.
4. **Uzaktan Çalışma (Remote Work) Tavsiyeleri**: Uzaktan veya hibrit staja başlayacaklara "Görünürlüğünü artırmak için haftalık özet raporları gönder" veya "Sanal kahve sohbetleri (Virtual Coffee) ayarla" gibi spesifik taktikler ver.
5. **Oyunlaştırma ve XP**: Öğrencinin gösterdiği her çabayı (reddedilse bile) "Resilience XP (Direnç Puanı)" olarak kutla. Kariyer serisini (streak) bozmamasını hatırlat.
6. **Mühendislik, İşletme ve Sanat Kariyer Yolları**: Bölüm spesifik basamak stajlarını (Stepping-stone internships) öner (örneğin mühendisler için QA veya Draft stajları, işletmeciler için operasyon/analist stajları).

Kısa, net, samimi, markdown (kalın yazı, madde imleri) kullanan ve emoji barındıran Türkçe bir dil kullan.`;

    try {
      const aiResponse = await generateAIResponse(userMsg, systemPrompt);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Şu an sunucularımızda bir yoğunluk var, lütfen birazdan tekrar dene! 🛠️", sender: 'ai' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className={`${isExpanded ? 'w-[600px] h-[700px] fixed bottom-6 right-6' : 'w-80 sm:w-[400px] h-[550px]'} bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white flex flex-col overflow-hidden animate-fade-in transition-all duration-300`}>
          
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-[#990000] to-red-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Bot size={22} className="text-red-100" />
              </div>
              <div>
                <h3 className="font-black text-base flex items-center gap-1">Kariyer Asistanı <Sparkles size={14} className="text-yellow-400"/></h3>
                <p className="text-[11px] text-red-200 font-medium">Sohbetsel Kariyer Koçu</p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button onClick={() => setIsExpanded(!isExpanded)} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* GAMIFICATION BAR */}
          <div className="px-4 py-2.5 bg-red-50/50 border-b border-red-100 flex items-center justify-between backdrop-blur-md">
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 text-orange-600 font-black text-xs bg-orange-100/50 px-2.5 py-1 rounded-lg">
                 <Flame size={14} fill="currentColor" />
                 {streak} Gün Seri
               </div>
               <div className="flex items-center gap-1.5 text-red-600 font-black text-xs bg-indigo-100/50 px-2.5 py-1 rounded-lg">
                 <Zap size={14} fill="currentColor" />
                 {xp} XP
               </div>
             </div>
             <span className="text-[10px] font-bold text-gray-500">Çırak Seviyesi</span>
          </div>
          
          {/* CHAT AREA */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3.5 text-[13px] leading-relaxed font-medium shadow-sm ${
                  m.sender === 'ai' 
                    ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm' 
                    : 'bg-gradient-to-r from-[#990000] to-red-800 text-white rounded-2xl rounded-tr-sm'
                }`}>
                  {m.text.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line.startsWith('- ') ? (
                        <li className="ml-2 mb-1 list-disc list-inside">{line.substring(2)}</li>
                      ) : line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                      ) : (
                        <span>{line}</span>
                      )}
                      {idx < m.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-[80%] flex gap-1.5 items-center shadow-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* QUICK CHIPS */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 bg-gray-50/30 flex gap-2 overflow-x-auto hide-scrollbar">
              <button onClick={() => setInput("Staj mülakatım var, bana STAR metodunu anlat.")} className="shrink-0 text-[11px] font-bold text-red-600 bg-white border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-50 transition shadow-sm">🎯 Mülakat Pratiği</button>
              <button onClick={() => setInput("Sürekli reddediliyorum, moralim çok bozuk.")} className="shrink-0 text-[11px] font-bold text-rose-600 bg-white border border-rose-100 px-3 py-1.5 rounded-full hover:bg-rose-50 transition shadow-sm">❤️ Dertleş</button>
              <button onClick={() => setInput("CV'mi ATS uyumlu nasıl yaparım?")} className="shrink-0 text-[11px] font-bold text-emerald-600 bg-white border border-emerald-100 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition shadow-sm">📄 CV Kontrolü</button>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
            <div className="relative flex items-center">
              <input 
                value={input} 
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Wingman'e sor..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-5 pr-14 py-3.5 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-400 outline-none transition-all placeholder-gray-400"
              />
              <button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 top-1.5 w-10 h-10 bg-gradient-to-r from-red-600 to-red-600 disabled:opacity-50 hover:shadow-lg text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0"
              >
                <Send size={18} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group animate-pulse-slow">
          {/* Floating Tooltip */}
          <div className="absolute right-[110%] top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none flex items-center gap-2">
            <div>
              <span className="block text-gray-400 text-[10px] font-medium leading-none mb-1">Yeni Modül</span>
              Mentör ile Tanış!
            </div>
            <Sparkles size={16} className="text-yellow-500" />
          </div>

          <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-[#990000] to-red-800 text-white rounded-[1.2rem] shadow-2xl shadow-red-900/30 flex items-center justify-center hover:scale-110 transition-all duration-300 relative border-2 border-white/20"
          >
            <Bot size={28} />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center animate-pulse shadow-md">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
