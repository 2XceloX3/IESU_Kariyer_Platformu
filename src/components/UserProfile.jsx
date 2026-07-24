import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, MessageSquare, ExternalLink, Calendar, Star, Building2, UserCircle2, Award, FileText, CheckCircle2, BookOpen, UserPlus, UserCheck, Users, ShieldCheck, Camera, Home, Compass, Bell, Search, MessageCircle, X, Heart, Crown, Activity, Globe, Volume2, PlayCircle, Sparkles } from 'lucide-react';
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

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('user_profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [followersModal, setFollowersModal] = useState({ isOpen: false, title: '', users: [] });
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('avatar'); // 'avatar' | 'cover'

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
      setUser(currentUser || { name: 'Kariyer Geliştirme Koordinatörlüğü', department: 'Yönetim', grade: 'Süper Admin', role: 'admin' });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    if (currentUser && (targetUserId === currentUser?.id || targetUserId === parseInt(currentUser?.id))) {
      setUser(currentUser);
      setUserType(currentUser?.role === 'admin' ? 'admin' : (userRole === 'employer' ? 'company' : userRole));
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

  const renderStudentProfile = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 sm:h-48 bg-[#990000] relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-32 h-32 sm:w-[152px] sm:h-[152px] rounded-full border-4 border-white bg-white absolute -top-16 sm:-top-24 left-6 sm:left-8 overflow-hidden">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=0A2342&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
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
                    <p className="text-indigo-200 text-xs sm:text-sm font-medium">Birlik Ağı DAO tarafından onaylandı.</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded border border-white/10">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-indigo-100 font-mono">IPFS CID: QmYwAPJ...x5G7</span>
                      <span className="text-[9px] text-emerald-400 ml-2 border border-emerald-400/30 px-1 rounded bg-emerald-400/10">Kalıcı Kayıt (Filecoin)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* SKILL TREE & ACHIEVEMENTS (Only for current user) */}
            {currentUser?.id === user?.id && userRole !== 'academic' && (
              <section className="mt-8">
                <SkillTree />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlumniProfile = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-teal-700 to-teal-900 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-32 h-32 sm:w-[152px] sm:h-[152px] rounded-full border-4 border-white bg-white absolute -top-16 sm:-top-24 left-6 sm:left-8 overflow-hidden">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=0F766E&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="pt-20 sm:pt-24 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} <Badge type="success">Mezun</Badge> {renderBadges(user?.badge || user?.badges)}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">{user?.title || 'Mezun'} {user?.company && `at ${user?.company}`}</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{user?.department} • {user?.gradYear} Mezunu</p>
            {user?.faculty && <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">{user?.faculty}</p>}
            {(user?.doubleMajor || user?.minor) && (
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                {user?.doubleMajor && `ÇAP: ${user?.doubleMajor}`}
                {user?.doubleMajor && user?.minor && ' • '}
                {user?.minor && `Yandal: ${user?.minor}`}
              </p>
            )}
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
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition border ${isFollowing && userRole !== 'academic' ? 'bg-teal-50 border-teal-600 text-teal-600' : 'bg-teal-600 border-teal-600 text-white hover:bg-teal-700'}`}
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
      </div>
    </div>
  );

  const renderCompanyProfile = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-red-700 to-red-900 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-white shadow-lg absolute -top-12 sm:-top-16 left-6 sm:left-8 overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img src={user.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=2563EB&color=fff&size=200`} alt={user?.name} className="w-full h-full object-contain" />
        </div>
        
        <div className="pt-20 sm:pt-24 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} {user.status === 'Onaylı' && <CheckCircle2 className="text-red-500" size={20} />} {renderBadges(user?.badge || user?.badges)}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1 flex items-center gap-1.5">
              <Briefcase size={14} className="text-gray-500" />
              {user.sector || 'Sektör Belirtilmemiş'}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-black text-gray-900">0</span>
                <span className="text-gray-500 font-medium">Takipçi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-gray-500 font-medium">Merkez</span>
              </div>
            </div>
          </div>
          {currentUser?.id !== user?.id && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={userRole === 'academic' ? () => window.toast.info('Akademik inceleme moduna geçildi.') : () => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition border ${isFollowing && userRole !== 'academic' ? 'bg-red-50 border-red-600 text-red-600' : 'bg-red-600 border-red-600 text-white hover:bg-red-700'}`}
              >
                {userRole === 'academic' ? <><FileText size={16} /> Akademik İnceleme</> : isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border border-gray-500 hover:border-gray-700 text-gray-700 hover:bg-gray-100 rounded-full font-bold text-sm transition shadow-sm">
                <MessageSquare size={16} /> İletişime Geç
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAcademicProfile = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-slate-700 to-red-950 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-32 h-32 sm:w-[152px] sm:h-[152px] rounded-full border-4 border-white bg-white absolute -top-16 sm:-top-24 left-6 sm:left-8 overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=475569&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="pt-20 sm:pt-24 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} {renderBadges(user?.badges)}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">{user?.title || 'Akademik Personel'}</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{user?.department || 'Bölüm Belirtilmemiş'}</p>
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
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition border ${isFollowing && userRole !== 'academic' ? 'bg-slate-50 border-slate-700 text-slate-700' : 'bg-slate-700 border-slate-700 text-white hover:bg-red-900'}`}
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
      </div>
    </div>
  );

  const allItems = combineFeedItems(posts, events, news, announcements, jobs);
  
  const userPosts = allItems.filter(p => {
    const authorName = typeof p.author === 'string' ? p.author : p.author?.name;
    const authorRole = p.author?.role;
    const isMatch = authorName === user?.name || p.company === user?.name;
    const isAdminProfile = user?.role === 'admin' || userType === 'admin' || user?.name === 'Kariyer Geliştirme Koordinatörlüğü' || userId === 'admin_1513';
    const isAdminPost = authorRole === 'admin' || authorName === 'Kariyer Geliştirme Koordinatörlüğü';
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
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Koordinatörlüğü</p>
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
        {userType === 'alumni' && renderAlumniProfile()}
        {userType === 'company' && renderCompanyProfile()}
        {userType === 'academic' && renderAcademicProfile()}
        {userType === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Box 1: Identity (Spans 2 columns) */}
            <div className="md:col-span-2 bg-white rounded-xl border border-[var(--border-soft)] shadow-sm overflow-hidden flex flex-col group relative">
              <div className="h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-[var(--brand-secondary)] relative overflow-hidden">
                <img src="https://panel.esenyurt.edu.tr/assets/2026/resimler/kurumsaliletisim/98a001cf03524bf49bd45bd3e4810c71_295b798c355c46abb92d8d4e0b02683a.jpg" className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Esenyurt University" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="px-6 pb-6 flex-1 relative flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-xl -mt-12 overflow-hidden flex items-center justify-center relative shrink-0 p-2 z-10">
                  <img src="/logo.png" alt="Admin" className="w-full h-full object-contain" />
                </div>
                <div className="pt-4 flex-1">
                  <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    {user?.name || 'Kariyer Geliştirme Koordinatörlüğü'}
                    <ShieldCheck size={20} className="text-emerald-500" />
                  </h1>
                  <p className="text-gray-500 font-medium">{user?.title || 'Süper Yönetici Hesabı'}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <button onClick={handleMessage} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition">
                      <MessageCircle size={18} /> İletişime Geç
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Box 2: Stats */}
            <div className="bg-white rounded-xl border border-[var(--border-soft)] shadow-sm p-6 flex flex-col justify-between">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-[#990000]" /> İstatistikler
              </h3>
              <div className="space-y-4">
                <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition" onClick={() => setFollowersModal({isOpen: true, title: 'Gönderiler', users: []})}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><BookOpen size={18} /></div>
                    <span className="font-bold text-gray-700">Paylaşımlar</span>
                  </div>
                  <span className="font-black text-gray-900 text-lg">{userPosts.length}</span>
                </div>
                <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition" onClick={() => setFollowersModal({isOpen: true, title: 'Takipçiler', users: students?.slice(0, 15) || []})}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600"><Users size={18} /></div>
                    <span className="font-bold text-gray-700">Takipçiler</span>
                  </div>
                  <span className="font-black text-gray-900 text-lg">{user?.followers?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Bento Box 3: Network Overview */}
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
        
        {/* User Posts Section */}
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

      {/* Image Upload Cropper Modal (Mock) */}
      {showImageUploadModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                <Camera className="text-[#990000]" size={22} />
                {uploadType === 'avatar' ? 'Profil Fotoğrafını Güncelle' : 'Kapak Fotoğrafını Güncelle'}
              </h3>
              <button onClick={() => setShowImageUploadModal(false)} className="text-gray-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"><X size={20} /></button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center bg-[#F8F9FC]">
              <div className="w-full max-w-sm aspect-video bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-iesu-navy hover:bg-red-50/30 hover:text-[#990000] transition group">
                <Camera size={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm">Fotoğraf Seç</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Sürükle bırak veya tıkla (PNG, JPG)</p>
                <input type="file" className="hidden" accept="image/png, image/jpeg" />
              </div>
              
              <div className="w-full mt-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">Ölçekleme <span>100%</span></p>
                <input type="range" min="50" max="150" defaultValue="100" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-iesu-navy" />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">İptal</button>
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-secondary)] hover:shadow-lg text-white rounded-xl transition-all">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING DOCK (CONTEXT AWARE) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-iesu-navy" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanıcı')}&background=0A2342&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}




