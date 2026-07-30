import useAppStore from '../store/useAppStore';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, MoreVertical, Phone, Video, Info, Paperclip, Send, X, ArrowLeft, Camera, Image as ImageIcon, Smile, FileText, Check, CheckCheck, Clock, ShieldCheck, File, Headphones, Play, Pause, AlertCircle, Mic, MicOff, VideoOff, Monitor, MonitorOff, CircleDashed, Users, MessageCircle, MessageSquare, Edit, Archive, Edit3, CheckCircle2, PhoneCall, PhoneOutgoing, PhoneMissed, PhoneIncoming, Megaphone, UserCircle2, ChevronLeft, ChevronDown, PlayCircle, Eye, EyeOff, Film, Aperture, Infinity, PhoneOff, Trash2, Bell, BellOff, Shield, ShieldOff, UserX, UserPlus, Building2, GraduationCap, School, Activity, Wifi } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

// Audio Synth for Call Cues using Web Audio API
class WebAudioCallSynth {
  constructor() {
    this.ctx = null;
    this.interval = null;
  }

  init() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && typeof AudioCtx === 'function') {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('AudioContext initialization fallback:', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended' && typeof this.ctx.resume === 'function') {
      this.ctx.resume().catch(() => {});
    }
  }

  playDialTone() {
    this.stop();
    this.init();
    if (!this.ctx) return;

    const playPulse = () => {
      try {
        if (!this.ctx || this.ctx.state === 'closed') return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
      } catch (e) {
        console.warn('Dial tone error:', e);
      }
    };

    playPulse();
    this.interval = setInterval(playPulse, 3000);
  }

  playIncomingRing() {
    this.stop();
    this.init();
    if (!this.ctx) return;

    const playRing = () => {
      try {
        if (!this.ctx || this.ctx.state === 'closed') return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.25);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.9);
      } catch (e) {
        console.warn('Ring tone error:', e);
      }
    };

    playRing();
    this.interval = setInterval(playRing, 2200);
  }

  playConnectChime() {
    this.stop();
    this.init();
    if (!this.ctx) return;

    try {
      if (!this.ctx || this.ctx.state === 'closed') return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  playEndCallBeep() {
    this.stop();
    this.init();
    if (!this.ctx) return;

    try {
      if (!this.ctx || this.ctx.state === 'closed') return;
      const now = this.ctx.currentTime;
      const notes = [440, 330, 220];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn('End call beep error:', e);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Fallback Canvas & Web Audio Media Stream Generator
const createFallbackStream = (label, isRemote = false) => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let animFrameId;
  let phase = 0;

  const draw = () => {
    if (!ctx) return;
    phase += 0.05;
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    if (isRemote) {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#090d16');
    } else {
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    ctx.strokeStyle = isRemote ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    ctx.lineWidth = 2;
    for (let r = 50; r < 300; r += 60) {
      ctx.beginPath();
      ctx.arc(320, 240, r + Math.sin(phase + r) * 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(320, 200, 70, 0, Math.PI * 2);
    ctx.fillStyle = isRemote ? 'rgba(99, 102, 241, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = isRemote ? '#6366f1' : '#ef4444';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = (label || 'HD').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    ctx.fillText(initials, 320, 200);

    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(label || 'Katılımcı', 320, 300);

    ctx.font = '600 13px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('● 1080p HD Stüdyo Akışı', 320, 330);

    ctx.fillStyle = isRemote ? '#818cf8' : '#f87171';
    const barCount = 16;
    const barWidth = 8;
    const startX = 320 - (barCount * (barWidth + 4)) / 2;
    for (let i = 0; i < barCount; i++) {
      const h = Math.abs(Math.sin(phase + i * 0.4)) * 35 + 5;
      ctx.fillRect(startX + i * (barWidth + 4), 420 - h, barWidth, h);
    }

    animFrameId = requestAnimationFrame(draw);
  };

  draw();

  let stream;
  if (canvas && typeof canvas.captureStream === 'function') {
    stream = canvas.captureStream(30);
  } else {
    const MediaStreamClass = (typeof window !== 'undefined' && window.MediaStream) ? window.MediaStream : (typeof MediaStream !== 'undefined' ? MediaStream : class MockMediaStream {
      constructor() { this.tracks = []; }
      addTrack(t) { this.tracks.push(t); }
      getTracks() { return this.tracks; }
      getVideoTracks() { return []; }
      getAudioTracks() { return []; }
    });
    stream = new MediaStreamClass();
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = isRemote ? 440 : 520;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
    }
  } catch (e) {
    console.warn('Fallback audio track creation error:', e);
  }

  stream._cleanup = () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };

  return stream;
};


const BellIconMute = ({ muted }) => muted ? <BellOff size={18} /> : <Bell size={18} />;
const ShieldAlertMute = ({ blocked }) => blocked ? <ShieldOff size={18} /> : <Shield size={18} />;

const EMOJI_CATEGORIES = [
  { id: 'frequent', name: '🔥 Popüler', emojis: ['😍', '🔥', '✨', '🎉', '🚀', '💯', '❤️', '👏', '🥳', '😎', '💡', '🙌', '⭐', '🎓', '💼', '🏆', '🌟', '💪', '🤝', '🎯', '🤩', '💬', '🤙', '🎈', '💖', '👑', '🌈', '💎', '🍿', '⚡', '⚡', '💣', '🥳', '🌶️', '🚀', '💥', '🍕', '🎉', '🌟', '🏆', '🥇', '👑', '🔮', '🧿'] },
  { id: 'faces', name: '😀 Duygular & Mimikler', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫣', '🤫', '🫢', '🫡', '🤗', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'] },
  { id: 'academic', name: '🎓 Kariyer & Üniversite', emojis: ['🎓', '📚', '💼', '🏫', '🏛️', '📊', '📈', '📜', '🖊️', '💻', '📑', '👨‍🎓', '👩‍🎓', '🧑‍💻', '🏆', '🥇', '🥈', '🥉', '🎖️', '🧠', '🔬', '🎨', '⚙️', '🌐', '🏢', '📑', '🖊️', '🔍', '💡', '🗓️', '📐', '📐', '📏', '📎', '📁', '📂', '📄', '📅', '📮', '📣', '📢', '💬', '📌', '🏷️', '🛠️', '🔬', '🧪', '🔭', '📡'] },
  { id: 'gestures', name: '👍 El & Jestler', emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '🫱', '🫲', '🫵', '🫲', '🫱', '🫳', '🫴', '🤏', '💪', '🦾', '🖕', '✍️', '💅', '🤳', '👂', '👃', '👀', '👁️', '👅', '👄'] },
  { id: 'activities', name: '⚽ Etkinlik & Spor', emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '👡', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🎷', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🎲', '♟️', '🎯', 'bowling', '🎮', '🎰', '🧩'] },
  { id: 'symbols', name: '❤️ Semboller & Kutlama', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '🔥', '💥', '💢', '💦', '💨', '💫', '⚡', '🎉', '🎊', '🎈', '🎁', '🎯', '🥇', '🔮', '🧿', '☸️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '☣️', '☢️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🉐', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆏', '🧅', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '🩶', '🩵', '🩷', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈴', '🛂', '🛃', '🛄', '🛅'] }
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

export default function MessagingInterface({ previousView, currentUser, userRole, setView, setSelectedUserId, selectedUserId, selectedGroupId, isOverlay = false, contacts: propsContacts, messages: propsMessages, onClose }) {
  const storeMessages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const messages = Array.isArray(propsMessages) ? propsMessages : storeMessages;
  
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const companies = useAppStore(state => state.companies);
  const academicStaff = useAppStore(state => state.academicStaff);

  const contacts = useMemo(() => {
    if (propsContacts && propsContacts.length) return propsContacts;
    return [
      ...(students || []),
      ...(alumni || []),
      ...(companies || []),
      ...(academicStaff || [])
    ];
  }, [propsContacts, students, alumni, companies, academicStaff]);

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
  
  // Call states & WebRTC Studio Refs
  const [callStatus, setCallStatus] = useState(null);
  const [callType, setCallType] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [callFilter, setCallFilter] = useState('all');
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [rttLatency, setRttLatency] = useState(14);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const callSynthRef = useRef(null);
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
  // Advanced Interaction & Access Control states
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [mutedChats, setMutedChats] = useState([]);
  const [companyRequests, setCompanyRequests] = useState([
    { id: 'req_cmp_1', companyId: 'CMP-011', companyName: 'MACFİT İnsan Kaynakları', message: 'Kariyer fırsatları hakkında görüşmek istiyoruz.', status: 'pending', date: 'Bugün 14:20' }
  ]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [spamMessages, setSpamMessages] = useState([]);
  const [archivedChats, setArchivedChats] = useState([]);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('frequent');

  const toggleBlockUser = (targetId) => {
    setBlockedUsers(prev => prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]);
    window.toast && window.toast.info(blockedUsers.includes(targetId) ? "Engel kaldırıldı." : "Kişi engellendi.");
  };

  const toggleMuteChat = (targetId) => {
    setMutedChats(prev => prev.includes(targetId) ? prev.filter(id => id !== targetId) : [...prev, targetId]);
    window.toast && window.toast.info(mutedChats.includes(targetId) ? "Sohbet sesi açıldı." : "Sohbet sessize alındı.");
  };

  const handleAcceptCompanyRequest = (reqId) => {
    setCompanyRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'accepted' } : r));
    window.toast && window.toast.success("Firma mesaj isteği kabul edildi!");
  };

  const handleRejectCompanyRequest = (reqId) => {
    setCompanyRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    window.toast && window.toast.info("Firma mesaj isteği reddedildi.");
  };

  const allowedContacts = useMemo(() => {
    return contacts.filter(c => {
      if (!userRole || userRole === 'admin') return true;
      const isContactCompany = !!c.sector || c.role === 'company' || c.type === 'company';
      const isContactAcademic = !!c.title || c.role === 'academic' || c.type === 'academic' || (typeof c.name === 'string' && (c.name.includes('Prof') || c.name.includes('Dr.') || c.name.includes('Doç.')));
      const isContactAlumni = !!c.gradYear || c.role === 'alumni' || c.type === 'alumni';
      const isContactStudent = (!!c.year && !c.gradYear) || c.role === 'student' || c.type === 'student';

      const hasExplicitRole = !!(c.sector || c.gradYear || c.year || c.title || c.role || c.type);
      if (!hasExplicitRole) return true;

      if (userRole === 'student' || userRole === 'alumni') {
        return isContactStudent || isContactAlumni || isContactAcademic;
      }
      if (userRole === 'academic') {
        return isContactCompany || isContactStudent || isContactAlumni;
      }
      if (userRole === 'company') {
        return isContactAcademic;
      }
      return true;
    });
  }, [contacts, userRole]);

  const activeContact = useMemo(() => {
    if (!activeContactId) return null;
    let found = allowedContacts.find(c => c.id === activeContactId) || contacts.find(c => c.id === activeContactId);
    if (found) return found;
    return groups.find(g => g.id === activeContactId);
  }, [activeContactId, allowedContacts, contacts, groups]);

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
    
    // First seed all contacts so users can click any contact directly to message
    (allowedContacts || []).forEach(c => {
      map.set(c.id, { ...c, lastMessage: null, unread: 0 });
    });

    messages.forEach(m => {
      const isMine = m.senderId === currentUser?.id;
      const otherId = isMine ? m.receiverId : m.senderId;
      
      const group = groups.find(g => g.id === m.receiverId);
      if (group) {
        if (!map.has(group.id) || !map.get(group.id).lastMessage || new Date(map.get(group.id).lastMessage.timestamp) < new Date(m.timestamp)) {
          map.set(group.id, { ...group, lastMessage: m, unread: 0 });
        }
        return;
      }

      const existing = map.get(otherId);
      const contactObj = existing || allowedContacts.find(c => c.id === otherId) || contacts.find(c => c.id === otherId) || { id: otherId, name: m.senderName || m.receiverName || 'Kullanıcı' };

      if (!existing || !existing.lastMessage || new Date(existing.lastMessage.timestamp) < new Date(m.timestamp)) {
        map.set(otherId, { ...contactObj, lastMessage: m, unread: !isMine && !m.read ? 1 : (existing?.unread || 0) });
      } else if (!isMine && !m.read) {
        map.set(otherId, { ...contactObj, unread: (contactObj.unread || 0) + 1 });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [messages, currentUser, allowedContacts, contacts, groups]);

  useEffect(() => {
    if (!activeContactId && conversations && conversations.length > 0) {
      setActiveContactId(conversations[0].id);
    }
  }, [conversations, activeContactId]);

  const handleSend = (e, specificType = null) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !specificType) return;

    const isCompanyTarget = !!activeContact?.sector;
    if (isCompanyTarget) {
      window.toast && window.toast.info("🏢 Mesajınız iletildi. Firma başvurunuzu onayladıktan sonra mesajlaşma doğrudan başlayacaktır.");
    }

    const sentMessageContent = specificType === 'audio' ? 'Ses Kaydı' : newMessage;

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'usr_me',
      senderName: currentUser?.name || 'Ben',
      senderAvatar: currentUser?.avatar || 'https://ui-avatars.com/api/?name=Me',
      receiverId: activeContactId,
      receiverName: activeContact?.name || 'Kullanıcı',
      content: sentMessageContent,
      timestamp: new Date().toISOString(),
      read: false,
      type: specificType || 'text',
      mediaUrl: specificType === 'audio' ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null,
      replyTo: replyingTo
    };

    const updatedMessagesList = [...messages, newMsg];
    setMessages(updatedMessagesList);
    setNewMessage('');
    setShowEmojiPicker(false);
    setReplyingTo(null);

    // If company, insert auto notification message from system
    if (isCompanyTarget) {
      setTimeout(() => {
        const sysNotice = {
          id: Date.now().toString() + '_notice',
          senderId: activeContactId,
          senderName: activeContact.name,
          senderAvatar: activeContact.logo || activeContact.avatar,
          receiverId: currentUser?.id,
          content: "⏳ Talebiniz firmaya iletildi. Firma yetkilisi onayladıktan sonra canlı sohbet aktif olacaktır.",
          timestamp: new Date().toISOString(),
          read: true,
          type: 'text',
          isNotice: true
        };
        setMessages(prev => [...prev, sysNotice]);
      }, 800);
      return;
    }

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

  const startCall = async (type, direction = 'outgoing') => {
    setCallType(type);
    setCallStatus('calling');
    setCallTimer(0);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);

    if (!callSynthRef.current) {
      callSynthRef.current = new WebAudioCallSynth();
    }

    if (direction === 'outgoing') {
      callSynthRef.current.playDialTone();
    } else {
      callSynthRef.current.playIncomingRing();
    }

    // Initialize media streams (WebRTC with canvas/synth fallback)
    let localStream = null;
    try {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: type === 'video',
          audio: true
        });
      }
    } catch (err) {
      console.warn('Hardware media device access unavailable, using studio canvas stream fallback:', err);
    }

    if (!localStream) {
      localStream = createFallbackStream(currentUser?.name || 'Local User', false);
    }

    localStreamRef.current = localStream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    // Remote stream setup (loopback / mock stream)
    const remoteStream = createFallbackStream(activeContact?.name || 'Remote Contact', true);
    remoteStreamRef.current = remoteStream;

    setTimeout(() => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }, 400);

    // Transition to connected status after 2.5s
    setTimeout(() => {
      setCallStatus('connected');
      if (callSynthRef.current) {
        callSynthRef.current.playConnectChime();
      }
    }, 2500);
  };

  const endCall = () => {
    if (callSynthRef.current) {
      callSynthRef.current.playEndCallBeep();
      setTimeout(() => {
        if (callSynthRef.current) callSynthRef.current.stop();
      }, 500);
    }

    if (localStreamRef.current) {
      if (typeof localStreamRef.current._cleanup === 'function') {
        localStreamRef.current._cleanup();
      }
      if (localStreamRef.current.getTracks) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      if (typeof remoteStreamRef.current._cleanup === 'function') {
        remoteStreamRef.current._cleanup();
      }
      if (remoteStreamRef.current.getTracks) {
        remoteStreamRef.current.getTracks().forEach(t => t.stop());
      }
      remoteStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setCallStatus(null);
    setCallType(null);
    setCallTimer(0);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (localStreamRef.current && localStreamRef.current.getAudioTracks) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !nextMute;
      });
    }
  };

  const toggleCamera = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    if (localStreamRef.current && localStreamRef.current.getVideoTracks) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !nextVideoOff;
      });
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (localStreamRef.current) {
        if (typeof localStreamRef.current._cleanup === 'function') localStreamRef.current._cleanup();
        if (localStreamRef.current.getTracks) localStreamRef.current.getTracks().forEach(t => t.stop());
      }

      let newStream = null;
      try {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
          newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
      } catch (e) {}

      if (!newStream) {
        newStream = createFallbackStream(currentUser?.name || 'Local User', false);
      }
      localStreamRef.current = newStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
      setIsScreenSharing(false);
    } else {
      let screenStream = null;
      try {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
          screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        }
      } catch (e) {
        console.warn('getDisplayMedia permission denied or unavailable, using screen fallback canvas:', e);
      }

      if (!screenStream) {
        screenStream = createFallbackStream('Ekran Paylaşımı (Studio HD)', false);
      }

      localStreamRef.current = screenStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setIsScreenSharing(true);
    }
  };

  useEffect(() => {
    let t;
    if (callStatus === 'connected') {
      t = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(t);
  }, [callStatus]);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setRttLatency(12 + Math.floor(Math.random() * 6));
      }, 3000);
    }
    return () => clearInterval(interval);
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

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
      return;
    }
    const validViews = ['student', 'alumni', 'company', 'academic'];
    if (previousView && validViews.includes(previousView)) {
      if (typeof setView === 'function') setView(previousView);
      return;
    }
    const rawRole = currentUser?.role || userRole;
    let role = (rawRole || 'student').toString().toLowerCase().trim();
    if (role === 'employer') role = 'company';
    else if (role === 'student_user') role = 'student';
    else if (role === 'academic_staff') role = 'academic';
    else if (role === 'alumni_user') role = 'alumni';

    if (role === 'admin' || role === 'administrator' || !validViews.includes(role)) {
      role = 'student';
    }

    if (typeof setView === 'function') {
      setView(role);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in font-sans">
      <div className="w-full max-w-[1240px] h-[92vh] max-h-[840px] bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-slate-200/80 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Top-Right Absolute Modal Close Button (X) */}
        <button 
          onClick={handleClose}
          className="absolute top-3.5 right-4 z-50 w-9 h-9 rounded-full bg-slate-100 hover:bg-[#990000] hover:text-white text-gray-700 flex items-center justify-center transition shadow-md border border-slate-200 cursor-pointer group"
          title="Kapat"
        >
          <X size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* LEFT PANEL */}
        <div className={`w-full md:w-[380px] bg-white flex flex-col border-r border-slate-200/80 z-10 ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header with White Logo & Corporate Name */}
          <div className="bg-gradient-to-r from-[#8F0808] to-[#990000] text-white p-3.5 flex items-center justify-between shrink-0 shadow-md relative z-20">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <Logo variant="white" size="sm" className="h-8 w-auto hover:opacity-90 transition shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-black text-[12px] sm:text-[13px] leading-tight text-white truncate">İstanbul Esenyurt Üniversitesi</span>
                <span className="text-[9px] sm:text-[10px] text-red-200 font-bold uppercase tracking-wider truncate">Kariyer Geliştirme Merkezi</span>
              </div>
            </div>
            <button 
              onClick={() => setIsNewChatModalOpen(true)} 
              title="Yeni Mesaj Başlat" 
              className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition border border-white/20 bg-white/10 shrink-0"
            >
              <Edit3 size={15} />
            </button>
          </div>

          {/* Sohbetler Header Label */}
          <div className="px-3.5 pt-2 pb-1 flex items-center justify-between bg-white border-b border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#990000] flex items-center gap-1.5">
              <MessageSquare size={14} /> Sohbetler
            </h2>
          </div>

        {/* Search */}
        <div className="p-3 bg-white border-b border-gray-100 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Kişi, kurum veya mesaj ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-gray-800 text-xs font-medium rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-3 py-2 gap-2 overflow-x-auto custom-scrollbar border-b border-gray-100 bg-gray-50/50">
          <button onClick={() => setChatFilter('all')} className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${chatFilter === 'all' ? 'bg-[#990000] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Tümü</button>
          <button onClick={() => setChatFilter('unread')} className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${chatFilter === 'unread' ? 'bg-[#990000] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Okunmayanlar</button>
          <button onClick={() => setChatFilter('groups')} className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all ${chatFilter === 'groups' ? 'bg-[#990000] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>Gruplar</button>
        </div>

        {/* Innovative Modern Card Conversation List */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60 p-3 space-y-2.5 custom-scrollbar">
          {conversations.length > 0 ? (
            conversations.filter(c => chatFilter === 'groups' ? c.isGroup : (chatFilter === 'unread' ? c.unread > 0 : true)).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(conv => {
              const isSelected = activeContactId === conv.id;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveContactId(conv.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border ${isSelected ? 'bg-white border-[#990000] shadow-[0_8px_20px_rgba(153,0,0,0.1)] -translate-y-0.5' : 'bg-white border-slate-200/80 hover:border-red-200 hover:shadow-md hover:-translate-y-0.5'}`}
                >
                  <div className="relative shrink-0">
                    <div className={`p-0.5 rounded-full ${isSelected ? 'ring-2 ring-red-600' : ''}`}>
                      <img src={conv.avatar || conv.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}`} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-100" alt={conv.name} />
                    </div>
                    {!conv.isGroup && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-[14px] truncate ${isSelected ? 'text-[#990000]' : 'text-gray-900'}`}>{conv.name}</h3>
                      <span className={`text-[11px] font-bold ${conv.unread > 0 ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full' : 'text-gray-400'}`}>{conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ''}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-[12px] truncate ${conv.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                        {conv.lastMessage?.senderId === currentUser?.id ? <CheckCheck size={14} className="inline mr-1 text-red-600"/> : null}
                        {conv.lastMessage?.type === 'image' ? '📷 Fotoğraf' : conv.lastMessage?.type === 'audio' ? '🎤 Ses Kaydı' : (conv.lastMessage?.content || conv.lastMessage?.text || '')}
                      </p>
                      {conv.unread > 0 && (
                        <div className="w-5 h-5 bg-[#990000] text-[#ffffff] rounded-full flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm animate-pulse">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : allowedContacts.length > 0 ? (
            allowedContacts.filter(c => (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map(conv => {
              const isSelected = activeContactId === conv.id;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveContactId(conv.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border ${isSelected ? 'bg-white border-[#990000] shadow-[0_8px_20px_rgba(153,0,0,0.1)] -translate-y-0.5' : 'bg-white border-slate-200/80 hover:border-red-200 hover:shadow-md hover:-translate-y-0.5'}`}
                >
                  <div className="relative shrink-0">
                    <img src={conv.avatar || conv.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name || 'Kişi')}`} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-100" alt={conv.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-[14px] truncate ${isSelected ? 'text-[#990000]' : 'text-gray-900'}`}>{conv.name}</h3>
                    <p className="text-[12px] text-gray-500 truncate">{conv.title || conv.sector || 'Sohbet Başlat'}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
              <MessageCircle size={40} className="text-gray-300 mb-3" />
              <p className="text-xs font-bold text-gray-600">Henüz sohbet bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Chat Area) */}
      <div className={`flex-1 flex flex-col bg-[#F8FAFC] relative ${!activeContactId ? 'hidden md:flex' : 'flex'}`}>
        {activeContactId ? (
          <>
            {/* Header */}
            <div className="h-[68px] bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveContactId(null)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition" title="Sohbet Listesine Dön"><ArrowLeft size={20} /></button>
                <div className="relative">
                  <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || '')}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  {isTyping && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-gray-200">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col cursor-pointer">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{activeContact?.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {isTyping ? <span className="text-red-700 font-bold">yazıyor...</span> : (activeContact?.isGroup ? `${activeContact?.members?.length || 0} katılımcı` : 'çevrimiçi')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mr-12">
                <button 
                  onClick={() => startCall('audio')}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-red-600 transition"
                  title="Sesli Arama"
                >
                  <Phone size={18} />
                </button>
                <button 
                  onClick={() => startCall('video')}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-red-600 transition"
                  title="Görüntülü Arama"
                >
                  <Video size={18} />
                </button>
                <button 
                  onClick={() => toggleMuteChat(activeContactId)}
                  className={`p-2 rounded-xl transition ${mutedChats.includes(activeContactId) ? 'bg-amber-50 text-amber-600 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                  title={mutedChats.includes(activeContactId) ? "Sohbetin Sesini Aç" : "Sohbeti Sessize Al"}
                >
                  <BellIconMute muted={mutedChats.includes(activeContactId)} />
                </button>
                {!activeContact?.isGroup && (
                  <button 
                    onClick={() => toggleBlockUser(activeContactId)}
                    className={`p-2 rounded-xl transition ${blockedUsers.includes(activeContactId) ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                    title={blockedUsers.includes(activeContactId) ? "Engeli Kaldır" : "Kullanıcıyı Engelle"}
                  >
                    <ShieldAlertMute blocked={blockedUsers.includes(activeContactId)} />
                  </button>
                )}
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
                    <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-3 shadow-sm relative border ${isMine ? 'bg-red-50/90 border-red-100/80 text-gray-900' : 'bg-white border-slate-200 text-gray-900'} ${showTail && isMine ? 'rounded-br-sm' : ''} ${showTail && !isMine ? 'rounded-bl-sm' : ''}`}>
                      
                      {activeContact?.isGroup && !isMine && (
                        <div className="text-[12px] font-bold text-[#E53935] mb-1 px-1">{msg.senderName}</div>
                      )}

                      {/* Msg Content with Dynamic Live Emoji Animation inside Chat Bubbles */}
                      {(msg.type === 'text' || !msg.type) && (
                        <p className="text-[14px] leading-relaxed px-1 text-[#111B21] break-words">
                          {(() => {
                            const rawContent = (msg.content !== undefined && msg.content !== null) ? msg.content : (msg.text || '');
                            let isOnlyEmojis = false;
                            try {
                              isOnlyEmojis = rawContent ? /^[\p{Extended_Pictographic}\s]+$/u.test(rawContent.trim()) : false;
                            } catch (e) {
                              isOnlyEmojis = false;
                            }
                            if (isOnlyEmojis && rawContent.trim()) {
                              const emojiArray = Array.from(rawContent.trim());
                              const animClasses = ['animate-emoji-bounce', 'animate-emoji-pulse', 'animate-emoji-wiggle', 'animate-emoji-float'];
                              return (
                                <span className="inline-flex flex-wrap gap-2 py-1 text-3xl sm:text-4xl">
                                  {emojiArray.map((char, i) => (
                                    <span 
                                      key={i} 
                                      className={`${animClasses[i % animClasses.length]} inline-block filter drop-shadow-md`}
                                      style={{ animationDelay: `${(i % 4) * 0.25}s` }}
                                    >
                                      {char}
                                    </span>
                                  ))}
                                </span>
                              );
                            }
                            return rawContent;
                          })()}
                        </p>
                      )}
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
                <div className="absolute bottom-16 left-2 sm:left-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-200/90 p-3.5 w-80 sm:w-96 h-80 flex flex-col z-40 animate-scale-up">
                  {/* Category Tabs */}
                  <div className="flex gap-1 border-b border-slate-100 pb-2 mb-2 overflow-x-auto custom-scrollbar shrink-0">
                    {EMOJI_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveEmojiCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all shrink-0 ${activeEmojiCategory === cat.id ? 'bg-[#990000] text-white shadow-sm scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Emojis Grid Clean Selection */}
                  <div className="flex-1 overflow-y-auto grid grid-cols-6 sm:grid-cols-7 gap-1.5 p-1 custom-scrollbar">
                    {(EMOJI_CATEGORIES.find(c => c.id === activeEmojiCategory)?.emojis || EMOJI_CATEGORIES[0].emojis).map((emoji, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        onClick={() => setNewMessage(prev => prev + emoji)} 
                        className="text-2xl sm:text-3xl p-1.5 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-125 active:scale-95 flex items-center justify-center select-none cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-slate-100 shrink-0"></div>
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

      {/* ULTRA-PROFESSIONAL WEBRTC CALL OVERLAY STUDIO */}
      {callStatus && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in font-sans text-white select-none">
          {/* Background Blurred Avatar Glow */}
          <div className="absolute inset-0 z-0 opacity-15 overflow-hidden pointer-events-none">
            <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || 'User')}`} className="w-full h-full object-cover blur-3xl scale-125" />
          </div>

          {/* Top Bar: Participant Info & Active Network Quality Indicator Badge */}
          <div className="z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 sm:px-6 sm:py-3.5 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
            {/* Participant Name & Status */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || 'User')}`} className="w-10 h-10 rounded-full object-cover border-2 border-red-500 shadow-md" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${callStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">{activeContact?.name || 'Görüşme'}</h2>
                  <span className="bg-red-600/30 text-red-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-500/40 uppercase tracking-widest">
                    {callType === 'video' ? '🎥 HD Görüntülü' : '📞 HD Sesli'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {callStatus === 'calling' ? (
                    <span className="text-amber-400 font-semibold animate-pulse">Bağlanıyor / Aranıyor...</span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Canlı Görüşme: {formatCallTime(callTimer)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Active Network Quality Indicator Badge */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/70 px-3.5 py-2 rounded-xl border border-slate-800/80 shadow-inner">
              <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                1080p HD
              </span>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                <Activity size={13} className="text-emerald-400" />
                <span>{rttLatency}ms</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div className="text-[11px] font-semibold text-slate-300">
                60 FPS
              </div>
              <div className="h-3 w-[1px] bg-slate-800" />
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-emerald-400">Mükemmel</span>
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 h-1.5 bg-emerald-500 rounded-xs" />
                  <span className="w-1 h-2.5 bg-emerald-500 rounded-xs" />
                  <span className="w-1 h-3 bg-emerald-500 rounded-xs" />
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Video Call Studio Stage */}
          <div className="z-10 relative w-full max-w-5xl flex-1 my-3 sm:my-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
            {callType === 'video' ? (
              <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                {/* Remote Stream Video Element */}
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
                
                {/* Calling Overlay */}
                {callStatus === 'calling' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-28 h-28 rounded-full border-4 border-red-600/60 p-1 mb-4 shadow-2xl relative animate-pulse">
                      <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || 'User')}`} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{activeContact?.name}</h3>
                    <p className="text-slate-400 text-xs font-medium">Uçtan Uca Kriptolu Görüşme Başlatılıyor...</p>
                  </div>
                )}

                {/* Local Self-View Picture-in-Picture Window */}
                <div className="absolute bottom-4 right-4 w-36 h-48 sm:w-48 sm:h-64 bg-slate-950 rounded-2xl border-2 border-slate-700/80 shadow-2xl overflow-hidden z-20 group transition-all hover:scale-105">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`} 
                  />
                  {isVideoOff && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2">
                      <VideoOff size={24} className="mb-1 text-red-400" />
                      <span className="text-[10px] font-bold">Kamera Kapalı</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded-md text-[9px] font-bold text-emerald-400 border border-slate-700 backdrop-blur-xs">
                    {isScreenSharing ? 'Ekranınız' : 'Siz'}
                  </div>
                  {isMuted && (
                    <div className="absolute top-2 right-2 bg-red-600 p-1 rounded-md text-white shadow">
                      <MicOff size={12} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Voice Call Mode Screen */
              <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6">
                <div className="relative mb-6">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-emerald-500/50 p-1.5 shadow-2xl relative z-10 bg-slate-900">
                    <img src={activeContact?.avatar || activeContact?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact?.name || 'User')}`} className="w-full h-full object-cover rounded-full" />
                  </div>
                  {callStatus === 'calling' ? (
                    <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-75" />
                  ) : (
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-pulse opacity-40 scale-110" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{activeContact?.name}</h3>
                <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs font-semibold text-slate-300">
                  <span className={`w-2.5 h-2.5 rounded-full ${callStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  {callStatus === 'connected' ? `Canlı Ses Görüşmesi — ${formatCallTime(callTimer)}` : 'Sesli arama iletiliyor...'}
                </div>

                <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />
                <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
              </div>
            )}
          </div>

          {/* Bottom Call Controls Studio Toolbar */}
          <div className="z-10 flex items-center gap-3 sm:gap-6 bg-slate-900/90 px-6 py-4 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            {/* Microphone Toggle Button */}
            <button 
              onClick={toggleMute}
              title={isMuted ? "Mikrofonu Aç" : "Mikrofonu Sessize Al"} 
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border cursor-pointer hover:scale-105 active:scale-95 ${isMuted ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'}`}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Camera Toggle Button (if video call) */}
            {callType === 'video' && (
              <button 
                onClick={toggleCamera}
                title={isVideoOff ? "Kamerayı Aç" : "Kamerayı Kapat"} 
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border cursor-pointer hover:scale-105 active:scale-95 ${isVideoOff ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'}`}
              >
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}

            {/* Screen Sharing Toggle Button */}
            <button 
              onClick={toggleScreenShare}
              title={isScreenSharing ? "Ekran Paylaşımını Durdur" : "Ekran Paylaş"} 
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 border cursor-pointer hover:scale-105 active:scale-95 ${isScreenSharing ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'}`}
            >
              {isScreenSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
            </button>

            {/* Call End Button */}
            <button 
              onClick={endCall} 
              title="Aramayı Sonlandır"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-[0_0_25px_rgba(220,38,38,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-red-500"
            >
              <PhoneOff size={26} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Yeni Mesaj / Kişi Arama Modalı (Kalem Düğmesinden Açılır) */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={18} />
                <h3 className="font-bold text-sm">Yeni Sohbet Başlat</h3>
              </div>
              <button onClick={() => setIsNewChatModalOpen(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Öğrenci, mezun veya hoca ara..."
                  value={newChatSearch}
                  onChange={e => setNewChatSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setIsNewChatModalOpen(false); setShowGroupModal(true); }}
                  className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-[#990000] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-red-100"
                >
                  <Users size={14} /> Yeni Grup Kur
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Erişilebilir Kişiler</p>
              {allowedContacts
                .filter(c => c.name.toLowerCase().includes(newChatSearch.toLowerCase()))
                .map(contact => {
                  const isBlocked = blockedUsers.includes(contact.id);
                  const isCompany = !!contact.sector;
                  const isAcademic = !!contact.title;

                  return (
                    <div 
                      key={contact.id}
                      onClick={() => {
                        setActiveContactId(contact.id);
                        setIsNewChatModalOpen(false);
                        if (isCompany) {
                          window.toast && window.toast.info("🏢 Firmalara iletilen mesajlar yetkili onayından sonra canlı sohbete dönüşecektir.");
                        }
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${isBlocked ? 'opacity-50 bg-slate-100 border-slate-200' : 'bg-white border-slate-100 hover:border-red-200 hover:shadow-sm'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={contact.avatar || contact.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt={contact.name} />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{contact.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium truncate block">
                            {isAcademic ? `🎓 ${contact.title || 'Akademisyen'}` : isCompany ? `🏢 Kurumsal Firma` : (contact.gradYear ? `🎓 Mezun (${contact.gradYear})` : `📚 Öğrenci`)}
                          </span>
                        </div>
                      </div>

                      {isCompany ? (
                        <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-lg font-bold">Onaylı İletişim</span>
                      ) : (
                        <button className="p-1.5 bg-red-50 text-[#990000] rounded-xl hover:bg-[#990000] hover:text-white transition">
                          <MessageCircle size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Yeni Grup Kurma Modalı */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <h3 className="font-bold text-sm">Öğrenci & Mezun Grubu Oluştur</h3>
              </div>
              <button onClick={() => setShowGroupModal(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Grup Adı</label>
                <input 
                  type="text" 
                  placeholder="Örn: 2026 Yazılım & Proje Ekibi"
                  value={newGroupTitle}
                  onChange={e => setNewGroupTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-[11px] text-amber-800 leading-relaxed font-semibold">
                ⚠️ Öğrenci ve Mezunlar serbestçe gruba eklenebilir. Akademisyen hocalar gruba eklenemez, ancak doğrudan mesaj atabilirler.
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gruba Eklenecek Üyeler ({selectedGroupMembers.length})</p>
              {allowedContacts
                .filter(c => !c.sector && !c.title) // Firmaları ve Hocaları gruptan çıkar (Kurallar gereği)
                .map(contact => {
                  const isSelected = selectedGroupMembers.includes(contact.id);
                  return (
                    <div 
                      key={contact.id}
                      onClick={() => {
                        if (isSelected) setSelectedGroupMembers(prev => prev.filter(id => id !== contact.id));
                        else setSelectedGroupMembers(prev => [...prev, contact.id]);
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${isSelected ? 'border-[#990000] bg-red-50/40' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{contact.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">{contact.gradYear ? `Mezun (${contact.gradYear})` : 'Öğrenci'}</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSelected} readOnly className="accent-[#990000] w-4 h-4 rounded" />
                    </div>
                  );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button onClick={() => setShowGroupModal(false)} className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition">İptal</button>
              <button 
                onClick={() => {
                  if (!newGroupTitle.trim() || selectedGroupMembers.length === 0) {
                    window.toast && window.toast.error("Lütfen grup adı girin ve en az 1 üye seçin.");
                    return;
                  }
                  const newGrp = {
                    id: `grp_${Date.now()}`,
                    name: newGroupTitle,
                    isGroup: true,
                    members: selectedGroupMembers,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newGroupTitle)}&background=990000&color=fff`
                  };
                  setGroups([...groups, newGrp]);
                  setActiveContactId(newGrp.id);
                  setShowGroupModal(false);
                  setNewGroupTitle('');
                  setSelectedGroupMembers([]);
                  window.toast && window.toast.success("Yeni sohbet grubu oluşturuldu!");
                }}
                className="flex-1 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                Grubu Oluştur
              </button>
            </div>
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
    </div>
  );
}

