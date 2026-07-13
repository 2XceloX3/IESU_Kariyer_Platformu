import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AICareerWingman() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Selam! Ben senin Kariyer Asistanınım (Wingman). Sana en uygun işi bulmam için 'İstanbul'da part-time yazılım işleri' gibi doğal dille bir şeyler yazabilirsin! 🚀", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user msg
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    
    // Mock AI Reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Harika! Senin için algoritmayı filtreliyorum... Profilindeki yeteneklerinle tam eşleşen 3 yeni ilan buldum. 'Sizin İçin' akışına ekledim, göz atabilirsin! ✨", 
        sender: 'ai' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[500px] overflow-hidden animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-iesu-red flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm">AI Wingman</h3>
                <p className="text-[10px] text-gray-300 font-medium">Sohbetsel Kariyer Asistanı</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition"><X size={20} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${m.sender === 'ai' ? 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-none shadow-sm' : 'bg-iesu-red text-white self-end rounded-tr-none shadow-md shadow-red-200'}`}>
                {m.text}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input} 
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Bana nasıl bir iş aradığını söyle..." 
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none"
            />
            <button onClick={handleSend} className="w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center transition shrink-0">
              <Send size={16} className="-ml-0.5" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform relative group"
        >
          <Bot size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-iesu-red rounded-full flex items-center justify-center animate-pulse">
            <Sparkles size={10} fill="currentColor" />
          </span>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
            AI ile İş Bul ✨
          </div>
        </button>
      )}
    </div>
  );
}
