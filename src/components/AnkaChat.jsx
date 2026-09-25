import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, ChevronLeft, Sparkles, Brain, Loader2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import { generateAIResponse } from '../lib/gemini';

export default function AnkaChat({ setView, currentUser, userRole, setSelectedUserId }) {
  const [messages, setMessages] = useState([
    { id: 1, text: `Merhaba ${currentUser?.name || 'Esenyurtli'}! Ben Anka, senin kişisel Kariyer Danışmanınım. Hangi alanda uzmanlaşmak istiyorsun, ya da mülakat provası mı yapmak istersin?`, isBot: true }
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
      Sen Esenyurt Üniversitesi Kariyer Merkezi Danışmanı "Anka"sın. Çok akıllı, yardımsever ve motive edici bir kariyer mentorusun.
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
        setMessages(prev => [...prev, { id: Date.now(), text: "Kariyer danışma ağına şu an ulaşılamıyor, ancak kariyerin için çok güçlü bir profilin olduğunu biliyorum. Birazdan tekrar deneyebiliriz!", isBot: true }]);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-xs flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#990000] border border-slate-200 transition flex items-center justify-center cursor-pointer shadow-xs"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] border border-red-100 flex items-center justify-center shadow-xs">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-none">Anka Kariyer Danışmanı</h1>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yapay Zeka Destekli Kariyer Rehberi</span>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
        
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 md:p-6 mb-4 flex flex-col gap-5 custom-scrollbar scroll-smooth"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3.5 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${msg.isBot ? 'bg-gradient-to-br from-red-700 via-[#990000] to-rose-800 text-white' : 'bg-slate-800 text-white'}`}>
                {msg.isBot ? <Brain size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs' : 'bg-gradient-to-r from-red-700 via-[#990000] to-rose-700 text-white rounded-tr-xs shadow-md shadow-red-950/10'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3.5 max-w-[85%] self-start">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-gradient-to-br from-red-700 via-[#990000] to-rose-800 text-white">
                <Brain size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-700 rounded-tl-xs shadow-xs flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#990000]" />
                <span className="text-xs font-semibold text-slate-500 animate-pulse">Anka yanıt hazırlıyor...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 focus-within:border-[#990000] focus-within:ring-2 focus-within:ring-red-100 transition-all">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-slate-900 px-4 py-3 placeholder-slate-400 text-sm font-medium"
            placeholder="Kariyerin, stajların veya mülakat hazırlığın hakkında Anka'ya danış..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-red-700 via-[#990000] to-rose-700 hover:opacity-95 disabled:opacity-40 text-white rounded-xl transition shadow-md shadow-red-950/10 flex items-center justify-center cursor-pointer shrink-0"
            title="Gönder"
          >
            <Send size={18} />
          </button>
        </div>
        
        <p className="text-center text-[11px] font-medium text-slate-400 mt-3 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-[#990000]" /> İESÜ Kariyer Geliştirme Koordinatörlüğü Akıllı Asistanı
        </p>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
