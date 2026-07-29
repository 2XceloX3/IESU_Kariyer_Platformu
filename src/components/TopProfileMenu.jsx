import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  UserCircle2, Settings, Landmark, Terminal, FolderGit2, Rocket, Globe2, Map, Brain, 
  CreditCard, Zap, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, 
  MessageSquare, ShieldCheck, Crown, LayoutDashboard, GraduationCap, Users as UsersIcon, 
  Building2, BookOpen, MessageCircle, Ghost, EyeOff, Download, Trash2, Globe, Trophy, 
  Mic, Briefcase, Wallet, Bot, CalendarCheck, Target, BarChart2, Award, Atom, Activity, Compass
} from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';
import BMICalculatorModal from './BMICalculatorModal';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId, academicRole, currentView }) {
  const [showBmiModal, setShowBmiModal] = useState(false);
  const { ghostMode, setGhostMode, focusMode, setFocusMode, activeFrame } = useAppStore?.() || {};
  const alumniAssocBoard = useAppStore?.(state => state.alumniAssocBoard) || [];
  const featureAlumniAssocToggle = useAppStore?.(state => state.featureAlumniAssocToggle);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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
        return 'Kariyer Geliştirme Koordinatörlüğü';
      default: return 'Kullanıcı';
    }
  };

  // Check if current user has alumni assoc management privileges
  const isAssocAdmin = userRole === 'admin' || (alumniAssocBoard || []).some(m => 
    m.email === currentUser?.email || m.name === currentUser?.name
  );

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
      <div className="relative" ref={menuRef}>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Profil Menüsünü Aç/Kapat" aria-expanded={isOpen} aria-haspopup="true" className="flex items-center gap-2.5 focus:outline-none group transition-all duration-200">
          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${activeFrame ? activeFrame : ''}`}>
            {userRole === 'admin' ? (
              <img src="/iesu-logo.svg" alt="Admin" className="w-9 h-9 rounded-full object-contain p-0.5 bg-white border border-red-200 shadow-sm transition-all duration-200" />
            ) : (
              <img 
                src={currentUser?.avatar || '/iesu-logo.svg'} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-200 transition-all duration-200" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/iesu-logo.svg';
                }}
              />
            )}
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-fade-in origin-top-right transition-all duration-200">
          
          {userRole === 'admin' ? (
            <>
              {/* ADMIN HEADER */}
              <div className="px-4 py-3 border-b border-gray-50 bg-orange-50/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[14px] font-black text-gray-900 truncate flex-1 transition-all duration-200">
                    Kariyer Geliştirme...
                  </p>
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shrink-0 transition-all duration-200">
                    <Crown size={12} /> SÜPER ADMIN
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200">
                  <ShieldCheck size={12} className="text-gray-500" /> SÜPER ADMIN <span className="text-orange-500">• TÜM PANELLER</span>
                </p>
              </div>

              {/* ADMIN PANEL GRID */}
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Panel Geçişi</p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('admin'); setView?.('admin'); }} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-red-200 shadow-sm">
                    <div className="bg-red-100 text-red-600 p-1.5 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                      <LayoutDashboard size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700">Yönetim</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('academic'); setView?.('academic'); }} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-blue-200 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700">Akademik</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('student'); setView?.('student'); }} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-red-200 shadow-sm">
                    <div className="bg-red-100 text-red-600 p-1.5 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                      <GraduationCap size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700">Öğrenci</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('alumni'); setView?.('alumni'); }} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-emerald-200 shadow-sm">
                    <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                      <UsersIcon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700">Mezun</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('company'); setView?.('company'); }} className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-purple-200 shadow-sm">
                    <div className="bg-purple-100 text-purple-600 p-1.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all duration-200">
                      <Building2 size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700">Firma</span>
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
                <button role="menuitem" onClick={() => { 
                  setIsOpen(false); 
                  if (setSelectedUserId) setSelectedUserId?.(currentUser?.id || 'admin_1513');
                  setView?.('user_profile'); 
                }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <User size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> Profilim
                </button>
                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('calendar'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <Calendar size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> Takvim
                </button>
                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('mbs'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <Settings size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> Bilgileri Düzenle (MBS)
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
              
              {/* PANEL SWITCHER FOR ALL ROLES */}
              <div className="px-4 py-3 border-b border-gray-50 bg-slate-50/50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Panel Geçişi</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('student'); setView?.('student'); }} className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${userRole === 'student' ? 'bg-[#990000] text-white shadow-sm font-black' : 'bg-white hover:bg-red-50 text-gray-700 font-bold border border-gray-100'}`}>
                    <GraduationCap size={15} />
                    <span className="text-[11px]">Öğrenci</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('alumni'); setView?.('alumni'); }} className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${userRole === 'alumni' ? 'bg-[#990000] text-white shadow-sm font-black' : 'bg-white hover:bg-red-50 text-gray-700 font-bold border border-gray-100'}`}>
                    <UsersIcon size={15} />
                    <span className="text-[11px]">Mezun</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('company'); setView?.('company'); }} className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${(userRole === 'company' || userRole === 'employer') ? 'bg-[#990000] text-white shadow-sm font-black' : 'bg-white hover:bg-red-50 text-gray-700 font-bold border border-gray-100'}`}>
                    <Building2 size={15} />
                    <span className="text-[11px]">Firma</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('academic'); setView?.('academic'); }} className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${userRole === 'academic' ? 'bg-[#990000] text-white shadow-sm font-black' : 'bg-white hover:bg-red-50 text-gray-700 font-bold border border-gray-100'}`}>
                    <BookOpen size={15} />
                    <span className="text-[11px]">Akademik</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); useAppStore.getState().setUserRole('admin'); setView?.('admin'); }} className={`col-span-2 flex items-center justify-center gap-2 p-2 rounded-xl text-center transition-all ${userRole === 'admin' ? 'bg-[#990000] text-white shadow-sm font-black' : 'bg-white hover:bg-red-50 text-[#990000] font-black border border-red-200'}`}>
                    <LayoutDashboard size={15} />
                    <span className="text-[11px]">Yönetim Paneli</span>
                  </button>
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
                  onClick={() => { setIsOpen(false); setView?.('mbs'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Settings size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Bilgilerimi Düzenle (MBS)
                </button>

                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setShowBmiModal(true); 
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 transition-all duration-200 flex items-center gap-3 group border-l-4 border-emerald-500 cursor-pointer"
                >
                  <Activity size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" /> Kilo & Sağlık VKİ Ölçümü
                </button>

                {(userRole === 'student' || userRole === 'alumni') && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('applications'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-[#990000]/10 hover:text-[#990000] transition-all duration-200 flex items-center gap-3 group"
                  >
                    <FileText size={16} className="text-gray-500 group-hover:text-[#990000] transition-all duration-200" /> Başvurularım
                  </button>
                )}

                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('calendar'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-[#990000]/10 hover:text-[#990000] transition-all duration-200 flex items-center gap-3 group"
                >
                  <Calendar size={16} className="text-gray-500 group-hover:text-[#990000] transition-all duration-200" /> Takvim
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
    </div>
  );
}
