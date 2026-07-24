import React, { useState } from 'react';
import { MessageCircle, X, Maximize2, Send, ChevronDown } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function FloatingChatWidget({ setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const contacts = useAppStore(state => state.alumni) || []; // Mock contacts
  const currentUser = useAppStore(state => state.currentUser);

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 animate-fade-in">
      
      {/* Expanded Chat Widget */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: '500px', maxHeight: '70vh' }}>
          
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold">{activeChat ? activeChat.name : 'Mesajlar'}</h3>
            <div className="flex gap-2">

              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
            {!activeChat ? (
              // Chat List
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {contacts.slice(0, 5).map(contact => (
                  <div key={contact.id} onClick={() => setActiveChat(contact)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer transition">
                    <img src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">{contact.name}</div>
                      <div className="text-xs text-gray-500 truncate">Son mesaj içeriği burada...</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Active Chat View
              <div className="flex-1 flex flex-col bg-[#E5E5E5]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-sm p-2 text-sm shadow-sm max-w-[80%]">Merhaba!</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm p-2 text-sm shadow-sm max-w-[80%]">Nasılsın?</div>
                  </div>
                </div>
                {/* Input */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <button onClick={() => setActiveChat(null)} className="p-2 text-gray-500 hover:text-gray-900 transition">
                    <ChevronDown className="rotate-90" size={20} />
                  </button>
                  <input type="text" placeholder="Mesaj..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
                  <button className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black transition shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group"
        >
          <MessageCircle size={30} className="group-hover:-rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold">3</span>
        </button>
      )}
    </div>
  );
}
