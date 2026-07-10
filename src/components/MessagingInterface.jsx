import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserCircle2, CheckCircle2, ChevronLeft, MessageSquare, Home, Compass, Briefcase, Bell, MessageCircle, Heart } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

// Helper component for Navbar Icons
const NavIcon = ({ icon, label, badge, active, onClick }) => {
  const getClasses = () => {
    switch (label) {
      case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
      case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
      case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'Mesajlar': return { text: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-500', glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' };
      case 'Bildirimler': return { text: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-500', glow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' };
      default: return { text: 'text-iesu-red', bg: 'bg-red-50', badge: 'bg-iesu-red', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
    }
  };
  const c = getClasses();
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-2xl transition-all duration-500 group ${active ? `${c.bg} ${c.text} shadow-sm` : `text-gray-400 hover:${c.text} hover:${c.bg}`}`}
      title={label}
    >
      {React.cloneElement(icon, { size: active ? 22 : 20, className: `mb-1 transition-all duration-500 ${active ? `scale-110 ${c.glow}` : `group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:${c.glow}`}` })}
      <span className={`text-[9px] font-bold tracking-wide transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block'}`}>
        {label}
      </span>
      {badge > 0 && (
        <span className={`absolute top-1 right-2 sm:right-3 w-4 h-4 ${c.badge} text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white`}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export default function MessagingInterface({ messages = [], setMessages, currentUser, userRole, contacts = [], setView, setSelectedUserId, isOverlay = false }) {
  // messages format: { id, senderId, senderName, senderAvatar, receiverId, receiverName, content, timestamp, read }
  
  const [activeContactId, setActiveContactId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllContacts, setShowAllContacts] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContactId]);

  // Apply 2x2 Messaging Matrix Rules
  const allowedContacts = contacts.filter(c => {
    if (userRole === 'admin') return true; // Admin can message anyone
    
    // Identify contact roles by their data signature
    const isContactCompany = !!c.sector;
    const isContactAcademic = !!c.title;
    const isContactAlumni = !!c.gradYear;
    const isContactStudent = !!c.year && !c.gradYear;

    if (userRole === 'student' || userRole === 'alumni') {
      return isContactStudent || isContactAlumni || isContactAcademic;
    }
    if (userRole === 'academic') {
      return isContactCompany || isContactStudent || isContactAlumni;
    }
    if (userRole === 'company') {
      return isContactAcademic;
    }
    return false;
  });

  // Extract unique contacts from messages and merge with available contacts
  const getConversations = () => {
    const convos = new Map();
    
    // Add existing contacts from directory (if provided and allowed)
    allowedContacts.forEach(c => {
      convos.set(c.id, {
        id: c.id,
        name: c.name,
        avatar: c.avatar || '',
        role: c.role || 'Kullanıcı',
        lastMessage: null,
        unreadCount: 0,
        timestamp: 0
      });
    });

    // Process messages to find recent chats
    messages.forEach(msg => {
      const isSender = msg.senderId === currentUser?.id;
      const isReceiver = msg.receiverId === currentUser?.id;
      
      if (!isSender && !isReceiver) return; // Not our message

      const otherId = isSender ? msg.receiverId : msg.senderId;
      
      const realContact = allowedContacts.find(c => c.id === otherId);
      if (!realContact) return; // Skip orphan messages entirely

      const otherName = realContact.name;
      const otherAvatar = realContact.avatar || realContact.logo || '';
      const otherRole = realContact.department ? 'Öğrenci' : realContact.sector ? 'Firma' : realContact.gradYear ? 'Mezun' : 'Akademik';

      const existing = convos.get(otherId) || {
        id: otherId,
        name: otherName,
        avatar: otherAvatar,
        role: otherRole,
        unreadCount: 0
      };

      if (!existing.timestamp || msg.timestamp > existing.timestamp) {
        existing.lastMessage = msg?.content;
        existing.timestamp = msg.timestamp;
      }

      if (isReceiver && !msg?.read) {
        existing.unreadCount += 1;
      }

      convos.set(otherId, existing);
    });

    return Array.from(convos.values())
      .filter(c => showAllContacts || c.lastMessage || (searchQuery && c.name.toLowerCase().includes(searchQuery.toLowerCase()))) // Show all if toggled or searched
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  };

  const conversations = getConversations().filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = conversations.find(c => c.id === activeContactId) || null;

  const currentChatMessages = (messages || [])
    .filter(msg => 
      (msg.senderId === currentUser?.id && msg.receiverId === activeContactId) ||
      (msg.receiverId === currentUser?.id && msg.senderId === activeContactId)
    )
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // Mark as read when opening a chat
  useEffect(() => {
    if (activeContactId && messages) {
      const unreadMessages = currentChatMessages.filter(m => m.receiverId === currentUser?.id && !m.read);
      if (unreadMessages.length > 0) {
        setMessages(prevMessages => (prevMessages || []).map(m => 
          (m.receiverId === currentUser?.id && m.senderId === activeContactId) ? { ...m, read: true } : m
        ));
      }
    }
  }, [activeContactId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContactId) return;

    const newMsg = {
      id: 'MSG-' + Date.now(),
      senderId: currentUser?.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: activeContact?.id,
      receiverName: activeContact?.name,
      receiverAvatar: activeContact?.avatar,
      content: newMessage.trim(),
      timestamp: Date.now(),
      read: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const chatUI = (
    <>
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-gray-900">Mesajlar</h2>
            <button 
              onClick={() => setShowAllContacts(!showAllContacts)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${showAllContacts ? 'bg-iesu-red text-white' : 'bg-red-50 text-iesu-red hover:bg-red-100'}`}
              title="Yeni Mesaj"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              id="chat-search"
              type="text" 
              placeholder="Mesajlarda veya kişilerde ara..." 
              className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(conversations || []).length > 0 ? (
            conversations.map(convo => (
              <div 
                key={convo.id}
                onClick={() => setActiveContactId(convo.id)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeContactId === convo.id ? 'bg-red-50/50 border-red-500' : 'border-transparent hover:bg-gray-50'}`}
              >
                <div className="relative">
                  <img src={convo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.name)}&background=132A49&color=fff`} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                  {convo.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {convo.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 truncate text-[13px]">{convo.name}</h4>
                    {convo.timestamp && (
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 font-medium">
                        {formatTime(convo.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{convo.lastMessage || convo.role}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-50">
              <MessageSquare size={32} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-500">Henüz mesaj bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
      <div className={`flex-1 flex flex-col bg-white ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContactId(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600 transition">
                  <ChevronLeft size={20} />
                </button>
                <img src={activeContact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact.name)}&background=132A49&color=fff`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{activeContact.name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">{activeContact.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 transition" title="Profili Gör">
                  <UserCircle2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
              {currentChatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
                  <MessageSquare size={48} className="mb-4 opacity-20" />
                  <p>Henüz mesaj yok. İlk mesajı siz gönderin!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentChatMessages.map(msg => {
                    const isMine = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${isMine ? 'bg-iesu-red text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                          <p className="text-[13.5px] leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1.5 ${isMine ? 'text-red-200' : 'text-gray-400'}`}>
                            <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                            {isMine && <CheckCircle2 size={12} className={msg.read ? 'text-white' : ''} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      handleSend(e);
                    }
                  }}
                  placeholder="Bir mesaj yazın..."
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-sm py-2 px-2 text-gray-800"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 rounded-xl bg-iesu-red text-white flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#FAFAFA]">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-iesu-red ml-1" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Mesajlarınız</h2>
            <p className="text-gray-500 max-w-sm text-sm">Sohbete başlamak için sol taraftan bir kişi seçin veya yeni bir konuşma başlatın.</p>
          </div>
        )}
      </div>
    </>
  );

  if (isOverlay) {
    return <div className="w-full h-full flex bg-white">{chatUI}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          <button onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 text-gray-600" title="Geri Dön">
            <Home size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-center">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* RIGHT: Notifications & Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-iesu-red`} title="Bildirimler">
              <div className="relative">
                <Heart size={24} strokeWidth={2.5} className="fill-current text-iesu-red/10" />
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="messaging" />
          </div>
          
        </div>
      </nav>
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-24 flex-1 flex flex-col w-full">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex h-[700px] md:h-[80vh] w-full">
          {chatUI}
        </div>
      </main>

      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-iesu-red`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Öğrenci')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}
