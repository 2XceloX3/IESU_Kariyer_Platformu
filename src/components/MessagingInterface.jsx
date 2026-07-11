import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserCircle2, CheckCircle2, ChevronLeft, MessageSquare, Home, Compass, Briefcase, Bell, MessageCircle, Heart, Phone, Video, Paperclip, Smile, Image as ImageIcon, MoreVertical, X, Eye, EyeOff, Film, Camera, Aperture, PhoneCall, PhoneOff, PlayCircle, Clock, Infinity, Archive, Edit3, Grid3X3, Info, CircleDashed, Plus, Calendar, Users } from 'lucide-react';
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
  const [currentTab, setCurrentTab] = useState('chats'); // 'updates', 'calls', 'communities', 'chats', 'profile'
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState('all'); // 'all', 'unread', 'favorites', 'groups'
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

  // ---------------------------------------------------------
  // NEW IOS WHATSAPP STYLE VIEWS
  // ---------------------------------------------------------

  // 1. CHATS VIEW
  const renderChatsView = () => (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-5 pt-8 pb-3 bg-white z-10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button className="text-blue-500 font-medium">Düzenle</button>
          <div className="flex gap-4">
            <button className="text-blue-500"><Camera size={22} /></button>
            <button onClick={() => setShowAllContacts(!showAllContacts)} className="text-blue-500 rounded-full bg-gray-100 p-1"><Plus size={18} /></button>
          </div>
        </div>
        <h1 className="text-3xl font-black text-black mb-3">Sohbetler</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Mesaj veya kişi ara..." 
            className="w-full bg-[#f2f2f7] border-none rounded-xl pl-10 pr-4 py-2 text-[15px] focus:ring-0 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Tümü', 'Okunmamış', 'Favoriler', 'Gruplar'].map(filter => (
            <button 
              key={filter}
              onClick={() => setChatFilter(filter === 'Tümü' ? 'all' : filter === 'Okunmamış' ? 'unread' : filter === 'Favoriler' ? 'favorites' : 'groups')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (chatFilter === 'all' && filter === 'Tümü') || 
                (chatFilter === 'unread' && filter === 'Okunmamış') ||
                (chatFilter === 'favorites' && filter === 'Favoriler') ||
                (chatFilter === 'groups' && filter === 'Gruplar')
                  ? 'bg-green-100 text-[#00A884]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white px-2">
        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Archive size={20} className="text-gray-500" />
          </div>
          <div className="flex-1 border-b border-gray-100 pb-3 mt-3">
            <h4 className="font-bold text-[16px]">Arşivlenmiş</h4>
          </div>
        </div>
        
        {(conversations || []).filter(c => {
          if (chatFilter === 'unread') return c.unreadCount > 0;
          if (chatFilter === 'groups') return c.isGroup;
          return true;
        }).map(convo => (
          <div 
            key={convo.id}
            onClick={() => setActiveContactId(convo.id)}
            className={`flex items-stretch gap-3 pl-3 cursor-pointer transition-colors ${activeContactId === convo.id ? 'bg-gray-100/50 rounded-xl' : 'hover:bg-gray-50'}`}
          >
            <div className="relative self-center py-2 shrink-0">
              <img src={convo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.name)}&background=132A49&color=fff`} className="w-14 h-14 rounded-full object-cover" alt="" />
              {convo.unreadCount > 0 && (
                <div className="absolute top-1 right-0 w-5 h-5 bg-[#00A884] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  {convo.unreadCount}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 border-b border-gray-100 py-3 pr-4 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-black text-[16px] truncate">{convo.name}</h4>
                {convo.timestamp && (
                  <span className={`text-[13px] ${convo.unreadCount > 0 ? 'text-[#00A884] font-medium' : 'text-gray-500'} shrink-0 ml-2`}>
                    {formatTime(convo.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-[14px] text-gray-500 truncate">{convo.lastMessage || convo.role}</p>
            </div>
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
            <MessageSquare size={32} className="text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-500">Henüz mesaj bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );

  // 2. UPDATES VIEW
  const renderUpdatesView = () => (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-5 pt-8 pb-3 bg-white z-10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1"><MoreVertical size={20}/></button>
        </div>
        <h1 className="text-3xl font-black text-black mb-3">Güncellemeler</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Ara" className="w-full bg-[#f2f2f7] border-none rounded-xl pl-10 pr-4 py-2 text-[15px] focus:ring-0 focus:outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5">
        <h3 className="font-bold text-lg mb-4">Durum</h3>
        
        {/* My Status */}
        <div className="flex items-center gap-3 mb-6 cursor-pointer">
          <div className="relative shrink-0">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Ben')}`} className="w-14 h-14 rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00A884] rounded-full border-2 border-white flex items-center justify-center text-white">
              <Plus size={14} />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[16px]">Durum ekle</h4>
            <p className="text-gray-500 text-sm">24 saat sonra kaybolur</p>
          </div>
          <div className="flex gap-3 text-gray-500 shrink-0">
            <button className="bg-gray-100 p-2 rounded-full"><Camera size={18}/></button>
            <button className="bg-gray-100 p-2 rounded-full"><Edit3 size={18}/></button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Son Güncellemeler</h3>
        
        {/* Mock Statuses */}
        {[
          { name: 'Kariyer Merkezi', time: '8 sa. önce', verified: true },
          { name: 'Otomotiv Kulübü', time: '8 sa. önce' },
          { name: 'Danışman Hocam', time: '13 sa. önce' }
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 mb-4 cursor-pointer">
            <div className="w-14 h-14 rounded-full p-[2px] bg-[#00A884] shrink-0">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-200">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 border-b border-gray-100 pb-3 flex flex-col justify-center">
              <h4 className="font-bold text-[16px] flex items-center gap-1">
                {s.name} {s.verified && <CheckCircle2 size={14} className="text-blue-500" fill="currentColor"/>}
              </h4>
              <p className="text-gray-500 text-sm">{s.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. CALLS VIEW
  const renderCallsView = () => (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-5 pt-8 pb-3 bg-white z-10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1 text-blue-500 font-medium">Düzenle</button>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-500"><Phone size={18}/></button>
        </div>
        <h1 className="text-3xl font-black text-black mb-6">Aramalar</h1>
        
        <div className="flex justify-between px-2 mb-6">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Phone size={20}/></div>
            <span className="text-[11px] text-gray-500 font-medium">Ara</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Calendar size={20}/></div>
            <span className="text-[11px] text-gray-500 font-medium">Planla</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Grid3X3 size={20}/></div>
            <span className="text-[11px] text-gray-500 font-medium">Tuş takımı</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Heart size={20}/></div>
            <span className="text-[11px] text-gray-500 font-medium">Favoriler</span>
          </div>
        </div>
        
        <h3 className="font-bold text-lg mb-2">En Son</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5">
        {[
          { name: 'Kariyer Merkezi', type: 'Gelen', time: 'Dün', missed: false },
          { name: 'Danışman Hocam', type: 'Giden', time: 'Perşembe', missed: false },
          { name: 'Otomotiv Kulübü', type: 'Cevapsız', time: 'Perşembe', missed: true },
          { name: 'Mezunlar Derneği', type: 'Gelen', time: 'Pazartesi', missed: false }
        ].map((call, i) => (
          <div key={i} className="flex items-center gap-3 mb-1 cursor-pointer">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(call.name)}&background=random`} className="w-12 h-12 rounded-full object-cover shrink-0" />
            <div className="flex-1 border-b border-gray-100 py-3 flex justify-between items-center">
              <div>
                <h4 className={`font-bold text-[16px] ${call.missed ? 'text-red-500' : 'text-black'}`}>{call.name}</h4>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                  <Phone size={12} /> {call.type}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[15px]">{call.time}</span>
                <button className="text-blue-500 ml-2"><Info size={20}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getActiveTabContent = () => {
    switch (currentTab) {
      case 'updates': return renderUpdatesView();
      case 'calls': return renderCallsView();
      case 'chats': return renderChatsView();
      case 'communities': return <div className="p-8 text-center text-gray-500 h-full flex flex-col justify-center font-bold text-xl">Topluluklar özelliği yakında...</div>;
      case 'profile': return <div className="p-8 text-center text-gray-500 h-full flex flex-col justify-center font-bold text-xl">Ayarlar ve Profil</div>;
      default: return renderChatsView();
    }
  };

  const iOSBottomTabBar = (
    <div className="h-[84px] bg-[#f9f9f9]/90 backdrop-blur-md border-t border-gray-200/50 flex justify-around items-start pt-2 px-2 shrink-0 w-full z-50 relative">
      {[
        { id: 'updates', label: 'Güncellemeler', icon: CircleDashed, activeIcon: CircleDashed },
        { id: 'calls', label: 'Aramalar', icon: Phone, activeIcon: Phone },
        { id: 'communities', label: 'Topluluklar', icon: Users, activeIcon: Users },
        { id: 'chats', label: 'Sohbetler', icon: MessageCircle, activeIcon: MessageSquare },
        { id: 'profile', label: 'Siz', icon: UserCircle2, activeIcon: UserCircle2 }
      ].map(tab => (
        <button 
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className="flex flex-col items-center justify-center w-16 gap-1"
        >
          <div className={`relative flex items-center justify-center transition-transform ${currentTab === tab.id ? 'scale-110' : ''}`}>
            {currentTab === tab.id ? (
              <tab.activeIcon size={26} className="text-black" fill={tab.id === 'chats' || tab.id === 'communities' || tab.id === 'profile' ? "currentColor" : "none"} strokeWidth={2} />
            ) : (
              <tab.icon size={26} className="text-gray-400" strokeWidth={1.5} />
            )}
            {/* Unread dot simulation for chats */}
            {tab.id === 'chats' && conversations.some(c => c.unreadCount > 0) && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <span className={`text-[10px] font-medium mt-0.5 ${currentTab === tab.id ? 'text-black' : 'text-gray-500'}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  const leftPanel = (
    <div className={`w-full md:w-[420px] h-full flex flex-col bg-white border-r border-gray-200 shrink-0 ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
      {getActiveTabContent()}
      {iOSBottomTabBar}
    </div>
  );

  const rightPanel = (
    <div className={`flex-1 flex flex-col bg-[#efeae2] h-full ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
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
    return <div className="w-full h-full flex bg-white overflow-hidden">{leftPanel}{rightPanel}</div>;
  }

  return (
    <div className={`w-full h-[100dvh] bg-[#f0f2f5] flex flex-col font-sans overflow-hidden`}>
      <main className={`flex-1 flex justify-center w-full h-full overflow-hidden`}>
        {/* The main container acts like a native app shell. On desktop it has max-width, on mobile it's full screen */}
        <div className={`w-full h-full md:py-8 flex justify-center items-center`}>
          <div className={`w-full max-w-[1600px] h-full md:h-[calc(100vh-64px)] md:rounded-3xl shadow-2xl border border-gray-300 overflow-hidden flex bg-white`}>
            {leftPanel}
            {rightPanel}
          </div>
        </div>
      </main>

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
    </div>
  );
}
