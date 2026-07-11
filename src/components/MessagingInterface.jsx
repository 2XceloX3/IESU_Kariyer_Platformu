import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserCircle2, CheckCircle2, ChevronLeft, MessageSquare, Home, Compass, Briefcase, Bell, MessageCircle, Heart, Phone, Video, Paperclip, Smile, Image as ImageIcon, MoreVertical, X, Eye, EyeOff, Film } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

const EMOJI_LIST = [
  '😀','😂','🥰','😎','🤔','👍','🙌','❤️','🔥','🎉','✨','👏','🚀','💡',
  '🎓','💼','📊','📈','🤝','✅','❌','👀','🧑‍🎓','👨‍💻','🏆','🎯','💯','📝','🔔',
  '🏢','🖥️','💻','📱','📚','🧠','💪','🌟','✈️','🌍','🗣️','🗣️','🙌','👋'
];

export default function MessagingInterface({ previousView, messages = [], setMessages, currentUser, userRole, contacts = [], groups = [], setView, setSelectedUserId, selectedGroupId, isOverlay = false }) {
  // messages format: { id, senderId, senderName, senderAvatar, receiverId, receiverName, content, timestamp, read, type: 'text'|'image'|'video'|'view_once', mediaUrl }
  
  const [activeContactId, setActiveContactId] = useState(selectedGroupId || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [viewedOnceMsgs, setViewedOnceMsgs] = useState([]);
  const [pendingMediaType, setPendingMediaType] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
        isGroup: false,
        lastMessage: null,
        unreadCount: 0,
        timestamp: 0
      });
    });

    // Add groups
    (groups || []).forEach(g => {
      convos.set(g.id, {
        id: g.id,
        name: g.name,
        avatar: g.logo || '',
        role: 'Topluluk',
        isGroup: true,
        lastMessage: null,
        unreadCount: 0,
        timestamp: 0
      });
    });

    // Process messages to find recent chats
    messages.forEach(msg => {
      const isSender = msg.senderId === currentUser?.id;
      const isReceiver = msg.receiverId === currentUser?.id;
      const isGroupMsg = msg.receiverId && msg.receiverId.startsWith('GRP-');
      
      let otherId;
      if (isGroupMsg) {
        otherId = msg.receiverId;
      } else {
        if (!isSender && !isReceiver) return; // Not our message
        otherId = isSender ? msg.receiverId : msg.senderId;
      }
      
      const existing = convos.get(otherId);
      if (!existing && !isGroupMsg) {
        // Find real contact
        const realContact = allowedContacts.find(c => c.id === otherId);
        if(realContact) {
           convos.set(otherId, {
            id: otherId,
            name: realContact.name,
            avatar: realContact.avatar || realContact.logo || '',
            role: realContact.department ? 'Öğrenci' : realContact.sector ? 'Firma' : realContact.gradYear ? 'Mezun' : 'Akademik',
            isGroup: false,
            unreadCount: 0,
            timestamp: 0
          });
        }
      }

      const updated = convos.get(otherId);
      if (updated) {
        if (!updated.timestamp || msg.timestamp > updated.timestamp) {
          updated.lastMessage = msg.type === 'image' ? '📷 Fotoğraf' : msg.type === 'video' ? '🎥 Video' : msg.type === 'view_once' ? '👁️ 1 Kez Görüntüle' : msg.content;
          updated.timestamp = msg.timestamp;
        }
        if ((isReceiver || (isGroupMsg && !isSender)) && !msg?.read) {
          updated.unreadCount += 1;
        }
        convos.set(otherId, updated);
      }
    });

    return Array.from(convos.values())
      .filter(c => showAllContacts || c.lastMessage || c.isGroup || (searchQuery && c.name.toLowerCase().includes(searchQuery.toLowerCase()))) // Show all if toggled or searched
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

  const handleSend = (e, customType = 'text', mediaUrl = null) => {
    if (e) e.preventDefault();
    if (!activeContactId) return;
    if (customType === 'text' && !newMessage.trim()) return;

    const newMsg = {
      id: 'MSG-' + Date.now(),
      senderId: currentUser?.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: activeContact?.id,
      receiverName: activeContact?.name,
      receiverAvatar: activeContact?.avatar,
      content: customType === 'text' ? newMessage.trim() : '',
      timestamp: Date.now(),
      read: false,
      type: customType,
      mediaUrl: mediaUrl
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleSendMedia = (type) => {
    setPendingMediaType(type);
    if(fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', type === 'video' ? 'video/*' : 'image/*');
      fileInputRef.current.click();
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      handleSend(null, pendingMediaType, evt.target.result);
      setPendingMediaType(null);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const markViewOnce = (msgId) => {
    if(!viewedOnceMsgs.includes(msgId)){
      setViewedOnceMsgs([...viewedOnceMsgs, msgId]);
    }
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
            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContactId(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600 transition">
                  <ChevronLeft size={20} />
                </button>
                <div className="relative">
                  <img src={activeContact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact.name)}&background=132A49&color=fff`} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{activeContact.name}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Çevrimiçi</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Sesli Ara">
                  <Phone size={18} />
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Görüntülü Ara">
                  <Video size={20} />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Daha Fazla">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#E5E5E5] custom-scrollbar" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
              {currentChatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
                  <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm text-center">
                    <MessageSquare size={32} className="mx-auto mb-2 text-iesu-red opacity-50" />
                    <p className="font-medium text-sm">Mesajlaşma başlatıldı. Güvenli şekilde iletişim kurabilirsiniz.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentChatMessages.map(msg => {
                    const isMine = msg.senderId === currentUser?.id;
                    const isViewed = viewedOnceMsgs.includes(msg.id);
                    
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-2 shadow-sm ${isMine ? 'bg-[#DCF8C6] text-gray-800 rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-[0_2px_10px_rgb(0,0,0,0.05)]'}`}>
                          
                          {/* Sender Name in Group Chat */}
                          {activeContact.isGroup && !isMine && (
                            <div className="text-[11px] font-bold text-red-600 mb-1 px-1.5">{msg.senderName}</div>
                          )}

                          {/* Text Message */}
                          {msg.type === 'text' && (
                            <p className="text-[14px] leading-relaxed tracking-wide px-1.5 pt-1">{msg.content}</p>
                          )}

                          {/* Image Message */}
                          {msg.type === 'image' && msg.mediaUrl && (
                            <div className="rounded-xl overflow-hidden mb-1">
                              <img src={msg.mediaUrl} alt="attachment" className="w-full max-h-64 object-cover" />
                            </div>
                          )}

                          {/* Video Message */}
                          {msg.type === 'video' && msg.mediaUrl && (
                            <div className="rounded-xl overflow-hidden mb-1 bg-black">
                              <video src={msg.mediaUrl} controls className="w-full max-h-64" />
                            </div>
                          )}

                          {/* View Once Message */}
                          {msg.type === 'view_once' && msg.mediaUrl && (
                            <div className="rounded-xl overflow-hidden mb-1 bg-gray-900 border border-gray-800 p-4 w-48 text-center flex flex-col items-center justify-center relative group">
                              {isMine ? (
                                <>
                                  <Eye size={24} className="text-gray-400 mb-2" />
                                  <p className="text-xs text-gray-300 font-bold">1 Kez Görüntülenebilir Fotoğraf</p>
                                </>
                              ) : isViewed ? (
                                <>
                                  <EyeOff size={24} className="text-gray-500 mb-2" />
                                  <p className="text-xs text-gray-500 font-bold">Açıldı</p>
                                </>
                              ) : (
                                <button onClick={() => markViewOnce(msg.id)} className="w-full h-full flex flex-col items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2 animate-pulse">
                                    <Eye size={20} />
                                  </div>
                                  <p className="text-xs text-white font-bold">Fotoğrafı Gör</p>
                                </button>
                              )}
                              
                              {/* Overlay for viewing */}
                              {!isMine && !isViewed && viewedOnceMsgs.includes(msg.id + '_temp') && (
                                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
                                  <div className="relative max-w-2xl w-full">
                                    <img src={msg.mediaUrl} className="w-full rounded-xl" />
                                    <button onClick={() => markViewOnce(msg.id)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
                                      <X size={24} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className={`flex items-center justify-end gap-1.5 mt-1 px-1 ${isMine ? 'text-green-700/70' : 'text-gray-400'}`}>
                            <span className="text-[10px] font-medium">{formatTime(msg.timestamp)}</span>
                            {isMine && <CheckCircle2 size={12} className={msg.read ? 'text-blue-500' : ''} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <div className="p-3 bg-[#F0F2F5] border-t border-gray-200 shrink-0 z-10 relative">
              
              {/* Attachment Menu */}
              {showAttachmentMenu && (
                <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 animate-fade-in z-20">
                  <button onClick={() => handleSendMedia('image')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><ImageIcon size={16} /></div> Fotoğraf
                  </button>
                  <button onClick={() => handleSendMedia('video')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Film size={16} /></div> Video
                  </button>
                  <button onClick={() => handleSendMedia('view_once')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Eye size={16} /></div> 1 Kez Görüntüle
                  </button>
                </div>
              )}

              {/* Hidden File Input for Media Selection */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={onFileChange} 
              />

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 sm:right-16 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72 max-h-64 overflow-y-auto grid grid-cols-6 gap-2 animate-fade-in z-20 custom-scrollbar">
                  {EMOJI_LIST.map(emoji => (
                    <button key={emoji} onClick={() => setNewMessage(prev => prev + emoji)} className="text-2xl hover:bg-gray-100 rounded-lg transition active:scale-95">
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button onClick={() => {setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false);}} className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${showAttachmentMenu ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200'}`} title="Dosya Ekle">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1 bg-white rounded-full border border-gray-300 flex items-center px-4 py-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder="Bir mesaj yazın..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-gray-800 placeholder-gray-400 outline-none"
                  />
                  <button onClick={() => {setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false);}} className={`w-8 h-8 rounded-full flex items-center justify-center transition ml-2 ${showEmojiPicker ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`} title="Emoji">
                    <Smile size={22} />
                  </button>
                </div>

                {newMessage.trim() ? (
                  <button 
                    onClick={handleSend}
                    className="w-10 h-10 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] active:scale-95 transition-all shrink-0 shadow-md"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                ) : (
                  <button className="w-10 h-10 rounded-full text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all shrink-0">
                    <Phone size={20} />
                  </button>
                )}
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
    <div className={`w-full ${isOverlay ? 'h-full bg-transparent' : 'min-h-screen bg-gray-50 pb-20 flex flex-col font-sans'}`}>
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      {!isOverlay && (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 text-gray-600" title="Geri Dön">
            <Home size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
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
      )}
      <main className={`${!isOverlay ? 'max-w-[1400px] mx-auto px-4 lg:px-8 pt-24' : ''} flex-1 flex flex-col w-full h-full`}>
        <div className={`bg-white rounded-3xl ${!isOverlay ? 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-[700px] md:h-[80vh]' : 'h-full'} overflow-hidden flex w-full`}>
          {chatUI}
        </div>
      </main>

      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      {!isOverlay && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-iesu-red`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanici')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
