import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserCircle2, CheckCircle2, ChevronLeft, MessageSquare, Home, Compass, Briefcase, Bell, MessageCircle, Heart, Phone, Video, Paperclip, Smile, Image as ImageIcon, MoreVertical, X, Eye, EyeOff, Film, Camera, Aperture, PhoneCall, PhoneOff, PlayCircle, Clock, Infinity } from 'lucide-react';
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
  
  // Call states
  const [callStatus, setCallStatus] = useState(null); // 'calling', 'connected'
  const [callType, setCallType] = useState(null); // 'audio', 'video'
  const [callTimer, setCallTimer] = useState(0);

  // Advanced Camera specific states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraShareOption, setCameraShareOption] = useState('keep'); // 'keep', 'replay', 'once'
  const [isRecording, setIsRecording] = useState(false);
  const [viewReplayMsgs, setViewReplayMsgs] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

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
          updated.lastMessage = msg.type === 'image' ? '📷 Fotoğraf' : msg.type === 'video' ? '🎥 Video' : msg.content;
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
    if (type === 'camera') {
      startCamera();
      return;
    }
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setIsCameraActive(true);
      setShowAttachmentMenu(false);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Kameraya erişilemedi. Lütfen izinleri kontrol edin.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const startRecording = () => {
    if (streamRef.current) {
      recordedChunks.current = [];
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setCapturedMedia({ url, type: 'video' });
          stopCamera();
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("MediaRecorder error", err);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedMedia({ url: dataUrl, type: 'image' });
      stopCamera();
    }
  };

  const sendCapturedMedia = () => {
    if (capturedMedia) {
      // Map 'cameraShareOption' to our message types
      let mappedType = capturedMedia.type; 
      if (cameraShareOption === 'once') mappedType = 'view_once';
      if (cameraShareOption === 'replay') mappedType = 'view_replay';
      
      handleSend(null, mappedType, capturedMedia.url);
      setCapturedMedia(null);
    }
  };

  const cancelCapturedMedia = () => {
    setCapturedMedia(null);
    startCamera();
  };

  const markViewReplay = (msgId) => {
    const current = viewReplayMsgs[msgId] || 0;
    if (current < 2) {
      setViewReplayMsgs({ ...viewReplayMsgs, [msgId]: current + 1 });
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);



  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const startCall = (type) => {
    setCallType(type);
    setCallStatus('calling');
    setCallTimer(0);
    // Simulate accepting call after 3 seconds
    setTimeout(() => {
      setCallStatus((currentStatus) => {
        if (currentStatus === 'calling') return 'connected';
        return currentStatus;
      });
    }, 3000);
  };

  const endCall = () => {
    setCallStatus(null);
    setCallType(null);
    setCallTimer(0);
  };

  const formatCallTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
                <button onClick={() => startCall('audio')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Sesli Ara">
                  <Phone size={18} />
                </button>
                <button onClick={() => startCall('video')} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Görüntülü Ara">
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

                          {/* View Once / Replay Message */}
                          {(msg.type === 'view_once' || msg.type === 'view_replay') && msg.mediaUrl && (() => {
                            const isReplay = msg.type === 'view_replay';
                            const views = isReplay ? (viewReplayMsgs[msg.id] || 0) : (viewedOnceMsgs.includes(msg.id) ? 1 : 0);
                            const maxViews = isReplay ? 2 : 1;
                            const isViewed = views >= maxViews;

                            return (
                              <div className="rounded-xl overflow-hidden mb-1 bg-gray-900 border border-gray-800 p-4 w-48 text-center flex flex-col items-center justify-center relative group">
                                {isMine ? (
                                  <>
                                    {isReplay ? <PlayCircle size={24} className="text-gray-400 mb-2" /> : <Eye size={24} className="text-gray-400 mb-2" />}
                                    <p className="text-xs text-gray-300 font-bold">{isReplay ? 'Tekrar Oynatmalı' : '1 Kez Görüntülenebilir'}</p>
                                  </>
                                ) : isViewed ? (
                                  <>
                                    <EyeOff size={24} className="text-gray-500 mb-2" />
                                    <p className="text-xs text-gray-500 font-bold">Açıldı</p>
                                  </>
                                ) : (
                                  <button onClick={() => {
                                      if(isReplay) markViewReplay(msg.id);
                                      else markViewOnce(msg.id);
                                      setViewedOnceMsgs([...viewedOnceMsgs, msg.id + '_temp']);
                                    }} 
                                    className="w-full h-full flex flex-col items-center justify-center"
                                  >
                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2 animate-pulse">
                                      {isReplay ? <PlayCircle size={20} /> : <Eye size={20} />}
                                    </div>
                                    <p className="text-xs text-white font-bold">{isReplay ? `Aç (${views}/${maxViews})` : 'Aç'}</p>
                                  </button>
                                )}
                                
                                {/* Overlay for viewing */}
                                {!isMine && !isViewed && viewedOnceMsgs.includes(msg.id + '_temp') && (
                                  <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
                                    <div className="relative max-w-2xl w-full">
                                      <img src={msg.mediaUrl} className="w-full rounded-xl" />
                                      <button onClick={() => setViewedOnceMsgs(viewedOnceMsgs.filter(id => id !== msg.id + '_temp'))} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full">
                                        <X size={24} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

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
                  <button onClick={() => handleSendMedia('camera')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700 transition">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Aperture size={16} /></div> Kamera Aç
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

      {/* Advanced Camera Overlay (Snap Modülü) */}
      {(isCameraActive || capturedMedia) && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in font-sans">
          <div className="flex justify-between items-center p-4 absolute top-0 w-full z-50">
            <h2 className="text-white font-bold text-lg drop-shadow-md">Kamera</h2>
            <button onClick={() => { stopCamera(); setCapturedMedia(null); }} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative bg-black">
            {!capturedMedia ? (
              // LIVE CAMERA FEED
              <div className="w-full h-full relative flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-20 flex items-center gap-2 bg-red-500/80 backdrop-blur px-3 py-1.5 rounded-full text-white font-bold text-sm animate-pulse z-10">
                    <div className="w-2 h-2 rounded-full bg-white" /> Kaydediliyor...
                  </div>
                )}

                {/* Capture Button */}
                <div className="absolute bottom-12 left-0 w-full flex justify-center z-20">
                  <div className="relative flex items-center justify-center">
                    {/* Progress ring if recording (mock visual) */}
                    {isRecording && (
                      <svg className="absolute w-[84px] h-[84px] animate-spin-slow" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="250" strokeDashoffset="50" />
                      </svg>
                    )}
                    <button 
                      onPointerDown={startRecording}
                      onPointerUp={stopRecording}
                      onPointerLeave={stopRecording}
                      onClick={capturePhoto}
                      className={`w-20 h-20 rounded-full border-4 ${isRecording ? 'border-red-500' : 'border-white'} flex items-center justify-center bg-transparent transition-all`}
                    >
                      <div className={`w-16 h-16 rounded-full transition-all ${isRecording ? 'bg-red-500 scale-50' : 'bg-white hover:bg-gray-200'}`}></div>
                    </button>
                  </div>
                  <p className="absolute -bottom-8 text-white/70 text-xs font-medium">Fotoğraf için dokun, Video için basılı tut</p>
                </div>
              </div>
            ) : (
              // CAPTURED PREVIEW & SHARE OPTIONS
              <div className="w-full h-full relative">
                {capturedMedia.type === 'video' ? (
                  <video src={capturedMedia.url} autoPlay loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <img src={capturedMedia.url} className="absolute inset-0 w-full h-full object-cover" />
                )}

                {/* Cancel Button */}
                <button onClick={cancelCapturedMedia} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition z-50">
                  <ChevronLeft size={24} />
                </button>

                {/* Share Options Footer */}
                <div className="absolute bottom-0 w-full p-6 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent z-20">
                  
                  {/* Option Selector */}
                  <div className="bg-black/50 backdrop-blur-md rounded-full p-1 flex gap-1">
                    <button 
                      onClick={() => setCameraShareOption('once')}
                      className={`px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold transition ${cameraShareOption === 'once' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    >
                      <Clock size={14} /> 1 Kez
                    </button>
                    <button 
                      onClick={() => setCameraShareOption('replay')}
                      className={`px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold transition ${cameraShareOption === 'replay' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    >
                      <PlayCircle size={14} /> Tekrar
                    </button>
                    <button 
                      onClick={() => setCameraShareOption('keep')}
                      className={`px-4 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold transition ${cameraShareOption === 'keep' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                    >
                      <Infinity size={14} /> Sürekli
                    </button>
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={sendCapturedMedia}
                    className="w-14 h-14 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] transition shadow-xl"
                  >
                    <Send size={24} className="ml-1" />
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALL OVERLAY */}
      {callStatus && (
        <div className="fixed inset-0 z-[250] bg-slate-900 flex flex-col items-center justify-between py-16 animate-fade-in font-sans">
          {/* Background blurred avatar */}
          <div className="absolute inset-0 z-0 opacity-30">
            <img src={activeContact?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-full h-full object-cover blur-3xl" />
          </div>

          <div className="z-10 flex flex-col items-center mt-10">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-2xl relative">
              <img src={activeContact?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-full h-full object-cover" />
              {callStatus === 'calling' && (
                <div className="absolute inset-0 border-4 border-white rounded-full animate-ping opacity-20"></div>
              )}
            </div>
            <h2 className="text-3xl font-black text-white drop-shadow-md mb-2">{activeContact?.name}</h2>
            <p className="text-white/80 font-medium tracking-widest uppercase text-sm">
              {callStatus === 'calling' ? 'Aranıyor...' : formatCallTime(callTimer)}
            </p>
          </div>

          {/* Video Placeholder (if video call and connected) */}
          {callStatus === 'connected' && callType === 'video' && (
             <div className="absolute inset-0 z-0 flex items-center justify-center">
               <div className="w-full h-full bg-black flex items-center justify-center text-white/20">
                  <Video size={64} />
               </div>
               {/* Small Picture in Picture of self */}
               <div className="absolute top-8 right-8 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 flex items-center justify-center">
                  <UserCircle2 size={32} className="text-white/20" />
               </div>
             </div>
          )}

          <div className="z-10 flex items-center gap-6 pb-10">
            {callStatus === 'connected' && (
              <>
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition">
                   <PhoneOff size={24} /> {/* Mute */}
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition">
                   {callType === 'video' ? <Video size={24} /> : <Phone size={24} />}
                </button>
              </>
            )}
            
            <button 
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 flex items-center justify-center text-white transition hover:scale-105"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        </div>
      )}
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
