import useAppStore from '../store/useAppStore';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, MoreVertical, Phone, Video, Info, Paperclip, Send, X, ArrowLeft, Camera, Image as ImageIcon, Smile, FileText, Check, CheckCheck, Clock, ShieldCheck, File, Headphones, Play, Pause, AlertCircle, Mic, CircleDashed, Users, MessageCircle, MessageSquare, Edit, Archive, Edit3, CheckCircle2, PhoneCall, PhoneOutgoing, PhoneMissed, PhoneIncoming, Megaphone, UserCircle2, ChevronLeft, ChevronDown, PlayCircle, Eye, EyeOff, Film, Aperture, Infinity, PhoneOff, Trash2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

const EMOJI_LIST = [
  '😊','😂','🥰','😎','🤔','😅','😭','❤️','✨','🔥','👍','🎉','🙌','👏',
  '🤩','😇','😋','😜','🤫','😏','🙄','😬','😴','😷','🤒','🤢','🤯','🥳',
  '😎','🤓','🧐','🤠','😈','👻','👽','🤖','🎃','🌟','💫','⭐','🎈','🧨',
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸',
  '🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉',
  '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍',
  '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒',
  '🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🦯'
];

// SNAPCHAT FILTERS
const CAMERA_FILTERS = [
  { id: 'normal', name: 'Normal', filter: 'none' },
  { id: 'grayscale', name: 'Siyah Beyaz', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepya', filter: 'sepia(100%)' },
  { id: 'invert', name: 'Ters Renk', filter: 'invert(100%)' },
  { id: 'hue', name: 'Neon', filter: 'hue-rotate(90deg)' },
  { id: 'blur', name: 'Bulanık', filter: 'blur(2px)' },
  { id: 'contrast', name: 'Drama', filter: 'contrast(150%) brightness(90%)' }
];

export default function MessagingInterface({ previousView, currentUser, userRole, setView, setSelectedUserId, selectedUserId, selectedGroupId, isOverlay = false }) {
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const companies = useAppStore(state => state.companies);
  const academicStaff = useAppStore(state => state.academicStaff);

  const contacts = useMemo(() => {
    return [
      ...(students || []),
      ...(alumni || []),
      ...(companies || []),
      ...(academicStaff || [])
    ];
  }, [students, alumni, companies, academicStaff]);

  const [activeContactId, setActiveContactId] = useState(selectedUserId || selectedGroupId || null);
  const [currentTab, setCurrentTab] = useState('chats'); // 'updates', 'calls', 'communities', 'chats', 'profile'
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState('all'); 
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [viewedOnceMsgs, setViewedOnceMsgs] = useState([]);
  const [activeMessageOptions, setActiveMessageOptions] = useState(null);
  const [pendingMediaType, setPendingMediaType] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});

  const handleToggleReaction = (msgId, emoji) => {
    setMessageReactions(prev => {
      const current = prev[msgId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [msgId]: current.filter(e => e !== emoji) };
      }
      return { ...prev, [msgId]: [...current, emoji] };
    });
  };

  // Group Creation states
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSelectedContacts, setNewGroupSelectedContacts] = useState([]);
  
  // Call states
  const [callStatus, setCallStatus] = useState(null);
  const [callType, setCallType] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [callFilter, setCallFilter] = useState('all');
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [callHistory, setCallHistory] = useState([
    { id: 1, type: 'video', direction: 'incoming', missed: true, contact: contacts[0], timestamp: '15:30', date: 'Bugün' },
    { id: 2, type: 'audio', direction: 'outgoing', missed: false, contact: contacts[1], timestamp: 'Dün', date: 'Dün' }
  ]);

  // Advanced Camera specific states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraShareOption, setCameraShareOption] = useState('keep'); // 'keep', 'replay', 'once'
  const [isRecording, setIsRecording] = useState(false);
  const [viewReplayMsgs, setViewReplayMsgs] = useState({});
  const [cameraFilter, setCameraFilter] = useState(CAMERA_FILTERS[0]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContactId]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);

  useEffect(() => {
    if (activeContactId && currentTab === 'chats') {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 2500 + Math.random() * 2000);
      return () => clearTimeout(t);
    }
  }, [activeContactId, currentTab]);

  useEffect(() => {
    let t;
    if (isRecordingVoice) {
      t = setInterval(() => setVoiceTimer(prev => prev + 1), 1000);
    } else {
      setVoiceTimer(0);
    }
    return () => clearInterval(t);
  }, [isRecordingVoice]);

  const formatVoiceTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const allowedContacts = contacts.filter(c => {
    if (userRole === 'admin') return true;
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

  const activeContact = useMemo(() => {
    if (!activeContactId) return null;
    let found = allowedContacts.find(c => c.id === activeContactId);
    if (found) return found;
    return groups.find(g => g.id === activeContactId);
  }, [activeContactId, allowedContacts, groups]);

  const currentChatMessages = useMemo(() => {
    if (!activeContactId) return [];
    if (activeContact?.isGroup) {
      return messages.filter(m => m.receiverId === activeContactId).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    return messages.filter(m => 
      (m.senderId === currentUser?.id && m.receiverId === activeContactId) ||
      (m.senderId === activeContactId && m.receiverId === currentUser?.id)
    ).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messages, activeContactId, currentUser, activeContact]);

  const conversations = useMemo(() => {
    const map = new Map();
    messages.forEach(m => {
      const isMine = m.senderId === currentUser?.id;
      const otherId = isMine ? m.receiverId : m.senderId;
      
      const group = groups.find(g => g.id === m.receiverId);
      if (group) {
        if (!map.has(group.id) || new Date(map.get(group.id).timestamp) < new Date(m.timestamp)) {
          map.set(group.id, { ...group, lastMessage: m, unread: 0 });
        }
        return;
      }

      if (!map.has(otherId) || new Date(map.get(otherId).timestamp) < new Date(m.timestamp)) {
        const contact = allowedContacts.find(c => c.id === otherId);
        if (contact) map.set(otherId, { ...contact, lastMessage: m, unread: !isMine && !m.read ? 1 : 0 });
      } else if (!isMine && !m.read) {
        const c = map.get(otherId);
        c.unread = (c.unread || 0) + 1;
        map.set(otherId, c);
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.lastMessage?.timestamp || 0) - new Date(a.lastMessage?.timestamp || 0));
  }, [messages, currentUser, allowedContacts, groups]);

  const handleSend = (e, specificType = null) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !specificType) return;

    const sentMessageContent = specificType === 'audio' ? 'Ses Kaydı' : newMessage;

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar,
      receiverId: activeContactId,
      receiverName: activeContact?.name,
      content: sentMessageContent,
      timestamp: new Date().toISOString(),
      read: false,
      type: specificType || 'text',
      mediaUrl: specificType === 'audio' ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null,
      replyTo: replyingTo
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setReplyingTo(null);

    // AI Auto-Responder Logic
    if (activeContactId && activeContact?.name && !activeContact?.isGroup) {
      setTimeout(() => {
        let replyContent = `Selam! Ben ${activeContact.name}. Mesajını aldım, en kısa sürede detaylı dönüş yapacağım.`;
        
        const lowerMsg = sentMessageContent.toLowerCase();
        if (lowerMsg.includes('mülakat') || lowerMsg.includes('staj') || lowerMsg.includes('iş')) {
           replyContent = "Harika! Kariyerin için atmış olduğun bu adım çok önemli. Bol şans diliyorum, sana her zaman destek olmaya hazırım!";
        } else if (lowerMsg.includes('selam') || lowerMsg.includes('merhaba')) {
           replyContent = "Selam! Sana nasıl yardımcı olabilirim? Esenyurt Kariyer platformunda bugün neler yapıyorsun?";
        } else if (lowerMsg.includes('teşekkür')) {
           replyContent = "Ne demek, lafı bile olmaz! Başka bir sorun olursa buradayım.";
        } else if (lowerMsg.includes('nasılsın')) {
           replyContent = "Teşekkürler, iyiyim! Umarım senin de her şey yolundadır. Nasıl yardımcı olabilirim?";
        }

        const autoReply = {
          id: Date.now().toString() + '_auto',
          senderId: activeContactId,
          senderName: activeContact.name,
          senderAvatar: activeContact.avatar || 'https://ui-avatars.com/api/?name=A&background=random',
          receiverId: currentUser?.id,
          content: replyContent,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'text',
          replyTo: newMsg.id
        };
        setMessages(prev => [...prev, autoReply]);
        if (window.toast && window.toast.info) window.toast.info(`${activeContact.name} adlı kullanıcıdan yeni mesaj!`);
      }, Math.random() * 2000 + 1500); // 1.5s - 3.5s delay
    }
  };

  const handleSendMedia = (type) => {
    setPendingMediaType(type);
    if (type === 'camera') {
      setIsCameraActive(true);
      startCamera();
      setShowAttachmentMenu(false);
    } else {
      fileInputRef.current?.click();
      setShowAttachmentMenu(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser?.id,
      receiverId: activeContactId,
      content: '',
      timestamp: new Date().toISOString(),
      read: false,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      mediaUrl: url
    };
    setMessages([...messages, newMsg]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Kamera erişimi reddedildi:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCapturedMedia(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.filter = cameraFilter.filter;
      context.drawImage(videoRef.current, 0, 0);
      const url = canvasRef.current.toDataURL('image/jpeg');
      setCapturedMedia({ type: 'image', url });
    }
  };

  const startRecording = () => {
    if (streamRef.current) {
      setIsRecording(true);
      recordedChunks.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ type: 'video', url });
      };
      mediaRecorderRef.current.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelCapturedMedia = () => {
    setCapturedMedia(null);
  };

  const sendCapturedMedia = () => {
    if (!capturedMedia) return;
    
    let type = capturedMedia.type;
    if (cameraShareOption === 'once') type = 'view_once';
    if (cameraShareOption === 'replay') type = 'view_replay';

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser?.id,
      receiverId: activeContactId,
      content: '',
      timestamp: new Date().toISOString(),
      read: false,
      type: type,
      mediaUrl: capturedMedia.url,
      filter: cameraFilter.id
    };

    setMessages([...messages, newMsg]);
    stopCamera();
  };

  const markViewReplay = (id) => {
    setViewReplayMsgs(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
    setActiveMessageOptions(null);
  };

  const handleUnsendMessage = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, content: '', mediaUrl: null, type: 'text', isDeleted: true } : m));
    setActiveMessageOptions(null);
  };

  const startCall = (type) => {
    setCallType(type);
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
      setCallTimer(0);
    }, 3000);
  };

  const endCall = () => {
    setCallStatus(null);
    setCallType(null);
    setCallTimer(0);
  };

  useEffect(() => {
    let t;
    if (callStatus === 'connected') {
      t = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [callStatus]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCallTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={`flex flex-col md:flex-row bg-[#E1E6ED] h-screen font-sans overflow-hidden ${isOverlay ? 'fixed inset-0 z-50' : ''}`}>
      {/* LEFT PANEL */}
      <div className={`w-full md:w-[380px] bg-white flex flex-col border-r border-gray-200 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="bg-[#00A884] text-white p-4 flex items-center justify-between shrink-0 shadow-sm relative z-20">
          <div className="flex items-center gap-3">
            {isOverlay && (
              <button onClick={() => setView(previousView || (userRole === 'academic' ? 'academic' : userRole === 'company' ? 'company' : userRole === 'alumni' ? 'alumni' : 'student'))} className="p-2 hover:bg-white/20 rounded-full transition">
                <ArrowLeft size={24} />
              </button>
            )}
            <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shadow-inner">
              <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || '')}`} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-bold text-lg hidden sm:block">Sohbetler</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition"><CircleDashed size={22} /></button>
            <button onClick={() => setIsNewChatModalOpen(true)} className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition"><MessageSquare size={22} /></button>
            <button className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition"><MoreVertical size={22} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b border-gray-100 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Ara veya yeni sohbet başlat" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0F2F5] text-gray-800 text-sm rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A884] focus:bg-white transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-3 py-2 gap-2 overflow-x-auto custom-scrollbar border-b border-gray-100 bg-gray-50/50">
          <button onClick={() => setChatFilter('all')} className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${chatFilter === 'all' ? 'bg-[#E7F8F3] text-[#00A884]' : 'bg-[#F0F2F5] text-gray-600 hover:bg-gray-200'}`}>Tümü</button>
          <button onClick={() => setChatFilter('unread')} className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${chatFilter === 'unread' ? 'bg-[#E7F8F3] text-[#00A884]' : 'bg-[#F0F2F5] text-gray-600 hover:bg-gray-200'}`}>Okunmayanlar</button>
          <button onClick={() => setChatFilter('groups')} className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${chatFilter === 'groups' ? 'bg-[#E7F8F3] text-[#00A884]' : 'bg-[#F0F2F5] text-gray-600 hover:bg-gray-200'}`}>Gruplar</button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {conversations.filter(c => chatFilter === 'groups' ? c.isGroup : (chatFilter === 'unread' ? c.unread > 0 : true)).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveContactId(conv.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F5F6F6] transition-colors border-b border-gray-50/50 last:border-0 ${activeContactId === conv.id ? 'bg-[#F0F2F5]' : ''}`}
            >
              <div className="relative shrink-0">
                <img src={conv.avatar || conv.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}`} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                {!conv.isGroup && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-semibold text-[16px] text-gray-900 truncate">{conv.name}</h3>
                  <span className={`text-[12px] ${conv.unread > 0 ? 'text-[#00A884] font-bold' : 'text-gray-500'}`}>{conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-[14px] truncate pr-2 ${conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {conv.lastMessage?.senderId === currentUser?.id ? <CheckCheck size={14} className="inline mr-1 text-red-500"/> : null}
                    {conv.lastMessage?.type === 'image' ? '📷 Fotoğraf' : conv.lastMessage?.type === 'audio' ? '🎤 Ses Kaydı' : conv.lastMessage?.content}
                  </p>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-[#00A884] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
              <MessageCircle size={48} className="text-gray-300 mb-4" />
              <p className="text-sm">Henüz bir sohbetiniz yok. Yeni bir sohbete başlamak için üstteki butonu kullanın.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Chat Area) */}
      <div className={`flex-1 flex flex-col bg-[#EFEAE2] relative bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat bg-[length:400px_400px] bg-opacity-40 bg-blend-overlay ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {activeContactId ? (
          <>
            {/* Header */}
            <div className="h-[68px] bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContactId(null)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={20} /></button>
                <div className="relative">
                  <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  {isTyping && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => {/* Open Contact Info */}}>
                  <h3 className="font-semibold text-gray-900">{activeContact?.name}</h3>
                  <p className="text-xs text-gray-500">
                    {isTyping ? <span className="text-[#00A884] font-medium">yazıyor...</span> : (activeContact?.isGroup ? `${activeContact?.members?.length || 0} katılımcı` : 'çevrimiçi')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {!activeContact?.isGroup && (
                  <>
                    <button onClick={() => startCall('audio')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"><Phone size={20} /></button>
                    <button onClick={() => startCall('video')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"><Video size={20} /></button>
                  </>
                )}
                <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"><Search size={20} /></button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-2 custom-scrollbar">
              <div className="text-center my-4">
                <span className="bg-[#E1F3FB] text-gray-600 text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm border border-[#D1EAF4]">
                  Sohbet uçtan uca şifrelenmiştir.
                </span>
              </div>
              {currentChatMessages.map((msg, idx) => {
                const isMine = msg.senderId === currentUser?.id;
                const showTail = idx === currentChatMessages.length - 1 || currentChatMessages[idx + 1].senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 group`}>
                    <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-2 shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative ${isMine ? 'bg-[#DCF8C6]' : 'bg-white'} ${showTail && isMine ? 'rounded-br-sm' : ''} ${showTail && !isMine ? 'rounded-bl-sm' : ''}`}>
                      
                      {activeContact?.isGroup && !isMine && (
                        <div className="text-[12px] font-bold text-[#E53935] mb-1 px-1">{msg.senderName}</div>
                      )}

                      {/* Msg Content */}
                      {msg.type === 'text' && <p className="text-[14px] leading-relaxed px-1 text-[#111B21] break-words">{msg.content}</p>}
                      {msg.type === 'image' && <img src={msg.mediaUrl} className="max-w-full rounded-xl" onClick={() => setLightboxMedia(msg.mediaUrl)}/>}
                      {msg.type === 'video' && <video src={msg.mediaUrl} controls className="max-w-full rounded-xl"/>}
                      {msg.type === 'audio' && (
                        <div className="flex items-center gap-3 p-2 bg-black/5 rounded-xl min-w-[200px]">
                          <button className="w-10 h-10 bg-[#00A884] rounded-full flex items-center justify-center text-white"><Play size={20} className="ml-1"/></button>
                          <div className="flex-1"><div className="h-1 bg-gray-300 w-full"><div className="h-full bg-[#00A884] w-1/3"></div></div></div>
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 mt-1 px-1 ${isMine ? 'text-green-800/60' : 'text-gray-500'}`}>
                        <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                        {isMine && (msg.read ? <CheckCheck size={14} className="text-[#53bdeb]"/> : <Check size={14}/>)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#F0F2F5] shrink-0 relative flex gap-2 items-end z-20">
              {showAttachmentMenu && (
                <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 z-30">
                  <button onClick={() => handleSendMedia('image')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700">
                    <ImageIcon size={18} className="text-red-500"/> Fotoğraf & Video
                  </button>
                  <button onClick={() => handleSendMedia('camera')} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700">
                    <Aperture size={18} className="text-red-500"/> Kamera Aç
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl text-sm font-bold text-gray-700">
                    <FileText size={18} className="text-purple-500"/> Belge
                  </button>
                </div>
              )}

              {showEmojiPicker && (
                <div className="absolute bottom-16 left-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72 h-64 overflow-y-auto grid grid-cols-6 gap-2 z-30 custom-scrollbar">
                  {EMOJI_LIST.map(emoji => (
                    <button key={emoji} onClick={() => setNewMessage(prev => prev + emoji)} className="text-2xl hover:bg-gray-100 rounded-lg">{emoji}</button>
                  ))}
                </div>
              )}

              <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} />

              <div className="flex gap-1 shrink-0 mb-1.5">
                <button onClick={() => {setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false)}} className="p-2 text-gray-500 hover:text-gray-600 transition"><Smile size={24}/></button>
                <button onClick={() => {setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false)}} className="p-2 text-gray-500 hover:text-gray-600 transition"><Paperclip size={24}/></button>
              </div>

              <div className="flex-1 bg-white rounded-xl min-h-[44px] flex items-center shadow-sm">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend(e); }}
                  placeholder="Bir mesaj yazın"
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-2.5 text-[15px] outline-none"
                />
              </div>

              <div className="shrink-0 mb-1.5">
                {newMessage.trim() ? (
                  <button onClick={handleSend} className="p-2.5 bg-[#00A884] text-white rounded-full hover:bg-[#008f6f] transition shadow-md"><Send size={20} className="ml-1"/></button>
                ) : (
                  <button onClick={() => setIsRecordingVoice(!isRecordingVoice)} className="p-2.5 bg-[#00A884] text-white rounded-full hover:bg-[#008f6f] transition shadow-md"><Mic size={20}/></button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#F0F2F5] text-center p-8">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" className="w-64 opacity-60 mb-6 grayscale" />
            <h2 className="text-3xl font-light text-gray-700 mb-4">Esenyurt Kariyer Web</h2>
            <p className="text-gray-500 max-w-md">Mesaj gönderin ve alın. Ağınızı genişletin, kariyer fırsatlarını yakalayın. Tüm mesajlar uçtan uca şifrelenmiştir.</p>
            <div className="mt-12 flex items-center gap-2 text-sm text-gray-400 font-medium">
              <ShieldCheck size={16} /> Esenyurt Üniversitesi Güvencesiyle
            </div>
          </div>
        )}
      </div>

      {/* SNAPCHAT CAMERA OVERLAY */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black z-[300] flex flex-col animate-fade-in font-sans">
          <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />
            
            {!capturedMedia ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{filter: cameraFilter.filter, transform: 'scaleX(-1)'}}/>
                
                {/* Camera UI Elements */}
                <div className="absolute top-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent z-20">
                  <button onClick={stopCamera} className="p-2 text-white hover:bg-white/20 rounded-full backdrop-blur-sm"><X size={28} /></button>
                  <div className="flex flex-col gap-3">
                    <button className="p-3 text-white bg-black/40 hover:bg-white/20 rounded-full backdrop-blur-md transition"><Aperture size={22} /></button>
                    <button className="p-3 text-white bg-black/40 hover:bg-white/20 rounded-full backdrop-blur-md transition"><ImageIcon size={22} /></button>
                  </div>
                </div>

                {/* Filters (Snapchat logic) */}
                <div className="absolute bottom-32 w-full px-4 z-20 overflow-x-auto custom-scrollbar flex gap-3 pb-2 snap-x">
                  {CAMERA_FILTERS.map(f => (
                    <button key={f.id} onClick={() => setCameraFilter(f)} className={`snap-center shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-end p-2 border-2 transition ${cameraFilter.id === f.id ? 'border-[#00A884] scale-110 shadow-lg bg-black/40' : 'border-transparent bg-black/20 hover:bg-black/40'} backdrop-blur-sm`}>
                      <span className="text-[10px] text-white font-bold text-shadow-md text-center">{f.name}</span>
                    </button>
                  ))}
                </div>

                {/* Capture Button */}
                <div className="absolute bottom-8 w-full flex justify-center z-20">
                  <div className="relative flex justify-center items-center">
                    <button 
                      onClick={capturePhoto} 
                      onMouseDown={startRecording} 
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative z-10"
                    >
                      <div className={`w-16 h-16 rounded-full transition-all ${isRecording ? 'bg-red-500 scale-50' : 'bg-white hover:bg-gray-200'}`}></div>
                    </button>
                  </div>
                  <p className="absolute -bottom-6 text-white/70 text-[10px] font-bold uppercase tracking-wider text-shadow-md">Bas Çek - Basılı Tut Video</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                {capturedMedia.type === 'video' ? (
                  <video src={capturedMedia.url} autoPlay loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter: cameraFilter.filter}} />
                ) : (
                  <img src={capturedMedia.url} className="absolute inset-0 w-full h-full object-cover" style={{filter: cameraFilter.filter}} />
                )}

                <button onClick={cancelCapturedMedia} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 z-50">
                  <X size={28} />
                </button>

                {/* Share Options */}
                <div className="absolute bottom-0 w-full p-6 flex flex-col gap-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setCameraShareOption('once')} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${cameraShareOption === 'once' ? 'bg-white text-black' : 'bg-black/50 text-white backdrop-blur-md'}`}><Clock size={16}/> 1 Kez</button>
                    <button onClick={() => setCameraShareOption('replay')} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${cameraShareOption === 'replay' ? 'bg-white text-black' : 'bg-black/50 text-white backdrop-blur-md'}`}><PlayCircle size={16}/> Tekrar</button>
                    <button onClick={() => setCameraShareOption('keep')} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition ${cameraShareOption === 'keep' ? 'bg-[#00A884] text-white' : 'bg-black/50 text-white backdrop-blur-md'}`}><Infinity size={16}/> Sürekli</button>
                  </div>
                  
                  <div className="flex justify-end w-full">
                    <button onClick={sendCapturedMedia} className="w-14 h-14 rounded-full bg-[#00A884] text-white flex items-center justify-center hover:bg-[#008f6f] shadow-xl transition hover:scale-105">
                      <Send size={24} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALL OVERLAY */}
      {callStatus && (
        <div className="fixed inset-0 z-[250] bg-red-950 flex flex-col items-center justify-between py-16 animate-fade-in font-sans">
          <div className="absolute inset-0 z-0 opacity-30">
            <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-full h-full object-cover blur-3xl" />
          </div>
          <div className="z-10 flex flex-col items-center mt-10">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-2xl relative">
              <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-full h-full object-cover" />
              {callStatus === 'calling' && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-full h-full animate-ping rounded-full border-4 border-white opacity-50"></div>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 text-shadow-md">{activeContact?.name}</h2>
            <p className="text-gray-400 font-medium text-lg tracking-wide">
              {callStatus === 'calling' ? (callType === 'video' ? 'Görüntülü aranıyor...' : 'Sesli aranıyor...') : formatCallTime(callTimer)}
            </p>
          </div>
          <div className="z-10 flex items-center gap-8 mb-10">
            {callStatus === 'connected' && (
              <>
                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition border border-white/10">
                  <Mic size={24} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition border border-white/10">
                  <Video size={24} />
                </button>
              </>
            )}
            <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-xl flex items-center justify-center text-white transition hover:scale-105">
              <PhoneOff size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxMedia && (
        <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxMedia(null)}>
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition"><X size={28}/></button>
          <img src={lightboxMedia} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()}/>
        </div>
      )}
    </div>
  );
}
