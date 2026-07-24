import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, ChevronLeft, Sparkles, Brain, Loader2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import { generateAIResponse } from '../lib/gemini';

export default function AnkaChat({ setView, currentUser, userRole, setSelectedUserId }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Merhaba ${currentUser?.name || 'Esenyurtli'}! Ben Anka, senin kişisel AI Kariyer Mentorunum. Hangi alanda uzmanlaşmak istiyorsun, ya da mülakat provası mı yapmak istersin?`, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isBot: false }]);
    setIsTyping(true);

    const contextMessages = messages.map(m => `${m.isBot ? 'Anka' : 'Öğrenci'}: ${m.text}`).join('\n');
    const prompt = `
      Sen Esenyurt Üniversitesi yapay zekası "Anka"sın. Çok akıllı, yardımsever ve motive edici bir kariyere mentorusun.
      Öğrencinin adı: ${currentUser?.name || 'Öğrenci'}.
      
      Sohbet Geçmişi:
      ${contextMessages}
      Öğrenci: ${userMsg}
      
      Sadece Anka olarak cevap ver, markdown kullanabilirsin. Kısa, samimi ve net ol (Maksimum 3-4 paragraf).
    `;

    try {
      const response = await generateAIResponse(prompt);
      setMessages(prev => [...prev, { id: Date.now(), text: response, isBot: true }]);
    } catch (e) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: "Esenyurt AI Ağına şu an ulaşılamıyor, ancak kariyerin için çok güçlü bir profilin olduğunu biliyorum. Birazdan tekrar deneyebiliriz!", isBot: true }]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      <header className="h-16 bg-[#0f172a]/80 backdrop-blur-xl border-b border-red-900 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-red-900 text-slate-300 hover:bg-slate-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="text-red-400" size={24} />
            <h1 className="font-black tracking-tight text-white">Anka AI Mentor</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-xl bg-[#1e293b] border border-red-900 p-4 md:p-6 mb-4 flex flex-col gap-6 custom-scrollbar scroll-smooth"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.isBot ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {msg.isBot ? <Brain size={20} /> : <User size={20} />}
              </div>
              <div className={`p-4 rounded-xl ${msg.isBot ? 'bg-red-900 border border-slate-700 text-slate-200 rounded-tl-sm' : 'bg-red-600 text-white rounded-tr-sm shadow-red-600/20 shadow-lg'}`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-4 max-w-[85%] self-start">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <Brain size={20} />
              </div>
              <div className="p-4 rounded-xl bg-red-900 border border-slate-700 text-slate-200 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-red-400" />
                <span className="text-sm text-slate-400 animate-pulse">Anka düşünüyor...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[#1e293b] p-2 rounded-2xl border border-red-900 flex items-center gap-2 shadow-2xl focus-within:border-red-500/50 transition-colors">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-slate-500"
            placeholder="Kariyerinle ilgili aklına takılan her şeyi Anka'ya sor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl transition shadow-lg flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
        
        <p className="text-center text-xs text-slate-600 mt-4 flex items-center justify-center gap-1">
          <Sparkles size={12}/> Anka AI, Esenyurt Üniversitesi'nin LLM mimarisi ile desteklenmektedir.
        </p>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
