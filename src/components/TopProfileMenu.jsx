import React, { useState, useRef, useEffect, useMemo } from 'react';
import {  UserCircle2, Settings, Landmark, Terminal, FolderGit2, Rocket, Globe2, Map, Brain, CreditCard, Zap, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, MessageSquare, ShieldCheck, Crown, LayoutDashboard, GraduationCap, Users as UsersIcon, Building2, BookOpen, MessageCircle, Ghost, EyeOff, Download, Trash2, Globe, Trophy, Mic, Briefcase, Wallet, Bot, CalendarCheck, Target , BarChart2 } from 'lucide-react';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId, academicRole, currentView }) {
  const { ghostMode, setGhostMode, focusMode, setFocusMode, activeFrame } = useAppStore?.() || {};
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

  const clubs = useAppStore?.(state => state?.clubs);
  const managedClubs = useMemo(() => {
    try {
      const clubsData = clubs || [];
      return clubsData?.filter?.(c => c?.presidentId === currentUser?.id || (c?.admins || [])?.includes?.(currentUser?.id));
    } catch {
      return [];
    }
  }, [clubs, currentUser?.id]);

  const isClubAdmin = managedClubs?.length > 0;

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
          <div className={`w-9 h-9 rounded-full ring-2 ring-white/20 group-hover:ring-red-400 transition-all duration-200 shrink-0 ${activeFrame ? activeFrame : ''}`}>
            {userRole === 'admin' ? (
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-red-100 transition-all duration-200">
                <img src="/logo.png" alt="Admin" className="w-full h-full rounded-full object-cover" />
              </div>
            ) : currentUser?.avatar ? (
              <img src={currentUser?.avatar} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm transition-all duration-200" />
            ) : (
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=0A2342&color=fff`} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm transition-all duration-200" />
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
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">PANEL GEÇİŞİ</p>
                <div className="grid grid-cols-2 gap-2">
                  <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('admin'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-red-200 shadow-sm">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Yönetim</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('student'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-red-200 shadow-sm">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all duration-200">
                      <GraduationCap size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Öğrenci</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('alumni'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-emerald-200 shadow-sm">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                      <UsersIcon size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Mezun</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('company'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-purple-200 shadow-sm">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all duration-200">
                      <Building2 size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Firma</span>
                  </button>
                  <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('academic'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5 active:scale-95 hover:border-amber-200 shadow-sm">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-all duration-200">
                      <BookOpen size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Akademik</span>
                  </button>
                </div>
              </div>

              {/* ADMIN QUICK ACTIONS */}
              <div className="py-1">
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
                {(userRole === 'alumni' || userRole === 'student') && (
                  <>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('alumni_card'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <CreditCard size={16} className="text-red-500 group-hover:text-red-600 transition-all duration-200" /> Dijital Mezun Kartım
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('digital_portfolio'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <FolderGit2 size={16} className="text-slate-500 group-hover:text-slate-700 transition-all duration-200" /> Dijital Portfolyo
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('metaverse_library'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#8B5A2B] bg-[#f5f0e6] hover:bg-[#e2d5c3] transition-all duration-200 flex items-center gap-3 group"
                    >
                      <BookOpen size={16} className="text-[#a06832] group-hover:text-[#6c4621] transition-all duration-200" /> Metaverse Kütüphanesi
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('hackathon_market'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-cyan-400 bg-gray-900 hover:bg-black transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Terminal size={16} className="text-rose-500 group-hover:text-cyan-400 transition-all duration-200" /> AI Hackathon Alanı
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('alumni_dao'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Landmark size={16} className="text-red-500 group-hover:text-indigo-700 transition-all duration-200" /> Mezunlar Meclisi (DAO)
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('campus_map'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Map size={16} className="text-orange-500 group-hover:text-teal-700 transition-all duration-200" /> İESÜ Metaverse Kampüs
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('global_map'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Globe size={16} className="text-red-500 group-hover:text-red-700 transition-all duration-200" /> Küresel Mezun Haritası
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('anka_chat'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-3 group"
                    >
                      <Bot size={16} className="text-red-500 group-hover:text-red-700 transition-all duration-200" /> Anka AI Sohbet
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('wallet'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-3"
                    >
                      <Wallet size={16} className="text-amber-500" /> Esenyurt Cüzdanı
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('mentor_booking'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-indigo-50 transition-colors flex items-center gap-3"
                    >
                      <CalendarCheck size={16} className="text-red-500" /> Mentor Ajandası
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('smart_certs'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                    >
                      <ShieldCheck size={16} className="text-emerald-500" /> Akıllı Sertifikalar
                    </button>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('reward_store'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#FF9800] bg-orange-50 hover:bg-orange-100 transition-colors flex items-center gap-3 group"
                    >
                      <Trophy size={16} className="text-[#FF9800] group-hover:scale-110 transition-transform" /> Esenyurt Mağazası
                    </button>
                                      <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('idari_portal'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <Building2 size={16} className="text-red-500" /> İESÜ İdari Portal
                    </button>
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button 
                        role="menuitem"
                        onClick={() => { setIsOpen(false); setView?.('about_us'); }}
                        className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <Award size={16} className="text-red-500" /> Hakkımızda
                      </button>
                      <button 
                        role="menuitem"
                        onClick={() => { setIsOpen(false); setView?.('services'); }}
                        className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <BookOpen size={16} className="text-red-500" /> Hizmetlerimiz
                      </button>
                      <button 
                        role="menuitem"
                        onClick={() => { setIsOpen(false); setView?.('research_hub'); }}
                        className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <Atom size={16} className="text-red-500" /> Araştırma & Ar-Ge OS
                      </button>
                      <button 
                        role="menuitem"
                        onClick={() => { setIsOpen(false); setView?.('events_list'); }}
                        className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <Calendar size={16} className="text-red-500" /> Etkinliklerimiz
                      </button>
                      <button 
                        role="menuitem"
                        onClick={() => { setIsOpen(false); setView?.('contact_us'); }}
                        className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 transition-colors flex items-center gap-3"
                      >
                        <Globe size={16} className="text-red-500" /> İletişim
                      </button>
                    </div>
                    <button 
                      role="menuitem"
                      onClick={() => { setIsOpen(false); setView?.('audit_logs'); }}
                      className="w-full text-left px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center gap-3"
                    >
                      <ShieldCheck size={16} className="text-emerald-500" /> Sistem Audit Logları
                    </button>
                  </>
                )}
                
                {userRole === 'company' && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('company_ats'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <Briefcase size={16} className="text-red-500 group-hover:text-red-600 transition-all duration-200" /> İşe Alım Panosu (ATS)
                  </button>
                )}
                
                {/* Kariyer Analitiği Merkezi */}
                <button 
                  role="menuitem" 
                  onClick={() => { setIsOpen(false); setView?.('student_analytics'); }} 
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#0A66C2] bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-3 group"
                >
                  <BarChart2 size={16} className="text-[#0A66C2] group-hover:text-red-800 transition-all duration-200" /> Kariyer Analitiği <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-auto shadow-sm">PREMIUM</span>
                </button>
                
                <button role="menuitem" onClick={() => { setIsOpen(false); setView?.('cvbuilder'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
                  <Wand2 size={16} className="text-gray-500 group-hover:text-gray-700 transition-all duration-200" /> AI CV Oluşturucu <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-auto animate-pulse">YENİ</span>
                </button>
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setView?.(userRole === 'admin' ? 'admin' : (userRole === 'company' ? 'company' : userRole || 'student'));
                    if(window.toast) window.toast.success('Birlik Ağı artık Ana Akışa (Feed) entegre edildi!');
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Globe size={16} className="text-red-500 group-hover:text-indigo-700 transition-all duration-200" /> Birlik Ağı (Ana Akış)
                </button>
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setView?.(userRole === 'admin' ? 'admin' : (userRole === 'company' ? 'company' : userRole || 'student'));
                    if(window.toast) window.toast.success('TeamUp & Mentor özellikleri artık Ana Akışa entegre edildi!');
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Target size={16} className="text-purple-500 group-hover:text-purple-700 transition-all duration-200" /> TeamUp & Mentor Match
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
              
              <div className="py-1">
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setView?.(userRole === 'admin' ? 'admin' : (userRole === 'employer' ? 'company' : userRole || 'student')); 
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <User size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Ana Sayfam
                </button>
                
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    if (setSelectedUserId) {
                      setSelectedUserId?.(currentUser?.id || 1);
                      setView?.('user_profile');
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <UserCircle2 size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Profilimi Görüntüle
                </button>
                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('mbs'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Settings size={16} className="text-gray-500 group-hover:text-red-600 transition-all duration-200" /> Bilgilerimi Düzenle (MBS)
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

                {isClubAdmin && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('club_admin'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-200 flex items-center gap-3 border-y border-emerald-100/50 group"
                  >
                    <Crown size={16} className="text-emerald-500 group-hover:text-emerald-600 transition-all duration-200" /> Kulüp Yönetim Paneli
                  </button>
                )}

                {/* GEN Z UX: Otonomi ve Veri Gizliliği */}
                <div className="border-t border-gray-50 my-1 py-1">
                  <p className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><ShieldCheck size={12}/> Gizlilik & Otonomi</p>
                  
                  <button 
                    role="menuitem"
                    onClick={() => setGhostMode?.(!ghostMode)}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-indigo-50 hover:text-red-600 transition-all duration-200 flex items-center justify-between group"
                    title="Aktifken şirketler ve İK uzmanları profilinizi görüntüleyemez."
                  >
                    <div className="flex items-center gap-3">
                      <Ghost size={16} className={ghostMode ? "text-red-500 transition-all duration-200" : "text-gray-500 group-hover:text-red-500 transition-all duration-200"} /> Hayalet Mod (Gizli İş Arama)
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${ghostMode ? 'bg-red-500' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${ghostMode ? 'left-4.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>

                  <button 
                    role="menuitem"
                    onClick={() => setFocusMode?.(!focusMode)}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 flex items-center justify-between group"
                    title="Nöroçeşitlilik dostu arayüz. Göz yoran animasyonları kapatır."
                  >
                    <div className="flex items-center gap-3">
                      <EyeOff size={16} className={focusMode ? "text-orange-500 transition-all duration-200" : "text-gray-500 group-hover:text-orange-500 transition-all duration-200"} /> Odak Modu (Animasyonları Kapat)
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all duration-200 ${focusMode ? 'bg-orange-500' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${focusMode ? 'left-4.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>


                </div>

                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setView?.(userRole === 'admin' ? 'admin' : (userRole === 'company' ? 'company' : userRole || 'student'));
                    if(window.toast) window.toast.success('Birlik Ağı artık Ana Akışa (Feed) entegre edildi!');
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Globe size={16} className="text-red-500 group-hover:text-indigo-700 transition-all duration-200" /> Birlik Ağı (Yeni)
                </button>
                <button 
                  role="menuitem"
                  onClick={() => { 
                    setIsOpen(false); 
                    setView?.(userRole === 'admin' ? 'admin' : (userRole === 'company' ? 'company' : userRole || 'student'));
                    if(window.toast) window.toast.success('TeamUp & Mentor özellikleri artık Ana Akışa entegre edildi!');
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 transition-all duration-200 flex items-center gap-3 group"
                >
                  <Target size={16} className="text-purple-500 group-hover:text-purple-700 transition-all duration-200" /> TeamUp & Mentor Match
                </button>
                
                {(userRole === 'student' || userRole === 'alumni') && (
                  <button 
                    role="menuitem"
                    onClick={() => { setIsOpen(false); setView?.('cvbuilder'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-[#990000]/10 hover:text-[#990000] transition-all duration-200 flex items-center gap-3 group"
                  >
                    <Wand2 size={16} className="text-gray-500 group-hover:text-[#990000] transition-all duration-200" /> Yapay Zekâ CV
                  </button>
                )}

                <button 
                  role="menuitem"
                  onClick={() => { setIsOpen(false); setView?.('messaging'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-[#990000]/10 hover:text-[#990000] transition-all duration-200 flex items-center gap-3 group"
                >
                  <MessageSquare size={16} className="text-gray-500 group-hover:text-[#990000] transition-all duration-200" /> Mesajlarım
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
    </div>
  );
}
