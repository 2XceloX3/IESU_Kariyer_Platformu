import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, MessageSquare, ExternalLink, Calendar, Star, Building2, UserCircle2, Award, FileText, CheckCircle2, BookOpen, UserPlus, UserCheck, Users, ShieldCheck, Camera, Home, Compass, Bell, Search, MessageCircle, X, Heart, Crown, Activity, Globe, Volume2, PlayCircle, Sparkles, Settings, Clock, Tag, Tent, Flag, Plus, ChevronRight, BarChart2, Link2, Link, Radar } from 'lucide-react';
import Logo from './Logo';
import { Badge } from './admin/AdminCMSLayout';
import PostCard from './PostCard';
import TopProfileMenu from './TopProfileMenu';
import { combineFeedItems } from '../utils/feedCombiner';
import NavIcon from './shared/NavIcon';
import useAppStore from '../store/useAppStore';
import SkillTree from './SkillTree';

export default function UserProfile({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser }) {
  const userRole = useAppStore(state => state.userRole);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const unlockedBadges = useAppStore(state => state.unlockedBadges);
  const companies = useAppStore(state => state.companies);
  const academicStaff = useAppStore(state => state.academicStaff);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const notifications = useAppStore(state => state.notifications);
  const news = useAppStore(state => state.news);
  const events = useAppStore(state => state.events);
  const announcements = useAppStore(state => state.announcements);
  const jobs = useAppStore(state => state.jobs);
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('user_profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  const setCompanies = useAppStore(state => state.setCompanies);
  const [followersModal, setFollowersModal] = useState({ isOpen: false, title: '', users: [] });
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('avatar'); // 'avatar' | 'cover'
  const [customImageUrl, setCustomImageUrl] = useState('');

  const renderBadges = (badgeData) => {
    let badges = [];
    if (typeof badgeData === 'string' && badgeData.trim() !== '') badges = [badgeData];
    else if (Array.isArray(badgeData)) badges = badgeData;
    
    if (badges.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 ml-1">
        {badges.map((badge, idx) => {
          if (badge === 'verified' || badge === 'Doğrulanmış') return <ShieldCheck key={idx} size={20} className="text-red-500" title="Doğrulanmış" />;
          if (badge === 'top_voice' || badge === 'Top Voice') return <Crown key={idx} size={20} className="text-amber-500" title="Top Voice" />;
          if (badge === 'president' || badge === 'Kulüp Başkanı') return <Crown key={idx} size={20} className="text-purple-600" title="Kulüp Başkanı" />;
          if (badge === 'rep' || badge === 'Sınıf Temsilcisi') return <Award key={idx} size={20} className="text-emerald-500" title="Sınıf Temsilcisi" />;
          return <span key={idx} className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase">{badge}</span>;
        })}
      </div>
    );
  };



  useEffect(() => {
    // If no userId is provided (e.g. clicked from quick nav without setting selectedUserId),
    // we assume the user wants to view their own profile.
    const targetUserId = userId || currentUser?.id;

    // Fallback: Eger localStorage'dan dolayi currentUser'in id'si yoksa ama admin profiline erisilmeye calisiliyorsa
    if (targetUserId === 'admin_1513' && (userRole === 'admin' || (currentUser && currentUser?.role === 'admin'))) {
      setUser(currentUser || { name: 'Kariyer Geliştirme Merkezi', department: 'Yönetim', grade: 'Süper Admin', role: 'admin' });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    if (currentUser && (targetUserId === currentUser?.id || targetUserId === parseInt(currentUser?.id))) {
      setUser(currentUser);
      setUserType(userRole === 'academic' ? 'academic' : (currentUser?.role === 'admin' ? 'admin' : (userRole === 'employer' ? 'company' : userRole)));
      setIsLoading(false);
      return;
    }

    let found = (students || []).find(s => s.id === targetUserId || s.id === parseInt(targetUserId));
    if (found) { setUser(found); setUserType('student'); setIsLoading(false); return; }

    found = (alumni || []).find(a => a.id === targetUserId || a.id === parseInt(targetUserId));
    if (found) { setUser(found); setUserType('alumni'); setIsLoading(false); return; }

    found = (companies || []).find(c => c.id === targetUserId || c.id === parseInt(targetUserId));
    if (found) { setUser(found); setUserType('company'); setIsLoading(false); return; }

    found = (academicStaff || []).find(a => a.id === targetUserId || a.id === parseInt(targetUserId));
    if (found) { setUser(found); setUserType('academic'); setIsLoading(false); return; }
    
    // Fallback: If viewing own profile and not found in arrays, use currentUser directly
    if (currentUser && (
        currentUser.id === targetUserId || 
        currentUser.id === parseInt(targetUserId) || 
        (!currentUser.id && (targetUserId === 'admin_1513' || targetUserId === 1 || targetUserId === '1')) ||
        !targetUserId
    )) {
      setUser({ ...currentUser, id: currentUser.id || targetUserId });
      setUserType(currentUser.role === 'alumni' ? 'alumni' : currentUser.role === 'employer' ? 'company' : currentUser.role === 'academic' ? 'academic' : currentUser.role === 'admin' ? 'admin' : 'student');
      setIsLoading(false);
      return;
    }

    // Advanced Fallback: Salvage user info from posts or messages (fixes "Kullanıcı Bulunamadı" when arrays are empty but user exists in history)
    const allFeedItems = [...(posts || []), ...(news || []), ...(events || []), ...(announcements || []), ...(jobs || [])];
    const postByUser = allFeedItems.find(p => p.author?.id === targetUserId);
    if (postByUser && postByUser.author) {
      setUser(postByUser.author);
      setUserType(postByUser.author.role === 'alumni' ? 'alumni' : postByUser.author.role === 'employer' ? 'company' : postByUser.author.role === 'academic' ? 'academic' : 'student');
      setIsLoading(false);
      return;
    }

    const messageWithUser = (messages || []).find(m => m.senderId === targetUserId || m.receiverId === targetUserId);
    if (messageWithUser) {
      const isSender = messageWithUser.senderId === targetUserId;
      setUser({
        id: targetUserId,
        name: isSender ? messageWithUser.senderName : messageWithUser.receiverName || 'Kullanıcı',
        avatar: isSender ? messageWithUser.senderAvatar : `https://ui-avatars.com/api/?name=U&background=0A2342&color=fff`,
        department: 'Esenyurt Üniversitesi',
        role: String(targetUserId).startsWith('ALU-') ? 'alumni' : String(targetUserId).startsWith('CMP-') ? 'company' : String(targetUserId).startsWith('ACAD-') ? 'academic' : 'student'
      });
      setUserType(String(targetUserId).startsWith('ALU-') ? 'alumni' : String(targetUserId).startsWith('CMP-') ? 'company' : String(targetUserId).startsWith('ACAD-') ? 'academic' : 'student');
      setIsLoading(false);
      return;
    }

    setUser(null);
    setIsLoading(false);
  }, [userId, students, alumni, companies, academicStaff, currentUser, userRole]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-iesu-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <UserCircle2 size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız profil silinmiş veya mevcut olmayabilir.</p>
        <button onClick={() => setView(userRole === 'admin' ? 'admin' : (previousView === 'user_profile' ? (userRole || 'landing') : (previousView || 'landing')))} className="flex items-center gap-2 bg-[#990000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
          <ArrowLeft size={18} /> Geri Dön
        </button>
      </div>
    );
  }

  const handleMessage = () => {
    if (setDirectMessageUser) {
      setDirectMessageUser(user.id);
    }
    setView('messaging');
  };

  const isMessageAllowed = (() => {
    if (userRole === 'admin') return true;
    if (!userType || !userRole) return false;
    if ((userRole === 'student' || userRole === 'alumni') && (userType === 'student' || userType === 'alumni' || userType === 'academic')) return true;
    if (userRole === 'academic' && (userType === 'company' || userType === 'student' || userType === 'alumni')) return true;
    if (userRole === 'company' && userType === 'academic') return true;
    return false;
  })();

  const renderStudentProfile = () => {
    return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 sm:h-48 bg-[#990000] relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-32 h-32 sm:w-[152px] sm:h-[152px] rounded-full border-4 border-white bg-white absolute -top-16 sm:-top-24 left-6 sm:left-8 overflow-hidden flex items-center justify-center p-2">
          {userType === 'admin' || user?.role === 'admin' || user?.name === 'Kariyer Geliştirme Merkezi' ? (
            <Logo size="xl" className="w-full h-full justify-center" />
          ) : (
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0A2342&color=fff&size=200`} 
              alt={user?.name} 
              className="w-full h-full object-cover rounded-full" 
              onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }}
            />
          )}
        </div>
        
        <div className="pt-20 sm:pt-24 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} 
              {user?.pronouns && <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md lowercase">[{user.pronouns}]</span>}
              <button aria-label="İşlem Butonu" title="İsmimin Okunuşu" className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                <Volume2 size={14} />
              </button>
              {renderBadges(currentUser?.id === user?.id ? [...(user?.badges || []), ...unlockedBadges] : user?.badges)}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">{user?.department}</p>
            {user?.faculty && <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">{user?.faculty}</p>}
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Sınıf: {user?.year || 'Belirtilmemiş'} 
              {user?.doubleMajor && ` • ÇAP: ${user?.doubleMajor}`}
              {user?.minor && ` • Yandal: ${user?.minor}`}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-black text-gray-900">0</span>
                <span className="text-gray-500 font-medium">Takipçi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-black text-gray-900">0</span>
                <span className="text-gray-500 font-medium">Takip Edilen</span>
              </div>
            </div>
          </div>
          {currentUser?.id !== user?.id && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={userRole === 'academic' ? () => window.toast.info('Akademik inceleme moduna geçildi.') : () => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition border ${isFollowing && userRole !== 'academic' ? 'bg-white border-iesu-navy text-[#990000] hover:bg-red-50' : 'bg-[#0A66C2] hover:bg-[#004182] border-[#0A66C2] text-white'}`}
              >
                {userRole === 'academic' ? <><FileText size={16} /> Akademik İnceleme</> : isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              {isMessageAllowed && (
                <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-gray-500 hover:border-gray-700 text-gray-700 hover:bg-gray-100 rounded-full font-bold text-sm transition shadow-sm">
                  <MessageSquare size={16} /> Mesaj Gönder
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <section>
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><FileText size={18} className="text-[#990000]" /> Hakkında</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-gray-50 p-4 sm:p-6 rounded-2xl">{user?.bio || 'Bu kullanıcı henüz hakkında bir bilgi eklememiş.'}</p>
            </section>
            
            <section>
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-[#990000]" /> Eğitim Bilgileri</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] shrink-0">
                    <GraduationCap size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">İstanbul Esenyurt Üniversitesi</h4>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">{user?.department}</p>
                    <p className="text-gray-500 text-xs mt-1">Sınıf: {user?.year}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2026 Web3 IPFS / SBT Certificates */}
            <section className="mt-8">
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-[#990000]" /> Soulbound (SBT) Sertifikalar</h3>
              <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck size={100} />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                    <Award size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Web3 Otonom Geliştirici Sertifikası</h4>
                    <p className="text-indigo-200 text-xs sm:text-sm font-medium">İESÜ Akreditasyon Kurulu tarafından onaylandı.</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded border border-white/10">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-indigo-100 font-mono">IPFS CID: QmYwAPJ...x5G7</span>
                      <span className="text-[9px] text-emerald-400 ml-2 border border-emerald-400/30 px-1 rounded bg-emerald-400/10">Kalıcı Kayıt (Filecoin)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};



  const renderAlumniProfile = () => {
    const activeUser = user || currentUser || { name: 'Kariyer Geliştirme Merkezi', title: 'Mezun', department: 'Bilgisayar Mühendisliği', gradYear: '2022' };
    const isSelf = currentUser?.id === activeUser?.id || (currentUser?.role === 'alumni' && userRole === 'alumni') || userRole === 'alumni';

    return (
      <div className="space-y-6">

        {/* ─── ZÜMRÜT MEZUN HERO KAPAK KARTI ─── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          <div className="h-44 sm:h-52 bg-gradient-to-r from-teal-950 via-teal-800 to-emerald-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent"></div>
            {isSelf && (
              <button 
                onClick={() => { setUploadType('cover'); setShowImageUploadModal(true); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={14} /> Kapak Değiştir
              </button>
            )}
          </div>

          <div className="px-6 sm:px-10 pb-6 relative">
            <div className="relative inline-block -top-16 sm:-top-18 -mb-12">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center p-1 relative group">
                <img 
                  src={activeUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser?.name || 'Mezun')}&background=0F766E&color=fff&size=200`} 
                  alt={activeUser?.name} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                {isSelf && (
                  <button 
                    onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 rounded-2xl cursor-pointer"
                  >
                    <Camera size={20} />
                    Fotoğraf Seç
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{activeUser?.name || 'Alperen Yılmaz'}</h1>
                  <ShieldCheck size={22} className="text-teal-600" title="Onaylı İESÜ Mezunu" />
                  <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeUser?.title || 'Kıdemli Yazılım Mimarı @ Trendyol Tech'}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-600 mt-1 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-teal-600" />
                  {activeUser?.department || 'Bilgisayar Mühendisliği'} • 2022 Mezunu
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isSelf ? (
                  <button 
                    onClick={() => setView('profile_update')} 
                    className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700 text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Settings size={15} /> Profili Düzenle
                  </button>
                ) : (
                  <button 
                    onClick={handleMessage} 
                    className="flex-1 sm:flex-none bg-gray-900 hover:bg-black text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={15} /> Mesaj Gönder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          
          {/* 1. SOL SÜTUN (3 SÜTUN - lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Kariyer Hikayesi & Biyografi */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Biyografi & Hikaye</h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {activeUser?.bio || 'İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği bölümünden dereceyle mezun oldum. Şu anda Trendyol Tech bünyesinde Kıdemli Yazılım Mühendisi olarak görev yapıyorum.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Etiketleri</p>
                <div className="flex flex-wrap gap-1.5">
                  {['#React', '#CloudArchitecture', '#NodeJS', '#SystemDesign', '#DevOps'].map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-gray-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* İESÜ Lisans Derecesi Kartı (Sol Sütunda Biyografinin Altında) */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/10 text-teal-300 rounded-lg flex items-center justify-center">
                      <GraduationCap size={16} />
                    </div>
                    <h3 className="font-black text-white text-xs">İESÜ Lisans</h3>
                  </div>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Award size={10} /> Yüksek Onur
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Fakülte & Bölüm</p>
                    <p className="font-black text-white text-xs mt-0.5">{activeUser?.department || 'Bilgisayar Mühendisliği'}</p>
                    <p className="text-[11px] text-gray-300 font-medium">Mühendislik Fakültesi</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Mezuniyet & GPA</p>
                    <p className="font-black text-white text-xs mt-0.5">{activeUser?.gradYear || '2022'} Dönemi</p>
                    <p className="text-[11px] text-emerald-400 font-bold">GPA: 3.84 / 4.00</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-200">
                <span className="truncate">Diploma #IESU-2022-8841</span>
                <span className="font-bold text-white flex items-center gap-0.5 shrink-0">Doğrula <ChevronRight size={12} /></span>
              </div>
            </div>
          </div>

          {/* 2. ORTA SÜTUN: GÖNDERİLER AKIŞI & SEKTÖR DENEYİMİ (6 SÜTUN - lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Sektör & Kariyer Geçmişi */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase size={16} />
                </div>
                <h3 className="font-black text-gray-900 text-base">Sektör & Kariyer Geçmişi</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Kıdemli Yazılım Mimarı</h4>
                    <p className="text-xs font-semibold text-teal-700">Trendyol Tech • Tam Zamanlı</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">2023 - Halen (2 Yıl 6 Ay)</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">Aktif Rol</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Full-Stack Software Developer</h4>
                    <p className="text-xs font-semibold text-gray-700">Aselsan A.Ş. • Tam Zamanlı</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">2022 - 2023 (1 Yıl 2 Ay)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GÖNDERİLER AKIŞI (TAM ORTADA KENDİ BÖLÜMÜNDE) */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <BookOpen size={18} className="text-teal-600" /> Paylaşımlar & Gönderiler
                </h3>
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {(posts || []).length} Gönderi
                </span>
              </div>

              {(() => {
                const userPosts = (posts || []).filter(p => p.author?.id === activeUser?.id || p.authorName === activeUser?.name || p.author === activeUser?.name);
                const listToRender = userPosts.length > 0 ? userPosts : (posts || []).slice(0, 4);

                return listToRender.map(post => (
                  <PostCard key={post.id} post={post} currentUser={currentUser} setPosts={setPosts} setSelectedUserId={setSelectedUserId} setView={setView} />
                ));
              })()}
            </div>
          </div>

          {/* 3. SAĞ SÜTUN (3 SÜTUN - lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Kariyer Metrikleri */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BarChart2 size={16} />
                </div>
                <h3 className="font-black text-gray-900 text-sm">Kariyer Metrikleri</h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Sektör Deneyimi</span>
                  <span className="font-black text-teal-700 text-sm">4+ Yıl</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Mentörlük Edilen</span>
                  <span className="font-black text-emerald-600 text-sm">28 Öğrenci</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Tamamlanan Proje</span>
                  <span className="font-black text-purple-600 text-sm">14 Proje</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Ağ Sıralaması</span>
                  <span className="font-black text-amber-600 text-sm">Top %5</span>
                </div>
              </div>
            </div>

            {/* Mentörlük & İletişim */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Mentörlük & İletişim</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                    <p className="font-bold text-blue-900">Mentörlük Saatleri</p>
                    <p className="text-blue-700 font-medium mt-0.5 text-[11px]">Çarşamba & Cuma: 18:00 - 20:00</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 truncate text-[11px]">
                      <Mail size={12} className="text-gray-400 shrink-0" /> {activeUser?.email || 'alperen.yilmaz@esenyurt.edu.tr'}
                    </p>
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 truncate text-[11px]">
                      <Link2 size={12} className="text-blue-500 shrink-0" /> linkedin.com/in/alperen-yilmaz
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleMessage()}
                className="w-full bg-teal-50 hover:bg-teal-100 text-teal-800 font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} /> Mentörlük İsteği Gönder
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderCompanyProfile = () => {
    const isOwnProfile = currentUser?.id === user?.id || userRole === 'company' || userRole === 'employer';

    // Firma'ya ait fuar başvuruları
    const myFairApps = careerFairApplications.filter(app =>
      app.companyName === user?.name ||
      app.companyId === user?.id ||
      app.userId === user?.id ||
      app.email === user?.email
    );

    // Firma'ya ait etkinlik katılımları (events)
    const myEvents = (events || []).filter(ev =>
      ev.registeredCompanies?.includes(user?.id) ||
      ev.registeredCompanies?.includes(user?.name) ||
      ev.sponsorCompany === user?.name ||
      ev.companyId === user?.id
    );

    // Gönderilmiş yönetici mesajları (adminMessages)
    const myMessages = adminMessages.filter(msg =>
      msg.companyId === user?.id ||
      msg.companyName === user?.name ||
      msg.email === user?.email
    );

    const fairStatusColor = (status) => {
      if (status === 'Onaylandı' || status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      if (status === 'Reddedildi' || status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
      return 'bg-amber-50 text-amber-700 border-amber-200';
    };
    const fairStatusLabel = (status) => {
      if (status === 'Onaylandı' || status === 'approved') return 'Onaylandı';
      if (status === 'Reddedildi' || status === 'rejected') return 'Reddedildi';
      return 'İnceleniyor';
    };

    const coverSrc = user?.coverImage || user?.cover;

    return (
      <div className="space-y-5">

        {/* ─── HERO CARD ─── */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="h-36 sm:h-52 bg-gradient-to-br from-[#7A0000] via-[#990000] to-red-800 relative overflow-hidden group">
            {coverSrc && (
              <img src={coverSrc} alt="Cover Background" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,0,0,0.2)_0%,_transparent_60%)]"></div>
            <div className="absolute bottom-4 right-6 opacity-10 pointer-events-none">
              <Building2 size={120} />
            </div>

            {/* Kapak Tasarımını Değiştir Butonu */}
            {isOwnProfile && (
              <button
                onClick={() => {
                  setUploadType('cover');
                  setCustomImageUrl(coverSrc || '');
                  setShowImageUploadModal(true);
                }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/20 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer z-10"
              >
                <Camera size={14} /> Kapak Tasarımını Değiştir
              </button>
            )}
          </div>

          {/* Logo + Info */}
          <div className="px-5 sm:px-8 pb-6 relative">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-white shadow-xl absolute -top-12 sm:-top-14 left-5 sm:left-8 overflow-hidden flex items-center justify-center p-1.5 group">
              {user?.role === 'admin' || user?.name === 'Kariyer Geliştirme Merkezi' ? (
                <Logo size="xl" className="w-full h-full justify-center" />
              ) : (
                <>
                  <img
                    src={user?.logo || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'F')}&background=990000&color=fff&size=200`}
                    alt={user?.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }}
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        setUploadType('avatar');
                        setCustomImageUrl(user?.logo || user?.avatar || '');
                        setShowImageUploadModal(true);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 rounded-xl cursor-pointer"
                    >
                      <Camera size={18} />
                      Logo Değiştir
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Name + Actions */}
            <div className="pt-16 sm:pt-18 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {user?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  {user?.sector && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                      <Tag size={13} className="text-gray-400" />{user.sector}
                    </span>
                  )}
                  {user?.location && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                      <MapPin size={13} className="text-gray-400" />{user.location}
                    </span>
                  )}
                  {user?.website && (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#990000] font-medium hover:underline">
                      <Link2 size={13} />{user.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {user?.description && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xl">{user.description}</p>
                )}
              </div>

              {/* Butonlar */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {isOwnProfile ? (
                  <button
                    onClick={() => setView('profile_update')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-bold text-sm transition shadow-md"
                  >
                    <Settings size={15} /> Bilgilerimi Düzenle
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { if (setDirectMessageUser) { setDirectMessageUser(user); setView('messages'); } else window.toast?.info('Mesajlaşma paneline yönlendiriliyorsunuz.'); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-bold text-sm transition shadow-md"
                    >
                      <MessageCircle size={15} /> İletişime Geç
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BENTO GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Fuar / Festival Katılımları */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Tent size={16} className="text-amber-600" />
                </div>
                Kariyer Fuarı & Festival Katılımları
              </h3>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {myFairApps.length} Başvuru
              </span>
            </div>

            {myFairApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                  <Tent size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Henüz fuar / festival başvurusu bulunmuyor.</p>
                <p className="text-xs text-gray-400 mt-1">Kariyer fuarı başvurusu yaptığınızda burada görünecek.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myFairApps.map((app, i) => (
                  <div key={app.id || i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <Flag size={18} className="text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{app.eventName || app.fairName || 'Kariyer Fuarı'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{app.notes || app.purpose || 'Stant & mülakat talebi'}</p>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock size={11} /> {app.date ? new Date(app.date).toLocaleDateString('tr-TR') : (app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('tr-TR') : 'Tarih belirtilmemiş')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${fairStatusColor(app.status)}`}>
                      {fairStatusLabel(app.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Etkinlik Takibi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                  <Calendar size={16} className="text-[#990000]" />
                </div>
                Etkinlik Takibi
              </h3>
              <span className="text-[11px] font-bold text-[#990000] bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                {myEvents.length} Etkinlik
              </span>
            </div>

            {myEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                  <Calendar size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Kayıtlı etkinlik yok.</p>
                <p className="text-xs text-gray-400 mt-1">Etkinlik onaylandığında burada görünecek.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myEvents.slice(0, 4).map((ev, i) => (
                  <div key={ev.id || i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">{ev.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={11} /> {ev.date || 'Tarih belirtilmemiş'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* İletişim & Mesaj Durumu */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MessageCircle size={16} className="text-blue-600" />
                </div>
                Yönetici İletişim Geçmişi
              </h3>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {myMessages.length} Mesaj
              </span>
            </div>

            {myMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                  <MessageCircle size={20} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Henüz yöneticiye mesaj gönderilmedi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {myMessages.map((msg, i) => (
                  <div key={msg.id || i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-gray-900 text-sm">{msg.subject || msg.topic || 'Genel Talep'}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${fairStatusColor(msg.status)}`}>
                        {fairStatusLabel(msg.status || 'pending')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{msg.message || msg.content || ''}</p>
                    <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                      <Clock size={11} /> {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('tr-TR') : 'Tarih yok'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  const renderAcademicProfile = () => {
    const activeUser = user || currentUser || { name: 'Kariyer Geliştirme Merkezi', title: 'Bölüm Başkanı', department: 'Bilgisayar Mühendisliği' };
    const isSelf = currentUser?.id === activeUser?.id || (currentUser?.role === 'academic' && userRole === 'academic') || userRole === 'academic';

    return (
      <div className="space-y-6">
        {/* ─── AKADEMİK HEADER & KART ─── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          
          {/* Arka Kapak Gradient */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-red-950 via-[#7A0000] to-red-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent"></div>
            <div className="absolute -bottom-10 right-10 opacity-10 text-white font-black text-8xl pointer-events-none select-none">
              AKADEMİK
            </div>
            
            {/* Kapak Görseli Değiştir Butonu (Kendi Profili İse) */}
            {isSelf && (
              <button 
                onClick={() => { setUploadType('cover'); setShowImageUploadModal(true); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={14} /> Kapak Değiştir
              </button>
            )}
          </div>

          {/* Profile Header Content */}
          <div className="px-6 sm:px-10 pb-8 relative">
            
            {/* Avatar & Hover Change */}
            <div className="relative inline-block -top-16 sm:-top-20 -mb-12">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center p-1 relative group">
                <img 
                  src={activeUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser?.name || 'Akademisyen')}&background=990000&color=fff&size=200`} 
                  alt={activeUser?.name} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                {isSelf && (
                  <button 
                    onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 rounded-2xl cursor-pointer"
                  >
                    <Camera size={20} />
                    Fotoğraf Seç
                  </button>
                )}
              </div>
            </div>

            {/* Top Action Buttons & Name Line */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{activeUser?.name || 'Akademisyen'}</h1>
                  <ShieldCheck size={22} className="text-[#990000]" title="Doğrulanmış Akademisyen Kadrosu" />
                  <span className="bg-red-50 text-[#990000] border border-red-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeUser?.title || 'Bölüm Başkanı'}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-600 mt-1 flex items-center gap-1.5">
                  <Building2 size={15} className="text-gray-400" />
                  {activeUser?.department || 'Bilgisayar Mühendisliği Bölümü'} • Mühendislik Fakültesi
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin size={13} className="text-gray-400" /> İstanbul Esenyurt Üniversitesi - Ana Kampüs B-Blok
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {isSelf ? (
                  <button 
                    onClick={() => setView('profile_update')} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Settings size={15} /> Profili Düzenle
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsFollowing(!isFollowing)} 
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition border cursor-pointer ${
                        isFollowing ? 'bg-gray-100 border-gray-300 text-gray-700' : 'bg-[#990000] border-[#990000] text-white hover:bg-red-800'
                      }`}
                    >
                      {isFollowing ? <><UserCheck size={15} /> Takip Ediliyor</> : <><UserPlus size={15} /> Takip Et</>}
                    </button>
                    <button 
                      onClick={handleMessage} 
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
                    >
                      <MessageSquare size={15} /> Mesaj İlet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BENTO GRID METRİKLER VE BİLGİ KARTLARI ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-[#990000]" /> Akademik Özgeçmiş & Biyografi
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {user?.bio || 'İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği Bölüm Başkanı. Yapay Zeka, Veri Madenciliği, Makine Öğrenmesi ve Yazılım Mimarileri alanında lisans ve lisansüstü düzeyinde dersler vermekte ve sanayi iş birliği projelerini yürütmektedir.'}
              </p>
            </div>

            {/* Uzmanlık Etiketleri (Tags) */}
            <div>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Tag size={14} className="text-[#990000]" /> Uzmanlık & Araştırma Alanları
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yapay Zeka & Derin Öğrenme', 
                  'Veri Madenciliği', 
                  'Yazılım Mimarisi', 
                  'Bulut Bilişim', 
                  'Siber Güvenlik', 
                  'Öğrenci Staj Koordinasyonu'
                ].map((tag, idx) => (
                  <span key={idx} className="bg-red-50 text-[#990000] border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KART 2: İSTATİSTİKLER & BÖLÜM METRİKLERİ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between space-y-4">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <BarChart2 size={18} className="text-[#990000]" /> Akademik Metrikler
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-100 text-center">
                <p className="text-2xl font-black text-[#990000]">450</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Sorumlu Öğrenci</p>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
                <p className="text-2xl font-black text-emerald-700">124</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Aktif Stajyer</p>
              </div>
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
                <p className="text-2xl font-black text-amber-700">18</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Yayın & Makale</p>
              </div>
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 text-center">
                <p className="text-2xl font-black text-blue-700">6</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Proje & Danışmanlık</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-gray-600 font-medium text-center">
              🎓 Öğrenci Danışmanlık Saatleri Haftalık 12 Saat
            </div>
          </div>

          {/* KART 3: VERİLEN DERSLER */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-[#990000]" /> Yürüttüğü Dersler
            </h3>
            <div className="space-y-2.5">
              {[
                { code: 'BM301', name: 'Yapay Zekaya Giriş', type: 'Lisans' },
                { code: 'BM402', name: 'Yazılım Mühendisliği Mimarileri', type: 'Lisans' },
                { code: 'YL505', name: 'İleri Derin Öğrenme Yöntemleri', type: 'Yüksek Lisans' }
              ].map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-black text-xs text-[#990000]">{c.code}</span>
                    <p className="font-bold text-gray-900 text-xs">{c.name}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KART 4: YAYINLAR & PROJELER */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <Award size={18} className="text-[#990000]" /> Son Yayınlar & TÜBİTAK Projeleri
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Derin Öğrenme Tabanlı Nesne Tespiti ve Otonom Sistemlerde Kullanımı', journal: 'IEEE Transactions on AI • 2025', badge: 'SCI-E Makale' },
                { title: 'Üniversite-Sanayi İş Birliği Modeliyle Akıllı Stajyer Eşleştirme Algoritması', journal: 'TÜBİTAK 1001 Projesi • Yürütücü', badge: 'TÜBİTAK Projesi' }
              ].map((pub, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{pub.title}</h4>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">{pub.journal}</p>
                  </div>
                  <span className="bg-red-50 text-[#990000] border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 w-fit">
                    {pub.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KART 5: İLETİŞİM & OFİS SAATLERİ */}
          <div className="md:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#990000]" /> İletişim & Öğrenci Ofis Saatleri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-gray-400 uppercase">E-POSTA ADRESİ</p>
                <p className="text-xs font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#990000]" /> {user?.email || 'akademisyen@esenyurt.edu.tr'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-gray-400 uppercase">OFİS KONUMU</p>
                <p className="text-xs font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                  <Building2 size={14} className="text-[#990000]" /> B-Blok Kat: 3 Oda: 304
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-gray-400 uppercase">OFİS SAATLERİ</p>
                <p className="text-xs font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#990000]" /> Salı & Perşembe 13:00 - 16:00
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const allItems = combineFeedItems(posts, events, news, announcements, jobs);
  
  const userPosts = allItems.filter(p => {
    const authorName = typeof p.author === 'string' ? p.author : p.author?.name;
    const authorRole = p.author?.role;
    const isMatch = authorName === user?.name || p.company === user?.name;
    const isAdminProfile = user?.role === 'admin' || userType === 'admin' || user?.name === 'Kariyer Geliştirme Merkezi' || userId === 'admin_1513';
    const isAdminPost = authorRole === 'admin' || authorName === 'Kariyer Geliştirme Merkezi';
    return isMatch || (isAdminProfile && isAdminPost);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="w-10"></div> {/* Spacer for symmetry */}
          
          {/* CENTER: Logo & Brand */}
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" /><div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
            </div>
          </div>
          
          {/* RIGHT: Notifications & Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="user_profile" />
          </div>
          
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-24 pb-20 animate-fade-in">
        {userType === 'student' && renderStudentProfile()}
        {(userType === 'alumni' || userRole === 'alumni') && renderAlumniProfile()}
        {(userType === 'company' || ((userType === 'admin') && (userRole === 'company' || userRole === 'employer'))) && renderCompanyProfile()}
        {(userType === 'academic' || userRole === 'academic') && renderAcademicProfile()}
        {userType === 'admin' && userRole === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Box 1: Identity */}
            <div className="md:col-span-2 bg-white rounded-xl border border-[var(--border-soft)] shadow-sm overflow-hidden flex flex-col group relative">
              <div className="h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-[var(--brand-secondary)] relative overflow-hidden">
                <img src="https://panel.esenyurt.edu.tr/assets/2026/resimler/kurumsaliletisim/98a001cf03524bf49bd45bd3e4810c71_295b798c355c46abb92d8d4e0b02683a.jpg" className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Esenyurt University" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="px-6 pb-6 flex-1 relative flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-xl -mt-12 overflow-hidden flex items-center justify-center relative shrink-0 p-2 z-10">
                  <Logo size="xl" className="w-full h-full justify-center" />
                </div>
                <div className="pt-4 flex-1">
                  <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    {user?.name || 'Kariyer Geliştirme Merkezi'}
                    <ShieldCheck size={20} className="text-emerald-500" />
                  </h1>
                  <p className="text-gray-500 font-medium">{user?.title || 'Süper Yönetici Hesabı'}</p>
                  
                  {(currentUser?.id !== user?.id && userRole !== 'employer' && userRole !== 'company') && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      <button onClick={handleMessage} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition">
                        <MessageCircle size={18} /> İletişime Geç
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bento Box 2: Stats (Firma Rolünde Gizlenir) */}
            {(userRole !== 'employer' && userRole !== 'company') && (
              <div className="bg-white rounded-xl border border-[var(--border-soft)] shadow-sm p-6 flex flex-col justify-between">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-[#990000]" /> İstatistikler
                </h3>
                <div className="space-y-4">
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition" onClick={() => setFollowersModal({isOpen: true, title: 'Gönderiler', users: []})}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><BookOpen size={18} /></div>
                      <span className="font-bold text-gray-700">Paylaşımlar</span>
                    </div>
                    <span className="font-black text-gray-900 text-lg">{userPosts.length}</span>
                  </div>
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition" onClick={() => setFollowersModal({isOpen: true, title: 'Takipçiler', users: students?.slice(0, 15) || []})}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><Users size={18} /></div>
                      <span className="font-bold text-gray-700">Takipçiler</span>
                    </div>
                    <span className="font-black text-gray-900 text-lg">{user?.followers?.length || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bento Box 3: Network Overview (Firma Rolünde Gizlenir) */}
            {(userRole !== 'employer' && userRole !== 'company') && (
              <div className="md:col-span-3 bg-white rounded-xl border border-[var(--border-soft)] shadow-sm p-6">
                 <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Globe size={18} className="text-red-500" /> Ağ Özeti
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-indigo-50 border border-red-100">
                    <p className="text-xs font-bold text-red-600 uppercase mb-1">Öğrenci Ağı</p>
                    <p className="text-2xl font-black text-gray-900">{students?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Mezun Ağı</p>
                    <p className="text-2xl font-black text-gray-900">{alumni?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100">
                    <p className="text-xs font-bold text-purple-600 uppercase mb-1">Firma Ağı</p>
                    <p className="text-2xl font-black text-gray-900">{companies?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">İlanlar</p>
                    <p className="text-2xl font-black text-gray-900">{jobs?.length || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {userType === 'student' && (
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Star size={24} className="text-amber-500" />
              Yetenekler & 3D Proje Vitrini
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
              {[
                { title: 'Esenyurt Kariyer Portalı', tech: 'React, Node.js', icon: <Compass size={20} /> },
                { title: 'AI Mülakat Asistanı', tech: 'Python, NLP', icon: <Sparkles size={20} /> },
                { title: 'Veri Analizi Modülü', tech: 'TensorFlow, Pandas', icon: <Activity size={20} /> }
              ].map((item, idx) => (
                <div key={idx} className="relative w-full h-64 rounded-2xl transition-transform duration-700 cursor-pointer group hover:shadow-2xl" style={{ transformStyle: 'preserve-3d' }} onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((y - centerY) / centerY) * -15;
                  const rotateY = ((x - centerX) / centerX) * 15;
                  e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-500 rounded-2xl shadow-lg flex flex-col justify-end p-6 border border-white/20 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white">
                      {item.icon}
                    </div>
                    <h3 className="text-white font-black text-xl mb-1 transform translate-z-10">{item.title}</h3>
                    <p className="text-indigo-100 text-sm font-medium">{item.tech}</p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded-md">İncelendi</span>
                      <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-1 rounded-md backdrop-blur-md">Başarılı</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* User Posts Section (Firma & Akademik Rolünde Gönderiler Gizlenir) */}
        {(userRole !== 'employer' && userRole !== 'company' && userRole !== 'academic' && userType !== 'academic') && (
          <div className="mt-8 mb-12">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={24} className="text-[#990000]" />
              Gönderiler
            </h2>
            <div className="space-y-6">
              {(() => {
                if (userPosts.length === 0) {
                  return (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={24} className="text-gray-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Henüz bir gönderisi yok</h3>
                      <p className="text-gray-500 text-sm">Kullanıcı herhangi bir gönderi paylaşmadı.</p>
                    </div>
                  );
                }
                return userPosts.map(post => (
                  <PostCard key={post.id} post={post} currentUser={currentUser} students={students || []} alumni={alumni || []} setPosts={setPosts} setMessages={setMessages} />
                ));
              })()}
            </div>
          </div>
        )}
      </main>

      {/* Followers Modal */}
      {followersModal.isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900">{followersModal.title}</h3>
              <button onClick={() => setFollowersModal({isOpen: false, title: '', users: []})} className="text-gray-500 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
            </div>
            <div className="p-2 overflow-y-auto flex-1">
              {followersModal.title === 'Gönderiler' ? (
                <div className="p-4 text-center text-gray-500 font-medium text-sm">
                  Gönderiler aşağıda sayfada listelenmektedir.
                </div>
              ) : followersModal.users?.length > 0 ? (
                <div className="space-y-1">
                  {followersModal.users.map((u, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=0A2342&color=fff`} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 leading-tight">{u.name}</p>
                          <p className="text-[11px] font-medium text-gray-500">{u.department || u.title || 'Kullanıcı'}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition">Profili Gör</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 font-medium text-sm">
                  Kimse bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload & Background Design Selection Modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/80">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                <Camera className="text-[#990000]" size={22} />
                {uploadType === 'avatar' ? 'Firma Logosu / Profil Fotoğrafı Güncelle' : 'Kapak / Arka Tasarım Fotoğrafı Güncelle'}
              </h3>
              <button onClick={() => setShowImageUploadModal(false)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-[#F8F9FC]">
              
              {/* Preview Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Mevcut Önizleme</label>
                <div className={`relative w-full overflow-hidden bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center ${uploadType === 'cover' ? 'h-36 sm:h-44' : 'h-32 w-32 mx-auto rounded-2xl'}`}>
                  {customImageUrl ? (
                    <img src={customImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <Camera size={36} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">Fotoğraf Yok / Seçilmedi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Local File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Cihazınızdan Fotoğraf Yükleyin</label>
                <label className="w-full py-4 bg-white border-2 border-dashed border-red-200 rounded-2xl flex items-center justify-center gap-3 text-[#990000] cursor-pointer hover:bg-red-50/50 hover:border-[#990000] transition font-bold text-sm shadow-sm group">
                  <Camera size={20} className="group-hover:scale-110 transition-transform" />
                  Dosya Seç (PNG, JPG, WEBP)
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            setCustomImageUrl(evt.target.result);
                            window.toast?.success('Fotoğraf başarıyla yüklendi, kaydet butonuna tıklayabilirsiniz.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* 2. Custom URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Veya Fotoğraf Bağlantısı (URL) Girin</label>
                <div className="relative">
                  <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {/* 3. Hazır Kurumsal Şablonlar (Preset Covers / Logos) */}
              <div className="space-y-2 pt-2 border-t border-gray-200/80">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block flex items-center justify-between">
                  {uploadType === 'cover' ? 'Hazır Arka Tasarım Şablonları' : 'Hazır Firma Logoları'}
                  <span className="text-[10px] text-[#990000] font-bold">1-Tıkla Seç</span>
                </label>
                
                {uploadType === 'cover' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Kurumsal Plaza & Finans Kulesi', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Teknoloji & İnovasyon Ofisi', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'İESÜ Kampüs & Ar-Ge Merkezi', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Kırmızı Kurumsal Tema', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`group relative h-20 rounded-xl overflow-hidden border-2 text-left transition-all ${customImageUrl === preset.url ? 'border-[#990000] ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-2 flex items-end">
                          <span className="text-[10px] font-bold text-white leading-tight drop-shadow">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Geometrik Tech Logo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Kurumsal Amblem', url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80' },
                      { name: 'İESÜ Logo', url: '/iesu-logo.svg' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`p-2 bg-white rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${customImageUrl === preset.url ? 'border-[#990000] ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-12 h-12 object-contain" />
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">İptal</button>
              <button
                onClick={() => {
                  if (!customImageUrl) {
                    window.toast?.info('Lütfen bir görsel yükleyin veya seçin.');
                    return;
                  }
                  const updatedUser = { ...user };
                  if (uploadType === 'cover') {
                    updatedUser.coverImage = customImageUrl;
                    updatedUser.cover = customImageUrl;
                  } else {
                    updatedUser.logo = customImageUrl;
                    updatedUser.avatar = customImageUrl;
                  }
                  setUser(updatedUser);
                  if (setCompanies) {
                    setCompanies(prev => (prev || []).map(c => (c.id === user?.id || c.name === user?.name) ? { ...c, ...updatedUser } : c));
                  }
                  try {
                    const stored = JSON.parse(localStorage.getItem('igu_mock_user') || '{}');
                    if (stored) {
                      localStorage.setItem('igu_mock_user', JSON.stringify({ ...stored, ...updatedUser }));
                    }
                  } catch (e) {}
                  setShowImageUploadModal(false);
                  window.toast?.success(uploadType === 'cover' ? 'Kapak / Arka tasarım fotoğrafı güncellendi!' : 'Firma logosu güncellendi!');
                }}
                className="px-6 py-2.5 text-xs font-black bg-[#990000] hover:bg-red-800 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Görseli Kaydet ve Uygula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING DOCK (CONTEXT AWARE & ROLE SCOPED) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[320px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.18)] flex items-center justify-around px-4 text-gray-800">
          
          {/* HOME / AKADEMİK AKIŞ */}
          <button 
            onClick={() => setView(userRole === 'academic' ? 'academic' : (userRole === 'employer' || userRole === 'company' ? 'company' : previousView || 'student'))} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-[#990000] hover:bg-red-50" 
            title="Ana Sayfa / Akış"
          >
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {(userRole === 'academic' || userType === 'academic') ? (
            /* AKADEMİK CENTER: KIRMIZI RADAR BUTTON */
            <button 
              onClick={() => setView('academic')} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7A0000] via-[#990000] to-red-600 text-white shadow-lg shadow-red-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
              title="Akademik Radar & Onay Havuzu"
            >
              <Radar size={24} strokeWidth={2.5} />
            </button>
          ) : (userRole === 'employer' || userRole === 'company') ? (
            /* COMPANY CENTER: RED (+) CREATE JOB FORM BUTTON */
            <button onClick={() => setView('company')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7A0000] via-[#990000] to-red-600 text-white shadow-lg shadow-red-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50" title="İlan / Staj Talebi Oluştur">
              <span className="text-2xl font-black leading-none">+</span>
            </button>
          ) : (
            <>
              <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="İlanlar">
                <Briefcase size={24} strokeWidth={2} />
              </button>
              
              {/* CENTER: SEARCH ICON */}
              <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : 'student')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
                <Search size={24} strokeWidth={2.5} />
              </button>
              
              {/* MESSAGES */}
              <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="Mesajlar">
                <MessageCircle size={24} strokeWidth={2} />
              </button>
            </>
          )}
          
          {/* PROFILE AVATAR */}
          <button 
            onClick={() => setView('user_profile')} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-red-500 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Profilim"
          >
            <img src={(currentUser?.role === 'admin' || currentUser?.avatar === '/iesu-logo.svg') ? '/iesu-logo.svg' : (currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanıcı')}&background=990000&color=fff`)} className="w-full h-full rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}





