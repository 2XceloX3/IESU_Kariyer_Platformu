import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee, Calendar, Clock, Video, CheckCircle2, X, Sparkles,
  User, Building2, Globe, MessageSquare, ChevronRight, Award,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import SafeAvatar from '../shared/SafeAvatar';
import useAppStore from '../../store/useAppStore';
import eventBus from '../../brain/eventBus';
import {
  COFFEE_CHAT_TOPICS,
  COFFEE_CHAT_STATUS
} from '../../services/studentRadarWorkflow';

const SAMPLE_ALUMNI = [
  {
    id: 'ALU-001',
    name: 'Caner Öztürk',
    department: 'Yazılım Mühendisliği',
    gradYear: '2023',
    company: 'Trendyol',
    title: 'Frontend Developer',
    avatar: 'https://ui-avatars.com/api/?name=Caner+Öztürk&background=EA580C&color=fff',
    city: 'İstanbul',
    bio: 'React, Vue ve modern frontend mimarileri konusunda mentorluk veriyorum.'
  },
  {
    id: 'ALU-002',
    name: 'Seda Çelik',
    department: 'Endüstri Mühendisliği',
    gradYear: '2022',
    company: 'Delivery Hero',
    title: 'Üretim ve Operasyon Yöneticisi',
    avatar: 'https://ui-avatars.com/api/?name=Seda+Çelik&background=EA580C&color=fff',
    city: 'Berlin',
    bio: 'Yurt dışı yüksek lisans ve Almanya iş arama vizeleri konusunda rehberlik.'
  },
  {
    id: 'ALU-003',
    name: 'Tolgahan Aslan',
    department: 'Uluslararası Ticaret',
    gradYear: '2024',
    company: 'Amazon UK',
    title: 'Operasyon & Finans Analisti',
    avatar: 'https://ui-avatars.com/api/?name=Tolgahan+Aslan&background=EA580C&color=fff',
    city: 'Londra',
    bio: 'İngiltere pazarı ve global e-ticaret lojistiği üzerine tecrübe paylaşımı.'
  },
  {
    id: 'ALU-005',
    name: 'Zeynep Demir',
    department: 'Bilgisayar Mühendisliği',
    gradYear: '2023',
    company: 'Google',
    title: 'Senior Software Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Zeynep+Demir&background=0284C7&color=fff',
    city: 'San Francisco',
    bio: 'FAANG mülakatları, algoritmalar ve sistem tasarımı tavsiyeleri.'
  }
];

