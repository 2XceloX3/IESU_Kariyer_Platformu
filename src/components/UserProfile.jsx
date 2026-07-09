import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, MessageSquare, ExternalLink, Calendar, Star, Building2, UserCircle2, Award, FileText, CheckCircle2, BookOpen, UserPlus, UserCheck, Users, ShieldCheck, Camera, Home, Compass, Bell, Search, MessageCircle, X } from 'lucide-react';
import Logo from './Logo';
import { Badge } from './admin/AdminCMSLayout';
import PostCard from './PostCard';
import TopProfileMenu from './TopProfileMenu';
import { combineFeedItems } from '../utils/feedCombiner';

export default function UserProfile({ userId, setView, setSelectedUserId, previousView, students, alumni, companies, academicStaff, currentUser, setDirectMessageUser, userRole, posts = [], setPosts, messages = [], notifications = [], news = [], events = [], announcements = [], jobs = [] }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('user_profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [followersModal, setFollowersModal] = useState({ isOpen: false, title: '', users: [] });
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('avatar'); // 'avatar' | 'cover'

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

  useEffect(() => {
    // Fallback: Eger localStorage'dan dolayi currentUser'in id'si yoksa ama admin profiline erisilmeye calisiliyorsa
    if (userId === 'admin_1513' && (userRole === 'admin' || (currentUser && currentUser.role === 'admin'))) {
      setUser(currentUser || { name: 'Kariyer Merkezi', department: 'Yönetim', grade: 'Süper Admin', role: 'admin' });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    if (currentUser && (userId === currentUser.id || userId === parseInt(currentUser.id))) {
      setUser(currentUser);
      setUserType(currentUser.role === 'admin' ? 'admin' : (userRole === 'employer' ? 'company' : userRole));
      setIsLoading(false);
      return;
    }

    let found = (students || []).find(s => s.id === userId || s.id === parseInt(userId));
    if (found) { setUser(found); setUserType('student'); setIsLoading(false); return; }

    found = (alumni || []).find(a => a.id === userId || a.id === parseInt(userId));
    if (found) { setUser(found); setUserType('alumni'); setIsLoading(false); return; }

    found = (companies || []).find(c => c.id === userId || c.id === parseInt(userId));
    if (found) { setUser(found); setUserType('company'); setIsLoading(false); return; }

    found = (academicStaff || []).find(a => a.id === userId || a.id === parseInt(userId));
    if (found) { setUser(found); setUserType('academic'); setIsLoading(false); return; }
    
    setUser(null);
    setIsLoading(false);
  }, [userId, students, alumni, companies, academicStaff]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-iesu-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <UserCircle2 size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız profil silinmiş veya mevcut olmayabilir.</p>
        <button onClick={() => setView(userRole === 'admin' ? 'admin' : (previousView === 'user_profile' ? (userRole || 'landing') : (previousView || 'landing')))} className="flex items-center gap-2 bg-iesu-red text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
          <ArrowLeft size={18} /> Geri Dön
        </button>
      </div>
    );
  }

  const handleMessage = () => {
    if (setDirectMessageUser) {
      setDirectMessageUser(user);
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-iesu-red to-red-900 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-lg absolute -top-12 sm:-top-16 left-6 sm:left-8 overflow-hidden">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=132A49&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="pt-14 sm:pt-4 sm:ml-40 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name}
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
                onClick={() => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm border-2 ${isFollowing ? 'bg-white border-iesu-red text-iesu-red hover:bg-red-50' : 'bg-iesu-red border-iesu-red hover:bg-red-700 text-white'}`}
              >
                {isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              {isMessageAllowed && (
                <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-sm transition shadow-sm">
                  <MessageSquare size={16} /> Mesaj Gönder
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            <section>
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><FileText size={18} className="text-iesu-red" /> Hakkında</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-gray-50 p-4 sm:p-6 rounded-2xl">{user?.bio || 'Bu kullanıcı henüz hakkında bir bilgi eklememiş.'}</p>
            </section>
            
            <section>
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2"><GraduationCap size={18} className="text-iesu-red" /> Eğitim Bilgileri</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-xl flex items-center justify-center text-iesu-red shrink-0">
                    <GraduationCap size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">İstanbul Esenyurt Üniversitesi</h4>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">{user?.department}</p>
                    <p className="text-gray-400 text-xs mt-1">Sınıf: {user?.year}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlumniProfile = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-teal-700 to-teal-900 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-lg absolute -top-12 sm:-top-16 left-6 sm:left-8 overflow-hidden">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=0F766E&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="pt-14 sm:pt-4 sm:ml-40 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} <Badge type="success">Mezun</Badge>
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
                onClick={() => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm border-2 ${isFollowing ? 'bg-teal-50 border-teal-600 text-teal-600' : 'bg-teal-600 border-teal-600 text-white hover:bg-teal-700'}`}
              >
                {isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              {isMessageAllowed && (
                <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-sm transition shadow-sm">
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-700 to-blue-900 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-white shadow-lg absolute -top-12 sm:-top-16 left-6 sm:left-8 overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img src={user.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=2563EB&color=fff&size=200`} alt={user?.name} className="w-full h-full object-contain" />
        </div>
        
        <div className="pt-14 sm:pt-4 sm:ml-40 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name} {user.status === 'Onaylı' && <CheckCircle2 className="text-blue-500" size={20} />}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mt-1 flex items-center gap-1.5">
              <Briefcase size={14} className="text-gray-400" />
              {user.sector || 'Sektör Belirtilmemiş'}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="font-black text-gray-900">0</span>
                <span className="text-gray-500 font-medium">Takipçi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-500 font-medium">Merkez</span>
              </div>
            </div>
          </div>
          {currentUser?.id !== user?.id && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm border-2 ${isFollowing ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-sm transition shadow-sm">
                <MessageSquare size={16} /> İletişime Geç
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAcademicProfile = () => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="h-32 sm:h-48 bg-gradient-to-r from-slate-700 to-slate-900 relative"></div>
      <div className="px-6 sm:px-8 pb-8 relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-lg absolute -top-12 sm:-top-16 left-6 sm:left-8 overflow-hidden flex items-center justify-center p-1 sm:p-2">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=475569&color=fff&size=200`} alt={user?.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="pt-14 sm:pt-4 sm:ml-40 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 flex-wrap">
              {user?.name}
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
                onClick={() => setIsFollowing(!isFollowing)} 
                className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm border-2 ${isFollowing ? 'bg-slate-50 border-slate-700 text-slate-700' : 'bg-slate-700 border-slate-700 text-white hover:bg-slate-800'}`}
              >
                {isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
              </button>
              {isMessageAllowed && (
                <button onClick={handleMessage} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-bold text-sm transition shadow-sm">
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
    const isAdminProfile = user?.role === 'admin' || userType === 'admin' || user?.name === 'Kariyer Merkezi' || userId === 'admin_1513';
    const isAdminPost = authorRole === 'admin' || authorName === 'Kariyer Merkezi';
    return isMatch || (isAdminProfile && isAdminPost);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-iesu-red transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Öğrenci, mezun, firma, ilan veya başvuru ara..." 
              className="bg-gray-100/80 pl-10 pr-4 py-2 rounded-2xl text-[14px] w-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-iesu-coral/20 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" active={activeTab === 'feed'} onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={activeTab === 'career_network'} onClick={() => {}} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={activeTab === 'jobs'} onClick={() => setView('jobs')} />
            <NavIcon 
              icon={<MessageCircle />} 
              label="Mesajlar" 
              badge={messages?.filter(m => m.receiverId === currentUser?.id && !m.read).length || 0} 
              onClick={() => setView('messaging')} 
            />
            <NavIcon 
              icon={<Bell />} 
              label="Bildirimler" 
              badge={(notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length || 0} 
              onClick={() => setView('notifications')} 
            />
            
            <TopProfileMenu 
              currentUser={currentUser} 
              userRole={userRole} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              setSelectedUserId={() => {}} 
              currentView="user_profile" 
            />
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
          <div className="bg-white rounded-3xl border border-[var(--border-soft)] shadow-md overflow-hidden transition-shadow hover:shadow-lg">
            <div className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-[var(--brand-red-dark)] relative overflow-hidden group">
              <img src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Esenyurt University" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              {currentUser?.id === user?.id && (
                <button 
                  onClick={() => { setUploadType('cover'); setShowImageUploadModal(true); }}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm border border-white/10" 
                  title="Kapak Fotoğrafını Değiştir"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>
            <div className="px-8 pb-8 relative">
              <div 
                className="w-36 h-36 rounded-full border-4 border-white bg-white shadow-xl absolute -top-16 left-8 overflow-hidden flex items-center justify-center group cursor-pointer p-2"
                onClick={() => { if (currentUser?.id === user?.id) { setUploadType('avatar'); setShowImageUploadModal(true); } }}
              >
                <img 
                  src={userType === 'admin' ? '/iesu-logo.svg' : (user?.avatar || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'KM')}&background=132A49&color=fff`)}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'KM')}&background=132A49&color=fff`; }}
                  alt={user?.name || "Profil"} 
                  className="w-full h-full object-contain" 
                />
                {currentUser?.id === user?.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera size={24} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="ml-44 pt-5 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                    {user?.name || 'Kariyer Geliştirme Koordinatörlüğü'}
                    <ShieldCheck size={24} className="text-emerald-500" />
                  </h1>
                  <p className="text-lg text-gray-600 font-medium mt-1">{user?.title || 'Süper Yönetici Hesabı'}</p>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition" onClick={() => setFollowersModal({isOpen: true, title: 'Gönderiler', users: []})}>
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600"><BookOpen size={16} /></div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Paylaşım</p>
                        <p className="text-sm font-black text-gray-900">{userPosts.length}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition" onClick={() => setFollowersModal({isOpen: true, title: 'Takipçiler', users: students?.slice(0, 15) || []})}>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Users size={16} /></div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Takipçi</p>
                        <p className="text-sm font-black text-gray-900">{user?.followers?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition" onClick={() => setFollowersModal({isOpen: true, title: 'Takip Edilenler', users: alumni?.slice(0, 5) || []})}>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><UserCheck size={16} /></div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Takip Edilen</p>
                        <p className="text-sm font-black text-gray-900">{user?.following?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {currentUser?.id !== user?.id && (
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition shadow-sm">
                    <MessageSquare size={18} /> İletişime Geç
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* User Posts Section */}
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={24} className="text-iesu-red" />
            Gönderiler
          </h2>
          <div className="space-y-6">
            {(() => {
              if (userPosts.length === 0) {
                return (
                  <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Henüz bir gönderisi yok</h3>
                    <p className="text-gray-500 text-sm">Kullanıcı herhangi bir gönderi paylaşmadı.</p>
                  </div>
                );
              }
              return userPosts.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} students={students || []} alumni={alumni || []} setPosts={setPosts} />
              ));
            })()}
          </div>
        </div>
      </main>

      {/* Followers Modal */}
      {followersModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900">{followersModal.title}</h3>
              <button onClick={() => setFollowersModal({isOpen: false, title: '', users: []})} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
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
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=132A49&color=fff`} className="w-10 h-10 rounded-full object-cover" alt="" />
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                <Camera className="text-iesu-red" size={22} />
                {uploadType === 'avatar' ? 'Profil Fotoğrafını Güncelle' : 'Kapak Fotoğrafını Güncelle'}
              </h3>
              <button onClick={() => setShowImageUploadModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"><X size={20} /></button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center bg-[#F8F9FC]">
              <div className="w-full max-w-sm aspect-video bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-iesu-red hover:bg-red-50/30 hover:text-iesu-red transition group">
                <Camera size={48} className="mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-bold text-sm">Fotoğraf Seç</p>
                <p className="text-xs font-medium text-gray-400 mt-1">Sürükle bırak veya tıkla (PNG, JPG)</p>
                <input type="file" className="hidden" accept="image/png, image/jpeg" />
              </div>
              
              <div className="w-full mt-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">Ölçekleme <span>100%</span></p>
                <input type="range" min="50" max="150" defaultValue="100" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-iesu-red" />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">İptal</button>
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[var(--brand-pomegranate)] to-[var(--brand-red-dark)] hover:shadow-lg text-white rounded-xl transition-all">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
