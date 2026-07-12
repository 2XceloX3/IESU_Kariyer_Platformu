import React, { useState } from 'react';
import { ArrowLeft, Bell, Briefcase, Calendar, CheckCircle2, MessageSquare, Star, Info, Trash2, CheckCircle, Home, Compass, MessageCircle, Search, Heart } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

export default function NotificationsPanel({ previousView, userRole, notifications, setNotifications, currentUser, setView, setSelectedUserId }) {
  
  const myNotifications = (notifications || []).filter(n => n.userId === currentUser?.id).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const unreadCount = (myNotifications || []).filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'message': return <MessageSquare size={18} className="text-blue-500" />;
      case 'application': return <Briefcase size={18} className="text-emerald-500" />;
      case 'event': return <Calendar size={18} className="text-purple-500" />;
      case 'system': return <Info size={18} className="text-iesu-red" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    const updated = (notifications || []).map(n => n.userId === currentUser?.id ? { ...n, read: true } : n);
    setNotifications(updated);
  };

  const handleNotificationClick = (id, link) => {
    const updated = (notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    if (link) {
      setView(link); // Optional handling to route to specific view based on notification
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = (notifications || []).filter(n => n.id !== id);
    setNotifications(updated);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = 'notifications';



  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="w-10"></div> {/* Spacer for symmetry */}
          
          {/* CENTER: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* RIGHT: Notifications & Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center bg-red-50 text-iesu-red`} title="Bildirimler">
              <div className="relative">
                <Heart size={24} strokeWidth={2.5} className="fill-current" />
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="notifications" />
          </div>
          
        </div>
      </nav>

      <main className="max-w-[800px] mx-auto px-4 lg:px-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            Bildirimler
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm font-bold text-gray-500 hover:text-iesu-red flex items-center gap-1 transition">
              <CheckCircle size={16} /> Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] overflow-hidden">
          {myNotifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Henüz bildiriminiz bulunmuyor.</h3>
              <p className="text-gray-500 text-sm">Size gelen önemli güncellemeler burada listelenecektir.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(myNotifications || []).map(notification => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id, notification.link)}
                  className={`p-6 flex items-start gap-4 transition cursor-pointer relative group ${!notification.read ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className={`text-sm mb-1 ${!notification.read ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                      {notification.title}
                    </h4>
                    <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.description}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(notification.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-iesu-red shrink-0 absolute right-6 top-8"></div>
                  )}
                  <button 
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="absolute right-6 top-6 p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanici')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}


