import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  UserCircle2, Settings, Landmark, Terminal, FolderGit2, Rocket, Globe2, Map, Brain, 
  CreditCard, Zap, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, 
  MessageSquare, ShieldCheck, Crown, LayoutDashboard, GraduationCap, Users as UsersIcon, 
  Building2, BookOpen, MessageCircle, Ghost, EyeOff, Download, Trash2, Globe, Trophy, 
  Mic, Briefcase, Wallet, Bot, CalendarCheck, Target, BarChart2, Award, Atom, Compass, Camera
} from 'lucide-react';
import Logo from './Logo';
import useAppStore, { coreStore } from '../store/useAppStore';
import CompanyManagementModal from './CompanyManagementModal';
import SafeAvatar from './shared/SafeAvatar';
import ThemeToggle from './shared/ThemeToggle';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId, academicRole, currentView, setCurrentUser, isDark: isDarkProp = false }) {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const storeDarkMode = useAppStore(state => state?.darkMode);
  const isDark = Boolean(isDarkProp || storeDarkMode);
  const activeFrame = useAppStore(state => state?.activeFrame);
  const alumniAssocBoard = useAppStore?.(state => state.alumniAssocBoard) || [];
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  const persistMockUser = (user) => {
    try {
      localStorage.setItem('iesu_mock_user', JSON.stringify(user));
    } catch (e) {}
  };

  const updateActiveUser = (user) => {
    const state = useAppStore.getState();
    if (state.setCurrentUser) state.setCurrentUser(user);
    if (setCurrentUser) setCurrentUser(user);
    persistMockUser(user);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        window.toast?.error('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target.result;
        const updatedUser = { ...(currentUser || {}), avatar: newAvatarUrl };
        
        const state = useAppStore.getState();
        updateActiveUser(updatedUser);
        
        if (userRole === 'student' && state.setStudents) {
          state.setStudents((state.students || []).map(s => s.id === updatedUser.id ? { ...s, avatar: newAvatarUrl } : s));
        } else if (userRole === 'alumni' && state.setAlumni) {
          state.setAlumni((state.alumni || []).map(a => a.id === updatedUser.id ? { ...a, avatar: newAvatarUrl } : a));
        } else if (userRole === 'academic' && state.setAcademicStaff) {
          state.setAcademicStaff((state.academicStaff || []).map(ac => ac.id === updatedUser.id ? { ...ac, avatar: newAvatarUrl } : ac));
        } else if (userRole === 'company' && state.setCompanies) {
          state.setCompanies((state.companies || []).map(c => c.id === updatedUser.id ? { ...c, avatar: newAvatarUrl } : c));
        }
        
        window.toast?.success('✅ Profil fotoğrafınız başarıyla güncellendi!');
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef?.current && !menuRef?.current?.contains?.(event?.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document?.addEventListener?.("mousedown", handleClickOutside);
    document?.addEventListener?.("keydown", handleKeyDown);
    return () => {
      document?.removeEventListener?.("mousedown", handleClickOutside);
      document?.removeEventListener?.("keydown", handleKeyDown);
    };
  }, [menuRef]);

  const handleLogout = async () => {
    // 1) Firebase oturumunu kapat
    try { await signOut(auth); } catch { /* Firebase yoksa da devam */ }

    // 2) Zustand coreStore'u doğrudan sıfırla (facade'da reset() yok)
    try {
      coreStore.setState({
        currentUser: null,
        userRole: null,
        authenticatedUserId: null,
        activeHive: 'student',
        previousHive: null,
        selectedUserId: null,
        selectedGroupId: null,
        activePortalBranch: null,
      });
      // Persist middleware'in yazdığı storage'ı da temizle
      coreStore?.persist?.clearStorage?.();
    } catch { /* intentional */ }

    // 3) TÜM localStorage ve sessionStorage oturum anahtarlarını temizle (iesu_theme tercihini koru)
    const savedTheme = (() => { try { return localStorage.getItem('iesu_theme'); } catch { return null; } })();
    const keysToRemove = [ 'iesu_admin_session', 'iesu_coordinator_token', 'iesu_mock_user', 'iesu_user', 'iesu_user_role_v1', 'iesu_remember_me', 'iesu_view_v1', 'iesu_posts', 'iesu_mentorships_v2', 'iesu_company_candidate_chats_v1', 'iesu_audit_log_v1', 'iesu_incubator_projects_v1', 'iesu_mentorship_requests_v1', 'iesu_messages_v2', 'iesu_applications_v1', 'iesu_notifications_v1', 'iesu_app_session_v1', 'iesu_active_portal_branch', 'iesu-career-shared-store', 'iesu-career-admin-store', 'iesu_staff_accounts_v1', 'iesu_academic_radar_v1', 'iesu_document_tracking_v1', 'iesu_candidate_pool_v1', 'iesu_admin_messages_v1', 'iesu_platform_messages_audit_v1' ]; keysToRemove.forEach(k => { try { localStorage.removeItem(k); } catch { /* intentional */ } }); Object.keys(localStorage).filter(k => (k.startsWith('iesu_') || k.startsWith('igu_')) && k !== 'iesu_theme').forEach(k => { try { localStorage.removeItem(k); } catch { /* intentional */ } });
    if (savedTheme) { try { localStorage.setItem('iesu_theme', savedTheme); } catch { /* intentional */ } }

    try { 
      sessionStorage.clear(); 
    } catch { /* intentional */ }

    setIsOpen(false);

    // 4) Sayfayı tamamen sıfırla — App.jsx useState initializer'ı null okur
    window.location.href = '/';
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'student': return 'Öğrenci';
      case 'alumni': return 'Mezun';
      case 'company': return 'Firma';
      case 'academic': return 'Akademik Personel';
      case 'admin':
        if (academicRole === 'super_admin') return 'Süper Yönetici';
        if (academicRole === 'content_admin') return 'İçerik Yöneticisi';
        if (academicRole === 'mentor_admin') return 'Mentor Yönetici';
        return 'Süper Yönetici';
      default: return 'Kullanıcı';
    }
  };

  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;

  // Check if current user has alumni assoc management privileges
  const isAssocAdmin = userRole === 'admin' || (alumniAssocBoard || []).some(m => 
    m.email === effectiveCurrentUser?.email || m.name === effectiveCurrentUser?.name
  );

  const activePortalBranch = useAppStore(state => state?.activePortalBranch);

  // Dal Egemenliği: Sayfa görünümü (currentView) veya açıkça belirtilen userRole önceliklidir
  const effectiveBranch = 
    (currentView === 'student') ? 'student' :
    (currentView === 'alumni') ? 'alumni' :
    (currentView === 'academic') ? 'academic' :
    (currentView === 'company' || currentView === 'employer') ? 'company' :
    (currentView === 'admin' || currentView === 'admin_cms' || currentView === 'yonetim_konsolu') ? 'admin' :
    (userRole && ['student', 'alumni', 'academic', 'company', 'admin'].includes(userRole)) ? userRole :
    (activePortalBranch || effectiveCurrentUser?.role || 'student');

  const isAdmin = effectiveCurrentUser?.role === 'admin';

  const branchUserName = effectiveCurrentUser?.name || (isAdmin ? 'KGM Yöneticisi' : 'Kullanıcı');

  const branchUserAvatar = effectiveCurrentUser?.avatar || (isAdmin ? '/iesu-logo.svg' : '/iesu-logo.svg');

  if (!effectiveCurrentUser) {
    return (
      <div className="flex items-center gap-2">
        <LanguageSwitcher variant={isDark ? 'dark' : 'compact'} />
        <ThemeToggle variant="surface" isDark={isDark} />
        <button 
          onClick={() => setView?.('login')}
          className="flex items-center gap-2 bg-[#990000] hover:bg-[#163B65] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md hover:shadow-lg"
        >
          <User size={14} /> Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher variant={isDark ? 'dark' : 'compact'} />
      <ThemeToggle variant="surface" isDark={isDark} />
      <div className="relative z-[100]" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Profil Menüsünü Aç/Kapat" 
          aria-expanded={isOpen} 
          aria-haspopup="true" 
          className={`flex items-center gap-2.5 p-1 sm:pr-3 rounded-full transition-all duration-200 shadow-sm hover:shadow cursor-pointer ${
            isDark 
              ? 'bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100' 
              : 'bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80'
          }`}
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center p-0.5 ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white'} border-2 ${
            effectiveBranch === 'student' ? (isDark ? 'border-rose-500/60' : 'border-[#990000]/40') :
            effectiveBranch === 'alumni' ? (isDark ? 'border-emerald-500/60' : 'border-emerald-600/40') :
            effectiveBranch === 'academic' ? (isDark ? 'border-purple-400/60' : 'border-purple-700/40') :
            effectiveBranch === 'company' ? (isDark ? 'border-blue-400/60' : 'border-blue-700/40') :
            'border-amber-500/60'
          } shadow-inner ${activeFrame ? activeFrame : ''}`}>
            {effectiveBranch === 'admin' ? (
              <Logo size="sm" variant={isDark ? "white" : "default"} className="w-full h-full justify-center" />
            ) : (
              <SafeAvatar
                src={branchUserAvatar}
                name={branchUserName}
                size="full"
                alt="Profile"
              />
            )}
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className={`text-[12px] font-black leading-tight truncate max-w-[135px] ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              {branchUserName}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              effectiveBranch === 'student' ? (isDark ? 'text-rose-400' : 'text-[#990000]') :
              effectiveBranch === 'alumni' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') :
              effectiveBranch === 'academic' ? (isDark ? 'text-purple-300' : 'text-purple-700') :
              effectiveBranch === 'company' ? (isDark ? 'text-sky-400' : 'text-blue-700') :
              (isDark ? 'text-amber-400' : 'text-amber-600')
            }`}>
              {isAdmin ? getRoleLabel('admin') : getRoleLabel(effectiveBranch)}
            </span>
          </div>

          <ChevronDown size={14} className={`transition-transform duration-200 ml-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'} ${isOpen ? 'rotate-180 text-rose-500' : ''}`} />
        </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-[285px] bg-white dark:bg-[#131c31] rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.35)] border border-gray-100 dark:border-slate-700/80 py-2 z-[9999] animate-fade-in origin-top-right transition-all duration-200">
          
          {isAdmin ? (
            <>
              {/* ADMIN HEADER */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-orange-50/30 dark:bg-amber-500/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[14px] font-black text-gray-900 dark:text-slate-100 truncate flex-1 transition-all duration-200">
                    Kariyer Geliştirme Koordinatörlüğü
                  </p>
                  <span className="bg-orange-100 dark:bg-amber-500/20 text-orange-600 dark:text-amber-300 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shrink-0 transition-all duration-200">
                    <Crown size={12} /> SÜPER ADMIN
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200">
                  <ShieldCheck size={12} className="text-gray-500 dark:text-slate-400" /> SÜPER ADMIN <span className="text-orange-500 dark:text-amber-400">• TÜM PANELLER</span>
                </p>
              </div>

              {/* PANEL SWITCHER GRID (6 BUTONLU HIZLI PANEL GEÇİŞİ) */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Portallar</p>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* 1. Yönetim Paneli */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('admin');
                      if (setSelectedUserId) setSelectedUserId('admin_1513');
                      setView?.('admin_cms');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'admin' && currentView === 'admin_cms')
                        ? 'bg-amber-600 text-white font-black border-amber-500 shadow-amber-950/20' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-amber-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'admin' && currentView === 'admin_cms' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white'}`}>
                      <LayoutDashboard size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'admin' && currentView === 'admin_cms' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Yönetim Paneli</span>
                  </button>

                  {/* 2. Kariyer Merkezi */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('admin');
                      if (setSelectedUserId) setSelectedUserId('admin_1513');
                      setView?.('admin');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'admin' && currentView === 'admin')
                        ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-black border-amber-500 shadow-amber-950/30' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-amber-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'admin' && currentView === 'admin' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white'}`}>
                      <Crown size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'admin' && currentView === 'admin' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Kariyer Merkezi</span>
                  </button>

                  {/* 3. Mezun Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('alumni');
                      setView?.('alumni'); 
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'alumni' || currentView === 'alumni'
                        ? 'bg-emerald-600 text-white font-black border-emerald-500 shadow-emerald-900/20' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'alumni' || currentView === 'alumni' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                      <UsersIcon size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'alumni' || currentView === 'alumni' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Mezun Portalı</span>
                  </button>

                  {/* 4. Öğrenci Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('student');
                      setView?.('student');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'student' || currentView === 'student'
                        ? 'bg-rose-600 text-white font-black border-rose-500 shadow-rose-900/20' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'student' || currentView === 'student' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white'}`}>
                      <GraduationCap size={16} />
                    </div>
                    <span className={`text-[11px] font-black leading-tight text-center ${userRole === 'student' || currentView === 'student' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Öğrenci Portalı</span>
                  </button>

                  {/* 5. Akademik Portal */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('academic');
                      setView?.('academic'); 
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'academic' || currentView === 'academic'
                        ? 'bg-[#4C1D95] text-white font-black border-purple-500 shadow-purple-950/20' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-purple-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'academic' || currentView === 'academic' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-500/20 text-[#4C1D95] dark:text-purple-300 group-hover:bg-[#4C1D95] group-hover:text-white'}`}>
                      <BookOpen size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'academic' || currentView === 'academic' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Akademik Portal</span>
                  </button>

                  {/* 6. Firma Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      const store = useAppStore.getState();
                      store.setActivePortalBranch?.('company');
                      setView?.('company');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'company' || userRole === 'employer' || currentView === 'company'
                        ? 'bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white font-black border-blue-500 shadow-blue-950/30' 
                        : 'bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 font-bold border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${(userRole === 'company' || userRole === 'employer' || currentView === 'company') ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 group-hover:bg-[#0A2342] group-hover:text-white'}`}>
                      <Building2 size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${(userRole === 'company' || userRole === 'employer' || currentView === 'company') ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>Firma Portalı</span>
                  </button>
                </div>
              </div>

              {/* ADMIN QUICK ACTIONS */}
              <div className="py-1">
                <button role="menuitem" onClick={() => { 
                  setIsOpen(false); 
                  if (setSelectedUserId) setSelectedUserId('admin_1513');
                  useAppStore.getState().setSelectedUserId?.('admin_1513');
                  setView?.('user_profile'); 
                }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 group cursor-pointer">
                  <User size={16} className="text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all duration-200" /> Kurumsal Profilim (KGM)
                </button>
                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('calendar'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 group cursor-pointer">
                  <Calendar size={16} className="text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200 transition-all duration-200" /> Takvim
                </button>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-gray-50 dark:border-slate-800 mt-1 py-1">
                <button role="menuitem" onClick={handleLogout} className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 transition-all duration-200 flex items-center gap-3 group">
                  <LogOut size={16} className="text-red-500 dark:text-rose-400 group-hover:text-red-600 transition-all duration-200" /> Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <>
              {/* NORMAL USER HEADER */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-black text-gray-900 dark:text-slate-100 truncate flex items-center gap-1 transition-all duration-200">
                    {branchUserName}
                    {effectiveCurrentUser?.badge && <ShieldCheck size={14} className="text-red-500 shrink-0" title={effectiveCurrentUser?.badge} />}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-0.5 flex items-center gap-1 transition-all duration-200">
                  <Shield size={10} /> {getRoleLabel(effectiveBranch)}
                </p>
              </div>
              
              {/* PANEL SWITCHER GRID (YÖNETİM BAŞTA -> KARİYER MERKEZİ -> MEZUN -> ÖĞRENCİ -> AKADEMİK -> FİRMA) */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Portallar</p>
                <div className="flex flex-col gap-1.5">
                  <div className="grid grid-cols-4 gap-1">
                    <button 
                      role="menuitem" 
                      onClick={() => { 
                        setIsOpen(false); 
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('alumni');
                        setView?.('alumni'); 
                      }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        effectiveBranch === 'alumni' 
                          ? 'bg-emerald-600 text-white font-black border-emerald-500 shadow-emerald-900/20' 
                          : 'bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-700/90 text-gray-700 dark:text-slate-200 font-bold border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 active:scale-95 hover:border-emerald-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${effectiveBranch === 'alumni' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                        <UsersIcon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${effectiveBranch === 'alumni' ? 'text-white' : 'text-gray-700 dark:text-slate-200'}`}>Mezun</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { 
                        setIsOpen(false); 
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('student');
                        setView?.('student'); 
                      }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        effectiveBranch === 'student' 
                          ? 'bg-rose-600 text-white font-black border-rose-500 shadow-rose-900/20' 
                          : 'bg-white dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-slate-700/90 text-gray-700 dark:text-slate-200 font-bold border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 active:scale-95 hover:border-rose-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${effectiveBranch === 'student' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white'}`}>
                        <GraduationCap size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${effectiveBranch === 'student' ? 'text-white' : 'text-gray-700 dark:text-slate-200'}`}>Öğrenci</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { 
                        setIsOpen(false); 
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('academic');
                        setView?.('academic'); 
                      }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        effectiveBranch === 'academic' 
                          ? 'bg-indigo-600 text-white font-black border-indigo-500 shadow-indigo-900/20' 
                          : 'bg-white dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-700/90 text-gray-700 dark:text-slate-200 font-bold border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 active:scale-95 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${effectiveBranch === 'academic' ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        <BookOpen size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${effectiveBranch === 'academic' ? 'text-white' : 'text-gray-700 dark:text-slate-200'}`}>Akademik</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { 
                        setIsOpen(false); 
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('company');
                        setView?.('company'); 
                      }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        effectiveBranch === 'company' 
                          ? 'bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white font-black border-blue-500 shadow-blue-950/20' 
                          : 'bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/90 text-gray-700 dark:text-slate-200 font-bold border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 active:scale-95 hover:border-blue-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${effectiveBranch === 'company' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 group-hover:bg-[#0A2342] group-hover:text-white'}`}>
                        <Building2 size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${effectiveBranch === 'company' ? 'text-white' : 'text-gray-700 dark:text-slate-200'}`}>Firma</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="py-1 border-b border-gray-50 dark:border-slate-800">
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    const store = useAppStore.getState();
                    const selfId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || effectiveCurrentUser?.studentNo || 'self';
                    if (setSelectedUserId) setSelectedUserId(selfId);
                    if (store?.setSelectedUserId) store.setSelectedUserId(selfId);
                    setView?.('user_profile'); 
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                >
                  <User size={16} className="text-slate-500 dark:text-slate-400" /> Profilimi Görüntüle
                </button>

                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('profile_update'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                >
                  <Settings size={16} className="text-slate-500 dark:text-slate-400" /> Profilimi Düzenle
                </button>

                {(effectiveBranch === 'student' || userRole === 'student') && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('student_kgb'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#990000] dark:text-rose-400 hover:bg-red-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                  >
                    <BookOpen size={16} className="text-[#990000] dark:text-rose-400" /> KGB Kariyer Karnem
                  </button>
                )}

                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    if (effectiveBranch === 'company' || userRole === 'company' || userRole === 'employer') {
                      setView?.('company_ats');
                    } else {
                      setView?.('applications');
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                >
                  <Briefcase size={16} className="text-slate-500 dark:text-slate-400" /> 
                  {effectiveBranch === 'company' || userRole === 'company' || userRole === 'employer' ? 'Aday Takip Panosu (ATS)' : 'Başvurularım'}
                </button>

                {(effectiveBranch === 'alumni' || userRole === 'alumni') && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('global_map'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-3 cursor-pointer"
                  >
                    <Globe size={16} className="text-emerald-600 dark:text-emerald-400" /> Küresel Mezun Haritası
                  </button>
                )}
              </div>

              <div className="py-1">
                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('calendar'); }}
                  className={`w-full text-left px-4 py-2 text-[13px] font-bold transition-all duration-200 flex items-center gap-3 group cursor-pointer ${
                    effectiveBranch === 'alumni' ? 'text-gray-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-800 dark:hover:text-emerald-300' : 'text-gray-700 dark:text-slate-200 hover:bg-[#990000]/10 dark:hover:bg-slate-800 hover:text-[#990000] dark:hover:text-rose-300'
                  }`}
                >
                  <Calendar size={16} className={`text-gray-500 dark:text-slate-400 transition-all duration-200 ${userRole === 'alumni' ? 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300' : 'group-hover:text-[#990000] dark:group-hover:text-rose-300'}`} /> Takvim
                </button>
              </div>

              <div className="border-t border-gray-50 dark:border-slate-800 mt-1 py-1">
                <button 
                  role="menuitem"
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-rose-950/40 hover:text-red-600 dark:hover:text-rose-400 transition-all duration-200 flex items-center gap-3 group"
                >
                  <LogOut size={16} className="text-gray-500 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-rose-400 transition-all duration-200" /> Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      )}
      </div>
      <CompanyManagementModal isOpen={showCompanyModal} onClose={() => setShowCompanyModal(false)} currentUser={effectiveCurrentUser} />
    </div>
  );
}

