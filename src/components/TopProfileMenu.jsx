import React, { useState, useRef, useEffect } from 'react';
import { UserCircle2, Settings, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, MessageSquare, ShieldCheck, Crown, LayoutDashboard, GraduationCap, Users as UsersIcon, Building2, BookOpen, MessageCircle } from 'lucide-react';
import Logo from './Logo';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId, academicRole, currentView }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuRef]);

  const handleLogout = () => {
    localStorage.removeItem('iesu_mock_user');
    localStorage.removeItem('iesu_user_role_v1');
    localStorage.removeItem('iesu_view_v1');
    setIsOpen(false);
    setView('landing');
    window.location.reload();
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
        return 'Kariyer Ofisi';
      default: return 'Kullanıcı';
    }
  };

  const getManagedClubs = () => {
    try {
      const clubsData = JSON.parse(localStorage.getItem('iesu_clubs_v1')) || [];
      return clubsData.filter(c => c.presidentId === currentUser?.id || (c.admins || []).includes(currentUser?.id));
    } catch {
      return [];
    }
  };

  const isClubAdmin = getManagedClubs().length > 0;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="true" className="flex items-center gap-2.5 focus:outline-none group">
        <div className="w-9 h-9 rounded-full ring-2 ring-white/20 group-hover:ring-red-400 transition-all shrink-0">
          {userRole === 'admin' ? (
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm border border-red-100">
              <Logo className="w-full h-full object-contain text-red-700" />
            </div>
          ) : currentUser?.avatar ? (
            <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm" />
          ) : (
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=132A49&color=fff`} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm" />
          )}
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
          
          {userRole === 'admin' ? (
            <>
              {/* ADMIN HEADER */}
              <div className="px-4 py-3 border-b border-gray-50 bg-orange-50/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[14px] font-black text-gray-900 truncate flex-1">
                    Kariyer Geliştirme...
                  </p>
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shrink-0">
                    <Crown size={12} /> SÜPER ADMIN
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-gray-400" /> SÜPER ADMIN <span className="text-orange-500">• TÜM PANELLER</span>
                </p>
              </div>

              {/* ADMIN PANEL GRID */}
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">PANEL GEÇİŞİ</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setIsOpen(false); setView('admin'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors group border border-gray-100 hover:border-red-200 shadow-sm">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Yönetim</span>
                  </button>
                  <button onClick={() => { setIsOpen(false); setView('student'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group border border-gray-100 hover:border-blue-200 shadow-sm">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <GraduationCap size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Öğrenci</span>
                  </button>
                  <button onClick={() => { setIsOpen(false); setView('alumni'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group border border-gray-100 hover:border-emerald-200 shadow-sm">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <UsersIcon size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Mezun</span>
                  </button>
                  <button onClick={() => { setIsOpen(false); setView('company'); }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors group border border-gray-100 hover:border-purple-200 shadow-sm">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Building2 size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Firma</span>
                  </button>
                  <button onClick={() => { setIsOpen(false); try { setView('academic'); } catch (e) { window.toast.error('HATA OLUŞTU: ' + e.message); } }} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors group border border-gray-100 hover:border-amber-200 shadow-sm">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <BookOpen size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Akademik</span>
                  </button>
                </div>
              </div>

              {/* ADMIN QUICK ACTIONS */}
              <div className="py-1">
                <button onClick={() => { 
                  setIsOpen(false); 
                  if (setSelectedUserId) setSelectedUserId(currentUser?.id || 'admin_1513');
                  setView('user_profile'); 
                }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <User size={16} className="text-gray-400" /> Profilim
                </button>
                <button onClick={() => { setIsOpen(false); setView('calendar'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" /> Takvim
                </button>
                <button onClick={() => { setIsOpen(false); setView('mbs'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Settings size={16} className="text-gray-400" /> Bilgileri Düzenle (MBS)
                </button>
                <button onClick={() => { setIsOpen(false); setView('cvbuilder'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Wand2 size={16} className="text-gray-400" /> AI CV Oluşturucu <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-auto animate-pulse">YENİ</span>
                </button>
                <button onClick={() => { setIsOpen(false); setView('interview_sim'); }} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <MessageCircle size={16} className="text-gray-400" /> AI Mülakat Simülasyonu <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-auto animate-pulse">YENİ</span>
                </button>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-gray-50 mt-1 py-1">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                  <LogOut size={16} /> Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <>
              {/* NORMAL USER HEADER */}
              <div className="px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-black text-gray-900 truncate flex items-center gap-1">
                    {currentUser?.name || 'Kullanıcı'}
                    {currentUser?.badge && <ShieldCheck size={14} className="text-blue-500 shrink-0" title={currentUser.badge} />}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                  <Shield size={10} /> {getRoleLabel(userRole)}
                </p>
              </div>
              
              <div className="py-1">
                <button 
                  onClick={() => { 
                    setIsOpen(false); 
                    setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' ? 'company' : userRole || 'student')); 
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                >
                  <User size={16} className="text-gray-400" /> Ana Sayfam
                </button>
                
                <button 
                  onClick={() => { 
                    setIsOpen(false); 
                    if (setSelectedUserId) {
                      setSelectedUserId(currentUser?.id || 1);
                      setView('user_profile');
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                >
                  <UserCircle2 size={16} className="text-gray-400" /> Profilimi Görüntüle
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setView('mbs'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                >
                  <Settings size={16} className="text-gray-400" /> Bilgilerimi Düzenle (MBS)
                </button>
                
                {(userRole === 'student' || userRole === 'alumni') && (
                  <button 
                    onClick={() => { setIsOpen(false); setView('applications'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-colors flex items-center gap-3"
                  >
                    <FileText size={16} className="text-gray-400 group-hover:text-iesu-red" /> Başvurularım
                  </button>
                )}

                <button 
                  onClick={() => { setIsOpen(false); setView('calendar'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-colors flex items-center gap-3"
                >
                  <Calendar size={16} className="text-gray-400 group-hover:text-iesu-red" /> Takvim
                </button>

                {isClubAdmin && (
                  <button 
                    onClick={() => { setIsOpen(false); setView('club_admin'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 transition-colors flex items-center gap-3 border-y border-emerald-100/50"
                  >
                    <Crown size={16} className="text-emerald-500" /> Kulüp Yönetim Paneli
                  </button>
                )}


                <button 
                  onClick={() => { setIsOpen(false); setView('groups'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-colors flex items-center gap-3"
                >
                  <UsersIcon size={16} className="text-gray-400 group-hover:text-iesu-red" /> Topluluklar
                </button>
                
                {(userRole === 'student' || userRole === 'alumni') && (
                  <button 
                    onClick={() => { setIsOpen(false); setView('cvbuilder'); }}
                    className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-colors flex items-center gap-3"
                  >
                    <Wand2 size={16} className="text-gray-400 group-hover:text-iesu-red" /> Yapay Zekâ CV
                  </button>
                )}

                <button 
                  onClick={() => { setIsOpen(false); setView('messaging'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-colors flex items-center gap-3"
                >
                  <MessageSquare size={16} className="text-gray-400 group-hover:text-iesu-red" /> Mesajlarım
                </button>
              </div>

              <div className="border-t border-gray-50 mt-1 py-1">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-3"
                >
                  <LogOut size={16} className="text-gray-400 group-hover:text-red-600" /> Çıkış Yap
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
