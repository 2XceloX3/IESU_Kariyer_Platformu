import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, UserCircle2, CheckCircle2, ChevronLeft, ChevronDown, MessageSquare, Home, Compass, Briefcase, Bell, MessageCircle, Heart, Phone, Video, Paperclip, Smile, Image as ImageIcon, MoreVertical, X, Eye, EyeOff, Film, Camera, Aperture, PhoneCall, PhoneOff, PlayCircle, Clock, Infinity, Archive, Edit3, Grid3X3, Info, CircleDashed, Plus, Calendar, Users, Edit, Link2, Megaphone, PhoneOutgoing, PhoneMissed, PhoneIncoming } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

const EMOJI_LIST = [
  '😀','😂','🥰','😎','🤔','👍','🙌','❤️','🔥','🎉','✨','👏','🚀','💡',
  '🎓','💼','📊','📈','🤝','✅','❌','👀','🧑‍🎓','👨‍💻','🏆','🎯','💯','📝','🔔',
  '🏢','🖥️','💻','📱','📚','🧠','💪','🌟','✈️','🌍','🗣️','🗣️','🙌','👋'
];

export default function MessagingInterface({ previousView, messages = [], setMessages, currentUser, userRole, contacts = [], groups = [], setView, setSelectedUserId, selectedGroupId, isOverlay = false, onClose }) {
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
  const [activeMessageOptions, setActiveMessageOptions] = useState(null);
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

  const handleUnsendMessage = (msgId) => {
    if (setMessages) {
      setMessages((messages || []).map(m => m.id === msgId ? { ...m, isDeleted: true, content: 'Bu mesaj silindi', mediaUrl: null, type: 'text' } : m));
    }
    setActiveMessageOptions(null);
  };

  const handleDeleteMessage = (msgId) => {
    if (setMessages) {
      setMessages((messages || []).filter(m => m.id !== msgId));
    }
    setActiveMessageOptions(null);
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
    setIsCameraActive(true);
    setShowAttachmentMenu(false);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  // Removed useEffect for streamRef

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setCapturedMedia({ url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' });
      stopCamera();
    }
  };

  const capturePhoto = () => {
    setCapturedMedia({ url: `https://picsum.photos/800/1200?random=${Date.now()}`, type: 'image' });
    stopCamera();
  };

  const sendCapturedMedia = () => {
    if (capturedMedia) {
      if (!activeContactId) {
        alert("📸 Fotoğrafınız başarıyla Güncellemeler (Durum) olarak paylaşıldı!");
        setCapturedMedia(null);
        setIsCameraActive(false);
        return;
      }
      // Map 'cameraShareOption' to our message types
      let mappedType = capturedMedia.type; 
      if (cameraShareOption === 'once') mappedType = 'view_once';
      if (cameraShareOption === 'replay') mappedType = 'view_replay';
      
      handleSend(null, mappedType, capturedMedia.url);
      setCapturedMedia(null);
      setIsCameraActive(false);
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


  const callTimeoutRef = useRef(null);

  const startCall = (type, contactId) => {
    if (contactId) setActiveContactId(contactId);
    const targetId = contactId || activeContactId;
    if (!targetId) return;

    setCallType(type);
    setCallStatus('calling');
    setCallTimer(0);
    
    callTimeoutRef.current = setTimeout(() => {
      setCallStatus('connected');
    }, 4000);
  };

  const endCall = () => {
    setCallStatus(null);
    setCallTimer(0);
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
  };

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

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
          <div className="flex gap-2 items-center">
            {onClose && <button onClick={onClose} className="text-red-500 font-bold text-[17px] mr-1 flex items-center gap-1 hover:opacity-80"><X size={20}/> Kapat</button>}
            <button className="text-blue-500 font-medium text-[17px]">Düzenle</button>
          </div>
          <div className="flex gap-4">
            <button onClick={startCamera} className="text-blue-500 hover:opacity-80 transition"><Camera size={24} strokeWidth={1.5} /></button>
            <button onClick={() => setShowAllContacts(!showAllContacts)} className="text-blue-500 hover:opacity-80 transition"><Edit size={24} strokeWidth={1.5} /></button>
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
        <div className="flex justify-between px-4 py-2 border-b border-gray-100 mb-2">
          <button className="text-blue-500 font-medium text-[15px]">Toplu Mesaj Listeleri</button>
          <button className="text-blue-500 font-medium text-[15px]">Yeni Grup</button>
        </div>

        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <Archive size={22} className="text-gray-500" />
          </div>
          <div className="flex-1 border-b border-gray-100 pb-3 mt-3">
            <h4 className="font-bold text-[16px] text-gray-900">Arşivlenmiş</h4>
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
          <div className="flex gap-2 items-center">
            {onClose && <button onClick={onClose} className="text-red-500 font-bold text-[17px] mr-1 flex items-center gap-1 hover:opacity-80"><X size={20}/> Kapat</button>}
          </div>
          <button className="p-1"><MoreVertical size={20}/></button>
        </div>
        <h1 className="text-3xl font-black text-black mb-3">Güncellemeler</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Ara" className="w-full bg-[#f2f2f7] border-none rounded-xl pl-10 pr-4 py-2 text-[15px] focus:ring-0 focus:outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5">
        <h3 className="text-[20px] font-bold text-black mb-4">Durum</h3>
        
        {/* My Status */}
        <div className="flex items-center gap-4 mb-8 cursor-pointer group bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="relative shrink-0">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Ben')}`} className="w-16 h-16 rounded-full object-cover ring-2 ring-white" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <Plus size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[17px] text-gray-900">Durumum</h4>
            <p className="text-gray-500 text-[15px] mt-0.5">Durumuma ekle</p>
          </div>
          <div className="flex gap-3 text-gray-500 shrink-0">
            <button onClick={startCamera} className="bg-gray-100/80 hover:bg-gray-200 p-2.5 rounded-full transition"><Camera size={20}/></button>
            <button className="bg-gray-100/80 hover:bg-gray-200 p-2.5 rounded-full transition"><Edit3 size={20}/></button>
          </div>
        </div>

        <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Son Güncellemeler</h3>
        
        {/* Mock Statuses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          {[
            { name: 'Kariyer Merkezi', time: '8 sa. önce', verified: true, unread: true },
            { name: 'Otomotiv Kulübü', time: '10 sa. önce', unread: true },
            { name: 'Danışman Hocam', time: 'Dün', unread: false }
          ].map((s, i, arr) => (
            <div key={i} className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-50 transition ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className={`w-14 h-14 rounded-full p-[2px] shrink-0 ${s.unread ? 'bg-gradient-to-tr from-blue-400 to-blue-600' : 'bg-gray-300'}`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className={`font-bold text-[16px] flex items-center gap-1 ${s.unread ? 'text-black' : 'text-gray-600'}`}>
                  {s.name} {s.verified && <CheckCircle2 size={16} className="text-blue-500" fill="currentColor"/>}
                </h4>
                <p className="text-gray-500 text-[14px] mt-0.5">{s.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Channels Section */}
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[20px] font-bold text-black">Kanallar</h3>
          <button className="text-blue-500 font-medium text-[15px] hover:underline">Tümünü Gör</button>
        </div>
        <div className="text-sm text-gray-500 px-1 mb-4">Önemsediğiniz konulardan haberdar olun. Sizin için kanallar bulabilirsiniz.</div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
          {[
            { name: 'Teknoloji Bülteni', followers: '1.2B' },
            { name: 'IESU İtiraf', followers: '840' },
            { name: 'Kariyer Fırsatları', followers: '3.4B' }
          ].map((ch, idx) => (
            <div key={idx} className="w-32 shrink-0 border border-gray-200 rounded-2xl p-3 flex flex-col items-center justify-center bg-white shadow-sm">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ch.name)}`} className="w-16 h-16 rounded-full mb-2 object-cover" />
              <h4 className="font-bold text-[14px] text-center leading-tight mb-1 truncate w-full">{ch.name}</h4>
              <button className="w-full py-1.5 bg-[#eff2f5] text-[#1c2b33] font-bold text-[13px] rounded-full hover:bg-gray-200 transition">Takip Et</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. CALLS VIEW
  const renderCallsView = () => (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="px-5 pt-8 pb-3 bg-white z-10 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            {onClose && <button onClick={onClose} className="text-red-500 font-bold text-[17px] mr-1 flex items-center gap-1 hover:opacity-80"><X size={20}/> Kapat</button>}
            <button className="text-blue-500 font-medium text-[17px] hidden sm:block">Düzenle</button>
          </div>
          <div className="flex bg-gray-100 p-0.5 rounded-lg w-48 hidden md:flex">
            <button className="flex-1 py-1.5 text-[13px] font-bold bg-white shadow-sm rounded-md text-black">Tümü</button>
            <button className="flex-1 py-1.5 text-[13px] font-medium text-gray-500 hover:text-black">Cevapsızlar</button>
          </div>
          <button className="text-blue-500"><Phone size={22}/></button>
        </div>
        <h1 className="text-3xl font-black text-black mb-6">Aramalar</h1>
        
        {/* Create Call Link */}
        <div className="flex items-center gap-4 mb-8 cursor-pointer bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
            <Link2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[17px] text-blue-500">Arama Bağlantısı Oluştur</h4>
            <p className="text-gray-500 text-[14px]">WhatsApp aramanız için bir bağlantı paylaşın</p>
          </div>
        </div>
        
        <h3 className="font-bold text-[18px] text-black mb-2 px-2">En Son</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {[
            { id: 'usr-1', name: 'Kariyer Merkezi', type: 'Gelen', time: 'Dün', missed: false },
            { id: 'usr-2', name: 'Danışman Hocam', type: 'Giden', time: 'Perşembe', missed: false },
            { id: 'usr-3', name: 'Otomotiv Kulübü', type: 'Cevapsız', time: 'Perşembe', missed: true },
            { id: 'usr-4', name: 'Mezunlar Derneği', type: 'Gelen', time: 'Pazartesi', missed: false }
          ].map((call, i, arr) => (
            <div key={i} onClick={() => startCall('audio', call.id)} className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-50 transition ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(call.name)}&background=random`} className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h4 className={`font-bold text-[16px] ${call.missed ? 'text-red-500' : 'text-gray-900'}`}>{call.name}</h4>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[14px] mt-0.5">
                    {call.type === 'Giden' ? <PhoneOutgoing size={14} /> : call.type === 'Cevapsız' ? <PhoneMissed size={14} className="text-red-500" /> : <PhoneIncoming size={14} />} 
                    <span>{call.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-[14px]">{call.time}</span>
                  <button className="text-blue-500 p-2 hover:bg-blue-50 rounded-full transition" onClick={(e) => { e.stopPropagation(); startCall('video', call.id); }}><Info size={22}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunitiesView = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-5 pt-8 pb-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        {onClose && (
          <div className="flex gap-2 items-center mb-2">
            <button onClick={onClose} className="text-red-500 font-bold text-[17px] flex items-center gap-1 hover:opacity-80"><X size={20}/> Kapat</button>
          </div>
        )}
        <h2 className="text-3xl font-bold text-black mb-4 tracking-tight">Topluluklar</h2>
        <p className="text-gray-500 text-sm mb-4">Gruplarınız ve dahil olduğunuz öğrenci kulüpleri burada yer alır.</p>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="bg-white px-5 py-4 mb-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-200">
          <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
            <Users size={28} className="text-white" fill="currentColor" />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00A884] rounded-full border-2 border-white flex items-center justify-center text-white">
              <Plus size={14} />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[17px] text-gray-900">Yeni Topluluk</h4>
          </div>
        </div>

        {(groups || []).length > 0 ? (groups || []).map(group => (
          <div key={group.id} className="bg-white mb-3 border-y border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                <img src={group.logo} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-[18px] text-black">{group.name}</h3>
            </div>
            <div onClick={() => { if (setSelectedGroupId) setSelectedGroupId(group.id); }} className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <Megaphone size={24} className="text-[#00A884]" fill="currentColor" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[16px] text-gray-900">Duyurular</h4>
                <p className="text-[14px] text-gray-500 truncate">Topluluk yöneticilerinden son haberler.</p>
              </div>
              <div className="text-[12px] text-gray-400">Dün</div>
            </div>
          </div>
        )) : (
          <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center">
            <Users size={64} className="text-gray-300 mb-6" />
            <p className="text-lg font-medium text-gray-800 mb-2">Henüz hiçbir topluluğa katılmadınız.</p>
            <p className="text-sm text-gray-500 mb-6">Topluluklar, birden fazla grubu bir araya getirerek okulunuzu, kulüplerinizi veya iş ağlarınızı düzenlemenize yardımcı olur.</p>
            <button className="bg-[#00A884] text-white font-bold py-3 px-6 rounded-full w-full hover:bg-[#008f6f] transition">Topluluklarınızı Görün</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="flex flex-col h-full bg-[#f2f2f6]">
      <div className="px-5 pt-8 pb-3 bg-white sticky top-0 z-10 border-b border-gray-100">
        <h2 className="text-3xl font-bold text-black mb-4 tracking-tight">Siz</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-5 mt-6 border-y border-gray-200/60 flex items-center gap-4">
          <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || '')}`} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-bold text-xl text-black">{currentUser?.name || 'Kullanıcı'}</h3>
            <p className="text-gray-500 text-sm">{currentUser?.department || 'Öğrenci'}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white border-y border-gray-200/60">
          <button onClick={() => { if (setView) setView('profile_update'); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3 text-black">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white"><UserCircle2 size={18}/></div>
              <span className="font-medium text-[16px]">Profili Düzenle</span>
            </div>
            <ChevronLeft size={20} className="text-gray-400 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );

  const getActiveTabContent = () => {
    switch (currentTab) {
      case 'updates': return renderUpdatesView();
      case 'calls': return renderCallsView();
      case 'chats': return renderChatsView();
      case 'communities': return renderCommunitiesView();
      default: return renderChatsView();
    }
  };

  const iOSBottomTabBar = (
    <div className="h-[84px] bg-[#f9f9f9]/90 backdrop-blur-md border-t border-gray-200/50 flex justify-around items-start pt-2 px-2 shrink-0 w-full z-50 relative">
      {[
        { id: 'updates', label: 'Güncellemeler', icon: CircleDashed, activeIcon: CircleDashed },
        { id: 'calls', label: 'Aramalar', icon: Phone, activeIcon: Phone },
        { id: 'communities', label: 'Topluluklar', icon: Users, activeIcon: Users },
        { id: 'chats', label: 'Sohbetler', icon: MessageCircle, activeIcon: MessageSquare }
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
    <>
      <div className={`flex-1 flex flex-col bg-[#efeae2] h-full ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContactId(null)} className="md:hidden flex items-center justify-center w-10 h-10 -ml-2 text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-sm">
                  <ChevronLeft size={24} />
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
                {onClose && (
                  <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-red-500 transition ml-1 md:hidden" title="Kapat">
                    <X size={20} />
                  </button>
                )}
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
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group relative`}>
                        {activeMessageOptions === msg.id && (
                          <div className={`absolute top-full mt-1 ${isMine ? 'right-0' : 'left-0'} z-20 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 flex flex-col overflow-hidden animate-fade-in`}>
                            {isMine && !msg.isDeleted && <button onClick={() => handleUnsendMessage(msg.id)} className="px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-gray-50">Herkesten Sil (Geri Çek)</button>}
                            <button onClick={() => handleDeleteMessage(msg.id)} className="px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">Benden Sil</button>
                            <button onClick={() => setActiveMessageOptions(null)} className="px-4 py-2 text-left text-sm font-medium text-gray-400 hover:bg-gray-50 border-t border-gray-100">İptal</button>
                          </div>
                        )}
                        <div 
                          onContextMenu={(e) => { e.preventDefault(); setActiveMessageOptions(msg.id); }}
                          onClick={() => setActiveMessageOptions(activeMessageOptions === msg.id ? null : msg.id)}
                          className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-2 shadow-sm cursor-pointer relative ${isMine ? 'bg-[#DCF8C6] text-gray-800 rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-[0_2px_10px_rgb(0,0,0,0.05)]'} ${msg.isDeleted ? 'opacity-70 italic' : ''}`}
                        >
                          <button onClick={(e) => { e.stopPropagation(); setActiveMessageOptions(msg.id); }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition p-1 text-gray-400 hover:text-gray-600 z-10 bg-white/50 rounded-full backdrop-blur-sm">
                            <ChevronDown size={14} />
                          </button>
                          
                          {/* Sender Name in Group Chat */}
                          {activeContact.isGroup && !isMine && (
                            <div className="text-[11px] font-bold text-red-600 mb-1 px-1.5">{msg.senderName}</div>
                          )}

                          {/* Text Message */}
                          {msg.type === 'text' && (
                            <p className="text-[14px] leading-relaxed tracking-wide px-1.5 pt-1 flex items-center gap-1.5">
                              {msg.isDeleted && <div className="text-gray-400">🚫</div>}
                              {msg.content}
                            </p>
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
              // LIVE CAMERA FEED (MOCK)
              <div className="w-full h-full relative flex items-center justify-center bg-gray-900">
                <Camera size={64} className="text-gray-600 animate-pulse mb-20" />
                <p className="absolute bottom-40 text-gray-400 font-medium">Kamera Simulasyonu Aktif</p>
                <video ref={videoRef} className="hidden" />

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
              {callStatus === 'calling' ? 'Yanıt Bekleniyor...' : formatCallTime(callTimer)}
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
    </div>
  );
}
