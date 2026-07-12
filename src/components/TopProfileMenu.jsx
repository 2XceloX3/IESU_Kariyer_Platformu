import React, { useState, useRef, useEffect } from 'react';
import { UserCircle2, Settings, LogOut, ChevronDown, User, Shield, Calendar, Wand2, FileText, MessageSquare, Crown, LayoutDashboard, GraduationCap, Building2, Users } from 'lucide-react';

export default function TopProfileMenu({ currentUser, userRole, setView, setSelectedUserId }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = () => {
    setIsOpen(false);
    setView('login');
  };

  const isSuperAdmin = currentUser?.isSuperAdmin === true;

  const getRoleLabel = (role) => {
    if (isSuperAdmin) return 'Süper Admin';
    switch(role) {
      case 'student': return 'Öğrenci';
      case 'alumni': return 'Mezun';
      case 'company': return 'Firma';
      case 'employer': return 'Firma';
      case 'academic': return 'Akademik Personel';
      case 'admin': return 'Kariyer Ofisi';
      default: return 'Kullanıcı';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 ml-2 hover:bg-gray-100/50 p-1 rounded-full pr-3 transition-colors group"
      >
        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${isSuperAdmin ? 'border-amber-400 ring-2 ring-amber-200' : 'border-iesu-coral'} p-0.5 bg-white shrink-0 transition-transform duration-300 group-hover:scale-105`}>
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-contain bg-white p-1" />
          ) : (
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanıcı')}&background=132A49&color=fff`} alt="Profile" className="w-full h-full rounded-full object-contain bg-white p-0.5" />
          )}
        </div>
        {isSuperAdmin && <Crown size={14} className="text-amber-500 -ml-1" />}
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-gray-900 truncate">
                {isSuperAdmin ? 'Kariyer Geliştirme Ofisi' : (currentUser?.name || 'Kullanıcı')}
              </p>
              {isSuperAdmin && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider rounded-full whitespace-nowrap flex items-center gap-1">
                  <Crown size={9} /> Süper Admin
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <Shield size={10} /> {getRoleLabel(userRole)}
              {isSuperAdmin && <span className="text-amber-500 ml-1">• Tüm Paneller</span>}
            </p>
          </div>
          
          {/* Super Admin Panel Switches */}
          {isSuperAdmin && (
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-1.5">Panel Geçişi</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => { setIsOpen(false); setView('admin'); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <LayoutDashboard size={14} className="text-red-500 group-hover:scale-110 transition-transform duration-300" /> Yönetim
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setView('student'); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <GraduationCap size={14} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" /> Öğrenci
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setView('alumni'); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <Users size={14} className="text-green-500 group-hover:scale-110 transition-transform duration-300" /> Mezun
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setView('company'); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <Building2 size={14} className="text-purple-500 group-hover:scale-110 transition-transform duration-300" /> Firma
                </button>
              </div>
            </div>
          )}

          <div className="py-1">
            <button 
              onClick={() => { setIsOpen(false); setView(userRole === 'admin' ? 'admin' : userRole); }}
              className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
            >
              <User size={16} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" /> Ana Sayfam
            </button>
            {!isSuperAdmin && userRole !== 'admin' && (
              <>
                <button 
                  onClick={() => { 
                    setIsOpen(false); 
                    if (setSelectedUserId) {
                      setSelectedUserId(currentUser?.id || 1);
                      setView('user_profile');
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
                >
                  <UserCircle2 size={16} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" /> Profilimi Görüntüle
                </button>
                <button 
                  onClick={() => { setIsOpen(false); setView('profile_update'); }}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
                >
                  <Settings size={16} className="text-gray-400 group-hover:text-red-500 transition-colors duration-300" /> Bilgilerimi Düzenle
                </button>
              </>
            )}
            
            {!isSuperAdmin && (userRole === 'student' || userRole === 'alumni') && (
              <button 
                onClick={() => { setIsOpen(false); setView('applications'); }}
                className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
              >
                <FileText size={16} className="text-gray-400 group-hover:text-iesu-red transition-colors duration-300" /> Başvurularım
              </button>
            )}

            <button 
              onClick={() => { setIsOpen(false); setView('calendar'); }}
              className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
            >
              <Calendar size={16} className="text-gray-400 group-hover:text-iesu-red transition-colors duration-300" /> Takvim
            </button>
            
            {!isSuperAdmin && (userRole === 'student' || userRole === 'alumni') && (
              <button 
                onClick={() => { setIsOpen(false); setView('cvbuilder'); }}
                className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
              >
                <Wand2 size={16} className="text-gray-400 group-hover:text-iesu-red transition-colors duration-300" /> Yapay Zekâ CV
              </button>
            )}

            {!isSuperAdmin && userRole !== 'admin' && (
              <button 
                onClick={() => { setIsOpen(false); setView('messaging'); }}
                className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-iesu-red/10 hover:text-iesu-red transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
              >
                <MessageSquare size={16} className="text-gray-400 group-hover:text-iesu-red transition-colors duration-300" /> Mesajlarım
              </button>
            )}
          </div>

          <div className="py-1 border-t border-gray-50">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1"
             aria-label="Aksiyon Butonu">
              <LogOut size={16} className="group-hover:scale-110 transition-transform duration-300" /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
