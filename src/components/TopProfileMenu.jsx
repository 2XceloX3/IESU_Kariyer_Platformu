import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  UserCircle2, Settings, Landmark, Terminal, FolderGit2, Rocket, Globe2, Map, Brain, 
  CreditCard, Zap, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, 
  MessageSquare, ShieldCheck, Crown, LayoutDashboard, GraduationCap, Users as UsersIcon, 
  Building2, BookOpen, MessageCircle, Ghost, EyeOff, Download, Trash2, Globe, Trophy, 
  Mic, Briefcase, Wallet, Bot, CalendarCheck, Target, BarChart2, Award, Atom, Activity, Compass, Camera
} from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';
import BMICalculatorModal from './BMICalculatorModal';
import CompanyManagementModal from './CompanyManagementModal';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId, academicRole, currentView }) {
  const [showBmiModal, setShowBmiModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const ghostMode = useAppStore(state => state?.ghostMode);
  const setGhostMode = useAppStore(state => state?.setGhostMode);
  const focusMode = useAppStore(state => state?.focusMode);
  const setFocusMode = useAppStore(state => state?.setFocusMode);
  const activeFrame = useAppStore(state => state?.activeFrame);
  const alumniAssocBoard = useAppStore?.(state => state.alumniAssocBoard) || [];
  const featureAlumniAssocToggle = useAppStore?.(state => state.featureAlumniAssocToggle);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarFileInputRef = useRef(null);

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
        if (state.setCurrentUser) state.setCurrentUser(updatedUser);
        localStorage.setItem('igu_mock_user', JSON.stringify(updatedUser));
        
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

  const handleLogout = () => {
    window?.localStorage?.removeItem?.('igu_mock_user');
    window?.localStorage?.removeItem?.('igu_user_role_v1');
    window?.localStorage?.removeItem?.('igu_view_v1');
    useAppStore?.getState?.()?.setUserRole?.(null);
    setIsOpen(false);
    if (window?.location) {
      window.location.href = '/';
      window.location.reload?.();
    }
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
        return 'Kariyer Geliştirme Merkezi';
      default: return 'Kullanıcı';
    }
  };

  // Check if current user has alumni assoc management privileges
  const isAssocAdmin = userRole === 'admin' || (alumniAssocBoard || []).some(m => 
    m.email === currentUser?.email || m.name === currentUser?.name
  );

  // Tek yetki kaynağı: rol yalnızca currentUser.role + userRole üzerinden türetilir.
  // Avatar adı / sabit isim heuristic kullanılmaz (eski: 'Kariyer Geliştirme Merkezi' adı).
  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin' || academicRole === 'super_admin';

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2">
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
    <div className="flex items-center gap-3">
      <div className="relative z-[100]" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Profil Menüsünü Aç/Kapat" 
          aria-expanded={isOpen} 
          aria-haspopup="true" 
          className="flex items-center gap-2.5 p-1 sm:pr-3 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 rounded-full transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
        >
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center p-0.5 bg-white border-2 border-[#990000]/30 shadow-inner ${activeFrame ? activeFrame : ''}`}>
            {userRole === 'admin' || currentUser?.role === 'admin' || currentUser?.name === 'Kariyer Geliştirme Merkezi' ? (
              <Logo size="sm" className="w-full h-full justify-center" />
            ) : (
              <img 
                src={currentUser?.avatar || '/iesu-logo.svg'} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/iesu-logo.svg';
                }}
              />
            )}
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-[12px] font-black text-gray-900 leading-tight truncate max-w-[135px]">
              {currentView === 'admin' ? 'KGM Yönetimi' : (currentUser?.name || 'Hesabım')}
            </span>
            <span className="text-[10px] font-bold text-[#990000] uppercase tracking-wider">
              {currentView === 'admin' ? 'Yönetici' : getRoleLabel(userRole)}
            </span>
          </div>

          <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ml-0.5 ${isOpen ? 'rotate-180 text-[#990000]' : ''}`} />
        </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.2)] border border-gray-100 py-2 z-[9999] animate-fade-in origin-top-right transition-all duration-200">
          
          {userRole === 'admin' || currentUser?.role === 'admin' || academicRole === 'super_admin' ? (
            <>
              {/* ADMIN HEADER */}
              <div className="px-4 py-3 border-b border-gray-50 bg-orange-50/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[14px] font-black text-gray-900 truncate flex-1 transition-all duration-200">
                    Kariyer Geliştirme Merkezi
                  </p>
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shrink-0 transition-all duration-200">
                    <Crown size={12} /> SÜPER ADMIN
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200">
                  <ShieldCheck size={12} className="text-gray-500" /> SÜPER ADMIN <span className="text-orange-500">• TÜM PANELLER</span>
                </p>
              </div>

              {/* PANEL SWITCHER GRID (6 BUTONLU HIZLI PANEL GEÇİŞİ) */}
              <div className="px-4 py-3 border-b border-gray-50 bg-slate-50/50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Sistem Portalları Arası Geçiş</p>
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* 1. Yönetici Paneli */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('admin');
                      setView?.('admin');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'admin' && currentView === 'admin')
                        ? 'bg-[#990000] text-white font-black border-[#990000] shadow-red-950/20' 
                        : 'bg-white hover:bg-red-50 text-gray-700 font-bold border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'admin' && currentView === 'admin' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                      <LayoutDashboard size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'admin' && currentView === 'admin' ? 'text-white' : 'text-gray-800'}`}>Yönetici Paneli</span>
                  </button>

                  {/* 2. Süper Admin Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('admin');
                      setView?.('admin');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'admin' && currentView === 'admin')
                        ? 'bg-amber-600 text-white font-black border-amber-600 shadow-amber-900/20' 
                        : 'bg-white hover:bg-amber-50 text-gray-700 font-bold border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'admin' && currentView === 'admin' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white'}`}>
                      <Crown size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'admin' && currentView === 'admin' ? 'text-white' : 'text-gray-800'}`}>Süper Admin Portalı</span>
                  </button>

                  {/* 3. Mezun Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('alumni'); 
                      setView?.('alumni'); 
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'alumni' 
                        ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-emerald-900/20' 
                        : 'bg-white hover:bg-emerald-50 text-gray-700 font-bold border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'alumni' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                      <UsersIcon size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'alumni' ? 'text-white' : 'text-gray-800'}`}>Mezun Portalı</span>
                  </button>

                  {/* 4. Öğrenci Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('student');
                      setView?.('student');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'student' && currentView === 'student')
                        ? 'bg-rose-600 text-white font-black border-rose-600 shadow-rose-900/20' 
                        : 'bg-white hover:bg-rose-50 text-gray-700 font-bold border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'student' && currentView === 'student' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white'}`}>
                      <GraduationCap size={16} />
                    </div>
                    <span className={`text-[11px] font-black leading-tight text-center ${userRole === 'student' && currentView === 'student' ? 'text-white' : 'text-gray-800'}`}>Öğrenci Portalı</span>
                  </button>

                  {/* 5. Akademik Portal */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('academic'); 
                      setView?.('academic'); 
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      userRole === 'academic' 
                        ? 'bg-blue-600 text-white font-black border-blue-700 shadow-blue-900/20' 
                        : 'bg-white hover:bg-blue-50 text-gray-700 font-bold border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${userRole === 'academic' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <BookOpen size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${userRole === 'academic' ? 'text-white' : 'text-gray-800'}`}>Akademik Portal</span>
                  </button>

                  {/* 6. Firma Portalı */}
                  <button 
                    role="menuitem" 
                    onClick={() => { 
                      setIsOpen(false); 
                      useAppStore.getState().setUserRole('company'); 
                      setView?.('company');
                    }} 
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 group border shadow-xs cursor-pointer ${
                      (userRole === 'company' || userRole === 'employer') 
                        ? 'bg-purple-600 text-white font-black border-purple-700 shadow-purple-900/20' 
                        : 'bg-white hover:bg-purple-50 text-gray-700 font-bold border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className={`p-1 rounded-lg transition-all duration-200 ${(userRole === 'company' || userRole === 'employer') ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                      <Building2 size={16} />
                    </div>
                    <span className={`text-[11px] font-bold ${(userRole === 'company' || userRole === 'employer') ? 'text-white' : 'text-gray-800'}`}>Firma Portalı</span>
                  </button>
                </div>
              </div>

              {/* ADMIN QUICK ACTIONS */}
              <div className="py-1">
                {featureAlumniAssocToggle && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('alumni_assoc_portal'); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-black text-[#990000] bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-3 group border-l-4 border-[#990000]"
                  >
                    <Crown size={16} className="text-[#990000] group-hover:scale-110 transition-transform" /> Mezun Derneği Özel Yönetim Paneli
                  </button>
                )}



                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('calendar'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <Calendar size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> Takvim
                </button>
                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('profile_update'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <Settings size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> Bilgileri Düzenle
                </button>
                <button role="menuitem" onClick={() => { setIsOpen(false); setShowBmiModal(true); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-3 group cursor-pointer">
                  <Activity size={16} className="text-emerald-600 group-hover:scale-110 transition-all duration-200" /> Kilo & Sağlık VKİ Ölçümü
                </button>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-gray-50 mt-1 py-1">
                <button role="menuitem" onClick={handleLogout} className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group">
                  <LogOut size={16} className="text-red-500 group-hover:text-red-600 transition-all duration-200" /> Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <>
              {/* NORMAL USER HEADER */}
              <div className="px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-black text-gray-900 truncate flex items-center gap-1 transition-all duration-200">
                    {currentUser?.name || 'Kullanıcı'}
                    {currentUser?.badge && <ShieldCheck size={14} className="text-red-500 shrink-0" title={currentUser?.badge} />}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 flex items-center gap-1 transition-all duration-200">
                  <Shield size={10} /> {getRoleLabel(userRole)}
                </p>
              </div>
              
              {/* PANEL SWITCHER GRID (YÖNETİM BAŞTA -> MEZUN -> ÖĞRENCİ -> AKADEMİK -> FİRMA) */}
              <div className="px-4 py-3 border-b border-gray-50 bg-slate-50/50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Panel Geçişi</p>
                <div className="flex flex-col gap-1.5">
                  {isAdmin && (
                  <button 
                    role="menuitem" 
                    onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('admin'); setView?.('admin'); }} 
                    className={`flex items-center justify-center gap-2 p-2 rounded-xl text-center transition-all duration-200 group border shadow-sm ${
                      userRole === 'admin' 
                        ? 'bg-[#990000] text-white font-black border-[#990000]' 
                        : 'bg-white hover:bg-red-50 text-[#990000] font-black border-red-200 hover:-translate-y-0.5 active:scale-95'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-200 ${userRole === 'admin' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                      <LayoutDashboard size={16} />
                    </div>
                    <span className="text-[11px] font-black">Yönetim Paneli</span>
                  </button>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      role="menuitem" 
                      onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('alumni'); setTimeout(() => setView?.('alumni'), 50); }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        userRole === 'alumni' 
                          ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-emerald-900/20' 
                          : 'bg-white hover:bg-emerald-50 text-gray-700 font-bold border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-emerald-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${userRole === 'alumni' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                        <UsersIcon size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${userRole === 'alumni' ? 'text-white' : 'text-gray-700'}`}>Mezun</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('student'); setTimeout(() => setView?.('student'), 50); }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        userRole === 'student' 
                          ? 'bg-orange-600 text-white font-black border-orange-700 shadow-orange-900/20' 
                          : 'bg-white hover:bg-orange-50 text-gray-700 font-bold border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-orange-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${userRole === 'student' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                        <GraduationCap size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${userRole === 'student' ? 'text-white' : 'text-gray-700'}`}>Öğrenci</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('academic'); setTimeout(() => setView?.('academic'), 50); }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        userRole === 'academic' 
                          ? 'bg-blue-600 text-white font-black border-blue-700 shadow-blue-900/20' 
                          : 'bg-white hover:bg-blue-50 text-gray-700 font-bold border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-blue-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${userRole === 'academic' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        <BookOpen size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${userRole === 'academic' ? 'text-white' : 'text-gray-700'}`}>Akademik</span>
                    </button>

                    <button 
                      role="menuitem" 
                      onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('company'); setTimeout(() => setView?.('company'), 50); }} 
                      className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200 group border shadow-sm ${
                        (userRole === 'company' || userRole === 'employer') 
                          ? 'bg-purple-600 text-white font-black border-purple-700 shadow-purple-900/20' 
                          : 'bg-white hover:bg-purple-50 text-gray-700 font-bold border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-purple-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg transition-all duration-200 ${(userRole === 'company' || userRole === 'employer') ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                        <Building2 size={16} />
                      </div>
                      <span className={`text-[10px] font-bold ${(userRole === 'company' || userRole === 'employer') ? 'text-white' : 'text-gray-700'}`}>Firma</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                {featureAlumniAssocToggle && isAssocAdmin && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('alumni_assoc_portal'); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-black text-[#990000] bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-3 group border-l-4 border-[#990000]"
                  >
                    <Crown size={16} className="text-[#990000] group-hover:scale-110 transition-transform" /> Mezun Derneği Özel Yönetim Paneli
                  </button>
                )}
                




                <button 
                  role="menuitem"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-700 bg-red-50/70 hover:bg-red-100 transition-all duration-200 flex items-center gap-3 group cursor-pointer"
                >
                  <Camera size={16} className="text-[#990000] group-hover:scale-110 transition-all duration-200" /> 📷 Profil Fotoğrafı Yükle
                </button>
                <input 
                  type="file" 
                  ref={avatarFileInputRef} 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                />

                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('profile_update'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Settings size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Bilgilerimi Düzenle
                </button>

                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('calendar'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-[#990000]/10 hover:text-[#990000] transition-all duration-200 flex items-center gap-3 group"
                >
                  <Calendar size={16} className="text-gray-500 group-hover:text-[#990000] transition-all duration-200" /> Takvim
                </button>

                <button 
                  role="menuitem" 
                  onClick={() => { setIsOpen(false); setShowBmiModal(true); }} 
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-3 group cursor-pointer"
                >
                  <Activity size={16} className="text-emerald-600 group-hover:scale-110 transition-all duration-200" /> Kilo & Sağlık VKİ Ölçümü
                </button>
              </div>

              <div className="border-t border-gray-50 mt-1 py-1">
                <button 
                  role="menuitem"
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <LogOut size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      )}
      </div>
      <BMICalculatorModal isOpen={showBmiModal} onClose={() => setShowBmiModal(false)} />
      <CompanyManagementModal isOpen={showCompanyModal} onClose={() => setShowCompanyModal(false)} currentUser={currentUser} />
    </div>
  );
}