export default function AlumniCoffeeChatModal({
  isOpen,
  onClose,
  currentUser,
  userRole = 'student',
  selectedAlumnus: propAlumnus,
  initialTopic = 'cv_review'
}) {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const storeAlumni = useAppStore((state) => state.alumni) || [];
  const addNotification = useAppStore((state) => state.addNotification);
  const storeCoffeeChats = useAppStore((state) => state.coffeeChats);
  const storeAddCoffeeChat = useAppStore((state) => state.addCoffeeChat);
  const storeUpdateCoffeeChatStatus = useAppStore((state) => state.updateCoffeeChatStatus);

  const availableAlumni = useMemo(() => {
    if (propAlumnus) return [propAlumnus];
    if (Array.isArray(storeAlumni) && storeAlumni.length > 0) return storeAlumni;
    return SAMPLE_ALUMNI;
  }, [propAlumnus, storeAlumni]);

  const isAlumniUser = userRole === 'alumni' || effectiveCurrentUser?.role === 'alumni';
  const [activeTab, setActiveTab] = useState(() => (isAlumniUser ? 'my_chats' : 'new_chat')); // 'new_chat' | 'my_chats'
  const [chatFilter, setChatFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'completed'

  const [selectedAlumnusId, setSelectedAlumnusId] = useState(
    propAlumnus?.id || availableAlumni[0]?.id || 'ALU-001'
  );
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopic);
  const [selectedDate, setSelectedDate] = useState('2026-10-26');
  const [selectedSlot, setSelectedSlot] = useState('18:00 - 18:15');
  const [studentNote, setStudentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronized coffee chats state
  const [coffeeChats, setCoffeeChats] = useState(() => {
    if (Array.isArray(storeCoffeeChats) && storeCoffeeChats.length > 0) {
      return storeCoffeeChats;
    }
    try {
      const saved = localStorage.getItem('iesu_alumni_coffee_chats_v1');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'CHAT-MOCK-1',
        studentId: effectiveCurrentUser?.id || 'STU-001',
        studentName: effectiveCurrentUser?.name || 'Alperen Yılmaz',
        studentDept: effectiveCurrentUser?.department || 'Yazılım Mühendisliği',
        alumnusId: 'ALU-001',
        alumnusName: 'Caner Öztürk',
        alumnusCompany: 'Trendyol',
        alumnusTitle: 'Frontend Developer',
        topicId: 'cv_review',
        topicTitle: 'CV & Portfolyo İnceleme (15 Dk)',
        date: '2026-10-26',
        timeSlot: '18:00 - 18:15',
        note: 'Frontend portfolyom ve React projelerimi incelemenizi rica ederim.',
        status: 'CONFIRMED',
        meetingLink: 'https://meet.google.com/iesu-coffee-trendyol',
        createdAt: '2026-10-22 14:00'
      },
      {
        id: 'CHAT-MOCK-2',
        studentId: 'STU-002',
        studentName: 'Zeynep Kaya',
        studentDept: 'Endüstri Mühendisliği',
        alumnusId: 'ALU-002',
        alumnusName: 'Seda Çelik',
        alumnusCompany: 'Delivery Hero',
        alumnusTitle: 'Üretim ve Operasyon Yöneticisi',
        topicId: 'abroad_master',
        topicTitle: 'Yurt Dışı / Yüksek Lisans Deneyimi',
        date: '2026-10-27',
        timeSlot: '19:00 - 19:15',
        note: 'Almanya yüksek lisans başvuru süreci hakkında görüşmek isterim.',
        status: 'PENDING',
        meetingLink: null,
        createdAt: '2026-10-23 09:30'
      }
    ];
  });

  // Keep in sync with storeCoffeeChats when it changes
  useEffect(() => {
    if (Array.isArray(storeCoffeeChats) && storeCoffeeChats.length > 0) {
      setCoffeeChats(storeCoffeeChats);
    }
  }, [storeCoffeeChats]);

  const activeAlumnus = useMemo(() => {
    return availableAlumni.find((a) => a.id === selectedAlumnusId) || availableAlumni[0];
  }, [availableAlumni, selectedAlumnusId]);

  if (!isOpen) return null;

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const topicObj = COFFEE_CHAT_TOPICS.find((t) => t.id === selectedTopicId);

    const newChat = {
      id: 'CHAT-' + Date.now(),
      studentId: effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'STU-001',
      studentName: effectiveCurrentUser?.name || 'Öğrenci',
      studentDept: effectiveCurrentUser?.department || 'Öğrenci',
      alumnusId: activeAlumnus?.id || 'ALU-UNKNOWN',
      alumnusName: activeAlumnus?.name || 'Mezun Mentör',
      alumnusCompany: activeAlumnus?.company || 'Teknoloji Şirketi',
      alumnusTitle: activeAlumnus?.title || 'Sektör Profesyoneli',
      topicId: selectedTopicId,
      topicTitle: topicObj?.title || '15 Dk Mikro-Mentorluk',
      date: selectedDate,
      timeSlot: selectedSlot,
      note: studentNote,
      status: 'CONFIRMED', // Confirmed with meeting room URL generated immediately
      meetingLink: `https://meet.google.com/iesu-coffee-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newChat, ...coffeeChats];
    setCoffeeChats(updated);
    if (storeAddCoffeeChat) {
      storeAddCoffeeChat(newChat);
    }
    try {
      localStorage.setItem('iesu_alumni_coffee_chats_v1', JSON.stringify(updated));
    } catch (_) {}

    try {
      eventBus.emit('coffee_chat:requested', {
        chat: newChat,
        chatId: newChat.id,
        studentName: newChat.studentName,
        alumnusName: newChat.alumnusName,
        date: newChat.date,
        timeSlot: newChat.timeSlot
      });
    } catch (_) {}

    if (addNotification) {
      addNotification({
        id: 'NOTIF-CHAT-' + Date.now(),
        userId: effectiveCurrentUser?.id || 'STU-001',
        text: `${newChat.alumnusName} ile 15 Dk Kahve Sohbeti randevunuz onaylandı (${newChat.date} ${newChat.timeSlot}).`,
        read: false,
        time: 'Az önce'
      });
    }

    window.toast?.success?.(
      `${activeAlumnus?.name} ile 15 Dakika Kahve Sohbeti randevunuz oluşturuldu!`
    );

    setIsSubmitting(false);
    setActiveTab('my_chats');
  };

  const handleConfirmChat = (chatId) => {
    const meetUrl = `https://meet.google.com/iesu-coffee-${Math.random().toString(36).substr(2, 6)}`;
    const updated = coffeeChats.map((c) =>
      c.id === chatId ? { ...c, status: 'CONFIRMED', meetingLink: c.meetingLink || meetUrl } : c
    );
    setCoffeeChats(updated);
    if (storeUpdateCoffeeChatStatus) {
      storeUpdateCoffeeChatStatus(chatId, 'CONFIRMED', { meetingLink: meetUrl });
    }
    try {
      localStorage.setItem('iesu_alumni_coffee_chats_v1', JSON.stringify(updated));
    } catch (_) {}
    try {
      eventBus.emit('coffee_chat:status_changed', { chatId, status: 'CONFIRMED', extraData: { meetingLink: meetUrl } });
    } catch (_) {}
    window.toast?.success?.('Randevu onaylandı ve video mülakat linki oluşturuldu!');
  };

  const handleCompleteChat = (chatId) => {
    const updated = coffeeChats.map((c) =>
      c.id === chatId ? { ...c, status: 'COMPLETED' } : c
    );
    setCoffeeChats(updated);
    if (storeUpdateCoffeeChatStatus) {
      storeUpdateCoffeeChatStatus(chatId, 'COMPLETED');
    }
    try {
      localStorage.setItem('iesu_alumni_coffee_chats_v1', JSON.stringify(updated));
    } catch (_) {}
    try {
      eventBus.emit('coffee_chat:status_changed', { chatId, status: 'COMPLETED' });
    } catch (_) {}
    window.toast?.info?.('Randevu tamamlandı olarak işaretlendi.');
  };

  const handleCancelChat = (chatId) => {
    const updated = coffeeChats.map((c) =>
      c.id === chatId ? { ...c, status: 'CANCELLED' } : c
    );
    setCoffeeChats(updated);
    if (storeUpdateCoffeeChatStatus) {
      storeUpdateCoffeeChatStatus(chatId, 'CANCELLED');
    }
    try {
      localStorage.setItem('iesu_alumni_coffee_chats_v1', JSON.stringify(updated));
    } catch (_) {}
    try {
      eventBus.emit('coffee_chat:status_changed', { chatId, status: 'CANCELLED' });
    } catch (_) {}
    window.toast?.info?.('Randevu iptal edildi.');
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      data-testid="alumni-coffee-chat-modal"
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-amber-300">
              <Coffee size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                Mezunla 15 Dakika Kahve & Mikro-Mentorluk
              </h3>
              <p className="text-xs text-amber-200 font-medium">
                İESÜ Mezunlar Portalı • Birebir Hızlı Kariyer Rehberliği
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('new_chat')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'new_chat'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ☕ Yeni Randevu İste
          </button>
          <button
            onClick={() => setActiveTab('my_chats')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'my_chats'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📅 Randevularım ({coffeeChats.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'new_chat' ? (
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              {/* Alumnus Selector & Profile Banner */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  1. Görüşmek İstediğiniz İESÜ Mezunu
                </label>
                
                {availableAlumni.length > 1 && !propAlumnus && (
                  <select
                    value={selectedAlumnusId}
                    onChange={(e) => setSelectedAlumnusId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {availableAlumni.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {a.title} @ {a.company} ({a.department} '{a.gradYear || '22'})
                      </option>
                    ))}
                  </select>
                )}

                {activeAlumnus && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-amber-200 shrink-0">
                      <SafeAvatar
                        src={activeAlumnus.avatar}
                        name={activeAlumnus.name}
                        size="lg"
                        rounded="rounded-2xl"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{activeAlumnus.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                          🎓 İESÜ '{activeAlumnus.gradYear || '2023'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#990000] mt-0.5">
                        {activeAlumnus.title} @ {activeAlumnus.company}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {activeAlumnus.bio || `${activeAlumnus.department} mezunu. Öğrencilerimize 15 dakikalık çevrim içi kariyer desteği sağlıyor.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Topic Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  2. Kahve Sohbeti Konusu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COFFEE_CHAT_TOPICS.map((topic) => {
                    const isSelected = selectedTopicId === topic.id;
                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-black text-slate-900">{topic.title}</p>
                          {isSelected && <CheckCircle2 size={15} className="text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {topic.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    3. Randevu Tarihi
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="2026-10-26">26 Ekim 2026 Pazartesi</option>
                    <option value="2026-10-27">27 Ekim 2026 Salı</option>
                    <option value="2026-10-28">28 Ekim 2026 Çarşamba</option>
                    <option value="2026-10-29">29 Ekim 2026 Perşembe</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    4. 15 Dk Zaman Dilimi
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="18:00 - 18:15">18:00 - 18:15 (Akşam)</option>
                    <option value="18:30 - 18:45">18:30 - 18:45 (Akşam)</option>
                    <option value="19:00 - 19:15">19:00 - 19:15 (Akşam)</option>
                    <option value="19:30 - 19:45">19:30 - 19:45 (Akşam)</option>
                    <option value="20:00 - 20:15">20:00 - 20:15 (Gece)</option>
                  </select>
                </div>
              </div>

              {/* Student Question / Note */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  5. Mezuna İletmek İstediğiniz Soru veya Özet Notunuz
                </label>
                <textarea
                  rows={2}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Örn: Trendyol frontend stajı için hazırladığım GitHub projelerimi 15 dakika incelemenizi rica ediyorum..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Coffee size={16} />
                <span>15 Dakika Kahve Sohbetini Onayla</span>
              </button>
            </form>
          ) : (
            /* My Coffee Chats Tab */
            <div className="space-y-4">
              {/* Filter Sub-chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `Tümü (${coffeeChats.length})` },
                  { id: 'pending', label: `Onay Bekleyen (${coffeeChats.filter((c) => c.status === 'PENDING').length})` },
                  { id: 'confirmed', label: `Onaylanan (${coffeeChats.filter((c) => c.status === 'CONFIRMED').length})` },
                  { id: 'completed', label: `Tamamlanan (${coffeeChats.filter((c) => c.status === 'COMPLETED').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setChatFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                      chatFilter === f.id
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {(() => {
                const filtered = coffeeChats.filter((chat) => {
                  if (chatFilter === 'pending') return chat.status === 'PENDING';
                  if (chatFilter === 'confirmed') return chat.status === 'CONFIRMED';
                  if (chatFilter === 'completed') return chat.status === 'COMPLETED';
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <Coffee size={32} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-black text-slate-900">Randevu Bulunamadı</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Seçilen kriterde aktif randevu bulunmamaktadır.
                      </p>
                    </div>
                  );
                }

                return filtered.map((chat) => {
                  const statusObj = COFFEE_CHAT_STATUS[chat.status] || COFFEE_CHAT_STATUS.PENDING;
                  return (
                    <div
                      key={chat.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black">
                            <Coffee size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{chat.alumnusName}</h4>
                            <p className="text-xs font-bold text-slate-500">
                              {chat.alumnusTitle} @ {chat.alumnusCompany}
                            </p>
                            {chat.studentName && (
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Öğrenci: <strong className="text-slate-800">{chat.studentName}</strong> ({chat.studentDept || 'İESÜ'})
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusObj.badgeClass}`}>
                          {statusObj.label}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-amber-600" /> {chat.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-amber-600" /> {chat.timeSlot}
                        </span>
                        <span className="text-slate-500 font-bold truncate">
                          Konu: {chat.topicTitle}
                        </span>
                      </div>

                      {chat.note && (
                        <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/70 font-medium italic">
                          "{chat.note}"
                        </p>
                      )}

                      {/* Status-specific Action Bars */}
                      {chat.status === 'PENDING' && (
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleConfirmChat(chat.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 size={13} />
                            <span>Randevuyu Onayla (Link Oluştur)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancelChat(chat.id)}
                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            İptal Et
                          </button>
                        </div>
                      )}

                      {chat.status === 'CONFIRMED' && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          {chat.meetingLink && (
                            <a
                              href={chat.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Video size={13} />
                              <span>Görüşmeye Katıl (Google Meet)</span>
                            </a>
                          )}

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={() => handleCompleteChat(chat.id)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-black transition cursor-pointer border border-blue-200"
                            >
                              Görüşmeyi Tamamla
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelChat(chat.id)}
                              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                            >
                              İptal Et
                            </button>
                          </div>
                        </div>
                      )}

                      {chat.status === 'COMPLETED' && (
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-600" /> 15 Dk Mikro-Mentorluk Başarıyla Tamamlandı
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Arşivlendi</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
